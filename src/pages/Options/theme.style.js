const breakpoints = {
  values: {
    xs: 0,
    sm: 700,
    md: 900,
    lg: 1200,
    xl: 1536,
  },
};
export const lightThemeStyle = {
  breakpoints,
  palette: {
    mode: 'light',
    primary: {
      light: '#e2dbdb',
      dark: '#ae9999',
      main: '#b38888',
    },
    // secondary: {
    //   main: '#a23f60',
    // },
    background: {
      default: '#F8F9FA',
    },
  },
  spacing: 8,
};

export const darkThemeStyle = {
  breakpoints,
  palette: {
    mode: 'dark',
  },
};
