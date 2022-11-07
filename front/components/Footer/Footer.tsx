import React from "react";
import Link from "next/link";
import styles from "./Footer.module.scss";
import Image from "next/image";
import { Powered } from "./Powered";

const Footer = () => {
  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          <div className={styles.left}>
            {/* <p className={styles.title}>Tokopedia</p> */}
            <p>
              <Link href="/topay">
                <a>Topay</a>
              </Link>
            </p>
            <p>
              <Link href="/register/user">
                <a>Register</a>
              </Link>
            </p>
            <p>
              <Link href="/settings">
                <a>Setting</a>
              </Link>
            </p>
            <p>
              <Link href="/settings/address">
                <a>Address</a>
              </Link>
            </p>
            <p>
              <Link href="/login">
                <a>Login</a>
              </Link>
            </p>
            <p>
              <Link href="/seller/home">
                <a>Tohopedia Seller</a>
              </Link>
            </p>
          </div>
          <div className={styles.mid}>
          </div>
          <div className={styles.right}>
            <p>
              {/* <Link href=""> */}
              <a href="https://www.facebook.com/tokopedia/">
                Tokopedia - Facebook
              </a>
              {/* </Link> */}
            </p>
            <p>
              <Link href="/order-list">
                <a>Pembelian</a>
              </Link>
            </p>
            <p>
              <Link href="/cart">
                <a>Cart</a>
              </Link>
            </p>
            <p>
              <Link href="/user/settings">
                <a>Settings</a>
              </Link>
            </p>
          </div>
        </div>
        <div className={styles.footerRight}>
          {/* <Image src={footer} alt="footer" objectFit="contain"></Image> */}
          <div className={styles.footer_img}>
            <Image
              src={"/assets/footer_image.jpg"}
              alt="footer"
              layout="fill"
              objectFit="contain"
            ></Image>
          </div>
          <div className={styles.download}>
            <div className={styles.left}>
              <Image
                src={"/logo/icon_google_play.svg"}
                alt="footer"
                layout="fill"
                objectFit="contain"
              ></Image>
            </div>
            <div className={styles.right}>
              <Image
                src={"/logo/icon_app_store.svg"}
                alt="footer"
                layout="fill"
                objectFit="contain"
              ></Image>
            </div>
          </div>
          <div className={styles.lang}></div>
        </div>
      </footer>
      <Powered />
    </>
  );
};

export default Footer;
