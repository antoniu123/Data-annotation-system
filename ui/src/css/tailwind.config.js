module.exports = {
  important: true,
  purge: ['.src/**/*.html', './src/**/*.tsx'],
  theme: {
    fontFamily: {
      display: ['Helvetica Neue', 'Arial', 'sans-serif'],
      body: ['Helvetica Neue', 'Arial', 'sans-serif'],
      sans: ['Questrial', 'sans-serif'],
    },
    extend: {
      colors: {
        'fill-accent-medium': '#1d5dc7',
        'fill-base-subtle': '#edf3f7',
        'stroke-basic-subtle': '#c9cdd1',
        'status-error-subtle': '#ffd6d6',
        'fill-text-negative': '#b60000',
        'fill-basic-green': '#809c13',
        'fill-text-green': '#b5e550',
        'fill-contrast-light': '#27394f',
        'status-warning-subtle': '#ffecbf',
        'fill-text-warning': '#8d4600',
        'line-basic-subtle': '#d5dade',
        'fill-text-inverse': '#ffffff',
        'line-contrast-lines': '#4b6078',
        'fill-text-light': 'rgba(0, 0, 0, 0.7)',
        'full-text-base': '#000000',
        'fill-text-subtle': 'rgba(0, 0, 0, 0.5)',
        'unnamed-dark-indigo': '#0a2039',
        'unnamed-matte-blue': '#374b63',
        transparent: 'transparent',
        current: 'currentColor',
        turquoise: {
          light: '#6acecc',
          DEFAULT: '#05aea6',
          dark: '#019091',
        },
        blue: {
          DEFAULT: '#132e48',
        },
        yellow: {
          DEFAULT: '#e8bc10',
        },
        green: {
          DEFAULT: '#056947',
        },
        brown: {
          light: '#ae4700',
          DEFAULT: '#802e0e',
          dark: '#802e0e',
        },
        gray: {
          darkest: '#1f2d3d',
          dark: '#3c4858',
          DEFAULT: '#c0ccda',
          light: '#e0e6ed',
          lightest: '#f9fafc',
        },
        white: {
          DEFAULT: '#FFFFFF',
        }
          
        },
        spacing: {
          72: '18rem',
          84: '21rem',
          96: '24rem'
        },
        inset: {
          '-12': '-3rem',
          '1/2': '50%'
        },
        minHeight: {
          px: '1px',
          0: '0',
          1: '0.25rem',
          2: '0.5rem',
          3: '0.75rem',
          4: '1rem',
          5: '1.25rem',
          6: '1.5rem',
          8: '2rem',
          10: '2.5rem',
          12: '3rem',
          16: '4rem',
          20: '5rem',
          24: '6rem',
          32: '8rem',
          40: '10rem',
          48: '12rem',
          56: '14rem',
          64: '16rem'
        }
    }
  },
  variants: {
    extend: {
      fontWeight: ['hover', 'focus']
    }
  },
  plugins: [require('@tailwindcss/forms')],
}
