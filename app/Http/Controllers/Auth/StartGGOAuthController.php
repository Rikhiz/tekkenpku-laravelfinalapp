<?php
// app/Http/Controllers/Auth/StartGGOAuthController.php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class StartGGOAuthController extends Controller
{
    /**
     * Redirect to start.gg OAuth authorization
     */
    public function redirect()
    {
        $clientId = env('STARTGG_CLIENT_ID');
        $redirectUri = route('oauth.callback');
        $scopes = 'user.identity user.email';

        Log::info('OAuth Redirect Initiated', [
            'client_id' => $clientId,
            'redirect_uri' => $redirectUri,
            'app_url' => config('app.url'),
            'force_https' => env('FORCE_HTTPS'),
        ]);

        // Validate redirect URI is HTTPS
        if (!str_starts_with($redirectUri, 'https://')) {
            Log::error('OAuth Error: Redirect URI is not HTTPS', [
                'redirect_uri' => $redirectUri,
            ]);

            return redirect('/')->with('error', 'OAuth configuration error: Redirect URI must use HTTPS');
        }

        $authUrl = 'https://start.gg/oauth/authorize?' . http_build_query([
            'response_type' => 'code',
            'client_id' => $clientId,
            'scope' => $scopes,
            'redirect_uri' => $redirectUri,
        ]);

        Log::info('Redirecting to start.gg', ['auth_url' => $authUrl]);

        return redirect($authUrl);
    }

    /**
     * Handle OAuth callback from start.gg
     */
    public function callback(Request $request)
    {
        Log::info('OAuth Callback Received', [
            'all_params' => $request->all(),
            'has_code' => $request->has('code'),
            'has_error' => $request->has('error'),
        ]);

        // Check for OAuth errors
        if ($request->has('error')) {
            Log::error('OAuth Error from start.gg', [
                'error' => $request->get('error'),
                'error_description' => $request->get('error_description'),
            ]);

            return redirect('/')->with('error', 'OAuth error: ' . $request->get('error_description', 'Unknown error'));
        }

        $code = $request->query('code');

        if (!$code) {
            Log::error('OAuth callback: No code provided');
            return redirect('/')->with('error', 'OAuth authorization failed: No authorization code received.');
        }

        try {
            $redirectUri = route('oauth.callback');

            Log::info('Exchanging code for token', [
                'redirect_uri' => $redirectUri,
                'code_length' => strlen($code),
            ]);

            // Exchange code for access token
            $tokenResponse = Http::asForm()->post('https://api.start.gg/oauth/access_token', [
                'grant_type' => 'authorization_code',
                'client_id' => env('STARTGG_CLIENT_ID'),
                'client_secret' => env('STARTGG_CLIENT_SECRET'),
                'code' => $code,
                'redirect_uri' => $redirectUri,
                'scope' => 'user.identity user.email',
            ]);

            if ($tokenResponse->failed()) {
                Log::error('OAuth token exchange failed', [
                    'status' => $tokenResponse->status(),
                    'body' => $tokenResponse->body(),
                ]);
                return redirect('/')->with('error', 'Failed to obtain access token from start.gg. Please try again.');
            }

            $tokenData = $tokenResponse->json();
            $accessToken = $tokenData['access_token'] ?? null;

            if (!$accessToken) {
                Log::error('OAuth: No access token in response', ['response' => $tokenData]);
                return redirect('/')->with('error', 'Invalid response from start.gg.');
            }

            Log::info('Access token obtained successfully');

            // Get user data from start.gg
            $userData = $this->getUserData($accessToken);

            if (!$userData) {
                Log::error('OAuth: Failed to fetch user data');
                return redirect('/')->with('error', 'Failed to fetch your profile from start.gg.');
            }

            // Check player.id
            $playerId = $userData['player']['id'] ?? null;

            if (!$playerId) {
                Log::error('OAuth: No player ID found', ['userData' => $userData]);
                return redirect('/')->with('error', 'Your start.gg account does not have a player profile.');
            }

            // Find or Create User
            $user = User::where('sgguserid', $playerId)->first();
            $gamerTag = $userData['player']['gamerTag'] ?? 'Player';
            $prefix = $userData['player']['prefix'] ?? null;
            $fullName = $prefix ? "{$prefix} | {$gamerTag}" : $gamerTag;
            if ($user) {
                // ✅ EXISTING USER - Update data
                Log::info('OAuth: Existing user login', [
                    'name' => $fullName,
                    'email' => $userData['email']
                ]);

                $user = $this->updateUserFromStartGG($user, $userData); // ✅ update $user instance
                // Login user
                Auth::login($user);

                // Redirect based on role
                if ($user->role === 'admin') {
                    return redirect()->route('dashboard')->with('success', 'Welcome back, ' . $user->name . '!');
                } else {
                    // Player redirect ke home
                    return redirect('/')->with('success', 'Welcome back, ' . $user->name . '!');

                }
            }



        } catch (\Exception $e) {
            Log::error('OAuth Exception', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return redirect('/')
                ->with('error', '⚠️ ' . $e->getMessage());
        }
    }

    /**
     * Get user data from start.gg GraphQL API
     */
    private function getUserData($accessToken)
    {
        $query = <<<'GRAPHQL'
        query CurrentUser {
          currentUser {
            id
            slug
            name
            bio
            email
            birthday
            location {
              country
              state
              city
            }
            player {
              id
              gamerTag
              prefix
            }
            authorizations {
              externalUsername
              type
            }
            images {
              id
              url
              type
            }
          }
        }
        GRAPHQL;

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $accessToken,
                'Content-Type' => 'application/json',
            ])->post('https://api.start.gg/gql/alpha', [
                        'query' => $query,
                    ]);

            if ($response->failed()) {
                Log::error('GraphQL request failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                return null;
            }

            $data = $response->json();

            if (isset($data['errors'])) {
                Log::error('GraphQL errors', ['errors' => $data['errors']]);
                return null;
            }

            Log::info('User data fetched successfully', [
                'player_id' => $data['data']['currentUser']['player']['id'] ?? null,
                'gamerTag' => $data['data']['currentUser']['player']['gamerTag'] ?? null,
                'email' => $data['data']['currentUser']['email'] ?? null,
            ]);

            return $data['data']['currentUser'] ?? null;

        } catch (\Exception $e) {
            Log::error('getUserData exception', [
                'message' => $e->getMessage(),
            ]);
            return null;
        }
    }

    /**
     * Create new user from start.gg data
     */
    /**
     * Create new user from start.gg data
     */



    /**
     * Update existing user data from start.gg
     */
    private function updateUserFromStartGG(User $user, array $userData): User
    {
        $updateData = [];

        $gamerTag = $userData['player']['gamerTag'] ?? null;
        $prefix = $userData['player']['prefix'] ?? null;
        $newName = $prefix ? "{$prefix} | {$gamerTag}" : $gamerTag;

        if ($newName && $user->name !== $newName) {
            $updateData['name'] = $newName;
        }

        // ✅ hanya update email jika tersedia & tidak dipakai user lain
        if (!empty($userData['email'])) {
            $email = $userData['email'];
            $emailExists = User::where('email', $email)
                ->where('id', '!=', $user->id)
                ->exists();

            if ($emailExists) {
                Log::warning('Email already used by another account', [
                    'user_id' => $user->id,
                    'email' => $email,
                ]);
            } else {
                $updateData['email'] = $email;
            }
        }

        // Update avatar
        if (!empty($userData['images'])) {
            foreach ($userData['images'] as $image) {
                if ($image['type'] === 'profile') {
                    $newAvatar = $image['url'];
                    if ($user->avatar !== $newAvatar) {
                        $updateData['avatar'] = $newAvatar;
                    }
                    break;
                }
            }
        }

        try {
            if (!empty($updateData)) {
                $user->update($updateData);
                Log::info('User data updated from start.gg', [
                    'user_id' => $user->id,
                    'updated_fields' => array_keys($updateData),
                ]);
            } else {
                Log::info('No fields updated for user', ['user_id' => $user->id]);
            }

            return $user->fresh();
        } catch (\Illuminate\Database\QueryException $e) {
            Log::error('Database error during user update', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
            throw new \Exception('Gagal memperbarui data pengguna dari start.gg. Coba lagi nanti.');
        }
    }


}