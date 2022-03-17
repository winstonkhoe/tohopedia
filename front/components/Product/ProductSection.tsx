import { gql, useQuery } from "@apollo/client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import RupiahFormat from "../../misc/currency";
import { ALL_PRODUCT_QUERY } from "../../misc/global_query";
import styles from "./ProductSection.module.scss";

function Product(props: {
  productId: string;
  productName: string;
  productDiscount: number;
  productPrice: number;
  shopName?: string;
  shopCity?: string;
  shopType?: number;
  imageSrc: string;
}) {
  return (
    <div className={styles.product_outer_card}>
      <div className={styles.product_card}>
        <div className={styles.product_inner_card}>
          <Link href={`/${props.shopName}/${props.productId}`}>
            <a href="">
              <div className={styles.product_card_outline}>
                <div className={styles.product_outer_image_container}>
                  <div className={styles.product_image_container}>
                    <Image
                      src={`/uploads/${props.imageSrc}`}
                      alt="Product Image"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                </div>

                <div className={styles.product_detail_container}>
                  <a href="">
                    <div className={styles.product_detail_name}>
                      {props.productName}
                    </div>
                    <div className={styles.product_detail_price}>
                      {RupiahFormat(
                        (props.productPrice * (100 - props.productDiscount)) /
                          100
                      )}
                    </div>
                    {props.productDiscount > 0 ? (
                      <div className={styles.product_detail_discount_container}>
                        <div className={styles.product_detail_discount_percent}>
                          {props.productDiscount}%
                        </div>
                        <div
                          className={
                            styles.product_detail_discounted_original_price
                          }
                        >
                          {RupiahFormat(props.productPrice)}
                        </div>
                      </div>
                    ) : null}

                    <div
                      className={styles.product_detail_location_ratings_sells}
                    >
                      {props?.shopName ? (
                        <div className={styles.product_detail_location}>
                          {props?.shopType > 0 ? (
                            <div className={styles.product_store_badge}>
                              <div
                                className={styles.product_store_badge_container}
                              >
                                <Image
                                  src={`/logo/${
                                    props.shopType == 1
                                      ? "badge_pm.png"
                                      : props.shopType == 2
                                      ? "badge_pmp.svg"
                                      : props?.shopType == 3
                                      ? "badge_os.png"
                                      : null
                                  }`}
                                  alt=""
                                  layout="fill"
                                />
                              </div>
                            </div>
                          ) : null}

                          <div className={styles.product_store_location}>
                            <span className={styles.store_location}>
                              {props.shopCity}
                            </span>
                            <span className={styles.store_name}>
                              {props.shopName}
                            </span>
                          </div>
                        </div>
                      ) : null}

                      <div
                        className={styles.product_detail_ratings_sells}
                      ></div>
                    </div>
                  </a>
                </div>
              </div>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section(props: {
  slug?: string;
  header?: string;
  href?: any;
  keyword?: string | string[];
  limit?: number;
  offset?: number;
  order?: string;
  recommendation?: boolean;
  infinityScrolling: boolean;
  grid: boolean;
  onLoadData?: any;
  categoryId?: string | string[];
  shopType?: number[];
}) {
  const [productLimit, setProductLimit] = useState(5);
  const [shopTypeFilter, setShopTypeFilter] = useState();
  

  console.log(props?.categoryId);
  const {
    loading: allProductLoading,
    error: allProductError,
    data: data,
  } = useQuery(ALL_PRODUCT_QUERY, {
    variables: {
      slug: props?.slug,
      keyword: props?.keyword,
      limit: props.infinityScrolling == true ? productLimit : props?.limit,
      offset: props?.offset,
      order: props?.order,
      recommendation: props?.recommendation,
      categoryId: props?.categoryId,
      shopTypes: shopTypeFilter
    },
  });

  useEffect(() => {
    if (props?.onLoadData) {
      props?.onLoadData(data);
    }
    if (props?.shopType) {
      setShopTypeFilter(props?.shopType)
    }
  }, [data, props]);

  if (allProductLoading) {
    return null;
  }
  // console.log(props.infinityScrolling ? "Infinity Scrolling" : "Not Infinity Scrolling")
  console.log(data?.products)
  // console.log(productLimit)
  window.onscroll = function (ev) {
    let infinityContainer = document.getElementById(
      "infinity-scrolling-container"
    )?.offsetHeight;
    let final = infinityContainer
      ? infinityContainer
      : document.body.offsetHeight;
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    // if (window.innerHeight + window.scrollY >= final) {
      if (data?.products?.length == productLimit && props.infinityScrolling) {
        if (props?.limit) {
          let maxIncrease = props?.limit - productLimit;
          5 < maxIncrease
            ? setProductLimit(productLimit + 5)
            : setProductLimit(productLimit + maxIncrease);
        } else {
          setProductLimit(productLimit + 5);
        }
      }
    }
  };

  return (
    <>
      {props.grid == false ? (
        <section className={styles.section}>
          {props?.header ? (
            <div className={styles.product_section_label}>
              <div>
                <h2>{props?.header}</h2>
              </div>
              {props?.href ? (
                <div>
                  <Link href={props?.href}>
                    <a href="">Lihat Semua</a>
                  </Link>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className={styles.product_section_card}>
            <div className={styles.product_section_card_inner}>
              {data?.products?.map((product: any, index: number) => {
                // return shopTypeFilter ? (
                //   shopTypeFilter.indexOf(product?.shop?.type) >= 0 ? (
                //     <Product
                //       key={index}
                //       productId={product.id}
                //       imageSrc={product.images[0].image}
                //       productName={product.name}
                //       productPrice={product.price}
                //       productDiscount={product.discount}
                //       shopType={product?.shop?.type}
                //       shopCity={product.shop.city}
                //       shopName={product.shop.name}
                //     ></Product>
                //   ) : null
                // ) : (<Product
                //   key={index}
                //   productId={product.id}
                //   imageSrc={product.images[0].image}
                //   productName={product.name}
                //   productPrice={product.price}
                //   productDiscount={product.discount}
                //   shopType={product?.shop?.type}
                //   shopCity={product.shop.city}
                //   shopName={product.shop.name}
                // ></Product>);
                return (
                  <Product
                    key={index}
                    productId={product.id}
                    imageSrc={product.images[0].image}
                    productName={product.name}
                    productPrice={product.price}
                    productDiscount={product.discount}
                    shopType={product?.shop?.type}
                    shopCity={product.shop.city}
                    shopName={product.shop.name}
                  ></Product>
                );

                // <Product imageSrc="" productName="" productPrice={1} shopBadge="" shopCity="" shopName="" key={0}></Product>
              })}
            </div>
          </div>
        </section>
      ) : (
        <section className={styles.product_section}>
          {data?.products?.map((product: any, index: number) => {
            return (
              <>
                <Product
                  key={index}
                  productId={product.id}
                  imageSrc={product.images[0].image}
                  productName={product.name}
                  productPrice={product.price}
                  productDiscount={product.discount}
                  shopType={product?.shop?.type ? product?.shop?.type : null}
                  shopCity={product?.shop?.city ? product?.shop?.city : null}
                  shopName={product?.shop?.name ? product?.shop?.name : null}
                ></Product>
              </>
            );
            // <Product imageSrc="" productName="" productPrice={1} shopBadge="" shopCity="" shopName="" key={0}></Product>
          })}
        </section>
      )}
    </>
  );
}

function SectionProduct(props: { data: any; name: string; href?: any }) {
  return (
    <section className={styles.product_section}>
      {props?.data?.map((product: any, index: number) => {
        return (
          <>
            <Product
              key={index}
              productId={product.id}
              imageSrc={product.images[0].image}
              productName={product.name}
              productPrice={product.price}
              productDiscount={product.discount}
              shopType={product?.shop?.type ? product?.shop?.type : null}
              shopCity={product?.shop?.city ? product?.shop?.city : null}
              shopName={product?.shop?.name ? product?.shop?.name : null}
            ></Product>
          </>
        );
        // <Product imageSrc="" productName="" productPrice={1} shopBadge="" shopCity="" shopName="" key={0}></Product>
      })}
    </section>
  );
}

export {
  Product,
  Section,
  SectionProduct,
  // SectionProductInfinity
};
