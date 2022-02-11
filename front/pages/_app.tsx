import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import client from "../apolloclient";
import { ToastProvider } from "react-toast-notifications";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <ToastProvider placement="top-center" autoDismiss={true} autoDismissTimeout={4000}>
        <Component {...pageProps} />
      </ToastProvider>
    </ApolloProvider>
  );
}

export default MyApp;
