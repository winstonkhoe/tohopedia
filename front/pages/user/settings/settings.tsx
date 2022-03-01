import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Footer } from "../../../components/footer";
import InitFont from "../../../components/initialize_font";
import Navbar from "../../../components/navbar";
import styles from "../../styles/Settings_Home.module.scss";
import "react-multi-carousel/lib/styles.css";
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import React, { Children, useState } from "react";

const Settings = ( children: any ) => {
  const [kotak, setKotak] = useState(true);
  const [pembelian, setPembelian] = useState(true);
  const [profil, setProfil] = useState(true);
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

  function Section(props: { data: any; name: string; href?: any }) {
    return (
      <section className={styles.product_section}>
        <div className={styles.product_section_label}>
          <div>
            <h2>{props?.name}</h2>
          </div>
          {props?.href ? (
            <div>
              <Link href={props?.href}>
                <a href="">Lihat Semua</a>
              </Link>
            </div>
          ) : null}
        </div>

        <div className={styles.product_section_card}>
          <div className={styles.product_section_card_inner}>
            {props?.data?.map((product: any) => {
              return (
                <Product
                  key={product.id}
                  productId={product.id}
                  imageSrc={product.images[0].image}
                  productName={product.name}
                  productPrice={product.price}
                  productDiscount={product.discount}
                  shopType={product?.shop?.type}
                  shopCity={product.shop.city}
                  shopName={product.shop.name}
                ></Product>
              );
              // <Product imageSrc="" productName="" productPrice={1} shopBadge="" shopCity="" shopName="" key={0}></Product>
            })}
          </div>
        </div>
      </section>
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
          <InitFont />
        </Head>
        <Navbar />

        <main className={styles.main}>
          <div className={styles.main_container}>
            <div className={styles.main_inner_container}>
              {/* Summary User Nav */}
              <div className={styles.main_left_container}>
                <div className={styles.settings_user_profile_container}>
                  <div className={styles.settings_user_profile_image_container}>
                    <div
                      className={styles.settings_user_profile_image_relative}
                    >
                      <Image
                        src={"/uploads/1645900279556_0.jpg"}
                        alt=""
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  </div>
                  <div
                    className={styles.settings_user_profile_detail_container}
                  >
                    <h6 className={styles.settings_user_profile_name}>
                      Winston
                    </h6>
                    <div className={styles.settings_user_profile_other}>
                      <div
                        className={
                          styles.settings_user_profile_other_icon_relative
                        }
                      >
                        <Image
                          src={"/logo/icon_topay.png"}
                          alt=""
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                      <span
                        className={styles.settings_user_profile_other_label}
                      >
                        Tersambung ke Topay
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.settings_user_summary_container}>
                  <div
                    className={styles.settings_user_summary_wallet_container}
                  >
                    <div
                      className={
                        styles.settings_user_summary_wallet_with_icon_container
                      }
                    >
                      <div
                        className={
                          styles.settings_user_summary_wallet_icon_container
                        }
                      >
                        <div
                          className={
                            styles.settings_user_summary_wallet_icon_relative
                          }
                        >
                          <Image
                            src={"/logo/icon_topay.png"}
                            alt=""
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                      </div>
                      <Link href={"/topay"}>
                        <a
                          className={
                            styles.settings_user_summary_wallet_label_value_a
                          }
                          href=""
                        >
                          <div
                            className={
                              styles.settings_user_summary_wallet_label_value_container
                            }
                          >
                            <p
                              className={
                                styles.settings_user_summary_wallet_label
                              }
                            >
                              ToPay
                            </p>
                            <p
                              className={
                                styles.settings_user_summary_wallet_value
                              }
                            >
                              Rp200.000
                            </p>
                          </div>
                        </a>
                      </Link>
                    </div>
                    <div
                      className={
                        styles.settings_user_summary_wallet_without_icon_container
                      }
                    >
                      <div
                        className={styles.settings_user_summary_empty_icon}
                      ></div>
                      <Link href={"/topay"}>
                        <a
                          className={
                            styles.settings_user_summary_wallet_label_value_a
                          }
                          href=""
                        >
                          <div
                            className={
                              styles.settings_user_summary_wallet_label_value_container
                            }
                          >
                            <p
                              className={
                                styles.settings_user_summary_wallet_label
                              }
                            >
                              ToPay Coins
                            </p>
                            <p
                              className={
                                styles.settings_user_summary_wallet_value
                              }
                            >
                              Rp10.000
                            </p>
                          </div>
                        </a>
                      </Link>
                    </div>
                  </div>
                  <div
                    className={styles.settings_user_summary_coupons_container}
                  >
                    <Link href={"/user/coupons"}>
                      <a
                        className={styles.settings_user_summary_member_status}
                        href=""
                      >
                        <div
                          className={
                            styles.settings_user_summary_member_status_icon_container
                          }
                        >
                          <div
                            className={
                              styles.settings_user_summary_member_status_icon_relative
                            }
                          >
                            <Image
                              src={"/logo/icon_platinum.svg"}
                              alt=""
                              layout="fill"
                              objectFit="cover"
                            />
                          </div>
                        </div>
                        <h6
                          className={
                            styles.settings_user_summary_member_status_label
                          }
                        >
                          Member Platinum
                        </h6>
                      </a>
                    </Link>
                    <div
                      className={
                        styles.settings_user_summary_coupons_detail_container
                      }
                    >
                      <Link href={"/user/coupons"}>
                        <a
                          className={styles.settings_user_summary_item}
                          href=""
                        >
                          <div
                            className={
                              styles.settings_user_summary_item_container
                            }
                          >
                            <p
                              className={
                                styles.settings_user_summary_item_label
                              }
                            >
                              Kupon Saya
                            </p>
                            <p
                              className={
                                styles.settings_user_summary_item_value
                              }
                            >
                              4
                            </p>
                          </div>
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className={styles.settings_user_utilities_container}>
                  <div
                    className={
                      styles.settings_user_utilities_accordion_container
                    }
                  >
                    <button
                      className={
                        styles.settings_user_utilities_accordion_button
                      }
                    >
                      <h6
                        className={
                          styles.settings_user_utilities_accordion_header
                        }
                      >
                        Kotak Masuk
                      </h6>
                      <div
                        className={
                          styles.settings_user_utilities_accordion_icon
                        }
                        onClick={() => {
                          setKotak(!kotak);
                        }}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          fill="var(--color-icon-enabled, #525867)"
                          style={
                            kotak === true
                              ? { transform: "rotate(-180deg)" }
                              : {}
                          }
                        >
                          <path d="M12 15.5a.999.999 0 01-.71-.29l-5-5a1.004 1.004 0 111.42-1.42l4.29 4.3 4.29-4.3a1.004 1.004 0 011.42 1.42l-5 5a1 1 0 01-.71.29z"></path>
                        </svg>
                      </div>
                    </button>
                    <ul
                      className={
                        kotak === true
                          ? styles.settings_user_utilities_accordion_items_open
                          : styles.settings_user_utilities_accordion_items_close
                      }
                    >
                      <li
                        className={
                          styles.settings_user_utilities_accordion_item_container
                        }
                      >
                        <button
                          className={
                            styles.settings_user_utilities_accordion_item
                          }
                        >
                          <p
                            className={
                              styles.settings_user_utilities_accordion_item_inner_container
                            }
                          >
                            <Link href={"/user/chat"}>
                              <a
                                className={
                                  styles.settings_user_utilities_accordion_item_label
                                }
                                href=""
                              >
                                Chat{" "}
                                <span
                                  className={
                                    styles.settings_user_utilities_accordion_item_value
                                  }
                                >
                                  7
                                </span>
                              </a>
                            </Link>
                          </p>
                        </button>
                      </li>
                      <li
                        className={
                          styles.settings_user_utilities_accordion_item_container
                        }
                      >
                        <button
                          className={
                            styles.settings_user_utilities_accordion_item
                          }
                        >
                          <p
                            className={
                              styles.settings_user_utilities_accordion_item_inner_container
                            }
                          >
                            <Link href={"/user/chat"}>
                              <a
                                className={
                                  styles.settings_user_utilities_accordion_item_label
                                }
                                href=""
                              >
                                Ulasan{" "}
                                <span
                                  className={
                                    styles.settings_user_utilities_accordion_item_value
                                  }
                                >
                                  7
                                </span>
                              </a>
                            </Link>
                          </p>
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div
                    className={
                      styles.settings_user_utilities_accordion_container
                    }
                  >
                    <button
                      className={
                        styles.settings_user_utilities_accordion_button
                      }
                      onClick={() => {
                        setPembelian(!pembelian);
                      }}
                    >
                      <h6
                        className={
                          styles.settings_user_utilities_accordion_header
                        }
                      >
                        Pembelian
                      </h6>
                      <div
                        className={
                          styles.settings_user_utilities_accordion_icon
                        }
                      >
                        <svg
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          fill="var(--color-icon-enabled, #525867)"
                          style={
                            pembelian === true
                              ? { transform: "rotate(-180deg)" }
                              : {}
                          }
                        >
                          <path d="M12 15.5a.999.999 0 01-.71-.29l-5-5a1.004 1.004 0 111.42-1.42l4.29 4.3 4.29-4.3a1.004 1.004 0 011.42 1.42l-5 5a1 1 0 01-.71.29z"></path>
                        </svg>
                      </div>
                    </button>
                    <ul
                      className={
                        pembelian === true
                          ? styles.settings_user_utilities_accordion_items_open
                          : styles.settings_user_utilities_accordion_items_close
                      }
                    >
                      <li
                        className={
                          styles.settings_user_utilities_accordion_item_container
                        }
                      >
                        <button
                          className={
                            styles.settings_user_utilities_accordion_item
                          }
                        >
                          <p
                            className={
                              styles.settings_user_utilities_accordion_item_inner_container
                            }
                          >
                            <Link href={"/user/chat"}>
                              <a
                                className={
                                  styles.settings_user_utilities_accordion_item_label
                                }
                                href=""
                              >
                                Daftar Transaksi{" "}
                                <span
                                  className={
                                    styles.settings_user_utilities_accordion_item_value
                                  }
                                >
                                  7
                                </span>
                              </a>
                            </Link>
                          </p>
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div
                    className={
                      styles.settings_user_utilities_accordion_container
                    }
                  >
                    <button
                      className={
                        styles.settings_user_utilities_accordion_button
                      }
                      onClick={() => {
                        setProfil(!profil);
                      }}
                    >
                      <h6
                        className={
                          styles.settings_user_utilities_accordion_header
                        }
                      >
                        Profil Saya
                      </h6>
                      <div
                        className={
                          styles.settings_user_utilities_accordion_icon
                        }
                      >
                        <svg
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          fill="var(--color-icon-enabled, #525867)"
                          style={
                            profil === true
                              ? { transform: "rotate(-180deg)" }
                              : {}
                          }
                        >
                          <path d="M12 15.5a.999.999 0 01-.71-.29l-5-5a1.004 1.004 0 111.42-1.42l4.29 4.3 4.29-4.3a1.004 1.004 0 011.42 1.42l-5 5a1 1 0 01-.71.29z"></path>
                        </svg>
                      </div>
                    </button>
                    <ul
                      className={
                        profil === true
                          ? styles.settings_user_utilities_accordion_items_open
                          : styles.settings_user_utilities_accordion_items_close
                      }
                    >
                      <li
                        className={
                          styles.settings_user_utilities_accordion_item_container
                        }
                      >
                        <button
                          className={
                            styles.settings_user_utilities_accordion_item
                          }
                        >
                          <p
                            className={
                              styles.settings_user_utilities_accordion_item_inner_container
                            }
                          >
                            <Link href={"/user/wishlist"}>
                              <a
                                className={
                                  styles.settings_user_utilities_accordion_item_label
                                }
                                href=""
                              >
                                Wishlist{" "}
                                <span
                                  className={
                                    styles.settings_user_utilities_accordion_item_value
                                  }
                                >
                                  7
                                </span>
                              </a>
                            </Link>
                          </p>
                        </button>
                      </li>
                      <li
                        className={
                          styles.settings_user_utilities_accordion_item_container
                        }
                      >
                        <button
                          className={
                            styles.settings_user_utilities_accordion_item
                          }
                        >
                          <p
                            className={
                              styles.settings_user_utilities_accordion_item_inner_container
                            }
                          >
                            <Link href={"/user/chat"}>
                              <a
                                className={
                                  styles.settings_user_utilities_accordion_item_label
                                }
                                href=""
                              >
                                Pengaturan{" "}
                                <span
                                  className={
                                    styles.settings_user_utilities_accordion_item_value
                                  }
                                >
                                  7
                                </span>
                              </a>
                            </Link>
                          </p>
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div
                    className={
                      styles.settings_user_utilities_accordion_container
                    }
                  ></div>
                  <div
                    className={
                      styles.settings_user_utilities_accordion_container
                    }
                  ></div>
                </div>
              </div>
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
                        className={styles.settings_tab_navigator_item_active}
                      >
                        Biodata Diri
                      </div>
                      <div
                        className={styles.settings_tab_navigator_item_inactive}
                      >
                        Daftar Alamat
                      </div>
                      <div
                        className={
                          styles.settings_tab_navigator_active_indicator
                        }
                      ></div>
                    </div>
                  </div>
                  <div className={styles.settings_tab_content_container}>
                    {children}
                  </div>
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

export default Settings;
