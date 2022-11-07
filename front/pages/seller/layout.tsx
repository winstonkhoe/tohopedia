import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { ShopBadge, ShopIcon } from "../../components/ShopDetails/ShopDetails";
import { ErrorNotFound } from "../../components/error";
import {
  GreenLabel,
  GreyLabel,
} from "../../components/transaction/TransactionStatus";
import { DEFAULT_PROFILE_IMAGE } from "../../misc/global_constant";
import { GetMerchantType } from "../../misc/shop_type";
import { stateContext } from "../../services/StateProvider";
import { userDetailsContext } from "../../services/UserDataProvider";
import styles from "./layout.module.scss";
import { Shop } from "../../models/Shop";

const SellerLayout = (props: { children: any }) => {
  const { setPageTitle } = useContext(stateContext);

  useEffect(() => {
    setPageTitle("Seller Dashboard");
  }, [setPageTitle]);

  const storeData: Shop = useContext(userDetailsContext)?.shop;
  const [profileImage, setProfileImage] = useState(DEFAULT_PROFILE_IMAGE);

  useEffect(() => {
    setProfileImage(
      storeData?.image ? `/uploads/${storeData?.image}` : DEFAULT_PROFILE_IMAGE
    );
  }, [storeData]);

  if (!storeData) {
    return (
      <div className={styles.container}>
        <ErrorNotFound />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Left Navbar */}
      <div className={styles.seller_navbar}>
        <nav>
          <div>
            {/* Header */}
            <ul className={styles.seller_header}>
              <li>
                <div className={styles.seller_header_container}>
                  <div className={styles.seller_image}>
                    <Image src={profileImage} alt="" layout="fill" />
                  </div>
                  <div className={styles.seller_header_detail_container}>
                    <div className={styles.seller_name}>
                      <Link href="">
                        {/* <a>bai</a> */}
                        <a>{storeData?.name}</a>
                      </Link>
                    </div>
                    <div className={styles.seller_badge}>{<ShopBadge reputation={storeData?.reputationPoint}/>}</div>
                  </div>
                </div>
              </li>
              <li>
                <div className={styles.seller_merchant_container}>
                  <div className={styles.seller_merchant_flex}>
                    <div className={styles.seller_merchant_left}>
                      <div className={styles.seller_merchant_icon_wrapper}>
                        <div className={styles.seller_merchant_icon_relative}>
                          <ShopIcon type={storeData?.type} />
                        </div>
                      </div>
                      <p>
                        {GetMerchantType(storeData?.type)}
                      </p>
                    </div>
                    <Link href={"/seller/upgrade"}>
                      <a href="">
                        Upgrade
                      </a>
                    </Link>
                  </div>
                </div>
                
              </li>
              <li>
                {storeData?.isOpen &&
                new Date().getTime() >
                  new Date(storeData?.openTime).getTime() &&
                new Date().getTime() <
                  new Date(storeData?.closeTime).getTime() ? (
                  <GreenLabel text="Toko Buka" />
                ) : (
                  <GreyLabel text="Toko Tutup" />
                )}
              </li>
            </ul>
            {/* End Header */}

            {/* Menus */}

            {/* HOME */}
            <ItemSellerNavbar href={"/seller/home"} name={"Home"}>
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="var(--NN900, #2E3137)"
              >
                <path d="M13.17 2l9.33 8.44a.76.76 0 01-.748 1.289.748.748 0 01-.252-.149L19.75 10v10A1.76 1.76 0 0118 21.75H6A1.76 1.76 0 014.25 20V10L2.5 11.56a.75.75 0 11-1-1.12L10.83 2a1.75 1.75 0 012.34 0zm-2.92 14v4.25h3.5V16a.25.25 0 00-.25-.25h-3a.25.25 0 00-.25.25zm7.927 4.177A.25.25 0 0018.25 20V8.63l-6.08-5.47a.25.25 0 00-.34 0L5.75 8.63V20a.25.25 0 00.25.25h2.75V16a1.76 1.76 0 011.75-1.75h3A1.76 1.76 0 0115.25 16v4.25H18a.25.25 0 00.177-.073zM13.5 9.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path>
              </svg>
            </ItemSellerNavbar>

            <ItemSellerNavbar href={"/seller/chat"} name={"Chat"}>
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="var(--GN500, #00AA5B)"
              >
                <path d="M17 3.25H7A3.71 3.71 0 003.25 7v14a.76.76 0 00.41.67.84.84 0 00.34.08.74.74 0 00.45-.15l3.8-2.85H17A3.71 3.71 0 0020.75 15V7A3.71 3.71 0 0017 3.25zm-4 10.49H8a.75.75 0 110-1.5h5a.75.75 0 110 1.5zm3-4H8a.75.75 0 010-1.5h8a.75.75 0 110 1.5z"></path>
              </svg>
            </ItemSellerNavbar>

            <ItemSellerNavbar href={"/seller/settings"} name={"Setting"}>
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="var(--NN900, #2E3137)"
              >
                <path d="M13.17 2l9.33 8.44a.76.76 0 01-.748 1.289.748.748 0 01-.252-.149L19.75 10v10A1.76 1.76 0 0118 21.75H6A1.76 1.76 0 014.25 20V10L2.5 11.56a.75.75 0 11-1-1.12L10.83 2a1.75 1.75 0 012.34 0zm-2.92 14v4.25h3.5V16a.25.25 0 00-.25-.25h-3a.25.25 0 00-.25.25zm7.927 4.177A.25.25 0 0018.25 20V8.63l-6.08-5.47a.25.25 0 00-.34 0L5.75 8.63V20a.25.25 0 00.25.25h2.75V16a1.76 1.76 0 011.75-1.75h3A1.76 1.76 0 0115.25 16v4.25H18a.25.25 0 00.177-.073zM13.5 9.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path>
              </svg>
            </ItemSellerNavbar>

            {/* Tambah Produk */}
            <ItemSellerNavbar
              href={"/seller/add-product"}
              name={"Tambah Produk"}
            >
              {/* <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="var(--GN500, #00AA5B)"
                  >
                    <path d="M20 6.75H4a.76.76 0 01-.7-.47.76.76 0 01.18-.82l1.68-1.61a2 2 0 011.32-.61h11a2 2 0 011.33.62l1.7 1.59a.75.75 0 01-.51 1.3zm-5 1.5h5a.76.76 0 01.75.75v10A1.76 1.76 0 0119 20.75H5A1.76 1.76 0 013.25 19V9A.76.76 0 014 8.25h5v3.25a.5.5 0 00.76.42L12 10.43l2.22 1.49a.5.5 0 00.78-.42V8.25z"></path>
                  </svg> */}
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="var(--NN900, #2E3137)"
              >
                <path d="M20.7 19V7v-.1c0-.1 0-.2-.1-.3L18.9 4l-.1-.1c-.3-.4-.8-.6-1.3-.6h-11c-.5 0-1 .3-1.3.6L5 4 3.3 6.6c0 .1-.1.2-.1.3V19c0 .9.7 1.7 1.6 1.7h14.1c1 .1 1.8-.7 1.8-1.7 0 .1 0 0 0 0zM6.3 4.9c.1-.1.1-.1.2-.1h11c.1 0 .2.1.2.1l.9 1.4H5.4l.9-1.4zm7.9 2.8V10l-2-.7c-.2-.1-.3-.1-.5 0l-2 .7V7.7h4.5zm5 11.3c0 .2-.1.2-.2.2H5c-.2 0-.2-.1-.2-.2V7.7h3.5V11c0 .2.1.5.3.6.2.1.4.2.7.1l2.8-.9 2.8.9h.1c.2 0 .3 0 .4-.1.2-.1.3-.4.3-.6V7.7h3.5V19z"></path>
              </svg>
            </ItemSellerNavbar>

            {/* Daftar Produk */}
            <ItemSellerNavbar
              href={"/seller/product-list"}
              name={"Daftar Produk"}
            >
              {/* <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="var(--GN500, #00AA5B)"
                  >
                    <path d="M20 6.75H4a.76.76 0 01-.7-.47.76.76 0 01.18-.82l1.68-1.61a2 2 0 011.32-.61h11a2 2 0 011.33.62l1.7 1.59a.75.75 0 01-.51 1.3zm-5 1.5h5a.76.76 0 01.75.75v10A1.76 1.76 0 0119 20.75H5A1.76 1.76 0 013.25 19V9A.76.76 0 014 8.25h5v3.25a.5.5 0 00.76.42L12 10.43l2.22 1.49a.5.5 0 00.78-.42V8.25z"></path>
                  </svg> */}
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="var(--NN900, #2E3137)"
              >
                <path d="M20.7 19V7v-.1c0-.1 0-.2-.1-.3L18.9 4l-.1-.1c-.3-.4-.8-.6-1.3-.6h-11c-.5 0-1 .3-1.3.6L5 4 3.3 6.6c0 .1-.1.2-.1.3V19c0 .9.7 1.7 1.6 1.7h14.1c1 .1 1.8-.7 1.8-1.7 0 .1 0 0 0 0zM6.3 4.9c.1-.1.1-.1.2-.1h11c.1 0 .2.1.2.1l.9 1.4H5.4l.9-1.4zm7.9 2.8V10l-2-.7c-.2-.1-.3-.1-.5 0l-2 .7V7.7h4.5zm5 11.3c0 .2-.1.2-.2.2H5c-.2 0-.2-.1-.2-.2V7.7h3.5V11c0 .2.1.5.3.6.2.1.4.2.7.1l2.8-.9 2.8.9h.1c.2 0 .3 0 .4-.1.2-.1.3-.4.3-.6V7.7h3.5V19z"></path>
              </svg>
            </ItemSellerNavbar>

            {/* Daftar Produk */}
            <ItemSellerNavbar
              href={"/seller/create-voucher"}
              name={"Buat Voucher"}
            >
              {/* <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="var(--GN500, #00AA5B)"
                  >
                    <path d="M20 6.75H4a.76.76 0 01-.7-.47.76.76 0 01.18-.82l1.68-1.61a2 2 0 011.32-.61h11a2 2 0 011.33.62l1.7 1.59a.75.75 0 01-.51 1.3zm-5 1.5h5a.76.76 0 01.75.75v10A1.76 1.76 0 0119 20.75H5A1.76 1.76 0 013.25 19V9A.76.76 0 014 8.25h5v3.25a.5.5 0 00.76.42L12 10.43l2.22 1.49a.5.5 0 00.78-.42V8.25z"></path>
                  </svg> */}
              <Image src={`/logo/icon_coupon.svg`} alt="" width={24} height={24}/>
            </ItemSellerNavbar>
            {/* End Menus */}
          </div>
        </nav>
      </div>

      {/* Display */}
      <div className={styles.seller_display}>{props.children}</div>
    </div>
  );
};

function ItemSellerNavbar(props: { href?: any; name: string; children?: any }) {
  return (
    <li>
      <Link href={props.href ? props.href : "#"}>
        <a className={styles.item_seller_container}>
          <div className={styles.item_seller_logo}>
            <span style={{ marginRight: "8px" }}>{props.children}</span>
            <div className={styles.item_seller_name}>{props.name}</div>
          </div>
        </a>
      </Link>
    </li>
  );
}

export default SellerLayout;
