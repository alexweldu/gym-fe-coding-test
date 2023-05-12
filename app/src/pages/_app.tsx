import Layout from "@/components/Layout/Layout";
import theme from "@/utils/themes";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { SnackbarProvider } from "notistack";
const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider />
      <SessionProvider session={session}>
        <CssBaseline />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </ThemeProvider>
  );
};
export default App;
