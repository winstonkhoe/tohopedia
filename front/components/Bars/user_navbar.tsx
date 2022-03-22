import Image from "next/image";
import Link from "next/link";
import { useContext} from "react";
import RupiahFormat from "../../misc/currency";
import NumberFormat from "../../misc/number";
import { Accordion, AccordionItemNotif } from "../Accordion/Accordion";
import styles from "./user_navbar.module.scss";
import { userDetailsContext } from "../../services/UserDataProvider";
import { User } from "../../models/User";

export function UserNavbar(props: {}) {

  const userData = useContext<User>(userDetailsContext)

  if (!userData) {
    return null
  }

  return (
    <div className={styles.main_left_container}>
      <div className={styles.settings_user_profile_container}>
        <div className={styles.settings_user_profile_image_container}>
          <div className={styles.settings_user_profile_image_relative}>
            <Image
              src={`/uploads/${userData?.image}`}
              alt=""
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>
        <div className={styles.settings_user_profile_detail_container}>
          <h6 className={styles.settings_user_profile_name}>{userData?.name}</h6>
          <div className={styles.settings_user_profile_other}>
            <div className={styles.settings_user_profile_other_icon_relative}>
              <Image
                src={"/logo/icon_topay.png"}
                alt=""
                layout="fill"
                objectFit="cover"
              />
            </div>
            <Link href={"/topay"}>
              <a href="">
              <span className={styles.settings_user_profile_other_label}>
              Tersambung ke Topay
            </span>
            </a>
            </Link>
            
          </div>
        </div>
      </div>
      <div className={styles.settings_user_summary_container}>
        <div className={styles.settings_user_summary_wallet_container}>
          <div
            className={styles.settings_user_summary_wallet_with_icon_container}
          >
            <div className={styles.settings_user_summary_wallet_icon_container}>
              <div
                className={styles.settings_user_summary_wallet_icon_relative}
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
                className={styles.settings_user_summary_wallet_label_value_a}
                href=""
              >
                <div
                  className={
                    styles.settings_user_summary_wallet_label_value_container
                  }
                >
                  <p className={styles.settings_user_summary_wallet_label}>
                    ToPay
                  </p>
                  <p className={styles.settings_user_summary_wallet_value}>
                    {RupiahFormat(userData?.topay?.balance)}
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
            <div className={styles.settings_user_summary_empty_icon}></div>
            <Link href={"/topay"}>
              <a
                className={styles.settings_user_summary_wallet_label_value_a}
                href=""
              >
                <div
                  className={
                    styles.settings_user_summary_wallet_label_value_container
                  }
                >
                  <p className={styles.settings_user_summary_wallet_label}>
                    ToPay Coins
                  </p>
                  <p className={styles.settings_user_summary_wallet_value}>
                    {NumberFormat(userData?.topay?.coin)}
                  </p>
                </div>
              </a>
            </Link>
          </div>
        </div>
        <div className={styles.settings_user_summary_coupons_container}>
          <Link href={"/user/coupons"}>
            <a className={styles.settings_user_summary_member_status} href="">
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
              <h6 className={styles.settings_user_summary_member_status_label}>
                Member Platinum
              </h6>
            </a>
          </Link>
          <div
            className={styles.settings_user_summary_coupons_detail_container}
          >
            <Link href={"/user/coupons"}>
              <a className={styles.settings_user_summary_item} href="">
                <div className={styles.settings_user_summary_item_container}>
                  <p className={styles.settings_user_summary_item_label}>
                    Kupon Saya
                  </p>
                  <p className={styles.settings_user_summary_item_value}>4</p>
                </div>
              </a>
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.settings_user_utilities_container}>
        <Accordion header="Kotak Masuk">
          <AccordionItemNotif name="Chat" href={"/chat"} notifCount={7} />
          <AccordionItemNotif name="Ulasan" href={"/inbox-reputation/review"} notifCount={5} />
        </Accordion>
        <Accordion header="Pembelian">
          <AccordionItemNotif name="Daftar Transaksi" href={"/order-list"} notifCount={7} />
        </Accordion>
        <Accordion header="Profil Saya">
          <AccordionItemNotif name="Wishlist" notifCount={7} />
          <AccordionItemNotif name="Pengaturan" href={"/user/settings"} notifCount={7} />
        </Accordion>
      </div>
    </div>
  );
}
