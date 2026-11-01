<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Tournament;
use App\Models\User;
use App\Models\Leaderboard;
use Illuminate\Foundation\Testing\RefreshDatabase;

class LeaderboardAndTournamentRecapTest extends TestCase
{
    use RefreshDatabase;

    public function test_leaderboard_pagination_preserves_season_and_board(): void
    {
        $user = User::factory()->create();
        Tournament::create([
            'name' => 'Tournament Season 2',
            'created_by' => $user->id,
            'category' => 2,
            'season' => 2,
            'status' => 'Selesai',
        ]);

        Tournament::create([
            'name' => 'Tournament Season 3',
            'created_by' => $user->id,
            'category' => 2,
            'season' => 3,
            'status' => 'Selesai',
        ]);

        $response = $this->get('/leaderboards?season=2&board=normal&page=1');
        $response->assertStatus(200);

        $pageProps = $response->original->getData()['page']['props'];
        $this->assertEquals(2, $pageProps['selectedSeason']);
        $this->assertEquals('normal', $pageProps['board']);

        $leaderboards = $pageProps['leaderboards'];
        $this->assertNotNull($leaderboards);
    }

    public function test_tournament_show_includes_both_url_ig_and_instagram_recap_url(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $tournament = Tournament::create([
            'name' => 'Tekken Cup',
            'created_by' => $admin->id,
            'category' => 2,
            'season' => 3,
            'url_startgg' => 'tekken-cup-2026',
            'url_ig' => 'https://www.instagram.com/p/POST12345/',
            'instagram_recap_url' => 'https://www.instagram.com/p/RECAP12345/',
            'status' => 'Selesai',
        ]);

        $response = $this->get(route('tournaments.show', $tournament));
        $response->assertStatus(200);

        $pageProps = $response->original->getData()['page']['props'];
        $this->assertEquals('https://www.instagram.com/p/POST12345/', $pageProps['tournament']['url_ig']);
        $this->assertEquals('https://www.instagram.com/p/RECAP12345/', $pageProps['tournament']['instagram_recap_url']);
    }

    public function test_admin_can_add_edit_and_delete_instagram_recap_url_independently(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        // Create tournament with both url_ig and recap url
        $storeData = [
            'name' => 'Weekly Tekken',
            'created_by' => $admin->id,
            'category' => 3,
            'season' => 3,
            'status' => 'Pendaftaran Dibuka',
            'url_ig' => 'https://www.instagram.com/p/POST12345/',
            'instagram_recap_url' => 'https://www.instagram.com/p/NEW12345/',
        ];

        $response = $this->actingAs($admin)->post(route('tournaments.store'), $storeData);
        $response->assertRedirect();

        $tournament = Tournament::where('name', 'Weekly Tekken')->first();
        $this->assertNotNull($tournament);
        $this->assertEquals('https://www.instagram.com/p/POST12345/', $tournament->url_ig);
        $this->assertEquals('https://www.instagram.com/p/NEW12345/', $tournament->instagram_recap_url);

        // Edit tournament recap url without changing url_ig
        $updateData = array_merge($storeData, [
            'instagram_recap_url' => 'https://www.instagram.com/reel/UPDATED999/',
        ]);

        $response = $this->actingAs($admin)->put(route('tournaments.update', $tournament->tourid), $updateData);
        $response->assertRedirect();

        $tournament->refresh();
        $this->assertEquals('https://www.instagram.com/p/POST12345/', $tournament->url_ig);
        $this->assertEquals('https://www.instagram.com/reel/UPDATED999/', $tournament->instagram_recap_url);

        // Delete / clear tournament recap url while keeping url_ig
        $clearData = array_merge($storeData, [
            'instagram_recap_url' => '',
        ]);

        $response = $this->actingAs($admin)->put(route('tournaments.update', $tournament->tourid), $clearData);
        $response->assertRedirect();

        $tournament->refresh();
        $this->assertEquals('https://www.instagram.com/p/POST12345/', $tournament->url_ig);
        $this->assertNull($tournament->instagram_recap_url);
    }
}
