import "../styles/globals.css";
import type { AppContext, AppInitialProps, AppLayoutProps, AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import client from "../apolloclient";
import { ToastProvider } from "react-toast-notifications";
import HeadIcon from "../components/head_icon";
import UserDataProvider from "../services/UserDataProvider";
import StateProvider from "../services/StateProvider";
import PageLayout from "../components/PageLayout/PageLayout";
import {  ReactNode } from "react";
import { NextComponentType, NextPage } from "next";

type GetLayout = (page: ReactNode) => ReactNode;

type Page<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: GetLayout;
};

type MyAppProps<P = {}> = AppProps<P> & {
  Component: Page<P>;
};

const defaultGetLayout: GetLayout = (page: ReactNode): ReactNode => page;

function MyApp({ Component, pageProps }: MyAppProps): JSX.Element {
  const getLayout = Component.getLayout ?? defaultGetLayout;
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
