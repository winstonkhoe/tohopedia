import type { NextPage } from "next";
import Image from "next/image";
import styles from "../styles/Topay.module.scss";
import common from "../styles/components/common.module.scss";
// import Carousel from "react-multi-carousel";

import Link from "next/link";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import RupiahFormat from "../misc/currency";
import Overlay from "../components/overlay/overlay";
import { init, send } from "@emailjs/browser";
import { useToasts } from "react-toast-notifications";
import { OTPGenerator } from "../misc/otp";
import NumberFormat from "../misc/number";
import { userDetailsContext } from "../services/UserDataProvider";
import { stateContext } from "../services/StateProvider";

const SERVICE_ID = "service_egdaufp";
const TEMPLATE_ID = "template_b62xusn";
function Topay() {
  const { addToast } = useToasts();
  const [topUpping, setTopUpping] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemCode, setRedeemCode] = useState("");
  const [warningText, setWarningText] = useState("");
  init("user_3FcFw9m04bwuTvX6TklJs");

  const { setPageTitle } = useContext(stateContext)
  
  useEffect(() => {
    setPageTitle("Topay | Tohopedia")
  }, [setPageTitle])

  const userData = useContext(userDetailsContext)

  const MUTATION_TOKEN_TOPAY = gql`
    mutation createTokenTopay($code: String!, $value: Int!) {
      createTopayToken(code: $code, value: $value) {
        id
      }
    }
  `;

  const [
    createTokenTopay,
    ] = useMutation(MUTATION_TOKEN_TOPAY);

  const MUTATION_TOPUP_TOPAY = gql`
    mutation addTopayBalance($code: String!) {
        addTopayBalance(code: $code) {
        id
      }
    }
  `;

  const [
    addTopayBalance,
    ] = useMutation(MUTATION_TOPUP_TOPAY);
    
  const GET_TOKEN_TOPAY = gql`
    query getTopayToken($code: String!) {
      getTopayToken(code: $code) {
        id
        code
        validTo
        redeemed
      }
    }
  `;

  const [
    getTopayToken,
  ] = useLazyQuery(GET_TOKEN_TOPAY);
    function handleTopUp(value: number) {
      
    var otp = OTPGenerator();
    setTopUpping(false)
    var templateParams = {
      email_reply: "winstonkcoding@gmail.com",
      email_destination: userData?.email,
      otp_code: otp,
    };
    send(SERVICE_ID, TEMPLATE_ID, templateParams).then(function (response) {
      createTokenTopay({
        variables: {
          code: otp,
          value: value,
        },
      });
      addToast("Silahkan Check Email Untuk Kode-nya", { appearance: "info" });
    });
    }
    
    function handleRedeem() {
        if (redeemCode.length < 6) {
            setWarningText("Invalid Code")
        } else {
            getTopayToken({variables:{
                code: redeemCode
            }
            }).then((data: any) => {
                if (data?.data == undefined || data?.data?.id == "") {
                    setWarningText("Invalid Code")
                } else if (data?.data?.redeemed === true) {
                    setWarningText("Code has been redeemed!")
                } else {
                    let now = new Date().getTime()
                    let codeValidTo = new Date(data?.data?.getTopayToken?.validTo).getTime()
                    if (codeValidTo < now) {
                        setWarningText("The code is expired!")
                    } else {
                        addTopayBalance({
                            variables: {
                            code: redeemCode
                            }
                        }).then((topay: any) => {
                            addToast("You have successly Top-up ToPay balance", { appearance: "success" });
                            setRedeeming(false)
                        })
                    }
                }
            })
        }
    }

  return (
      <main className={styles.main}>
        <div className={styles.main_container}>
          <div className={styles.image_background}>
            <Image
              src={"/assets/topay_bg.png"}
              layout="fill"
              objectFit="cover"
              alt=""
            />
          </div>
          <div className={styles.topay_container_flex}>
            <div className={styles.topay_balance_container}>
              <div className={styles.topay_wrapper_container}>
                <div className={styles.topay_empty_wrapper_container}></div>
                <div className={styles.topay_balance_wrapper_container}>
                  <div className={styles.topay_balance_inner_container}>
                    <div className={styles.topay_balance_header_container}>
                      <div className={styles.topay_balance_name}>
                        <div className={styles.topay_icon}>
                          <Image
                            src={"/logo/icon_topay_plus.png"}
                            alt=""
                            layout="fill"
                          />
                        </div>
                        <svg
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
                          fill="var(--N0, #FFFFFF)"
                        >
                          <path d="M12.004 22c-2 0-3.9-.6-5.6-1.7-1.6-1.1-2.9-2.7-3.7-4.5-.7-1.8-.9-3.8-.5-5.8.4-1.9 1.3-3.7 2.7-5.1 1.4-1.4 3.2-2.3 5.1-2.7 2-.4 4-.2 5.8.6 1.8.8 3.4 2 4.5 3.7 1.1 1.6 1.7 3.5 1.7 5.5 0 2.7-1.1 5.2-2.9 7.1-1.9 1.8-4.4 2.9-7.1 2.9zm0-18c-1.6 0-3.1.5-4.4 1.3-1.4.9-2.4 2.2-3 3.6-.6 1.5-.8 3.1-.4 4.7.3 1.6 1.1 3 2.2 4.1 1.1 1.1 2.5 1.9 4.1 2.2 1.6.3 3.2.2 4.6-.5 1.5-.6 2.7-1.6 3.6-2.9.9-1.3 1.3-2.9 1.3-4.4 0-2.1-.8-4.2-2.3-5.7-1.5-1.5-3.6-2.4-5.7-2.4zm-1.2 3.786v.064c.024.674.517 1.15 1.2 1.15.259 0 .49-.068.679-.19l.02-.01a.489.489 0 00.193-.168c.194-.21.308-.499.308-.832 0-.55-.308-.976-.78-1.134a.478.478 0 00-.22-.066l-.145.001a1.293 1.293 0 00-.565.1c-.197.005-.392.202-.49.399a1.795 1.795 0 00-.01.022 1.242 1.242 0 00-.19.664zm1.2 9.214c-.6 0-1-.4-1-1v-4c0-.6.4-1 1-1s1 .4 1 1v4c0 .5-.4 1-1 1z"></path>
                        </svg>
                      </div>
                      <div>
                        <svg
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          fill="white"
                        >
                          <path d="M19.48 13.12h.08a2.48 2.48 0 01.94 3.41l-.5.87a2.47 2.47 0 01-3.42.8h-.09a8.082 8.082 0 01-1.93 1.13v.09a2.481 2.481 0 01-2.5 2.5h-1a2.48 2.48 0 01-2.5-2.5v-.09a7.999 7.999 0 01-1.8-1l-.2.12a2.38 2.38 0 01-1.2.3 2.48 2.48 0 01-2.2-1.3l-.5-.9a2.46 2.46 0 01.9-3.4h.09a7.329 7.329 0 01-.01-2.22h-.08a2.49 2.49 0 01-.93-3.41l.5-.87a2.47 2.47 0 013.41-.93h.09a8.08 8.08 0 011.93-1.13V4.5a2.48 2.48 0 012.5-2.5h1a2.48 2.48 0 012.53 2.5v.09a7.9 7.9 0 011.87 1.09l.13-.08a2.38 2.38 0 011.2-.3A2.41 2.41 0 0120 6.7l.47.9a2.47 2.47 0 01-.9 3.4h-.07a7.5 7.5 0 01.07 1 7.75 7.75 0 01-.09 1.12zm-1.22 3.29l.49-.87a.47.47 0 00-.18-.68l-1.38-.79c.246-.662.371-1.364.37-2.07a6.071 6.071 0 00-.38-2.1l1.38-.8a.37.37 0 00.1-.6l-.5-.9c-.1-.2-.2-.3-.4-.3a.31.31 0 00-.2.1l-1.36.79a6 6 0 00-3.64-2.1V4.5a.47.47 0 00-.5-.5h-1a.47.47 0 00-.5.5v1.59a6 6 0 00-3.64 2.1l-1.37-.78a.47.47 0 00-.68.18l-.5.87a.47.47 0 00.18.68l1.38.79A5.93 5.93 0 005.56 12a5.94 5.94 0 00.38 2.1l-1.38.8a.38.38 0 00-.1.6l.5.9c.1.2.2.3.4.3a.35.35 0 01.2-.1l1.36-.79a6 6 0 003.64 2.1v1.59a.472.472 0 00.5.5h1a.47.47 0 00.5-.5v-1.59a6 6 0 003.64-2.1l1.37.78a.48.48 0 00.69-.18zm-5.749-6.184a2 2 0 00-2.351.374 1.93 1.93 0 000 2.8 2 2 0 102.351-3.174zM9.343 8.712A4.05 4.05 0 0111.56 8a4.3 4.3 0 012.8 1.1 4.05 4.05 0 01-2.8 6.9 4.3 4.3 0 01-2.8-1.1 4.05 4.05 0 01.583-6.188z"></path>
                        </svg>
                      </div>
                    </div>
                    <div className={styles.topay_balance_value_container}>
                                          <p>{RupiahFormat(userData?.topay?.balance)}</p>
                      <button onClick={() => setTopUpping(true)}>
                        <span>Top-up</span>
                      </button>
                      <button onClick={() => setRedeeming(true)}>
                        <span>Redeem</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className={styles.topay_coins_wrapper_container}>
                  <div className={styles.topay_coins_container}>
                    <div className={styles.topay_coins_logo}>
                      <Image
                        src={"/logo/icon_topay_coins.png"}
                        layout="fill"
                        alt=""
                      />
                    </div>
                    <p>{NumberFormat(userData?.topay?.coin)}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.topay_transaction_wrapper}>
              <div className={styles.topay_transaction_empty_container}></div>
              <div className={styles.topay_transaction_container}>
                <div>
                  <div className={styles.topay_transaction_header_container}>
                    <p>Riwayat Transaksi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
              <div>
                  {topUpping && TopayTopup()}
                  {redeeming && RedeemOverlay()}
              </div>
      </main>
  );
  function TopayTopup() {
    return (
      <Overlay>
        <div className={common.overlay_container}>
          <button
            className={common.close_button}
            onClick={() => {
              setTopUpping(false);
            }}
          ></button>
          <h2 className={common.overlay_header}>Top-Up ToPay</h2>
          <div className={common.fields_overlay_container}>
            <label className={common.fields_container_label} htmlFor=""></label>
            <div>
              <div className={styles.overlay_container}>
                <button
                  className={styles.topup_value_button}
                  onClick={() => {
                    handleTopUp(50000);
                  }}
                >
                  <span>50.000</span>
                </button>
                <button
                  className={styles.topup_value_button}
                  onClick={() => {
                    handleTopUp(100000);
                  }}
                >
                  <span>100.000</span>
                </button>
                <button
                  className={styles.topup_value_button}
                  onClick={() => {
                    handleTopUp(250000);
                  }}
                >
                  <span>250.000</span>
                </button>
                <button
                  className={styles.topup_value_button}
                  onClick={() => {
                    handleTopUp(500000);
                  }}
                >
                  <span>500.000</span>
                </button>
                <button
                  className={styles.topup_value_button}
                  onClick={() => {
                    handleTopUp(1000000);
                  }}
                >
                  <span>1.000.000</span>
                </button>
                <button
                  className={styles.topup_value_button}
                  onClick={() => {
                    handleTopUp(2500000);
                  }}
                >
                  <span>2.500.000</span>
                </button>
                <button
                  className={styles.topup_value_button}
                  onClick={() => {
                    handleTopUp(5000000);
                  }}
                >
                  <span>5.000.000</span>
                </button>
                <button
                  className={styles.topup_value_button}
                  onClick={() => {
                    handleTopUp(10000000);
                  }}
                >
                  <span>10.000.000</span>
                </button>
                <button
                  className={styles.topup_value_button}
                  onClick={() => {
                    handleTopUp(100000000);
                  }}
                >
                  <span>100.000.000</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Overlay>
    );
    }
    
    function RedeemOverlay() {
        return (
          <Overlay>
            <div className={common.overlay_container}>
              <button
                className={common.close_button}
                onClick={() => {
                  setRedeeming(false);
                }}
              ></button>
              <h2 className={common.overlay_header}>Redeem Code</h2>
              <div className={common.fields_overlay_container}>
                <label className={common.fields_container_label} htmlFor="">
                  Kode Top-Up ToPay
                </label>
                <div>
                  <div className={common.input_container}>
                    <input
                      className={common.input_fields}
                      type="text"
                      onChange={(e) => {
                        setRedeemCode(e.target.value);
                      }}
                    />
                  </div>
                        </div>
                <label className={`${common.fields_container_label} ${common.warning_text}`} htmlFor="">
                            {warningText}
                </label>
              </div>
              <button
                className={
                  redeemCode ==  ""
                    ? common.button_overlay_disable
                    : common.button_overlay
                }
                onClick={() => {
                  handleRedeem()
                }}
                // className={
                //   common.button_overlay
                // }
              >
                <span>Simpan</span>
              </button>
            </div>
          </Overlay>
        );
      }
};

export default Topay;
