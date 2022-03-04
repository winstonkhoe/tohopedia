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
          <p className={styles.title}>Tokopedia</p>
          <p>
            {/* <Link href=""> */}
              <a href="https://www.tokopedia.com">Sensasi berbelanja Online beneran</a>
            {/* </Link> */}
          </p>
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
          <p className={styles.title}>Buy</p>
          {/* <p>
            <Link href="">
              <a>Bill &#38; Top up</a>
            </Link>
          </p> */}
          {/* <p>
            <Link href="">
              <a>Trade in Handphone</a>
            </Link>
          </p> */}
          {/* <p>
            <Link href="">
              <a>Tokopedia COD</a>
            </Link>
          </p> */}
          <p className={styles.title}>Sell</p>
          <p>
            {/* <Link href=""> */}
              <a href="https://www.facebook.com/tokopedia/">Tokopedia - Facebook</a>
            {/* </Link> */}
          </p>
          <p>
            <Link href="">
              <a>Mitra Toppers</a>
            </Link>
          </p>
          <p>
            <Link href="">
              <a>Register Official Store</a>
            </Link>
          </p>
        </div>
        <div className={styles.right}>
          <p className={styles.title}>Guide and Help</p>
          <p>
            <Link href="">
              <a>Tokopedia Care</a>
            </Link>
          </p>
          <p>
            <Link href="">
              <a>Terms and Condition</a>
            </Link>
          </p>
          <p>
            <Link href="">
              <a>Privacy</a>
            </Link>
          </p>
          <p className={styles.title}>Follow Us</p>
          <div className={styles.socmed}></div>
        </div>
      </div>
      <div className={styles.footerRight}>
        {/* <Image src={footer} alt="footer" objectFit="contain"></Image> */}
        <div className={styles.footer_img}>
        <Image src={"/assets/footer_image.jpg"} alt="footer" layout="fill" objectFit="contain"></Image>
        </div>
        <div className={styles.download}>
          <div className={styles.left}>
            <Image src={"/logo/icon_google_play.svg"} alt="footer" layout="fill" objectFit="contain"></Image>
          </div>
          <div className={styles.right}>
            <Image src={"/logo/icon_app_store.svg"} alt="footer" layout="fill" objectFit="contain"></Image>
          </div>
        </div>
        <div className={styles.lang}>
        </div>
      </div>
    </footer>
      <Powered/>
    </>
  );
}

export default Footer;
