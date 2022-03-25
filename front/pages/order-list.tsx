import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Footer from "../components/Footer/Footer";
import InitFont from "../components/initialize_font";
import Navbar from "../components/navbar";
import styles from "../styles/Order_List.module.scss";
import detailStyle from "../styles/components/detail_transaction_overlay.module.scss";
import common from "../styles/components/common.module.scss";
import "react-multi-carousel/lib/styles.css";
import Link from "next/link";
import { gql, useMutation, useQuery } from "@apollo/client";
import React, { Children, useContext, useEffect, useState } from "react";
import { UserNavbar } from "../components/Bars/user_navbar";
import Router, { useRouter } from "next/router";
import TransactionCard from "../components/transaction/TransactionCard";
import tCardStyle from "../components/transaction/TransactionCard.module.scss";
import Overlay from "../components/overlay/overlay";
import {
  GreenLabel,
  SelesaiOtomatis,
  YellowLabel,
} from "../components/transaction/TransactionStatus";
import RupiahFormat from "../misc/currency";
import {
  toIndonesianDate,
  toIndonesianDateAndTime,
  toIndonesianDateShort,
} from "../misc/date";
import { userDetailsContext } from "../services/UserDataProvider";
import { ShopIcon } from "../components/ShopDetails/ShopDetails";
import { FinalPriceDiscount } from "../misc/prices";
import { stateContext } from "../services/StateProvider";

