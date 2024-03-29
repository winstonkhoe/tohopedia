import { gql, useMutation, useQuery } from "@apollo/client";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ErrorNotFound } from "../../components/error";
import Footer from "../../components/Footer/Footer";
import InitFont from "../../components/initialize_font";
import Navbar from "../../components/navbar";
import RupiahFormat from "../../misc/currency";
import styles from "../../styles/ProductDetail.module.scss";
import { useToasts } from "react-toast-notifications";
import { ProductImage } from "../../models/ProductImage";

const ProductDetail: NextPage = () => {
  const { addToast } = useToasts();
  const router = useRouter();
  const { shopDomain, productId } = router.query;
  const [productAtCartQty, setProductAtCartQty] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [onHoverImage, setOnHoverImage] = useState("");

  const PRODUCT_STORE_QUERY = gql`
    query GetProductDetail($id: ID!) {
      product(id: $id) {
        id
        name
        price
        stock
        metadata
        description
        discount
        sold
        category {
          name
        }
        images {
          image
        }
        shop {
          id
          name
          city
          image
          type
          slug
        }
      }
      getCurrentUser {
        name
        shop {
          id
          name
        }
      }
    }
  `;

  const {
    loading: productLoading,
    error: productError,
    data: productData,
  } = useQuery(PRODUCT_STORE_QUERY, {
    variables: {
      id: productId,
    },
  });

  useEffect(() => {
    setSelectedImage(productData?.product?.images[0]?.image);
    setQuantity(productData?.product?.stock > 0 ? 1 : 0);
  }, [productData]);

  const PRODUCT_CART_QUERY = gql`
    query GetProductCart($productId: ID!) {
      getCartProduct(productId: $productId) {
        quantity
      }
    }
  `;

  const {
    loading: productCartLoading,
    error: productCartError,
    data: productCartData,
  } = useQuery(PRODUCT_CART_QUERY, {
    variables: {
      productId: productId,
    },
  });

  useEffect(() => {
    setProductAtCartQty(productCartData?.getCartProduct?.quantity);
  }, [productCartData]);

  const ADD_CART_MUTATION = gql`
    mutation createUpdateCart($productId: ID!, $quantity: Int!) {
      createUpdateCart(productId: $productId, quantity: $quantity) {
        id
        quantity
      }
    }
  `;
  const [
    mutationCreateUpdateCart,
    { loading: addCartLoading, error: addCartError, data: addCartData },
  ] = useMutation(ADD_CART_MUTATION, {
    onCompleted: (data: any) => {
      setProductAtCartQty(data.createUpdateCart.quantity);
    },
  });

  function DescriptionPrinter(string: string) {
    let arr = string.split("\n");
    let arrTotal: (string | JSX.Element)[] = [];
    arr.forEach((element) => {
      arrTotal.push(element);
      arrTotal.push(<br />);
    });
    return arrTotal;
    // return string.replace("\n", `${<br/>}`)
  }

  function handleAddCart() {
    try {
      if (productAtCartQty + quantity > productData.product.stock) {
        addToast(
          `Stok barang ini sisa ${productData.product.stock} dan kamu sudah punya ${productAtCartQty} di keranjangmu.`,
          { appearance: "error" }
        );
      } else {
        mutationCreateUpdateCart({
          variables: {
            productId: productId,
            quantity: quantity,
          },
        });
      }
    } catch (error) {}
  }

  function handleQuantityChange(value: any) {
    if (isNaN(value)) {
      setQuantity(0);
    } else {
      if (Number(value) <= productData.product.stock && Number(value) >= 1)
        setQuantity(Number(value));
    }
  }
  // Error Handling
  if (productData?.product?.name == "") {
    return (
      <div className={styles.container}>
        <ErrorNotFound />
      </div>
    );
  }
  // END Error Handling

  if (productData) {
    return (
      <main className={styles.main}>
        <div className={styles.main_container}>
          {/* Category */}
          <div className={styles.category_container}>
            <ol className={styles.category_lists}>
              <li className={styles.category_lists_item}>
                <a href="" className={styles.category_lists_item_text}>
                  {productData?.product?.category?.name}
                </a>
              </li>
            </ol>
          </div>

          <div className={styles.product_detail_outer_container}>
            {/* Product Images */}

            <div className={styles.product_image_outer_container}>
              <div className={styles.product_image_inner_container}>
                <div className={styles.product_image_large_container}>
                  <div className={styles.product_image_large_inner_container}>
                    <div className={styles.product_image_magnifier}></div>
                    <div className={styles.product_image_container}>
                      <div className={styles.product_image_container_relative}>
                        <Image
                          src={`/uploads/${
                            onHoverImage != "" ? onHoverImage : selectedImage
                          }`}
                          alt="product image"
                          layout="fill"
                          objectFit="contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.product_image_lists_container}>
                  <div className={styles.product_image_lists_inner_container}>
                    <div className={styles.product_image_lists}>
                      {productData.product.images.map((image: ProductImage) => {
                        return (
                          <div
                            key={image?.image}
                            className={styles.product_image_item_container}
                            onMouseEnter={() => setOnHoverImage(image?.image)}
                            onMouseLeave={() => setOnHoverImage("")}
                            onMouseDown={() => setSelectedImage(image?.image)}
                          >
                            <div className={styles.product_image_item_relative}>
                              <Image
                                src={`/uploads/${image?.image}`}
                                alt="product image"
                                layout="fill"
                                objectFit="contain"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* End Product Images */}

            <div className={styles.product_buy_options_outer_container}>
              <div className={styles.product_buy_options_inner_container}>
                <div className={styles.product_buy_options_outline_container}>
                  <h6 className={styles.product_buy_options_header}>
                    Atur jumlah dan catatan
                  </h6>

                  <div
                    className={
                      styles.product_buy_option_quantity_stock_container
                    }
                  >
                    <div
                      className={styles.product_buy_option_quantity_container}
                    >
                      <button
                        className={
                          styles.product_buy_option_minus_quantity_button
                        }
                        onClick={() => handleQuantityChange(quantity - 1)}
                      >
                        <svg
                          // class="unf-icon"
                          viewBox="0 0 24 24"
                          width="18px"
                          height="18px"
                          fill={quantity <= 1 ? "#BFC9D9" : "#00AA5B"}
                          // style="display: inline-block; vertical-align: middle;"
                        >
                          <path d="M19 13H5c-.6 0-1-.4-1-1s.4-1 1-1h14c.6 0 1 .4 1 1s-.4 1-1 1z"></path>
                        </svg>
                      </button>
                      <input
                        type="text"
                        pattern="[0-9]*"
                        className={styles.product_buy_option_quantity_input}
                        onChange={(e) => handleQuantityChange(e.target.value)}
                        //   onKeyPress={(e) => handleQuantityChange(e)}
                        value={quantity}
                      />
                      <button
                        className={
                          styles.product_buy_option_minus_quantity_button
                        }
                        onClick={() => handleQuantityChange(quantity + 1)}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          width="18px"
                          height="18px"
                          fill={
                            quantity >= productData.product.stock
                              ? "#BFC9D9"
                              : "#00AA5B"
                          }
                        >
                          <path d="M19 11h-6V5a1 1 0 00-2 0v6H5a1 1 0 000 2h6v6a1 1 0 002 0v-6h6a1 1 0 000-2z"></path>
                        </svg>
                      </button>
                    </div>
                    <p className={styles.product_buy_option_stock_label}>
                      Stok <b>{productData.product.stock}</b>
                    </p>
                  </div>

                  {/* Sub Total Container */}
                  <div className={styles.subtotal_container}>
                    <p>Subtotal</p>
                    <p className={styles.subtotal_value}>
                      {RupiahFormat(productData.product.price * quantity)}
                    </p>
                  </div>
                  {/* END Sub Total Container */}
                  {/* Buy Options Container */}
                  <div className={styles.product_buy_cart_container}>
                    <div className={styles.product_buy_buttons_container}>
                      {productData.product.shop.id ==
                      productData.getCurrentUser.shop.id ? (
                        <button className={styles.product_button_add_cart}>
                          <span>Ubah Produk</span>
                        </button>
                      ) : (
                        <>
                          <button
                            className={styles.product_button_add_cart}
                            onClick={handleAddCart}
                          >
                            <span>+ Keranjang</span>
                          </button>
                          <button className={styles.product_button_buy_instant}>
                            <span>Beli Langsung</span>
                          </button>
                        </>
                      )}
                    </div>
                    <div className={styles.product_buy_actions_container}>
                      <button className={styles.product_buy_icon_chat}>
                        <div className={styles.product_buy_icon_container}>
                          <Image
                            src={"/logo/icon_chat.svg"}
                            alt="icon"
                            layout="fill"
                          />
                        </div>
                        Chat
                      </button>
                      <button className={styles.product_buy_icon_chat}>
                        <div className={styles.product_buy_icon_container}>
                          <Image
                            src={"/logo/icon_wishlist.svg"}
                            alt="icon"
                            layout="fill"
                          />
                        </div>
                        Wishlist
                      </button>
                      <button
                        className={styles.product_buy_icon_wishlist}
                        onClick={async() => {
                          if (!navigator.clipboard) {
                            // Clipboard API not available
                            return;
                          }
                          const text = window.location.href;
                          try {
                            await navigator.clipboard.writeText(text);
                          } catch (err) {
                            console.error("Failed to copy!", err);
                          }
                        }}
                      >
                        <div className={styles.product_buy_icon_container}>
                          <Image
                            src={"/logo/icon_share.svg"}
                            alt="icon"
                            layout="fill"
                          />
                        </div>
                        Share
                      </button>
                      {/* </div> */}
                    </div>
                  </div>
                  {/* ENDBuy Options Container */}
                </div>
              </div>
            </div>

            <div className={styles.product_detail_header_container}>
              <div className={styles.product_detail_header_inner_container}>
                <h1 className={styles.product_detail_name}>
                  {productData.product.name}
                </h1>
                <div
                  className={
                    styles.product_detail_terjual_rating_diskusi_outer_container
                  }
                >
                  <div
                    className={
                      styles.product_detail_terjual_rating_diskusi_inner_container
                    }
                  >
                    <div>
                      <span className={styles.product_detail_terjual_label}>
                        Terjual
                      </span>{" "}
                      {productData?.product?.sold}
                    </div>
                    <span>•</span>
                    <div>
                      <span>
                        <div
                          className={styles.product_detail_rating_icon_relative}
                        >
                          <Image
                            src={"/logo/icon_star.svg"}
                            alt=""
                            layout="fill"
                          />
                        </div>
                        <span className={styles.product_detail_terjual_label}>
                          4.5
                        </span>
                      </span>
                      <span>(2 ulasan)</span>
                    </div>
                    <span>•</span>
                    <div>
                      <span className={styles.product_detail_terjual_label}>
                        Diskusi
                      </span>{" "}
                      (15)
                    </div>
                  </div>
                </div>
                <div className={styles.product_detail_price_container}>
                  <div className={styles.product_detail_price}>
                    {RupiahFormat(productData.product.price)}
                  </div>
                </div>
                <div className={styles.product_detail_desc_outer_container}>
                  <div
                    className={styles.product_detail_desc_container_separator}
                  ></div>
                  <div>
                    <div className={styles.product_detail_section_tabs_outer}>
                      <div className={styles.product_detail_section_tabs_inner}>
                        <div
                          className={styles.product_detail_section_tabs_item}
                        >
                          Detail
                        </div>
                        <div
                          className={styles.product_detail_section_tabs_active}
                        ></div>
                      </div>
                    </div>
                    <div className={styles.product_detail_desc_tab_panel}>
                      <ul className={styles.product_detail_information_lists}>
                        {JSON.parse(productData.product.metadata).map(
                          (metadata: any) => {
                            if (metadata.label.trim().length > 0) {
                              return (
                                <li
                                  key={metadata.label}
                                  className={
                                    styles.product_detail_information_item
                                  }
                                >
                                  <span
                                    className={styles.key_values}
                                  >{`${metadata.label}: `}</span>
                                  <span>{metadata.value}</span>
                                </li>
                              );
                            }
                          }
                        )}
                        <li className={styles.product_detail_information_item}>
                          <span className={styles.key_values}>Kategori: </span>
                          <Link href={""}>
                            <a href="" className={styles.link_values}>
                              {productData?.product?.category?.name}
                            </a>
                          </Link>
                        </li>
                      </ul>
                      <div className={styles.product_detail_desc_area_outer}>
                        <span className={styles.product_detail_desc_area_inner}>
                          <span className={styles.product_detail_desc_area}>
                            <div className={styles.product_detail_desc_content}>
                              {DescriptionPrinter(
                                productData.product.description
                              )}
                            </div>
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.product_shop_detail_info_container}>
                  <div
                    className={
                      styles.product_shop_detail_info_container_separator
                    }
                  ></div>
                  <div className={styles.product_shop_detail_container}>
                    <div className={styles.product_shop_heads}>
                      <Link href={""}>
                        <a href="" className={styles.product_shop_image_link}>
                          <div className={styles.product_shop_image_relative}>
                            <Image
                              src={`/uploads/${productData.product.shop.image}`}
                              alt=""
                              layout="fill"
                              objectFit="cover"
                            />
                          </div>
                        </a>
                      </Link>
                      <div className={styles.product_shop_name_header}>
                        <Link href={`/${productData?.product?.shop?.slug}`}>
                          <a
                            href=""
                            className={
                              styles.product_shop_name_header_container
                            }
                          >
                            <div className={styles.product_shop_icon_relative}>
                              <Image
                                src={`/logo/${
                                  productData.product.shop?.type == 1
                                    ? "badge_pm.png"
                                    : productData.product.shop?.type == 2
                                    ? "badge_pmp.svg"
                                    : productData.product.shop?.type == 3
                                    ? "badge_os.png"
                                    : null
                                }`}
                                alt=""
                                layout="fill"
                              />
                            </div>
                            <h2>{productData.product.shop.name}</h2>
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
  return <h2>Loading</h2>;
};

export default ProductDetail;
