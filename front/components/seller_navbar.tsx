import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/nav.module.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState } from "react";
import { checkCookies } from "cookies-next";
import Router from "next/router";

export function SellerNavbar() {
  const loggedIn = checkCookies("tokenid");
  // const [name, setName] = useState("")
  // const [shopName, setShopName] = useState("")

  var userName, shopName;
  var shop = null;
  const NAVBAR_QUERY = gql`
    query GetUser {
      getCurrentUser {
        name
        shop {
          name
          slug
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(NAVBAR_QUERY);

  if (loading) {

  }

  if (data) {
    var user = data.getCurrentUser;
    shop = data.getCurrentUser.shop;
    userName = user.name;
    shopName = shop.name;
  
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
                  <div>
                    <i className={styles.logo_cart}></i>
                    <span className={styles.num_info}>18</span>
                  </div>
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
                <Link href={`/seller/${shop ? shop.slug : null}`}>
                  <a className={styles.profiles}>
                    <NavProfileItem
                      src="/logo/seller_no_profile.png"
                      alt="Seller Logo"
                      name={ shop ? shop.name : null}
                      badge="pmp"
                    >
                      <DropdownMenu></DropdownMenu>
                    </NavProfileItem>
                  </a>
                </Link>
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
                    onClick={() => Router.push("/register")}
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
                ></NavProfileItem>
              ) : (
                null
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }


function NavProfileItem(props: {
  badge?: string;
  src: string;
  alt: string;
  name: string;
  children?: any;
}) {
  const [itemHover, setItemHover] = useState(false);

  return (
    <div>
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
        {props.badge ? (
          <div className={styles.badge_logo}>
            {props.badge == "pm" ? (
              <Image src="/logo/" alt="PM Logo" layout="fill" />
            ) : props.badge == "pmp" ? (
              <Image
                src="/logo/Power Merchant Pro.svg"
                alt="PMP Logo"
                layout="fill"
              />
            ) : (
              <Image src="/logo/" alt="OS Logo" layout="fill" />
            )}
          </div>
        ) : (
          ""
        )}
        {props.name ? <div>{props.name}</div> : ""}

        {itemHover && props.children}
      </div>
    </div>
  );
}

function DropdownMenu(props: any) {
  function DropdownItem(props: {
    href?: string;
    children?: any;
    leftIcon?: any;
    rightIcon?: any;
    button: boolean;
  }) {
    return (
      <a
        href={props.href}
        className={props.button ? styles.menu_button : styles.menu_item}
      >
        <span className="icon-button">{props.leftIcon}</span>
        {props.children}
        <span className="icon-button">{props.rightIcon}</span>
      </a>
    );
  }

  return (
    <div className={styles.dropdown_virtual}>
      <div className={styles.dropdown}>
        <div className={styles.dropdown_container}>
          <DropdownItem button={false}>Anda Belum Memiliki Toko</DropdownItem>
          <DropdownItem href="/registerSeller" button={true}>
            Buka Toko
          </DropdownItem>
          <DropdownItem button={false}>
            Pelajari lebih lanjut di pusat edukasi seller
          </DropdownItem>
        </div>
      </div>
    </div>
  );
}

export default SellerNavbar;
