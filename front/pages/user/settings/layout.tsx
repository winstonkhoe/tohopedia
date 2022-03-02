import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Footer } from "../../../components/footer";
import InitFont from "../../../components/initialize_font";
import Navbar from "../../../components/navbar";
import styles from "../../../styles/Settings_Home.module.scss";
import "react-multi-carousel/lib/styles.css";
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import React, { Children, useState } from "react";
import { UserNavbar } from "../../../components/user/user_navbar";
import Router, { useRouter } from "next/router";
import { render } from "sass";

const Layout = (props: { children: any }) => {
  const router = useRouter()
//   const [kotak, setKotak] = useState(true);
//   const [pembelian, setPembelian] = useState(true);
//   const [profil, setProfil] = useState(true);
  // console.log(router.pathname)
  // console.log(router.pathname.split('/'))

  function checkPathExists(array: any, path: string) {
    return array.indexOf(path) >= 0
  }

  const paths = router.pathname.split('/')
  const [activeTab, setActiveTab] = useState(checkPathExists(paths, "address") ? "address" : "index")
  const indicatorStyle = {
    index: {width: "131px", left: "0px"}, address: {width: "148px", left: "131px"}
  }
  const ALL_PRODUCT_QUERY = gql`
    query GetAllProduct {
      products {
        id
        name
        price
        discount
        images {
          image
        }
        shop {
          name
          city
          type
        }
      }
    }
  `;

  // const [products, setProducts] = useState(null);

  const {
    loading: allProductLoading,
    error: allProductError,
    data: allProductData,
  } = useQuery(ALL_PRODUCT_QUERY);

  const TOP_DISCOUNT_PRODUCT_QUERY = gql`
    query GetTopDiscountProduct {
      topProductDiscount {
        id
        name
        price
        discount
        images {
          image
        }
        shop {
          name
          city
          type
        }
      }
    }
  `;
    console.log(props.children)

  // const [products, setProducts] = useState(null);

  const {
    loading: TopDiscountProductLoading,
    error: TopDiscountProductError,
    data: TopDiscountProductData,
  } = useQuery(TOP_DISCOUNT_PRODUCT_QUERY);

  function Product(props: {
    productId: string;
    productName: string;
    productDiscount: number;
    productPrice: number;
    shopName: string;
    shopCity: string;
    shopType: number;
    imageSrc: string;
  }) {
    return (
      <div className={styles.product_outer_card}>
        <div className={styles.product_card}>
          <div className={styles.product_inner_card}>
            <Link href={`/${props.shopName}/${props.productId}`}>
              <a href="">
                <div className={styles.product_card_outline}>
                  <div className={styles.product_outer_image_container}>
                    <div className={styles.product_image_container}>
                      <Image
                        src={`/uploads/${props.imageSrc}`}
                        alt="Product Image"
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  </div>

                  <div className={styles.product_detail_container}>
                    <a href="">
                      <div className={styles.product_detail_name}>
                        {props.productName}
                      </div>
                      <div className={styles.product_detail_price}></div>
                      {props.productDiscount > 0 ? (
                        <div
                          className={styles.product_detail_discount_container}
                        >
                          <div
                            className={styles.product_detail_discount_percent}
                          >
                            {props.productDiscount}%
                          </div>
                          <div
                            className={
                              styles.product_detail_discounted_original_price
                            }
                          ></div>
                        </div>
                      ) : null}

                      <div
                        className={styles.product_detail_location_ratings_sells}
                      >
                        <div className={styles.product_detail_location}>
                          {props?.shopType > 0 ? (
                            <div className={styles.product_store_badge}>
                              <div
                                className={styles.product_store_badge_container}
                              >
                                <Image
                                  src={`/logo/${
                                    props.shopType == 1
                                      ? "badge_pm.png"
                                      : props.shopType == 2
                                      ? "badge_pmp.svg"
                                      : props?.shopType == 3
                                      ? "badge_os.png"
                                      : null
                                  }`}
                                  alt=""
                                  layout="fill"
                                />
                              </div>
                            </div>
                          ) : null}

                          <div className={styles.product_store_location}>
                            <span className={styles.store_location}>
                              {props.shopCity}
                            </span>
                            <span className={styles.store_name}>
                              {props.shopName}
                            </span>
                          </div>
                        </div>
                        <div
                          className={styles.product_detail_ratings_sells}
                        ></div>
                      </div>
                    </a>
                  </div>
                </div>
              </a>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (allProductLoading || TopDiscountProductLoading) {
    return <h2>Loading...</h2>;
  }

  // if (productData) {
  return (
    <React.Fragment>
      <div className={styles.container}>
        <Head>
          <title>Settings | Tohopedia</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
          <InitFont />
        <Navbar />

        <main className={styles.main}>
          <div className={styles.main_container}>
                      <div className={styles.main_inner_container}>
                          <UserNavbar/>
              {/* Summary User Nav

              {/* END Summary User Nav */}

              {/* Menu Settings */}
              <div className={styles.main_right_container}>
                <span className={styles.main_right_container_header}>
                  Winston
                </span>
                <div className={styles.settings_tab_outer_container}>
                  <div className={styles.settings_tab_navigator_container}>
                    <div
                      className={styles.settings_tab_navigator_container_flex}
                    >
                      <div
                        className={activeTab == "index" ? styles.settings_tab_navigator_item_active : styles.settings_tab_navigator_item_inactive}
                        onClick={() => { setActiveTab("index");  Router.replace('/user/settings')}}
                                          >
                        Biodata Diri
                        
                      </div>
                      <div
                                              className={activeTab == "address" ? styles.settings_tab_navigator_item_active : styles.settings_tab_navigator_item_inactive}
                        onClick={() => { setActiveTab("address"); Router.replace('/user/settings/address')}}
                      >
                        Daftar Alamat
                      </div>
                      <div
                        className={
                          styles.settings_tab_navigator_active_indicator
                        }
                        style={indicatorStyle[activeTab]}
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
        <Footer />
      </div>
    </React.Fragment>
  );
  // }
};

export default Layout;
