import Image from "next/image";
import styles from "../styles/nav.module.scss";
import cartStyle from "../styles/components/cart_overlay.module.scss";
import Link from "next/link";
import { useEffect, useState, createContext, useContext } from "react";
import { checkCookies, removeCookies } from "cookies-next";
import Router, { useRouter } from "next/router";
import RupiahFormat from "../misc/currency";
import Overlay from "./overlay/overlay";
import { userDetailsContext } from "../services/UserDataProvider";
import { ShopIcon } from "./ShopDetails/ShopDetails";
import { GetMerchantType } from "../misc/shop_type";

export function Navbar() {
  // const opencage = require("opencage-api-client");
  const DEFAULT_PROFILE_IMAGE = `/logo/user_profile.jpg`;
  const [profileImage, setProfileImage] = useState(DEFAULT_PROFILE_IMAGE);
  const [currentLocation, setCurrentLocation] = useState("Jalan Sutera Utama 1");
  const [seeCartOverlay, setSeeCartOverlay] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  
  const data = useContext(userDetailsContext);
  const [loggedIn, setLoggedIn] = useState(data !== undefined)

  useEffect(() => {
    setLoggedIn(checkCookies("tokenid"));
  }, [])
  useEffect(() => {
    setProfileImage(
      data?.shop?.image
        ? `/uploads/${data?.shop?.image}`
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
    //         resolve(position);
    //       },
    //       () => {
    //         reject(new Error("Permission denied"));
    //       }
    //     );
    //   });
    //   p.then((location: any) => {
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
    //         if (data.results.length > 0) {
    //           const place = data.results[0];
    //           setCurrentLocation(place.components.road)
    //         } else {
    //         }
    //       })
    //       .catch((error: any) => {
    //         // if (error.status.code === 402) {
    //         //   console.log("hit free trial daily limit");
    //         // }
    //       });
    //   });
    // }
  }, [DEFAULT_PROFILE_IMAGE, currentLocation, data]);

  // if (data === undefined) {
  //   return null;
  // }

  function getCartTotalQuantity(carts: any) {
    let totalSum = 0;
    carts?.map((cart: any) => {
      totalSum += cart.quantity;
    });
    return totalSum;
  }

  const handleSearch = (e: any) => {
    e.preventDefault();
    Router.push({
      pathname: "/search",
      query: { keyword: searchKeyword },
    });
  };
  function CartOverlay() {
    return (
      <Overlay>
        <div
          className={cartStyle.wrapper}
          onMouseEnter={() => {
            setSeeCartOverlay(true);
          }}
        >
          <div
            className={cartStyle.container_wrapper}
            onMouseEnter={() => {
              setSeeCartOverlay(true);
            }}
            onMouseLeave={() => {
              setSeeCartOverlay(false);
            }}
          >
            <div className={cartStyle.container}>
              <div className={cartStyle.header}>
                <div className={cartStyle.header_count}>
                  Keranjang ({getCartTotalQuantity(data?.carts)})
                </div>
              </div>

              <div className={cartStyle.carts_container}>
                {data?.carts.map((cart: any, index: number) => {
                  return (
                    <div key={index} className={cartStyle.cart_item_wrapper}>
                      <div className={cartStyle.cart_item_image}>
                        <div className={cartStyle.cart_item_image_relative}>
                          <Image
                            src={`/uploads/${cart?.product?.images[0]?.image}`}
                            layout="fill"
                            alt=""
                          />
                        </div>
                      </div>
                      <div className={cartStyle.cart_item_name}>
                        <div>{cart?.product?.name}</div>
                      </div>
                      <div className={cartStyle.cart_item_price}>
                        {RupiahFormat(cart?.product?.price)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Overlay>
    );
  }

  return (
    <>
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
              <form method="get" onSubmit={(e) => handleSearch(e)}>
                <div className={styles.search_container}>
                  <div className={styles.search_container_inner}>
                    <div className={styles.search_container_divider}>
                      <button aria-label="search-button"></button>
                      <input
                        type="text"
                        name=""
                        id=""
                        placeholder="Cari Orang"
                        value={searchKeyword}
                        onChange={(e) => {
                          setSearchKeyword(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </form>
              <div className={styles.user_feature}>
                <div>
                  <Link href={"/cart"}>
                    <a href="">
                      <div
                        onMouseEnter={() => {
                          setSeeCartOverlay(true);
                        }}
                        onMouseLeave={() => {
                          setSeeCartOverlay(false);
                        }}
                      >
                        <i className={styles.logo_cart}></i>
                        <span className={styles.num_info}>
                          {getCartTotalQuantity(data?.carts)}
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
                  name={data?.shop?.name ? data?.shop?.name : ""}
                  type={data?.shop?.type}
                >
                  {data?.shop?.name !== undefined || data?.shop?.name !== "" ? (
                    <div className={styles.dropdown_seller_outer_container}>
                      <div className={styles.dropdown_seller_inner_container}>
                        <div
                          className={
                            styles.dropdown_seller_shop_detail_container
                          }
                        >
                          <div
                            className={
                              styles.dropdown_seller_shop_image_container
                            }
                          >
                            <Image
                              src={profileImage}
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
                              <Link href={`/${data?.shop?.slug}`}>
                                <a href="">{data?.shop?.name}</a>
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
                                {data?.shop?.type > 0 ? (
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
                                      <ShopIcon type={data?.shop?.type} />
                                    </div>
                                  </div>
                                ) : null}
                                <div
                                  className={
                                    styles.dropdown_seller_shop_type_name
                                  }
                                >
                                  {GetMerchantType(data?.shop?.type)}
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
                          className={
                            styles.dropdown_seller_desc_button_container
                          }
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
                              <h4
                                className={styles.dropdown_seller_desc_header}
                              >
                                Tohopedia Seller
                              </h4>
                            </div>
                            <div
                              className={styles.dropdown_seller_desc_content}
                            >
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

              <div>
              {loggedIn ? (
                <NavProfileItem
                  src={
                    data?.image === undefined || data?.image === ""
                      ? "/logo/user_profile.jpg"
                      : `/uploads/${data?.image}`
                  }
                  alt=""
                  name={data?.name}
                >
                  <div className={styles.dropdown_user_outer_container}>
                    <div className={styles.dropdown_user_inner_container}>
                      <div className={styles.dropdown_user_profile_container}>
                        <div
                          className={
                            styles.dropdown_user_profile_image_container
                          }
                        >
                          <Image
                            src={
                              data?.image === undefined || data?.image === ""
                                ? "/logo/user_profile.jpg"
                                : `/uploads/${data?.image}`
                            }
                            alt=""
                            layout="fill"
                            objectFit="cover"
                          />
                        </div>
                        <div
                          className={
                            styles.dropdown_user_profile_name_container
                          }
                        >
                          <div className={styles.dropdown_user_profile_name}>
                            {data?.name}
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
                                <div
                                  className={styles.dropdown_gopay_container}
                                >
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
                                    <span
                                      className={styles.dropdown_gopay_label}
                                    >
                                      ToPay
                                    </span>
                                  </div>
                                  <div>
                                    <div
                                      className={styles.dropdown_gopay_value}
                                    >
                                      {RupiahFormat(data?.topay?.balance)}
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
                                      className={
                                        styles.dropdown_gopay_empty_icon
                                      }
                                    ></div>
                                    <span
                                      className={styles.dropdown_gopay_label}
                                    >
                                      ToPay Coins
                                    </span>
                                  </div>
                                  <div>
                                    <div
                                      className={styles.dropdown_gopay_value}
                                    >
                                      {RupiahFormat(data?.topay?.coin)}
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
                        <div
                          className={styles.dropdown_user_settings_container}
                        >
                          <Link href={"/order-list"}>
                            <a
                              className={
                                styles.dropdown_user_setting_button_link
                              }
                              href=""
                            >
                              Pembelian
                            </a>
                          </Link>
                          <Link href={"/wishlist"}>
                            <a
                              className={
                                styles.dropdown_user_setting_button_link
                              }
                              href=""
                            >
                              Wishlist
                            </a>
                          </Link>
                          <Link href={"/user/settings"}>
                            <a
                              className={
                                styles.dropdown_user_setting_button_link
                              }
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
              </div>
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
      <div>{seeCartOverlay && CartOverlay()}</div>
    </>
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
              <ShopIcon type={props?.type} />
            </div>
          </div>
        ) : null}
      </div>
      <div>
      {props.name ? <p>{props.name}</p> : ""}

      {itemHover && props.children}
      </div>
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
