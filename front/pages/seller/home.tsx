import { gql, useMutation, useQuery } from "@apollo/client";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useToasts } from "react-toast-notifications";
import InitFont from "../../components/initialize_font";
import Navbar from "../../components/navbar";
import styles from "../../styles/seller.module.scss";
import Switch from "react-switch";

import { ErrorNotFound } from "../../components/error";
import Footer from "../../components/Footer/Footer";
import { userDetailsContext } from "../../services/UserDataProvider";
import {
  GreenLabel,
  GreyLabel,
} from "../../components/transaction/TransactionStatus";
import { GetMerchantType } from "../../misc/shop_type";
import Shop from "../../models/Shop";
import { stateContext } from "../../services/StateProvider";
import Router from "next/router";
import SellerLayout from "./layout";

const SellerHome = () => {

  return (
    <div className={styles.container}>
    </div>
  );
};

export default SellerHome;

SellerHome.getLayout = function getLayout(page: any) {
  return <SellerLayout>{page}</SellerLayout>;
};
