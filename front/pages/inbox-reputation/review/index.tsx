import ReviewLayout from "../layout";
import styles from "./index.module.scss";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { userDetailsContext } from "../../../services/UserDataProvider";
import { stateContext } from "../../../services/StateProvider";
import Router from "next/router";
import { Transaction } from "../../../models/Transaction";
import Link from "next/link";
import { toHourMinute, toIndonesianDateShort } from "../../../misc/date";
import { RedLabel } from "../../../components/transaction/TransactionStatus";
import { Button } from "../../../components/Button/button";
import { TransactionDetail } from "../../../models/TransactionDetail";

export default function ReviewPage() {
  const { setTabIndexSetting } = useContext(stateContext);

  const transactionData: Transaction[] =
    useContext(userDetailsContext)?.transactions;
  useEffect(() => {
    setTabIndexSetting(0);
  }, []);

  function checkEmptyField(addressObj: any, key: string) {
    return addressObj[key].trim().length == 0;
  }

  return (
    <div className={styles.container}>
      <div className={styles.top_wrapper}>
        <div>
          <div>
            <button></button>
            <input
              type="text"
              placeholder="Invoice / Nama Penjual / Produk / Toko"
              onChange={(e) => {}}
            />
          </div>
        </div>
        <button>
          <span>Filter</span>
        </button>
      </div>
      {transactionData?.map((transaction: Transaction, index: number) => {
        return (
          <div key={index} className={styles.transaction_wrapper}>
            <div className={styles.card_header}>
              <span>
                <Link href={"/"}>{transaction?.id}</Link>
              </span>
              <div className={styles.timestamp}>
                Pesanan dibuat:{" "}
                {toIndonesianDateShort(transaction?.date) +
                  ", " +
                  toHourMinute(transaction?.date)}
              </div>
            </div>
            <div className={styles.card_body}>
              <div className={styles.reputation}>
                <div className={styles.header}>
                  <div className={styles.shop_image_relative}>
                    <Image
                      src={`/uploads/${transaction?.shop?.image}`}
                      alt=""
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className={styles.shop_detail}>
                    <div className={styles.shop_name}>
                      <Link href={`/${transaction?.shop?.slug}`}>
                        {transaction?.shop?.name}
                      </Link>
                    </div>
                    <div className={styles.shop_badge}>
                      <RedLabel text="Penjual" />
                      <div className={styles.shop_badge_image_relative}>
                        <Image
                          src={"/logo/logo_diamond_4.gif"}
                          alt=""
                          layout="fill"
                          objectFit="contain"
                        />
                      </div>
                    </div>
                  </div>
                  <Button warning={false} disable={false}>
                    + Follow
                  </Button>
                </div>
              </div>
              <div className={styles.product_list}>
                <div className={styles.product_list_container}>
                  <h5>Daftar Produk</h5>
                  <div className={styles.list_container}>
                    <ul>
                      {transaction?.details?.map(
                        (detail: TransactionDetail, index: number) => {
                          return (
                            <li key={index}>
                              <div className={styles.product_image}>
                                <Image
                                  src={`/uploads/${detail?.product?.images[0]?.image}`}
                                  alt=""
                                  layout="fill"
                                  objectFit="cover"
                                />
                              </div>
                              <div className={styles.product_info}>
                                <div className={styles.product_title}>
                                  <div className={styles.title_wrapper}>
                                    <Link
                                      href={`/${detail?.product?.shop?.slug}/${detail?.product?.id}`}
                                    >
                                      {detail?.product?.name}
                                    </Link>
                                  </div>
                                </div>
                                <div className={styles.product_rating}>
                                  <span>Belum diulas</span>
                                </div>
                              </div>
                              {detail?.review?.id === "" ? (
                                <div
                                  onClick={() => {
                                    Router.push(
                                      `/inbox-reputation/review/${transaction?.id}/${detail?.id}`
                                    );
                                  }}
                                >
                                  <Button disable={false} warning={false}>
                                    Tulis Ulasan
                                  </Button>
                                </div>
                              ) : null}
                            </li>
                          );
                        }
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

ReviewPage.getLayout = function getLayout(page: any) {
  return <ReviewLayout>{page}</ReviewLayout>;
};
