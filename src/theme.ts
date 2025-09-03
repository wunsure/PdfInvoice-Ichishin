// src/theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#008040", // 主色：綠色
    },
    secondary: {
      main: "rgba(0, 176, 80, 0.3)", // 次色：30%綠色
    },
  },
});

export default theme;