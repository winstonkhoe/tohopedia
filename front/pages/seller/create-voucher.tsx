import SellerLayout from "./layout";
import styles from "./product-list.module.scss";
import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { gql, useMutation, useQuery } from "@apollo/client";
import { userDetailsContext } from "../../services/UserDataProvider";
import { ADD_PRODUCT_MUTATION } from "../../misc/global_mutation";
import { CATEGORY_QUERY } from "../../misc/global_query";
import Link from "next/link";
import RupiahFormat from "../../misc/currency";
import Image from "next/image";
import { off } from "process";

export default function CreateVoucher() {
  const { addToast } = useToasts();
  const [offset, setOffset] = useState(0);
  const limit = 10;

  // var page = 1;
  // var pages = 1;
  // var nProd = storeData?.products?.length;
  // page = Math.ceil(offset / limit + 1);
  // pages =
  //   nProd % limit == 0
  //     ? Math.floor(nProd / limit)
  //     : Math.floor(nProd / limit + 1);
  
  
  return (
    <div className={styles.add_product_container}>
      
      <section className={styles.section_container}>
      <div className={styles.add_product_header}>
        <h3>Create Voucher</h3>
      </div>
      </section>
    </div>
  );
}

CreateVoucher.getLayout = function getLayout(page: any) {
  return <SellerLayout>{page}</SellerLayout>;
};
