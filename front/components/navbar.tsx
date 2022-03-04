import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/nav.module.scss";
import cartStyle from "../styles/components/cart_overlay.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";
import { checkCookies, removeCookies } from "cookies-next";
import Router from "next/router";
import { Url } from "url";
import RupiahFormat from "../misc/currency";
import Overlay from "./overlay/overlay";

export function Navbar() {
  // const opencage = require("opencage-api-client");
  const DEFAULT_PROFILE_IMAGE = `/logo/user_profile.jpg`;
  const loggedIn = checkCookies("tokenid");
  const [profileImage, setProfileImage] = useState(DEFAULT_PROFILE_IMAGE);
  const [currentLocation, setCurrentLocation] = useState(null);

  var userName, shopName;
  var shop = null;
  const NAVBAR_QUERY = gql`
    query GetUser {
      getCurrentUser {
        name
        shop {
          name
          slug
          image
          type
        }
        carts {
          quantity
        }
        topay {
          balance
          coin
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(NAVBAR_QUERY, {
    pollInterval: 500,
  });

  useEffect(() => {
    setProfileImage(
      data?.getCurrentUser?.shop?.image
        ? `/uploads/${data?.getCurrentUser?.shop?.image}`
        : DEFAULT_PROFILE_IMAGE
    );

    // if (currentLocation === null) {
    //   const geolocation = navigator.geolocation;
    //   const p = new Promise((resolve, reject) => {
    //     if (!geolocation) {
    //       reject(new Error("Not Supported"));
    //     }
    //     // this.setState({
    //     //   isLocating: true,
    //     // });
    //     geolocation.getCurrentPosition(
    //       (position) => {
    //         console.log("Location found");
    //         console.log(position);
    //         resolve(position);
    //       },
    //       () => {
    //         console.log("Location : Permission denied");
    //         reject(new Error("Permission denied"));
    //       }
    //     );
    //   });
    //   p.then((location: any) => {
    //     console.log(location);
    //     console.log(location.coords.latitude + ", " + location.coords.longitude);
    //     // this.setState({
    //     //   isLocating: false,
    //     // });
    //     // this.props.onChange(
    //     //   'query',
    //     //   location.coords.latitude + ', ' + location.coords.longitude
    //     // );
    //     opencage
    //       .geocode({ q: `${location.coords.latitude}, ${location.coords.longitude}`, key: '8f5357a2d6914852a8b41d6185dcd5c7' })
    //       .then((data: any) => {
    //         // console.log(JSON.stringify(data));
    //         if (data.results.length > 0) {
    //           const place = data.results[0];
    //           console.log(place.formatted);
    //           console.log(place.components.road);
    //           setCurrentLocation(place.components.road)
    //           console.log(place.annotations.timezone.name);
    //         } else {
    //           console.log("status", data.status.message);
    //           console.log("total_results", data.total_results);
    //         }
    //       })
    //       .catch((error: any) => {
    //         console.log("error", error.message);
    //         // if (error.status.code === 402) {
    //         //   console.log("hit free trial daily limit");
    //         //   console.log("become a customer: https://opencagedata.com/pricing");
    //         // }
    //       });
    //   });
    // }
  }, [DEFAULT_PROFILE_IMAGE, currentLocation, data]);

  if (loading) {
    return null;
  }

  if (data) {
    var user = data.getCurrentUser;
    shop = data.getCurrentUser.shop;
    userName = user.name;
    shopName = shop.name;
    console.log(shop);
  }

  function getCartTotalQuantity(carts: any) {
    let totalSum = 0;
    carts?.map((cart: any) => {
      totalSum += cart.quantity;
    });
    return totalSum;
  }

  function CartOverlay() {
    return (
      <Overlay>
        <div className={cartStyle.container}>
          <div className={cartStyle.header}>
            <div className={cartStyle.header_count}>
              Keranjang ({getCartTotalQuantity(data?.getCurrentUser?.carts)})
            </div>
          </div>

          <div className={cartStyle.carts_container}>
          <div className={cartStyle.cart_item_wrapper}>
          <div className={cartStyle.cart_item_image}>
          
          </div>
          <div className={cartStyle.cart_item_name}>

          </div>
          <div className={cartStyle.cart_item_price}>

          </div>
          </div>
          </div>
        </div>
      </Overlay>
    );
  }

  return (
    <div className={styles.nav_container}>
      <div>
        <div className={styles.nav_header}>
          <div id="navbar" className={styles.container}>
            <Link href="/">
              <a>
                <div className={styles.logo}>
                  <div>
                    <Image
                      src="/logo/tohopedia_logo.png"
                      alt="Tohopedia Logo"
                      layout="fill"
                    />
                  </div>
                </div>
              </a>
            </Link>
            <div className={styles.category}>
              <div className={styles.hovering}>
                <a href="#">Kategori</a>
              </div>
            </div>
            <form action="/search" method="get">
              <div className={styles.search_container}>
                <div className={styles.search_container_inner}>
                  <div className={styles.search_container_divider}>
                    <button aria-label="search-button"></button>
                    <input type="text" name="" id="" placeholder="Cari Orang" />
                  </div>
                </div>
              </div>
            </form>
            <div className={styles.user_feature}>
              <div>
                <Link href={"/cart"}>
                  <a href="">
                    <div>
                      <i className={styles.logo_cart}></i>
                      <span className={styles.num_info}>
                        {getCartTotalQuantity(data?.getCurrentUser?.carts)}
                      </span>
                    </div>
                  </a>
                </Link>
              </div>
              <div>
                <div>
                  <i className={styles.logo_notification}></i>
                  <span className={styles.num_info}>5</span>
                </div>
              </div>
              <div>
                <div>
                  <i className={styles.logo_message}></i>
                  <span className={styles.num_info}>7</span>
                </div>
              </div>
              {/* <FontAwesomeIcon icon={["fas", "cart-plus"]} /> */}
            </div>
            <div className={styles.right_separator}></div>

            {loggedIn ? (
              <NavProfileItem
                src={profileImage}
                alt="Seller Logo"
                name={shop ? shop.name : null}
                type={shop?.type}
              >
                {data?.getCurrentUser?.shop?.name !== undefined &&
                data?.getCurrentUser?.shop?.name !== "" ? (
                  <div className={styles.dropdown_seller_outer_container}>
                    <div className={styles.dropdown_seller_inner_container}>
                      <div
                        className={styles.dropdown_seller_shop_detail_container}
                      >
                        <div
                          className={
                            styles.dropdown_seller_shop_image_container
                          }
                        >
                          <Image
                            src={"/uploads/1645957474102_2.png"}
                            alt=""
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                        <div
                          className={
                            styles.dropdown_seller_shop_name_type_container
                          }
                        >
                          <div className={styles.dropdown_seller_shop_name}>
                            <Link href={`/${data?.getCurrentUser?.shop?.slug}`}>
                              <a href="">{data?.getCurrentUser?.shop?.name}</a>
                            </Link>
                          </div>
                          <div
                            className={
                              styles.dropdown_seller_shop_type_container
                            }
                          >
                            <div
                              className={
                                styles.dropdown_seller_shop_type_inner_container
                              }
                            >
                              {data?.getCurrentUser?.shop?.type > 0 ? (
                                <div
                                  className={
                                    styles.dropdown_seller_shop_image_outer_container
                                  }
                                >
                                  <div
                                    className={
                                      styles.dropdown_seller_shop_image_container
                                    }
                                  >
                                    <Image
                                      src={`/logo/${
                                        data?.getCurrentUser?.shop?.type == 1
                                          ? "badge_pm.png"
                                          : data?.getCurrentUser?.shop?.type ==
                                            2
                                          ? "badge_pmp.svg"
                                          : data?.getCurrentUser?.shop?.type ==
                                            3
                                          ? "badge_os.png"
                                          : null
                                      }`}
                                      alt=""
                                      layout="fill"
                                    />
                                  </div>
                                </div>
                              ) : null}
                              <div
                                className={
                                  styles.dropdown_seller_shop_type_name
                                }
                              >
                                {data?.getCurrentUser?.shop?.type == 0
                                  ? "Regular Merchant"
                                  : data?.getCurrentUser?.shop?.type == 1
                                  ? "Power Merchant"
                                  : data?.getCurrentUser?.shop?.type == 2
                                  ? "Power Merchant Pro"
                                  : "Official Store"}
                              </div>
                              <Link href={"/snapwin/setting"}>
                                <a
                                  className={
                                    styles.dropdown_seller_shop_type_upgrade
                                  }
                                  href=""
                                >
                                  Upgrade
                                </a>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={styles.dropdown_seller_desc_button_container}
                      >
                        <div
                          className={
                            styles.dropdown_seller_desc_button_inner_container
                          }
                        >
                          <div
                            className={
                              styles.dropdown_seller_desc_header_container
                            }
                          >
                            <h4 className={styles.dropdown_seller_desc_header}>
                              Tohopedia Seller
                            </h4>
                          </div>
                          <div className={styles.dropdown_seller_desc_content}>
                            Pantau pesanan yang masuk dan cek perkembangan
                            tokomu secara
                            <br /> rutin di satu tempat.
                          </div>
                          <Link href={"/seller/home"}>
                            <a
                              className={styles.dropdown_seller_seller_button}
                              href=""
                            >
                              Cek Tohopedia Seller
                            </a>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <DropdownMenu>
                      <DropdownItem button={false}>
                        Anda Belum Memiliki Toko
                      </DropdownItem>
                      <DropdownItem href="/register/seller" button={true}>
                        Buka Toko
                      </DropdownItem>
                      <DropdownItem button={false}>
                        Pelajari lebih lanjut di pusat edukasi seller
                      </DropdownItem>
                    </DropdownMenu>{" "}
                  </>
                )}
              </NavProfileItem>
            ) : (
              <div className={styles.not_logged_in_container}>
                <button
                  className={styles.masuk}
                  onClick={() => Router.push("/login")}
                >
                  Masuk
                </button>
                <button
                  className={styles.daftar}
                  onClick={() => Router.push("/register/user")}
                >
                  Daftar
                </button>
              </div>
            )}

            {loggedIn ? (
              <NavProfileItem
                src="/logo/user_profile.jpg"
                alt="User Logo"
                name={userName}
              >
                <div className={styles.dropdown_user_outer_container}>
                  <div className={styles.dropdown_user_inner_container}>
                    <div className={styles.dropdown_user_profile_container}>
                      <div
                        className={styles.dropdown_user_profile_image_container}
                      >
                        <Image
                          src={"/uploads/1645957474102_2.png"}
                          alt=""
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                      <div
                        className={styles.dropdown_user_profile_name_container}
                      >
                        <div className={styles.dropdown_user_profile_name}>
                          {data?.getCurrentUser?.name}
                        </div>
                        <Link href={"/user/home"}>
                          <a href="">
                            <div
                              className={
                                styles.dropdown_user_profile_member_container
                              }
                            >
                              <span>Member</span>
                            </div>
                          </a>
                        </Link>
                      </div>
                    </div>
                    <div className={styles.dropdown_user_options_container}>
                      <div className={styles.dropdown_user_summary_container}>
                        <div className={styles.dropdown_user_gopay_container}>
                          <Link href={"/topay"}>
                            <a
                              className={
                                styles.dropdown_user_gopay_inner_container
                              }
                              href=""
                            >
                              <div className={styles.dropdown_gopay_container}>
                                <div
                                  className={
                                    styles.dropdown_gopay_inner_container
                                  }
                                >
                                  <div
                                    className={
                                      styles.dropdown_gopay_icon_relative
                                    }
                                  >
                                    <Image
                                      src={"/logo/icon_topay.png"}
                                      alt=""
                                      layout="fill"
                                    />
                                  </div>
                                  <span className={styles.dropdown_gopay_label}>
                                    ToPay
                                  </span>
                                </div>
                                <div>
                                  <div className={styles.dropdown_gopay_value}>
                                    {RupiahFormat(
                                      data?.getCurrentUser?.topay?.balance
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div
                                className={
                                  styles.dropdown_gopay_coins_container
                                }
                              >
                                <div
                                  className={
                                    styles.dropdown_gopay_coins_inner_container
                                  }
                                >
                                  <div
                                    className={styles.dropdown_gopay_empty_icon}
                                  ></div>
                                  <span className={styles.dropdown_gopay_label}>
                                    ToPay Coins
                                  </span>
                                </div>
                                <div>
                                  <div className={styles.dropdown_gopay_value}>
                                    {RupiahFormat(
                                      data?.getCurrentUser?.topay?.coin
                                    )}
                                  </div>
                                </div>
                              </div>
                            </a>
                          </Link>
                        </div>
                        <div
                          className={styles.dropdown_summary_separator}
                        ></div>
                        <Link href={"/user/kuponsaya"}>
                          <a
                            className={styles.dropdown_user_item_container}
                            href=""
                          >
                            Kupon Saya
                            <div className={styles.dropdown_user_item_amount}>
                              5
                            </div>
                          </a>
                        </Link>
                      </div>
                      <div className={styles.dropdown_user_settings_container}>
                        <Link href={"/order-list"}>
                          <a
                            className={styles.dropdown_user_setting_button_link}
                            href=""
                          >
                            Pembelian
                          </a>
                        </Link>
                        <Link href={"/wishlist"}>
                          <a
                            className={styles.dropdown_user_setting_button_link}
                            href=""
                          >
                            Wishlist
                          </a>
                        </Link>
                        <Link href={"/user/settings"}>
                          <a
                            className={styles.dropdown_user_setting_button_link}
                            href=""
                          >
                            Pengaturan
                          </a>
                        </Link>
                        <div
                          className={styles.dropdown_user_logout_container}
                          onClick={() => {
                            removeCookies("tokenid");
                            Router.reload();
                          }}
                        >
                          Keluar
                          <div
                            className={
                              styles.dropdown_user_logout_image_relative
                            }
                          >
                            <Image
                              src={"/logo/icon_logout.svg"}
                              alt=""
                              layout="fill"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </NavProfileItem>
            ) : null}
            <div className={styles.location_container}>
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                fill="var(--color-icon-enabled, #525867)"
              >
                <path d="M11.5 21.87a1 1 0 00.5.13 1 1 0 00.514-.138C12.974 21.587 20 17.399 20 10a7.909 7.909 0 00-8-8 7.91 7.91 0 00-8 8c0 7.399 7.025 11.587 7.486 11.862l.014.008zM9.694 4.44A5.94 5.94 0 0112 4a5.94 5.94 0 016 6c0 5.28-4.48 8.81-6 9.81-1.52-1.03-6-4.51-6-9.81a5.94 5.94 0 013.694-5.56zm.084 8.886a4 4 0 104.444-6.652 4 4 0 00-4.444 6.652zm1.11-4.989a2 2 0 112.223 3.326 2 2 0 01-2.222-3.326z"></path>
              </svg>
              <div className={styles.location_text_container}>
                <p className={styles.location_text_label}>Dikirim ke</p>
                <p className={styles.location_text_location_value}>
                  {currentLocation}
                </p>
                <svg
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="var(--color-icon-enabled, #525867)"
                >
                  <path d="M12 15.5a.999.999 0 01-.71-.29l-5-5a1.004 1.004 0 111.42-1.42l4.29 4.3 4.29-4.3a1.004 1.004 0 011.42 1.42l-5 5a1 1 0 01-.71.29z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavProfileItem(props: {
  type?: number;
  src: string;
  alt: string;
  name: string;
  children?: any;
}) {
  const [itemHover, setItemHover] = useState(false);

  return (
    <div className={styles.profiles_container}>
      <div className={styles.profiles_inner}>
        <div
          className={styles.profile_img}
          onMouseDown={() => {
            setItemHover(!itemHover);
          }}
          // onMouseEnter={() => {
          //   setItemHover(true);
          // }}
          // //   onMouseEnter={() => console.log(true)}
          // onMouseLeave={() => {
          //   setItemHover(false);
          // }}
          //   onMouseLeave={() => console.log(false)}
        >
          <Image src={props.src} alt={props.alt} layout="fill" />
        </div>
        {props?.type ? (
          <div className={styles.badge_logo}>
            <div className={styles.badge_logo_image}>
              <Image
                src={`/logo/${
                  props?.type == 1
                    ? "badge_pm.png"
                    : props?.type == 2
                    ? "badge_pmp.svg"
                    : props?.type == 3
                    ? "badge_os.png"
                    : null
                }`}
                alt=""
                layout="fill"
              />
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      {props.name ? <p>{props.name}</p> : ""}

      {itemHover && props.children}
    </div>
  );
}

function DropdownItem(props: {
  href?: any;
  children?: any;
  leftIcon?: any;
  rightIcon?: any;
  button: boolean;
}) {
  return (
    <Link href={props.href ? props.href : "#"}>
      <a className={props.button ? styles.menu_button : styles.menu_item}>
        <span className="icon-button">{props.leftIcon}</span>
        {props.children}
        <span className="icon-button">{props.rightIcon}</span>
      </a>
    </Link>
  );
}

function DropdownMenu(props: any) {
  return (
    <div className={styles.dropdown_virtual}>
      <div className={styles.dropdown}>
        <div className={styles.dropdown_container}>{props.children}</div>
      </div>
    </div>
  );
}

export default Navbar;
