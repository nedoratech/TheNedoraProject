/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        // B&W base
        'nd-black': '#0a0a0a',
        'nd-white': '#fafafa',
        'nd-grey': {
          50:  '#f7f7f7',
          100: '#efefef',
          200: '#dedede',
          400: '#9a9a9a',
          600: '#555555',
        },
        // Accent — deep indigo
        'nd-accent': {
          DEFAULT: '#1e3a8a',
          mid:     '#3b5bdb',
          bright:  '#6473f3',
          light:   '#eef2ff',
          dark:    '#0d1b3e',
        },
      },
      fontFamily: {
        futura: ['Futura', 'Century Gothic', 'Trebuchet MS', 'ui-sans-serif', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0',
        none: '0',
      },
      letterSpacing: {
        'label':  '0.2em',
        'wide':   '0.12em',
        'widest': '0.22em',
      },
    },
  },
}
