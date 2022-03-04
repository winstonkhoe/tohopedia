import { gql, useQuery } from "@apollo/client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./user_navbar.module.scss";

export function UserNavbar() {
  const [kotak, setKotak] = useState(true);
  const [pembelian, setPembelian] = useState(true);
  const [profil, setProfil] = useState(true);

  const USER_DATA_QUERY = gql`
    query GetUser {
      getCurrentUser {
        name
        image
      }
    }
  `;

  const { loading: userLoad, error: userErr, data: userData } = useQuery(USER_DATA_QUERY, {
    pollInterval: 2000,
  });

  return (
    <div className={styles.main_left_container}>
      <div className={styles.settings_user_profile_container}>
        <div className={styles.settings_user_profile_image_container}>
          <div className={styles.settings_user_profile_image_relative}>
            <Image
              src={`/uploads/${userData?.getCurrentUser?.image}`}
              alt=""
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>
        <div className={styles.settings_user_profile_detail_container}>
          <h6 className={styles.settings_user_profile_name}>{userData?.getCurrentUser?.name}</h6>
          <div className={styles.settings_user_profile_other}>
            <div className={styles.settings_user_profile_other_icon_relative}>
              <Image
                src={"/logo/icon_topay.png"}
                alt=""
                layout="fill"
                objectFit="cover"
              />
            </div>
            <span className={styles.settings_user_profile_other_label}>
              Tersambung ke Topay
            </span>
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
                    Rp10.000
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
        <div className={styles.settings_user_utilities_accordion_container}>
          <button className={styles.settings_user_utilities_accordion_button}>
            <h6 className={styles.settings_user_utilities_accordion_header}>
              Kotak Masuk
            </h6>
            <div
              className={styles.settings_user_utilities_accordion_icon}
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
                    : { transform: "" }
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
              <button className={styles.settings_user_utilities_accordion_item}>
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
                      Chat
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
              <button className={styles.settings_user_utilities_accordion_item}>
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
                      Ulasan
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
        <div className={styles.settings_user_utilities_accordion_container}>
          <button
            className={styles.settings_user_utilities_accordion_button}
            onClick={() => {
              setPembelian(!pembelian);
            }}
          >
            <h6 className={styles.settings_user_utilities_accordion_header}>
              Pembelian
            </h6>
            <div className={styles.settings_user_utilities_accordion_icon}>
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="var(--color-icon-enabled, #525867)"
                style={
                  pembelian === true
                    ? { transform: "rotate(-180deg)" }
                    : { transform: "" }
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
              <button className={styles.settings_user_utilities_accordion_item}>
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
                      Daftar Transaksi
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
        <div className={styles.settings_user_utilities_accordion_container}>
          <button
            className={styles.settings_user_utilities_accordion_button}
            onClick={() => {
              setProfil(!profil);
            }}
          >
            <h6 className={styles.settings_user_utilities_accordion_header}>
              Profil Saya
            </h6>
            <div className={styles.settings_user_utilities_accordion_icon}>
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="var(--color-icon-enabled, #525867)"
                style={
                  profil === true
                    ? { transform: "rotate(-180deg)" }
                    : { transform: "" }
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
              <button className={styles.settings_user_utilities_accordion_item}>
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
                      Wishlist
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
              <button className={styles.settings_user_utilities_accordion_item}>
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
                      Pengaturan
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
          className={styles.settings_user_utilities_accordion_container}
        ></div>
        <div
          className={styles.settings_user_utilities_accordion_container}
        ></div>
      </div>
    </div>
  );
}
