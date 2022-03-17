import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import client from "../apolloclient";
import { ToastProvider } from "react-toast-notifications";
import HeadIcon from "../components/head_icon";
import UserDataProvider from "../services/UserDataProvider";
import StateProvider from "../services/StateProvider";
import PageLayout from "../components/PageLayout/PageLayout";
import { Component } from "react";

// export function GetLayout () {
//   return (
//     Component.getLayout || ((page: any) => page)
//   )
// } 
function MyApp({ Component, pageProps }: AppProps) {

  const getLayout = Component.getLayout || ((page) => page)
  return (
    <ApolloProvider client={client}>
      <StateProvider>
        <UserDataProvider>
          <ToastProvider
            placement="top-center"
            autoDismiss={true}
            autoDismissTimeout={4000}
          >
            <PageLayout>
              {getLayout(<Component {...pageProps} />)}
            </PageLayout>
          </ToastProvider>
        </UserDataProvider>
      </StateProvider>
    </ApolloProvider>
  );
}

export default MyApp;
