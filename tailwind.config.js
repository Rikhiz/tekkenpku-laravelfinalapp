import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    safelist: [
        // 🏅 Warna medali & background dinamis dari TournamentShow.jsx
        'text-yellow-400',
        'text-gray-400',
        'text-orange-400',
        'text-[#69747C]',
        'bg-yellow-400/10',
        'bg-gray-400/10',
        'bg-orange-400/10',
        'bg-[#69747C]/10',
        'border-yellow-400/30',
        'border-gray-400/30',
        'border-orange-400/30',
        'border-[#69747C]/30',

        // 💬 Warna status / kategori dinamis (dari event status)
        'text-[#E57A9D]',
        'text-[#C23B69]',
        'bg-[#C23B69]/10',
        'bg-[#E57A9D]/10',
        'border-[#C23B69]/30',
        'border-[#E57A9D]/30',

        // 🟣 Warna Instagram Embed
        'text-pink-500',
        'bg-pink-500/10',
        'border-pink-500/30',
        'hover:bg-pink-500/20',
        'group-hover:text-pink-500',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
        },
    },

    plugins: [forms],
};

