import type { NextPage } from "next";
import { useContext, useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import styles from "../styles/Cart.module.scss";

const RedeemVoucher: NextPage = () => {
  const { addToast } = useToasts();
  useEffect(() => {
    addToast("TADAA This is Error Message", {appearance: "error"})
  }, [])
  return (
    <main className={styles.main}>
      <div className={styles.cart_header_container}>
        <h3 className={styles.cart_header_text}>Redeem Voucher</h3>
      </div>
    </main>
  );
};

export default RedeemVoucher;
