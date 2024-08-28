import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#AAB17D',
        },
        secondary: {
            main: '#91A69F',
        },
    },
    components: {
        MuiButton: {
          styleOverrides: {
            contained: {
              fontWeight: 'bold',
              color: '#fff',
            },
            outlined: {
                background: '#fff',

                "&:hover": {
                    background: '#F4F6E8',
                },
            },
            
          },
        },
        MuiAccordion: {
          styleOverrides: {
            root: {
              boxShadow: 'none',
            },
          },
        },
    },
});

export default theme;
