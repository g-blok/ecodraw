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
            root: {
              fontWeight: 'bold', // Make the text bold
              color: '#fff', // Default text color
            },
          },
        },
    },
});

export default theme;
