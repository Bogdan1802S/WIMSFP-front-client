import { extendTheme } from '@chakra-ui/react';

const googleSans = '"Google Sans", Arial, sans-serif';

export const theme = extendTheme({
    fonts: {
        heading: googleSans,
        body: googleSans,
    },
    colors: {
        cream: {
            50: '#fff8f1',
            100: '#fbf1e8',
        },
        brand: {
            500: '#a5471f',
            600: '#873b1b',
        },
    },
    styles: {
        global: {
            body: {
                bg: 'linear-gradient(135deg, #fff8f1 0%, #fbefe6 100%)',
                color: '#302821',
                fontFamily: googleSans,
            },
            '*:focus-visible': {
                outline: '3px solid #df9968',
                outlineOffset: '2px',
            },
        },
    },
    components: {
        Button: {
            baseStyle: {
                borderRadius: '12px',
                minH: '44px',
                fontWeight: 600,
            },
        },
        Card: {
            baseStyle: {
                borderRadius: '18px',
            },
        },
    },
});