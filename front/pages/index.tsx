import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

import InitFont from "../components/initialize_font";
import Navbar from "../components/navbar";
import styles from "../styles/Home.module.scss";

import "react-multi-carousel/lib/styles.css";
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import RupiahFormat from "../misc/currency";
import productSection from "../components/Product/ProductSection.module.scss";
import common from "../styles/components/common.module.scss";
import { Carousel, Item } from "../components/carousel/Carousel";
import Footer from "../components/Footer/Footer";
import {
  Product,
  Section,
  SectionProduct,
} from "../components/Product/ProductSection";
import { stateContext } from "../services/StateProvider";
const banners = [1, 2, 3];
// import existsSync from "fs";

const Home: NextPage = () => {
  const [productLimit, setProductLimit] = useState(5);
  const { setPageTitle } = useContext(stateContext)
  
  useEffect(() => {
    setPageTitle("Home | Tohopedia")
  }, [setPageTitle])
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

  return (
    <main className={styles.main}>
      <div className={styles.main_container}>
        <div className={styles.carousel_container}>
          <Carousel srcs={getAllBanner()} slideInterval={3000} />
        </div>
        <Section
          header={"Recommended For You"}
          recommendation={true}
          grid={false}
          infinityScrolling={false}
        />
        <Section
          header={"Top Discount"}
          href={"/product/top-discount"}
          limit={15}
          order="discount DESC"
          grid={false}
          infinityScrolling={false}
        />
        <div className={styles.category_flex_container}>
          <button className={common.text_button}>
            <Link
              href={{
                pathname: "/search",
                query: { category: "bf2b03db-7e3b-4775-bb61-bdae481cf761" },
              }}
            >
              <a>Otomotif</a>
            </Link>
          </button>
          <button className={common.text_button}>
            <Link
              href={{
                pathname: "/search",
                query: { category: "bf7f2635-5e2e-4169-8699-fae5f92ce205" },
              }}
            >
              <a>Rumah Tangga</a>
            </Link>
          </button>
          <button className={common.text_button}>
            <Link
              href={{
                pathname: "/search",
                query: { category: "3ac51dd5-e2d4-48ad-8faa-34930baa73a0" },
              }}
            >
              <a>Komputer & Laptop</a>
            </Link>
          </button>
          <button className={common.text_button}>
            <Link
              href={{
                pathname: "/search",
                query: { category: "06ad653a-938d-4b0a-892d-315662d98e33" },
              }}
            >
              <a>Elektronik</a>
            </Link>
          </button>
          <button className={common.text_button}>
            <Link
              href={{
                pathname: "/search",
                query: { category: "87fa537d-9a92-4c3c-9913-797f28dfd3d4" },
              }}
            >
              <a>Pertukangan</a>
            </Link>
          </button>
          <button className={common.text_button}>
            <Link
              href={{
                pathname: "/search",
                query: { category: "85a9e12f-d9ae-4109-88b6-2e011385b2e5" },
              }}
            >
              <a>Kamera</a>
            </Link>
          </button>
          <button className={common.text_button}>
            <Link
              href={{
                pathname: "/search",
                query: { category: "623c2f94-906f-41e8-b44c-15c670c317a7" },
              }}
            >
              <a>Gaming</a>
            </Link>
          </button>
          <button className={common.text_button}>
            <Link
              href={{
                pathname: "/search",
                query: { category: "a3be987f-d640-4a2e-82d8-e405db7cc637" },
              }}
            >
              <a>Buku</a>
            </Link>
          </button>
        </div>

        <div
          id="infinity-scrolling-container"
          className={styles.infinite_product_wrapper}
        >
          <Section grid={true} infinityScrolling={true} />
          {/* <SectionProductInfinity limit={25} /> */}
        </div>
      </div>
    </main>
  );
  // }
};

export default Home;
