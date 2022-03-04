import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Footer } from "../components/footer";
import InitFont from "../components/initialize_font";
import Navbar from "../components/navbar";
import styles from "../styles/Home.module.scss";
// import Carousel from "react-multi-carousel";

import "react-multi-carousel/lib/styles.css";
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import RupiahFormat from "../misc/currency";
import {Carousel, Item } from "../components/carousel/Carousel";
const banners = [1, 2, 3];
// import existsSync from "fs";

const Home: NextPage = () => {
  const ALL_PRODUCT_QUERY = gql`
    query GetAllProduct {
      products {
        id
        name
        price
        discount
        images {
          image
        }
        shop {
          name
          city
          type
        }
      }
    }
  `;

  // const [products, setProducts] = useState(null);

  const {
    loading: allProductLoading,
    error: allProductError,
    data: allProductData,
  } = useQuery(ALL_PRODUCT_QUERY);

  const TOP_DISCOUNT_PRODUCT_QUERY = gql`
    query GetTopDiscountProduct {
      topProductDiscount {
        id
        name
        price
        discount
        images {
          image
        }
        shop {
          name
          city
          type
        }
      }
    }
  `;

  // const [products, setProducts] = useState(null);

  const {
    loading: TopDiscountProductLoading,
    error: TopDiscountProductError,
    data: TopDiscountProductData,
  } = useQuery(TOP_DISCOUNT_PRODUCT_QUERY);

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  function getAllBanner() {
    let bannerItems = [];
    bannerItems = banners.map((bannerIndex: number) => {
      return (
        // <div key={bannerIndex} className={styles.carousel_image_container}>
        //   <Image
        //     src={`/assets/banner/${bannerIndex}.webp`}
        //     alt={`Banner ${bannerIndex}`}
        //     layout="fill"
        //   />
        // </div>
        `/assets/banner/${bannerIndex}.webp`
        // <Item key={bannerIndex} src={`/assets/banner/${bannerIndex}.webp`}/>
      );
    });

    return bannerItems;
  }

  function Product(props: {
    productId: string;
    productName: string;
    productDiscount: number;
    productPrice: number;
    shopName: string;
    shopCity: string;
    shopType: number;
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
                        <div
                          className={styles.product_detail_discount_container}
                        >
                          <div
                            className={styles.product_detail_discount_percent}
                          >
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
                        <div className={styles.product_detail_location}>
                          {props?.shopType > 0 ?
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
                          </div> : null}
                          

                          <div className={styles.product_store_location}>
                            <span className={styles.store_location}>
                              {props.shopCity}
                            </span>
                            <span className={styles.store_name}>
                              {props.shopName}
                            </span>
                          </div>
                        </div>
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

  function Section(props: { data: any; name: string; href?: any }) {
    return (
      <section className={styles.product_section}>
        <div className={styles.product_section_label}>
          <div>
            <h2>{props?.name}</h2>
          </div>
          {props?.href ? (
            <div>
              <Link href={props?.href}>
                <a href="">Lihat Semua</a>
              </Link>
            </div>
          ) : null}
        </div>

        <div className={styles.product_section_card}>
          <div className={styles.product_section_card_inner}>
            {props?.data?.map((product: any) => {
              return (
                <Product
                  key={product.id}
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
    );
  }
  if (allProductLoading || TopDiscountProductLoading) {
    return <h2>Loading...</h2>;
  }

  console.log(allProductData);
  // if (productData) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Home | Tohopedia</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <InitFont />
      </Head>
      <Navbar />

      <main className={styles.main}>
        <div className={styles.main_container}>
          <div className={styles.carousel_container}>
            {/* <Carousel
              ssr={true}
              responsive={responsive}
              autoPlay={true}
              autoPlaySpeed={5000}
              keyBoardControl={true}
              // customTransition="all .5"
              transitionDuration={1000}
              swipeable={false}
              draggable={false}
              showDots={true}
              infinite={true}
              containerClass="carousel-container"
              dotListClass="custom-dot-list-style"
              itemClass={styles.carousel_item}
              // itemClass="carousel-item-padding-40-px"
              className={styles.carousel_container}
            >
              {getAllBanner()}
            </Carousel> */}
            <Carousel srcs={getAllBanner()} slideInterval={3000}/>
            {/* </Carousel> */}
          </div>
          <Section
            data={TopDiscountProductData.topProductDiscount}
            name={"Top Discount"}
            href={"/product/top-discount"}
          />
          <Section data={allProductData.products} name={""} />
          {/* <section className={styles.product_section}>
              <div className={styles.product_section_label}>
                <div>
                  <h2>Top Discount</h2>
                </div>
                <div>
                  <Link href={""}>
                    <a href="">Lihat Semua</a>
                  </Link>
                </div>
              </div>

              <div className={styles.product_section_card}>
                {productData.topProductDiscount.map((product: any) => {
                  return (
                    <Product
                      key={product.id}
                      productId={product.id}
                      imageSrc={product.images[0].image}
                      productName={product.name}
                      productPrice={product.price}
                      productDiscount={product.discount}
                      shopBadge="pmp"
                      shopCity={product.shop.city}
                      shopName={product.shop.name}
                    ></Product>
                  );
                  // <Product imageSrc="" productName="" productPrice={1} shopBadge="" shopCity="" shopName="" key={0}></Product>
                })}
              </div>
            </section> */}
        </div>
      </main>

      <Footer />
    </div>
  );
  // }
};

export default Home;
