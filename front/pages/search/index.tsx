import { gql, useMutation, useQuery } from "@apollo/client";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { ErrorNoKeyword, ErrorNotFound } from "../../components/error";
import Footer from "../../components/Footer/Footer";
import InitFont from "../../components/initialize_font";
import Navbar from "../../components/navbar";
import RupiahFormat from "../../misc/currency";
import styles from "./search.module.scss";
import { useToasts } from "react-toast-notifications";
import { Accordion, AccordionItem } from "../../components/Accordion/Accordion";
import { Section } from "../../components/Product/ProductSection";
import { Checkbox } from "../../components/Checkbox/Checkbox";
import { GetMerchantType } from "../../misc/shop_type";
import { ShopIcon } from "../../components/Badge/ShopBadge";
import { stateContext } from "../../services/StateProvider";
import { ALL_PRODUCT_QUERY } from "../../misc/global_query";
import { Dropdown } from "../../components/Dropdown/dropdown";

const SearchPage: NextPage = () => {
  const { addToast } = useToasts();
  const router = useRouter();
  const { keyword, category, filter } = router.query;
  const [sortDropdown, setSortDropdown] = useState(false);
  const [offset, setOffset] = useState(0);
  // const [limit, setLimit] = useState(10);
  const limit = 5;
  const [content, setContent] = useState();
  const [filterCategory, setFilterCategory] = useState("");
  const [filterShop, setFilterShop] = useState({
    // "-1": true,
  });
  const [filterShopArr, setFilterShopArr] = useState();
  const { setPageTitle } = useContext(stateContext);
  const { data: searchData } = useQuery(ALL_PRODUCT_QUERY, {
    variables: {
      keyword: keyword,
    },
  });
  const [pageList, setPageList] = useState<number[]>([]);

  var currentPage = 1;
  var pages = 1;
  var nProd = searchData?.products?.length;
  currentPage = Math.ceil(offset / limit + 1);
  pages =
    nProd % limit == 0
      ? Math.floor(nProd / limit)
      : Math.floor(nProd / limit + 1);

  useEffect(() => {
    let pageL = [];
    for (let index = 1; index <= pages; index++) {
      pageL.push(index);
    }
    setPageList(pageL);
  }, [currentPage, pages]);

  useEffect(() => {
    setPageTitle("Search | Tohopedia");
  }, [setPageTitle]);

  useEffect(() => {
    if (category) {
      setFilterCategory(category);
    }
    if (filter) {
      let arr = [];
      for (let index = 0; index < filter.length; index++) {
        arr.push(Number(filter[index]));
      }
      setFilterShopArr(arr);
    }
  }, [category, filter]);

  // Error Handling
  if ((keyword === undefined || keyword === "") && filterCategory === "") {
    return <ErrorNoKeyword />;
  }

  const handleDataLoaded = (data: any) => {
    setContent(data);
  };

  const handleFilterShop = (data: any) => {
    //data --> obj {data: ..., check: ...}
    console.log(data);
    let filters = filterShop;
    let obj = {
      data: data?.data,
      check: data?.check,
    };
    filters[obj.data] = obj.check;
    setFilterShop(filters);
    let tempFilterShop = [];
    Object.keys(filters).map((key: number) => {
      if (filterShop[key] == true) {
        tempFilterShop.push(Number(key));
      }
    });
    setFilterShopArr(tempFilterShop);

    router.push({
      pathname: "/search",
      query: { keyword: keyword, filter: tempFilterShop },
    });
  };
  console.log("offset: " + offset);
  // END Error Handling
  return (
    <main className={styles.main}>
      <div className={styles.main_container}>
        <div className={styles.container_flex}>
          <div className={styles.wrapper_left}>
            <div>
              <h5>Filter</h5>

              <div className={styles.filter_wrapper}>
                {/* <div className={styles.wrapper_accordion}> */}
                <Accordion header="Kategori">
                  <AccordionItem>
                    <div
                      className={styles.category_item}
                      onClick={() => {
                        setFilterCategory("");
                      }}
                    >
                      <span>Reset</span>
                    </div>
                  </AccordionItem>
                  {searchData?.products
                    ?.map((product: any) => product?.category)
                    .filter(
                      (value: any, index: any, self: string | any[]) =>
                        self.indexOf(value) === index
                    )
                    .map((category: any, index: number) => {
                      return (
                        <AccordionItem key={index}>
                          <div
                            className={styles.category_item}
                            onClick={() => {
                              setFilterCategory(category?.id);
                            }}
                          >
                            <span>{category?.name}</span>
                          </div>
                        </AccordionItem>
                      );
                    })}
                </Accordion>
                <Accordion header="Jenis Toko">
                  <div className={styles.shop_filter_wrapper}>
                    {searchData?.products
                      ?.map((product: any) => product?.shop?.type)
                      .filter(
                        (value: any, index: any, self: string | any[]) =>
                          self.indexOf(value) === index
                      )
                      .map((type: number, index: number) => {
                        return (
                          <div
                            key={index}
                            className={styles.shop_filter_item_container}
                          >
                            <div
                              className={
                                styles.shop_filter_item_checkbox_wrapper
                              }
                            >
                              <Checkbox
                                data={type}
                                checked={
                                  filterShopArr?.indexOf(type) >= 0
                                    ? true
                                    : false
                                }
                                onChecked={handleFilterShop}
                              />
                            </div>
                            <label>
                              <span>{GetMerchantType(type)}</span>
                              <div className={styles.shop_filter_icon_wrapper}>
                                <div>
                                  <ShopIcon type={type} />
                                </div>
                              </div>
                            </label>
                          </div>
                        );
                      })}
                    {/* <div className={styles.shop_filter_item_container}>
                        <div
                          className={styles.shop_filter_item_checkbox_wrapper}
                        >
                          <Checkbox checked={false} />
                        </div>
                        <label>
                          <span>Official Store</span>
                          <div className={styles.shop_filter_icon_wrapper}>
                            <div>
                              <Image
                                src={"/logo/badge_os.png"}
                                layout="fill"
                                alt=""
                              />
                            </div>
                          </div>
                        </label>
                                          </div> */}
                  </div>
                </Accordion>
                {/* </div> */}
              </div>
            </div>
          </div>
          <div className={styles.right_wrapper}>
            <div className={styles.result_header_wrapper}>
              <div className={styles.search_keyword_container}>
                Menampilkan {searchData?.products?.length ? offset + 1 : 0} -{" "}
                {offset + limit < searchData?.products?.length
                  ? offset + limit
                  : searchData?.products?.length}{" "}
                barang dari total {searchData?.products?.length} untuk &quot;<b>{keyword}</b>
                &quot;
              </div>
              <div className={styles.order_container}>
                <span>Urutkan:</span>
                <div
                  className={
                    sortDropdown == false
                      ? styles.option_wrapper_close
                      : styles.option_wrapper_open
                  }
                >
                  <button
                    onClick={() => {
                      setSortDropdown(!sortDropdown);
                    }}
                  >
                    <label>
                      <span>Paling Sesuai</span>
                    </label>
                  </button>
                  <div className={styles.option_list_wrapper}>
                    <ul>
                      <li>
                        <button>
                          <span>Terbaru</span>
                        </button>
                      </li>
                      <li>
                        <button>
                          <span>Harga Tertinggi</span>
                        </button>
                      </li>
                      <li>
                        <button>
                          <span>Harga Terendah</span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div
              id="infinity-scrolling-container"
              className={styles.result_content_wrapper}
            >
              <Section
                grid={true}
                infinityScrolling={true}
                keyword={keyword}
                offset={offset}
                limit={limit}
                categoryId={filterCategory}
                onLoadData={handleDataLoaded}
                shopType={filterShopArr}
              />
            </div>
            <div className={styles.result_pagination_wrapper}>
              <div className={styles.result_pagination_container}>
                <div className={styles.result_pagination_list_flex}>
                  <button
                    className={styles.pagination_arrow}
                    onClick={() => {
                      currentPage > 1
                        ? setOffset(limit * (currentPage - 2))
                        : null;
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill={currentPage > 1 ? "#6C727C" : "#DBDEE2"}
                      style={{ transform: "rotate(180deg)" }}
                    >
                      <path d="M9.5 18a.999.999 0 01-.71-1.71l4.3-4.29-4.3-4.29a1.004 1.004 0 011.42-1.42l5 5a.998.998 0 010 1.42l-5 5a1 1 0 01-.71.29z"></path>
                    </svg>
                  </button>
                  {pageList.map((page: number, index: number) => {
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          setOffset(limit * (page - 1));
                        }}
                        className={`${styles.pagination_number} ${
                          page == currentPage ? styles.pagination_active : null
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  {/* <button
                    className={`${styles.pagination_number} ${styles.pagination_active}`}
                  >
                    1
                  </button> */}
                  {/* <button className={`${styles.pagination_number}`}>2</button> */}
                  <button
                    className={styles.pagination_arrow}
                    onClick={() => {
                      currentPage < pages
                        ? setOffset(limit * currentPage)
                        : null;
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill={currentPage < pages ? "#6C727C" : "#DBDEE2"}
                    >
                      <path d="M9.5 18a.999.999 0 01-.71-1.71l4.3-4.29-4.3-4.29a1.004 1.004 0 011.42-1.42l5 5a.998.998 0 010 1.42l-5 5a1 1 0 01-.71.29z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SearchPage;
