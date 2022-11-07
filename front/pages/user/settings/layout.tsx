import styles from "./layout.module.scss";
import "react-multi-carousel/lib/styles.css";
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import React, { Children, useContext, useEffect, useState } from "react";
import { UserNavbar } from "../../../components/Bars/user_navbar";
import Router, { useRouter } from "next/router";
import { userDetailsContext } from "../../../services/UserDataProvider";
import { stateContext } from "../../../services/StateProvider";
import { User } from "../../../models/User";

const Layout = (props: { children: any }) => {
  // const router = useRouter();
  const userData: User = useContext(userDetailsContext);
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

  const indicatorStyle: any = {
    0: { width: "125px", left: "0px" },
    1: { width: "140px", left: "125px" },
    2: { width: "140px", left: "calc(125px + 140px)" },
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
                      className={
                        tabIndexSetting == 2
                          ? // activeTab == "address"
                            styles.settings_tab_navigator_item_active
                          : styles.settings_tab_navigator_item_inactive
                      }
                      onClick={() => {
                        // setActiveTab("address");
                        setTabIndexSetting(2);
                        Router.replace(
                          {
                            pathname: "/user/settings/authentication",
                          },
                          undefined,
                          { shallow: true }
                        );
                      }}
                    >
                      Authentication
                    </div>
                    <div
                      className={styles.settings_tab_navigator_active_indicator}
                      style={indicatorStyle[tabIndexSetting]}
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
