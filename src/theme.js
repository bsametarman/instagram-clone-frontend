import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const colors = {
    blue: {
        50: '#e6f7ff',
        100: '#b3e5fc',
        200: '#81d4fa',
        300: '#4fc3f7',
        400: '#29b6f6',
        500: '#03a9f4',
        600: '#039be5',
        700: '#0288d1',
        800: '#0277bd',
        900: '#01579b',
    },
    red: {
        50: '#980b15',
        100: '#ac0c17',
        200: '#bf0d19',
        300: '#d20f1c',
        400: '#e4111f',
        500: '#ee1b29',
        600: '#ef2e3b',
        700: '#f1414d',
        800: '#f3535e',
        900: '#f46670',
    },
    purple: {
        50: '#f9f6fd',
        100: '#e5daf8',
        200: '#d3bef4',
        300: '#b795ec',
        400: '#a379e7',
        500: '#8952e0',
        600: '#7434db',
        700: '#6023c0',
        800: '#4f1d9e',
        900: '#3b1676',
    },
    yellow: {
        50: '#B49C04',
        100: '#C8AE04',
        200: '#DCBF04',
        300: '#F0D105',
        400: '#FADB0F',
        500: '#FBDE23',
        600: '#FBE137',
        700: '#FBE44B',
        800: '#FCE75F',
        900: '#FCEA73',
    },
    orange: {
        50: "#fefaf5",
        100: "#fdead7",
        200: "#fad1a8",
        300: "#f6ac62",
        400: "#f2871a",
        500: "#d17416",
        600: "#b06212",
        700: "#8d4e0f",
        800: "#6f3d0b",
        900: "#5b3209"
    },
};

const styles = {
    global: (props) => ({
        body: {
            bg: mode('gray.50', '#1a1514')(props),
            color: mode('gray.800', 'whiteAlpha.900')(props),
        },
    }),
};

const config = {
    initialColorMode: 'system',
    useSystemColorMode: true,
};

const theme = extendTheme({ config, colors, styles });

export default theme;