const OrderList = (props: { children: any }) => {
  const router = useRouter();

  const [selectedTransaction, setSelectedTransaction] = useState("");
  const [selectedTransactionObj, setSelectedTransactionObj] = useState();
  const [seeDetailTransaction, setSeeDetailTransaction] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [transactionSummary, setTransactionSummary] = useState({});
  const { setPageTitle } = useContext(stateContext);

  useEffect(() => {
    setPageTitle("Pembelian | Tohopedia");
  }, [setPageTitle]);

  const UPDATE_STATUS_MUTATION = gql`
    mutation UpdateStatus($id: ID!, $status: Int!) {
      updateStatus(id: $id, status: $status) {
        id
      }
    }
  `;

  const [
    updateStatus,
    { loading: statusLoad, data: statusData, error: statusErr },
  ] = useMutation(UPDATE_STATUS_MUTATION);

  const userData = useContext(userDetailsContext);

  useEffect(() => {
    let transactionSummary: any = {};
    userData?.transactions.map((transaction: any) => {
      let transactionSum = 0;
      let transactionQuantity = 0;
      transaction?.details.map((detail: any) => {
        transactionQuantity += detail?.quantity;
        transactionSum += FinalPriceDiscount(
          detail?.product?.price,
          detail?.quantity,
          detail?.product?.discount
        );
      });
      transactionSummary[transaction?.id] = {
        total: transactionSum,
        quantity: transactionQuantity,
      };
    });
    setTransactionSummary(transactionSummary);
  }, [userData?.transactions]);

  const indicatorStyle = {
    index: { width: "131px", left: "0px" },
    address: { width: "148px", left: "131px" },
  };

  function getTransactionDetails(transactionId: string) {
    return userData?.transactions?.filter((transaction: any) => {
      return transaction.id === transactionId;
    })[0];
  }

  const handleDetailTransaction = (id: string) => {
    setSelectedTransaction(id);
    setSelectedTransactionObj(getTransactionDetails(id));
    setSeeDetailTransaction(true);
  };

  function SelesaiOtomatisEstimation(date: string) {
    let day = 60 * 60 * 24 * 1000;
    let d = new Date(new Date(date).getTime() + 2 * day);
    let curr = new Date();
    let dayDiff = Math.abs(curr.getDay() - d.getDay());
    let hourDiff = Math.abs(curr.getHours() - d.getHours());
    return dayDiff + " Hari " + hourDiff + " Jam";
  }
  return (
    <main className={styles.main}>
      <div className={styles.main_container}>
        <div className={styles.main_inner_container}>
          <UserNavbar />

          {/* Menu Settings */}
          <div className={styles.main_right_container}>
            {/* <span className={styles.main_right_container_header}>
                  Winston
                </span> */}
            <div className={styles.settings_tab_outer_container}>
              <div className={styles.filter_wrapper}>
                <div className={styles.filter_top_options_container}>
                  <div className={styles.search_field_container}>
                    <div>
                      <button></button>
                      <input
                        type="text"
                        placeholder="Cari transaksimu di sini"
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className={styles.category_dropdown_container}></div>
                  <div className={styles.date_choose_container}>
                    <div className={styles.date_choose_container_border}>
                      <input type="date" name="" id="" />
                    </div>
                  </div>
                </div>
                <div className={styles.filter_bottom_options_container}>
                  <div className={styles.filter_bottom_options_wrapper}>
                    <div className={styles.filter_bottom_options_header}>
                      <p>Status</p>
                    </div>
                    <div
                      className={styles.filter_options_container_flex_wrapper}
                    >
                      <div className={styles.filter_options_container_flex}>
                        <div
                          className={`${styles.filter_options_item} ${styles.filter_selected}`}
                        >
                          Semua
                        </div>
                        <div className={styles.filter_options_item}>
                          Berlangsung
                        </div>
                        <div className={styles.filter_options_item}>
                          Berhasil
                        </div>
                        <div className={styles.filter_options_item}>
                          Tidak Berhasil
                        </div>
                      </div>
                    </div>
                    <div className={styles.filter_reset_container}>
                      <p>Reset Filter</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.transaction_container}>
                {/* {} */}
                {userData?.transactions.map(
                  (transaction: any, index: number) => {
                    return (
                      <div
                        key={index}
                        className={styles.transaction_card_container}
                      >
                        <section className={tCardStyle.order_card_container}>
                          <div className={tCardStyle.order_detail_top}>
                            <div className={tCardStyle.order_detail_top_left}>
                              <div
                                className={tCardStyle.order_detail_icon}
                              ></div>
                              <div className={tCardStyle.order_detail_header}>
                                <p>Belanja</p>
                              </div>
                              <div className={tCardStyle.order_detail_date}>
                                <p>
                                  {toIndonesianDateShort(transaction?.date)}
                                </p>
                                {/* <p>{transaction?.date}</p> */}

                                {/* 28 Feb 2022 */}
                              </div>
                              <div className={tCardStyle.order_status}>
                                <p>
                                  {transaction?.status == 1 ? (
                                    <GreenLabel text="Selesai" />
                                  ) : (new Date().getTime() -
                                      new Date(transaction?.date).getTime()) /
                                      (1000 * 3600 * 24) >
                                    transaction?.shipment?.duration ? (
                                    <YellowLabel text="Tiba Di Tujuan" />
                                  ) : (
                                    <YellowLabel text="Sedang Dikirim" />
                                  )}
                                </p>
                              </div>
                              <div className={tCardStyle.order_invoice}>
                                <p>{transaction?.id}</p>
                              </div>
                            </div>
                            {(new Date().getTime() -
                              new Date(transaction?.date).getTime()) /
                              (1000 * 3600 * 24) >
                              transaction?.shipment?.duration &&
                            new Date().getTime() <
                              new Date(
                                new Date(transaction?.date).getTime() +
                                  2 * 1000 * 3600 * 24
                              ).getTime() ? (
                              <div
                                className={tCardStyle.order_detail_top_right}
                              >
                                <p>Selesai Otomatis</p>
                                <SelesaiOtomatis
                                  hour={SelesaiOtomatisEstimation(
                                    transaction?.date
                                  )}
                                />
                              </div>
                            ) : null}
                          </div>
                          <div className={tCardStyle.order_detail_shop}>
                            {transaction?.shop?.type > 0 ? (
                              <div className={tCardStyle.icon_image_relative}>
                                <ShopIcon type={transaction?.shop?.type} />
                              </div>
                            ) : null}
                            <Link href={`/${transaction?.shop?.slug}`} passHref>
                              <p>{transaction?.shop?.name}</p>
                            </Link>
                          </div>
                          <div className={tCardStyle.order_detail_product}>
                            <div
                              className={tCardStyle.order_detail_product_item}
                            >
                              <div
                                className={
                                  tCardStyle.order_detail_product_item_flex
                                }
                              >
                                <div
                                  className={
                                    tCardStyle.order_detail_product_image_wrapper
                                  }
                                >
                                  <div
                                    className={
                                      tCardStyle.order_detail_product_image_relative
                                    }
                                  >
                                    <Image
                                      src={`/uploads/${transaction?.details[0]?.product?.images[0]?.image}`}
                                      alt=""
                                      layout="fill"
                                      objectFit="cover"
                                    />
                                  </div>
                                </div>
                                <div className={tCardStyle.product_detail_flex}>
                                  <div
                                    className={tCardStyle.product_detail_name}
                                  >
                                    <Link
                                      href={`${transaction?.shop?.slug}/${transaction?.details[0]?.product?.id}`}
                                    >
                                      <a href="">
                                        <h6>
                                          {
                                            transaction?.details[0]?.product
                                              ?.name
                                          }
                                        </h6>
                                      </a>
                                    </Link>
                                  </div>
                                  <div
                                    className={
                                      tCardStyle.product_detail_price_quantity
                                    }
                                  >
                                    {transaction?.details[0]?.quantity} barang x{" "}
                                    {RupiahFormat(
                                      FinalPriceDiscount(
                                        transaction?.details[0]?.product?.price,
                                        transaction?.details[0]?.quantity,
                                        transaction?.details[0]?.product
                                          ?.discount
                                      )
                                    )}
                                  </div>
                                  {transaction?.details?.length > 1 ? (
                                    <div
                                      className={
                                        tCardStyle.product_detail_extras
                                      }
                                    >
                                      +{transaction?.details?.length - 1} produk
                                      lainnya
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                            <div
                              className={tCardStyle.order_detail_total_purchase}
                            >
                              <div>
                                <p className={tCardStyle.order_total_header}>
                                  Total Belanja
                                </p>
                                <p className={tCardStyle.order_total_value}>
                                  {RupiahFormat(
                                    transactionSummary[transaction?.id]?.total
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className={tCardStyle.order_detail_buttons}>
                            <div
                              className={tCardStyle.order_detail_button_detail}
                            >
                              <p
                                onClick={() =>
                                  handleDetailTransaction(transaction?.id)
                                }
                              >
                                Lihat Detail Transaksi
                              </p>
                            </div>
                            {(new Date().getTime() -
                              new Date(transaction?.date).getTime()) /
                              (1000 * 3600 * 24) >
                            transaction?.shipment?.duration ? (
                              <div
                                className={
                                  tCardStyle.order_detail_button_action
                                }
                              >
                                {transaction?.status == 0 ? (
                                  <button
                                    onClick={() => {
                                      updateStatus({
                                        variables: {
                                          id: transaction?.id,
                                          status: 1,
                                        },
                                      });
                                    }}
                                  >
                                    <span>Selesai</span>
                                  </button>
                                ) : null}

                                {transaction?.status == 1 ? (
                                  <button
                                  // onClick={() => {
                                  //   updateStatus({
                                  //     variables: {
                                  //       id: transaction?.id,
                                  //       status: 2,
                                  //     },
                                  //   });
                                  // }}
                                  >
                                    <span>Beri Ulasan</span>
                                  </button>
                                ) : null}

                                {transaction?.status == 2 ? (
                                  <button
                                  // onClick={() => {
                                  //   updateStatus({
                                  //     variables: {
                                  //       id: transaction?.id,
                                  //       status: 2,
                                  //     },
                                  //   });
                                  // }}
                                  >
                                    <span>Beli Lagi</span>
                                  </button>
                                ) : null}
                              </div>
                            ) : null}
                          </div>
                        </section>
                      </div>
                      // <TransactionCard
                      //   key={transaction?.id}
                      //   date={transaction?.date}
                      //   productName={transaction?.details[0]?.product?.name}
                      //   productPrice={
                      //     transaction?.details[0]?.product?.price
                      //   }
                      //   productQuantity={transaction?.details[0]?.quantity}
                      //   productImage={
                      //     transaction?.details[0]?.product?.images[0]?.image
                      //   }
                      //   shopName={transaction?.shop?.name}
                      //   shopType={transaction?.shop?.type}
                      //   transactionId={transaction?.id}
                      // />
                    );
                  }
                )}
              </div>
              <div className={styles.pagination_container}></div>
            </div>
          </div>
          {/* END Menu Settings */}
        </div>
      </div>
      <div>{seeDetailTransaction && DetailTransactionOverlay()}</div>
    </main>
  );

  function DetailTransactionOverlay() {
    return (
      <Overlay>
        <div className={detailStyle.container}>
          <button
            className={common.close_button}
            onClick={() => {
              setSeeDetailTransaction(false);
            }}
          ></button>
          <h2 className={common.overlay_header}>Detail Transaksi</h2>
          <div className={detailStyle.transaction_container_flex}>
            <div className={detailStyle.transaction_container_left}>
              <div className={detailStyle.transaction_container_item}>
                <div className={detailStyle.transaction_container_status}>
                  <div>
                    <h5>Selesai</h5>
                  </div>
                </div>
                <div className={detailStyle.transaction_container_invoice_date}>
                  <div
                    className={
                      detailStyle.transaction_container_invoice_date_row
                    }
                  >
                    <p>No. Invoice</p>
                    <div>
                      <a>
                        {/* <span>INV/21903810923809</span> */}
                        <span>{selectedTransactionObj?.id}</span>
                      </a>
                    </div>
                  </div>
                  <div
                    className={
                      detailStyle.transaction_container_invoice_date_row
                    }
                  >
                    <p>Tanggal Pembelian</p>
                    <div>
                      <p>
                        {/* <span>25 Januari 2022, 13:10 WIB</span> */}
                        <span>
                          {toIndonesianDateAndTime(
                            selectedTransactionObj?.date
                          )}
                          {/* {toIndonesianDate(selectedTransactionObj?.date)} */}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={detailStyle.transaction_container_item}>
                <div>
                  <div className={detailStyle.wrapper_title}>
                    <h5>Detail Produk</h5>
                    {/* Shop Detail */}
                    <div className={detailStyle.shop_wrapper}>
                      <div className={detailStyle.shop_icon_wrapper}>
                        <div className={detailStyle.shop_icon_relative}>
                          <ShopIcon type={selectedTransactionObj?.shop?.type} />
                        </div>
                      </div>
                      <h6>{selectedTransactionObj?.shop?.name}</h6>
                      <svg
                        viewBox="0 0 24 24"
                        width="15"
                        height="15"
                        fill="var(--N700, rgba(49, 53, 59, 0.96))"
                      >
                        <path d="M9.5 18a.999.999 0 01-.71-1.71l4.3-4.29-4.3-4.29a1.004 1.004 0 011.42-1.42l5 5a.998.998 0 010 1.42l-5 5a1 1 0 01-.71.29z"></path>
                      </svg>
                    </div>
                  </div>
                  {/* Product Card */}
                  {selectedTransactionObj?.details.map(
                    (detail: any, index: number) => {
                      return (
                        <section
                          key={index}
                          className={detailStyle.product_detail_section}
                        >
                          <div className={detailStyle.product_section_flex}>
                            <div className={detailStyle.product_wrapper}>
                              <div className={detailStyle.product_info_flex}>
                                <div
                                  className={detailStyle.product_image_wrapper}
                                >
                                  <div
                                    className={
                                      detailStyle.product_image_relative
                                    }
                                  >
                                    <Image
                                      src={`/uploads/${detail?.product?.images[0]?.image}`}
                                      layout="fill"
                                      alt=""
                                      objectFit="cover"
                                    />
                                  </div>
                                </div>
                                <div
                                  className={detailStyle.product_detail_wrapper}
                                >
                                  <Link href={""}>
                                    <a href="">
                                      <span>{detail?.product?.name}</span>
                                    </a>
                                  </Link>
                                  <p>
                                    {detail?.quantity} x{" "}
                                    {RupiahFormat(
                                      FinalPriceDiscount(
                                        detail?.product?.price,
                                        1,
                                        detail?.product?.discount
                                      )
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className={detailStyle.price_action}>
                              <div>
                                <p>Total Harga</p>
                                {/* <p>{RupiahFormat(detail?.product?.price)}</p> */}
                                <p>
                                  {RupiahFormat(
                                    FinalPriceDiscount(
                                      detail?.product?.price,
                                      detail?.quantity,
                                      detail?.product?.discount
                                    )
                                  )}
                                </p>
                              </div>
                              <button>
                                <span>Beli Lagi</span>
                              </button>
                            </div>
                          </div>
                        </section>
                      );
                    }
                  )}
                  {/* End Product Card */}
                </div>
              </div>
              <div className={detailStyle.transaction_container_item}>
                <div className={detailStyle.wrapper_title}>
                  <h5>Info Pengiriman</h5>
                </div>
                <div className={detailStyle.shipping_wrapper}>
                  <div className={detailStyle.item_shipment}>
                    <p>Kurir</p>
                    <span>:</span>
                    <div className={detailStyle.shipment_content}>
                      <p>{selectedTransactionObj?.shipment?.name}</p>
                    </div>
                  </div>
                  <div className={detailStyle.item_shipment}>
                    <p>Alamat</p>
                    <span>:</span>
                    <div className={detailStyle.shipment_content}>
                      <h6>{selectedTransactionObj?.address?.receiver}</h6>
                      <p>
                        {selectedTransactionObj?.address?.phone}
                        <br />
                        {selectedTransactionObj?.address?.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={detailStyle.transaction_container_item}>
                <div className={detailStyle.wrapper_title}>
                  <h5>Rincian Pembayaran</h5>
                </div>
                <div>
                  <div
                    className={`${detailStyle.rincian_pembayaran_item} ${detailStyle.with_border}`}
                  >
                    <p>Metode Pembayaran</p>
                    <div>
                      <p>
                        <span>GoPay</span>
                      </p>
                    </div>
                  </div>
                  <div className={`${detailStyle.rincian_pembayaran_item}`}>
                    <p>
                      Total Harga (
                      {transactionSummary[selectedTransaction]?.quantity}{" "}
                      barang)
                    </p>
                    <div>
                      <p>
                        <span>
                          {RupiahFormat(
                            transactionSummary[selectedTransaction]?.total
                          )}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div
                    className={`${detailStyle.rincian_pembayaran_item} ${detailStyle.total}`}
                  >
                    <p>Total Belanja</p>
                    <div>
                      <p>
                        <span>
                          {RupiahFormat(
                            transactionSummary[selectedTransaction]?.total
                          )}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={detailStyle.transaction_container_right}>
              <button className={detailStyle.button_green}>Beri Ulasan</button>
            </div>
          </div>
        </div>
      </Overlay>
    );
  }
  // }
};

export default OrderList;
