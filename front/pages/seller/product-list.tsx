import SellerLayout from "./layout";
import styles from "./product-list.module.scss";
import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { gql, useMutation, useQuery } from "@apollo/client";
import Shop from "../../models/Shop";
import { userDetailsContext } from "../../services/UserDataProvider";
import { ADD_PRODUCT_MUTATION } from "../../misc/global_mutation";
import { CATEGORY_QUERY } from "../../misc/global_query";
import Link from "next/link";
import RupiahFormat from "../../misc/currency";
import Image from "next/image";
import { off } from "process";
import { Product } from "../../models/Product";

export default function ProductList() {
  const { addToast } = useToasts();
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const storeData = useContext<Shop>(userDetailsContext)?.shop;

  var page = 1;
  var pages = 1;
  var nProd = storeData?.products?.length;
  page = Math.ceil(offset / limit + 1);
  pages =
    nProd % limit == 0
      ? Math.floor(nProd / limit)
      : Math.floor(nProd / limit + 1);
  
  const {
    loading: allProductLoading,
    error: allProductError,
    data: data,
  } = useQuery(Product.ALL_PRODUCT_QUERY, {
    variables: {
      slug: storeData?.slug,
      limit: limit,
      offset: offset,
      order: "created_at DESC",
    },
  });
  
  return (
    <div className={styles.add_product_container}>
      
      <section className={styles.section_container}>
      <div className={styles.add_product_header}>
        <h3>Daftar Produk</h3>
      </div>
        {data?.products?.map((product: any, index: number) => {
          return (
            <div key={index} className={styles.item_card}>
              <div className={styles.cart_lists_item_detail_inner_container}>
                <div className={styles.cart_lists_item_detail_container}>
                  <Link href={`/${product?.shop?.name}/${product?.id}`}>
                    <a href="">
                      <div
                        className={
                          styles.cart_lists_item_image_container_relative
                        }
                      >
                        <Image
                          src={`/uploads/${product?.images[0]?.image}`}
                          alt=""
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                    </a>
                  </Link>
                  <div className={styles.cart_lists_item_name_price_container}>
                    <Link href={`/${product?.shop?.name}/${product?.id}`}>
                      <a href="" className={styles.cart_lists_item_header_a}>
                        <p className={styles.cart_lists_item_name}>
                          {product?.name}
                        </p>
                      </a>
                    </Link>
                    <p className={styles.cart_lists_item_variant}>LHR 15</p>
                    <div className={styles.cart_lists_item_price_container}>
                      {product?.discount > 0 ? (
                        <>
                          <div
                            className={styles.cart_lists_item_price_discount}
                          >
                            {product?.discount}%
                          </div>
                          <p
                            className={
                              styles.cart_lists_item_price_orginal_price
                            }
                          >
                            {RupiahFormat(product?.price)}
                          </p>
                        </>
                      ) : null}

                      <p className={styles.cart_lists_item_price_final_price}>
                        {RupiahFormat(
                          (product?.price * (100 - product?.discount)) / 100
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div className={styles.pagination_container}>
          <ul>
            {offset - 1 >= 0 && (
              <a onClick={() => setOffset(offset - limit)}>❮</a>
            )}
            {/* {page} */}
            {page + 1 <= pages && (
              <a
                onClick={() => {
                  setOffset(limit * page);
                }}
              >
                ❯
              </a>
            )}
          </ul>
        </div>
      </section>
    </div>
  );
}

ProductList.getLayout = function getLayout(page: any) {
  return <SellerLayout>{page}</SellerLayout>;
};
