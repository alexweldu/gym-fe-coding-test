import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#005363",
        },
        secondary: {
            main: "#FFA500",
        },
        info: {
            main: "#4EB1BA",
        },
        success: {
            main: "#9CCC65",
        },
        error: {
            main: "#FF5252",
        },
        warning: {
            main: "#FFC107",
        },
        background: {
            default: "#FFFFFF",
            paper: "#F5F5F5",
        },
    },
});

export default theme;
