import React from "react";
import Link from "next/link";
import s from "./Footer.module.scss";
import Image from "next/image";
import footer from "../../../public/images/footer.jpg";
import googlePlay from "../../../public/images/googlePlay.png";
import appStore from "../../../public/images/appStore.png";
import Button from "../../common/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Card from "../../common/Card";

const Footer = () => {
  return (
    // <Card>
      <footer className={s.footer}>
        <div className={s.footerLeft}>
          <div className={s.left}>
            <p className={s.title}>Tokopedia</p>
            <p>
              <Link href="">
                <a>About Tokopedia</a>
              </Link>
            </p>
            <p>
              <Link href="">
                <a>Career</a>
              </Link>
            </p>
            <p>
              <Link href="">
                <a>Blog</a>
              </Link>
            </p>
            <p>
              <Link href="">
                <a>Toko Points</a>
              </Link>
            </p>
            <p>
              <Link href="">
                <a>Tokopedia Affiliate Program</a>
              </Link>
            </p>
          </div>
          <div className={s.mid}>
            <p className={s.title}>Buy</p>
            <p>
              <Link href="">
                <a>Bill &#38; Top up</a>
              </Link>
            </p>
            <p>
              <Link href="">
                <a>Trade in Handphone</a>
              </Link>
            </p>
            <p>
              <Link href="">
                <a>Tokopedia COD</a>
              </Link>
            </p>
            <p className={s.title}>Sell</p>
            <p>
              <Link href="">
                <a>Seller Educative Center</a>
              </Link>
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
          <div className={s.right}>
            <p className={s.title}>Guide and Help</p>
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
            <p className={s.title}>Follow Us</p>
            <div className={s.socmed}></div>
          </div>
        </div>
        <div className={s.footerRight}>
          <Image src={footer} alt="footer" objectFit="contain"></Image>
          <div className={s.download}>
            <div className={s.left}>
              <Image src={googlePlay} alt="footer" objectFit="contain"></Image>
            </div>
            <div className={s.right}>
              <Image src={appStore} alt="footer" objectFit="contain"></Image>
            </div>
          </div>
          <a>&copy; Tohopedia by SY</a>
          <div className={s.lang}>
            {/* <Button>Indonesia</Button> */}
            {/* <Button>English</Button> */}
          </div>
        </div>
      </footer>
    {/* </Card> */}
  );
};

export default Footer;
