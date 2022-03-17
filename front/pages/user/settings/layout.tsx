import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Footer from "../../../components/Footer/Footer";
import InitFont from "../../../components/initialize_font";
import Navbar from "../../../components/navbar";
import styles from "../../../styles/Settings_Home.module.scss";
import "react-multi-carousel/lib/styles.css";
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import React, { Children, useContext, useEffect, useState } from "react";
import { UserNavbar } from "../../../components/Bars/user_navbar";
import Router, { useRouter } from "next/router";
import { userDetailsContext } from "../../../services/UserDataProvider";
import { stateContext } from "../../../services/StateProvider";

const Layout = (props: { children: any }) => {
  // const router = useRouter();
  const userData = useContext(userDetailsContext);
  const { setPageTitle } = useContext(stateContext);

  useEffect(() => {
    setPageTitle("Settings | Tohopedia");
  }, [setPageTitle]);

  // function checkPathExists(array: any, path: string) {
  //   return array.indexOf(path) >= 0;
  // }

  // const paths = router.pathname.split("/");
  const { tabIndexSetting, setTabIndexSetting } = useContext(stateContext);
  // const [activeTab, setActiveTab] = useState(
  //   checkPathExists(paths, "address") ? "address" : "index"
  // );

  const indicatorStyle = {
    0: { width: "131px", left: "0px" },
    1: { width: "148px", left: "131px" },
  };

  return (
    <>
      <main className={styles.main}>
        <div className={styles.main_container}>
          <div className={styles.main_inner_container}>
            <UserNavbar />
            {/* Summary User Nav

              {/* END Summary User Nav */}

            {/* Menu Settings */}
            <div className={styles.main_right_container}>
              <span className={styles.main_right_container_header}>
                {userData?.name}
              </span>
              <div className={styles.settings_tab_outer_container}>
                <div className={styles.settings_tab_navigator_container}>
                  <div className={styles.settings_tab_navigator_container_flex}>
                    <div
                      className={
                        tabIndexSetting == 0
                          ? // activeTab == "index"
                            styles.settings_tab_navigator_item_active
                          : styles.settings_tab_navigator_item_inactive
                      }
                      onClick={() => {
                        // setActiveTab("index");
                        setTabIndexSetting(0);
                        Router.replace(
                          {
                            pathname: "/user/settings",
                          },
                          undefined,
                          { shallow: true }
                        );
                      }}
                    >
                      Biodata Diri
                    </div>
                    <div
                      className={
                        tabIndexSetting == 1
                          ? // activeTab == "address"
                            styles.settings_tab_navigator_item_active
                          : styles.settings_tab_navigator_item_inactive
                      }
                      onClick={() => {
                        // setActiveTab("address");
                        setTabIndexSetting(1);
                        Router.replace(
                          {
                            pathname: "/user/settings/address",
                          },
                          undefined,
                          { shallow: true }
                        );
                      }}
                    >
                      Daftar Alamat
                    </div>
                    <div
                      className={styles.settings_tab_navigator_active_indicator}
                      style={indicatorStyle[tabIndexSetting]}
                      // style={{width: "131px", left: "0px"}}
                    ></div>
                  </div>
                </div>
                {props.children}
              </div>
            </div>
            {/* END Menu Settings */}
          </div>
        </div>
      </main>
    </>
  );
  // }
};

export default Layout;
