import Image from "next/image";
import Link from "next/link";
import Router from "next/router";
import { useContext, useEffect, useState } from "react";
import { ErrorNotFound } from "../../components/error";
import { DEFAULT_PROFILE_IMAGE } from "../../misc/global_constant";
import { GetMerchantType } from "../../misc/shop_type";
import { Shop } from "../../models/Shop";
import { stateContext } from "../../services/StateProvider";
import { userDetailsContext } from "../../services/UserDataProvider";
import styles from "./layout.module.scss";

const AdminLayout = (props: { children: any }) => {
  const { setPageTitle } = useContext(stateContext);

  useEffect(() => {
    setPageTitle("Seller Dashboard");
  }, [setPageTitle]);

  const userData = useContext(userDetailsContext);
  const [profileImage, setProfileImage] = useState(DEFAULT_PROFILE_IMAGE);

  useEffect(() => {
    setProfileImage(
      userData?.image ? `/uploads/${userData?.image}` : DEFAULT_PROFILE_IMAGE
    );
  }, [userData]);

  if (!userData) {
    return (
      <div className={styles.container}>
        <ErrorNotFound />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.seller_navbar}>
        <nav>
          <div>
            <ul className={styles.seller_header}>
              <li>
                <div className={styles.seller_header_container}>
                  <div className={styles.seller_image}>
                    <Image src={profileImage} alt="PM Logo" layout="fill" />
                  </div>
                  <div className={styles.seller_header_detail_container}>
                    <div className={styles.seller_name}>
                      <Link href="">
                        {/* <a>bai</a> */}
                        <a>{userData?.name}</a>
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            </ul>

            <ItemSellerNavbar href={"/admin/home"} name={"Home"}>
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="var(--NN900, #2E3137)"
              >
                <path d="M13.17 2l9.33 8.44a.76.76 0 01-.748 1.289.748.748 0 01-.252-.149L19.75 10v10A1.76 1.76 0 0118 21.75H6A1.76 1.76 0 014.25 20V10L2.5 11.56a.75.75 0 11-1-1.12L10.83 2a1.75 1.75 0 012.34 0zm-2.92 14v4.25h3.5V16a.25.25 0 00-.25-.25h-3a.25.25 0 00-.25.25zm7.927 4.177A.25.25 0 0018.25 20V8.63l-6.08-5.47a.25.25 0 00-.34 0L5.75 8.63V20a.25.25 0 00.25.25h2.75V16a1.76 1.76 0 011.75-1.75h3A1.76 1.76 0 0115.25 16v4.25H18a.25.25 0 00.177-.073zM13.5 9.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path>
              </svg>
            </ItemSellerNavbar>

            <ItemSellerNavbar href={"/admin/manage-user"} name={"Manage User"}>
              <div className={styles.icon_relative}>
                <Image src={"/logo/user_logo.svg"} alt="" layout="fill" objectFit="contain"/>
              </div>
            </ItemSellerNavbar>

            <ItemSellerNavbar href={"/admin/manage-coupon"} name={"Manage Coupon"}>
              <div className={styles.icon_relative}>
                <Image src={"/logo/icon_coupon.svg"} alt="" layout="fill" objectFit="contain"/>
              </div>
            </ItemSellerNavbar>
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

export default AdminLayout;
