import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Footer from "../../components/Footer/Footer";
import HeadIcon from "../../components/head_icon";
import InitFont from "../../components/initialize_font";
import Navbar from "../../components/navbar";
import RupiahFormat from "../../misc/currency";
import Shop from "../../models/Shop";
import { stateContext } from "../../services/StateProvider";
import styles from "../../styles/Cart.module.scss";

const Cart: NextPage = () => {
  const router = useRouter();
  const [prevSet, setPrevSet] = useState(new Set());
  const [cartsQty, setCartsQty] = useState([]);
  const [uniqueStoreList, setUniqueStoreList] = useState([]);
  const [uniqueStoreObjs, setUniqueStoreObjs] = useState([]);
  const [cartSummary, setCartSummary] = useState({
    quantity: 0,
    original: 0,
    discount: 0,
  });

  const { setPageTitle } = useContext(stateContext);

  useEffect(() => {
    setPageTitle("Keranjang | Tohopedia");
  }, [setPageTitle]);

  const USER_CARTS_QUERY = gql`
    query GetUser {
      getCurrentUser {
        carts {
          id
          checked
          quantity
          product {
            id
            name
            discount
            price
            stock
            shop {
              id
              name
              city
              type
            }
            images {
              image
            }
          }
        }
      }
    }
  `;

  const {
    loading: cartLoading,
    error: cartError,
    data: cartData,
  } = useQuery(USER_CARTS_QUERY, {
    pollInterval: 100,
  });

  const PRODUCT_STOCK_QUERY = gql`
    query GetStock($id: ID!) {
      product(id: $id) {
        stock
      }
    }
  `;

  const [
    getStock,
    { loading: stockLoading, error: stockError, data: stockData },
  ] = useLazyQuery(PRODUCT_STOCK_QUERY);

  const UPDATE_CART_MUTATION = gql`
    mutation UpdateCart($id: ID!, $quantity: Int!) {
      updateCart(id: $id, quantity: $quantity) {
        quantity
      }
    }
  `;

  const [
    getUpdateCart,
    {
      loading: updateCartLoading,
      error: updateCartError,
      data: updateCartData,
    },
  ] = useMutation(UPDATE_CART_MUTATION);

  const TOGGLE_CART_MUTATION = gql`
    mutation ToggleCart($id: ID!, $checked: Boolean!) {
      toggleCheckCart(id: $id, checked: $checked) {
        id
        quantity
      }
    }
  `;

  const [
    toggleCart,
    {
      loading: toggleCartLoading,
      error: toggleCartError,
      data: toggleCartData,
    },
  ] = useMutation(TOGGLE_CART_MUTATION);

  const DELETE_CART_MUTATION = gql`
    mutation DeleteCart($id: ID!) {
      deleteCart(id: $id) {
        id
      }
    }
  `;

  const [
    getDeleteCart,
    {
      loading: deleteCartLoading,
      error: deleteCartError,
      data: deleteCartData,
    },
  ] = useMutation(DELETE_CART_MUTATION);

  useEffect(() => {
    let totalQuantity = 0;
    let totalOriginalPrice = 0;
    let totalDiscountedPrice = 0;
    cartData?.getCurrentUser?.carts.map((cart: any) => {
      if (cart?.checked === true) {
        totalQuantity += cart?.quantity;
        totalOriginalPrice += cart?.product?.price * cart?.quantity;
        totalDiscountedPrice +=
          (cart?.product?.price * cart?.quantity * cart?.product?.discount) /
          100;
      }
    });
    setCartSummary({
      quantity: totalQuantity,
      original: totalOriginalPrice,
      discount: totalDiscountedPrice,
    });

  }, [cartData]);

  function handleQuantityChange(cartId: string, value: any) {
    // let values = [...cartsQty];
    if (isNaN(value) === false) {
      getStock({
        variables: { id: getCart(cartId)?.product?.id },
      }).then((data) => {
        if (Number(value) <= data.data.product.stock && Number(value) >= 1) {
          getUpdateCart({
            variables: {
              id: cartId,
              quantity: Number(value),
            },
          });
        }
      });
    }
  }

  function handleDeleteCart(id: String) {
    getDeleteCart({
      variables: {
        id: id,
      },
    });
  }

  function getCart(cartId: string) {
    return cartData?.getCurrentUser?.carts.filter((cart: any) => {
      return cart.id === cartId;
    })[0];
  }

  function getShopCarts(shopId: string) {
    return cartData?.getCurrentUser?.carts.filter((cart: any) => {
      return cart?.product?.shop?.id === shopId;
    });
  }

  function handleShopClick(shopId: string, value: boolean) {
    getShopCarts(shopId).map((cart: any) => {
      toggleCart({ variables: { id: cart?.id, checked: value } });
    });
  }

  function getShopChecked(shopId: string) {
    let carts = getShopCarts(shopId);
    let checkedCounter = 0;
    carts.map((cart: any) => {
      if (cart?.checked == true) {
        checkedCounter += 1;
      }
    });
    return checkedCounter == carts.length;
  }

  return (
    <main className={styles.main}>
      <div className={styles.cart_header_container}>
        <h3 className={styles.cart_header_text}>Keranjang</h3>
      </div>
      <div className={styles.cart_lists_summary_outer_container}>
        <div className={styles.cart_lists_outer_container}>
          <div className={styles.cart_lists_active_container}>
            {/* KALO SEMPET --> Yaah, ada 2 barang yang tidak bisa diproses*/}
            <div className={styles.cart_lists_unavailable_container}> </div>
            {/* END KALO SEMPET */}

            {/* {[...new Set(cartData?.getCurrentUser?.carts.map())].map((shop: any, index: number) => { */}
            {cartData?.getCurrentUser?.carts
              .map((cart: any) => cart?.product?.shop)
              .filter(
                (value: any, index: any, self: string | any[]) =>
                  self.indexOf(value) === index
              )
              .map((shop: any, index: number) => {
                // {uniqueStoreObjs.map((shop: any, index: number) => {
                return (
                  <div
                    key={shop.id}
                    className={styles.cart_lists_stores_outer_container}
                  >
                    {index > 0 ? (
                      <div className={styles.cart_lists_store_separator}></div>
                    ) : null}
                    <div className={styles.cart_lists_stores_details_container}>
                      <div
                        className={
                          styles.cart_lists_stores_choose_store_outer_container
                        }
                      >
                        <div
                          className={
                            styles.cart_lists_stores_choose_store_inner_container
                          }
                        >
                          <label
                            className={
                              styles.cart_lists_stores_choose_store_input_container
                            }
                          >
                            <input
                              className={
                                styles.cart_lists_choose_checkbox_input_container
                              }
                              type="checkbox"
                              name=""
                              id=""
                              checked={getShopChecked(shop?.id)}
                              onClick={(e) =>
                                handleShopClick(shop?.id, e.target.checked)
                              }
                            />
                            <span
                              className={
                                styles.cart_lists_choose_checkbox_input_display
                              }
                            ></span>
                          </label>
                        </div>
                      </div>
                      <div className={styles.cart_lists_stores_name_city}>
                        <div className={styles.cart_lists_store_name_container}>
                          <div
                            className={styles.card_lists_store_badge_relative}
                          >
                            <Image
                              src={`/logo/${
                                shop?.type == 1
                                  ? "badge_pm.png"
                                  : shop?.type == 2
                                  ? "badge_pmp.svg"
                                  : shop?.type == 3
                                  ? "badge_os.png"
                                  : null
                              }`}
                              alt=""
                              layout="fill"
                            />
                          </div>
                          <Link href={"/"}>
                            <a href="">
                              <div
                                className={
                                  styles.card_lists_store_name_inner_container
                                }
                              >
                                <h5 className={styles.card_lists_store_name}>
                                  {shop?.name}
                                </h5>
                              </div>
                            </a>
                          </Link>
                        </div>
                        <div className={styles.cart_lists_store_city_container}>
                          <p className={styles.cart_lists_store_city_name}>
                            {shop?.city}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className={
                        styles.cart_lists_stores_item_details_container
                      }
                    >
                      {getShopCarts(shop?.id).map(
                        (cart: any, index: number) => {
                          // if (cart?.product?.shop?.id == shop?.id) {
                          // () => { setCartsQty([...cartsQty, { label: cart?.id }]) }

                          return (
                            <div
                              key={index}
                              className={
                                styles.cart_lists_stores_item_outer_container
                              }
                            >
                              {/* TERNARY CHECK IF LINE NEEDED, klo product > 1 dan mulai produk kedua*/}

                              {index > 0 ? (
                                <hr
                                  className={
                                    styles.cart_lists_stores_item_separator
                                  }
                                />
                              ) : null}
                              <div
                                className={
                                  styles.cart_lists_stores_item_inner_container
                                }
                              >
                                <div
                                  className={
                                    styles.cart_lists_stores_item_detail_container
                                  }
                                >
                                  <div
                                    className={
                                      styles.cart_lists_stores_item_detail_checkbox_container
                                    }
                                  >
                                    <label
                                      className={
                                        styles.cart_lists_stores_item_detail_input_container
                                      }
                                    >
                                      <input
                                        className={
                                          styles.cart_lists_item_checkbox_input_container
                                        }
                                        type="checkbox"
                                        name=""
                                        id=""
                                        checked={cart?.checked}
                                        onClick={() =>
                                          toggleCart({
                                            variables: {
                                              id: cart?.id,
                                              checked: !cart?.checked,
                                            },
                                          })
                                        }
                                      />
                                      <span
                                        className={
                                          styles.cart_lists_item_checkbox_input_display
                                        }
                                      ></span>
                                    </label>
                                  </div>
                                  <div
                                    className={
                                      styles.cart_lists_item_detail_inner_container
                                    }
                                  >
                                    <div
                                      className={
                                        styles.cart_lists_item_detail_container
                                      }
                                    >
                                      <Link
                                        href={`/${cart?.product?.shop?.name}/${cart?.product?.id}`}
                                      >
                                        <a href="">
                                          <div
                                            className={
                                              styles.cart_lists_item_image_container_relative
                                            }
                                          >
                                            <Image
                                              src={`/uploads/${cart?.product?.images[0]?.image}`}
                                              alt=""
                                              layout="fill"
                                              objectFit="cover"
                                            />
                                          </div>
                                        </a>
                                      </Link>
                                      <div
                                        className={
                                          styles.cart_lists_item_name_price_container
                                        }
                                      >
                                        <Link
                                          href={`/${cart?.product?.shop?.name}/${cart?.product?.id}`}
                                        >
                                          <a
                                            href=""
                                            className={
                                              styles.cart_lists_item_header_a
                                            }
                                          >
                                            <p
                                              className={
                                                styles.cart_lists_item_name
                                              }
                                            >
                                              {cart?.product?.name}
                                            </p>
                                          </a>
                                        </Link>
                                        <p
                                          className={
                                            styles.cart_lists_item_variant
                                          }
                                        >
                                          LHR 15
                                        </p>
                                        <div
                                          className={
                                            styles.cart_lists_item_price_container
                                          }
                                        >
                                          {cart?.product?.discount > 0 ? (
                                            <>
                                              <div
                                                className={
                                                  styles.cart_lists_item_price_discount
                                                }
                                              >
                                                {cart?.product?.discount}%
                                              </div>
                                              <p
                                                className={
                                                  styles.cart_lists_item_price_orginal_price
                                                }
                                              >
                                                {RupiahFormat(
                                                  cart?.product?.price
                                                )}
                                              </p>
                                            </>
                                          ) : null}

                                          <p
                                            className={
                                              styles.cart_lists_item_price_final_price
                                            }
                                          >
                                            {RupiahFormat(
                                              (cart?.product?.price *
                                                (100 -
                                                  cart?.product?.discount)) /
                                                100
                                            )}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={
                                    styles.cart_lists_stores_item_buttons_container
                                  }
                                >
                                  <div
                                    className={
                                      styles.cart_lists_stores_item_buttons_left_container
                                    }
                                  >
                                    <div>
                                      <div
                                        className={
                                          styles.cart_lists_stores_item_buttons_left
                                        }
                                      >
                                        Tulis Catatan
                                      </div>
                                    </div>
                                  </div>
                                  <div
                                    className={
                                      styles.cart_lists_stores_item_buttons_right_container
                                    }
                                  >
                                    <div
                                      className={
                                        styles.cart_lists_stores_item_wishlist_container
                                      }
                                    >
                                      <p
                                        className={
                                          styles.cart_lists_stores_item_wishlist
                                        }
                                      >
                                        Pindahkan ke Wishlist
                                      </p>
                                    </div>
                                    <div
                                      className={
                                        styles.cart_lists_stores_buttons_separator
                                      }
                                    ></div>
                                    <span
                                      className={
                                        styles.cart_lists_button_remove
                                      }
                                      onClick={() => handleDeleteCart(cart?.id)}
                                    >
                                      <Image
                                        src={"/logo/icon_trash.svg"}
                                        alt=""
                                        layout="fill"
                                      />
                                    </span>
                                    <div
                                      className={
                                        styles.cart_lists_quantity_modifier_outer_container
                                      }
                                    >
                                      <div
                                        className={
                                          styles.cart_lists_quantity_modifier_inner_container
                                        }
                                      >
                                        {/* Min Button */}
                                        <button
                                          className={
                                            styles.cart_lists_quantity_modifier_button
                                          }
                                          onClick={() =>
                                            handleQuantityChange(
                                              cart?.id,
                                              getCart(cart?.id).quantity - 1
                                            )
                                          }
                                        >
                                          <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              d="M4.4443 18.3147C6.08879 19.4135 8.02219 20 10 20C12.6522 20 15.1957 18.9464 17.0711 17.0711C18.9464 15.1957 20 12.6522 20 10C20 8.02219 19.4135 6.08879 18.3147 4.4443C17.2159 2.79981 15.6541 1.51809 13.8268 0.761209C11.9996 0.00433283 9.98891 -0.193701 8.0491 0.192152C6.10929 0.578004 4.32746 1.53041 2.92894 2.92894C1.53041 4.32746 0.578004 6.10929 0.192152 8.0491C-0.1937 9.98891 0.00433283 11.9996 0.761209 13.8268C1.51809 15.6541 2.79981 17.2159 4.4443 18.3147ZM5.55544 3.34825C6.87103 2.4692 8.41775 2 10 2C12.1217 2 14.1566 2.84286 15.6569 4.34315C17.1571 5.84344 18 7.87827 18 10C18 11.5823 17.5308 13.129 16.6518 14.4446C15.7727 15.7602 14.5233 16.7855 13.0615 17.391C11.5997 17.9965 9.99113 18.155 8.43928 17.8463C6.88743 17.5376 5.46197 16.7757 4.34315 15.6569C3.22433 14.538 2.4624 13.1126 2.15372 11.5607C1.84504 10.0089 2.00347 8.40035 2.60897 6.93854C3.21447 5.47673 4.23985 4.2273 5.55544 3.34825ZM6 11H14C14.2652 11 14.5196 10.8946 14.7071 10.7071C14.8946 10.5196 15 10.2652 15 10C15 9.73478 14.8946 9.48043 14.7071 9.29289C14.5196 9.10536 14.2652 9 14 9H6C5.73478 9 5.48043 9.10536 5.29289 9.29289C5.10536 9.48043 5 9.73478 5 10C5 10.2652 5.10536 10.5196 5.29289 10.7071C5.48043 10.8946 5.73478 11 6 11Z"
                                              fill={
                                                getCart(cart?.id).quantity > 1
                                                  ? "#12883D"
                                                  : "#BFC9D9"
                                              }
                                              // fill={"#12883D"} green
                                            ></path>
                                          </svg>
                                        </button>
                                        {/* END Min Button */}
                                        <div
                                          className={
                                            styles.cart_lists_quantity_modifier_input_container
                                          }
                                        >
                                          <input
                                            type="text"
                                            className={
                                              styles.cart_lists_quantity_modifier_input
                                            }
                                            // defaultValue={1}
                                            onChange={(e) =>
                                              handleQuantityChange(
                                                cart?.id,
                                                e.target.value
                                              )
                                            }
                                            value={getCart(cart?.id).quantity}
                                            // value={()=>getQuantity(cart?.id)}
                                          />
                                        </div>
                                        {/* Add Button */}
                                        <button
                                          className={
                                            styles.cart_lists_quantity_modifier_button
                                          }
                                          onClick={() =>
                                            handleQuantityChange(
                                              cart?.id,
                                              getCart(cart?.id).quantity + 1
                                            )
                                          }
                                        >
                                          <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              d="M4.4443 18.3147C6.08879 19.4135 8.02219 20 10 20C12.6522 20 15.1957 18.9464 17.0711 17.0711C18.9464 15.1957 20 12.6522 20 10C20 8.02219 19.4135 6.08879 18.3147 4.4443C17.2159 2.79981 15.6541 1.51809 13.8268 0.761209C11.9996 0.00433283 9.98891 -0.193701 8.0491 0.192152C6.10929 0.578004 4.32746 1.53041 2.92894 2.92894C1.53041 4.32746 0.578004 6.10929 0.192152 8.0491C-0.1937 9.98891 0.00433283 11.9996 0.761209 13.8268C1.51809 15.6541 2.79981 17.2159 4.4443 18.3147ZM5.55544 3.34825C6.87103 2.4692 8.41775 2 10 2C12.1217 2 14.1566 2.84286 15.6569 4.34315C17.1571 5.84344 18 7.87827 18 10C18 11.5823 17.5308 13.129 16.6518 14.4446C15.7727 15.7602 14.5233 16.7855 13.0615 17.391C11.5997 17.9965 9.99113 18.155 8.43928 17.8463C6.88743 17.5376 5.46197 16.7757 4.34315 15.6569C3.22433 14.538 2.4624 13.1126 2.15372 11.5607C1.84504 10.0089 2.00347 8.40035 2.60897 6.93854C3.21447 5.47673 4.23985 4.2273 5.55544 3.34825ZM11 9H14C14.2652 9 14.5196 9.10536 14.7071 9.29289C14.8946 9.48043 15 9.73478 15 10C15 10.2652 14.8946 10.5196 14.7071 10.7071C14.5196 10.8946 14.2652 11 14 11H11V14C11 14.2652 10.8946 14.5196 10.7071 14.7071C10.5196 14.8946 10.2652 15 10 15C9.73478 15 9.48043 14.8946 9.29289 14.7071C9.10536 14.5196 9 14.2652 9 14V11H6C5.73478 11 5.48043 10.8946 5.29289 10.7071C5.10536 10.5196 5 10.2652 5 10C5 9.73478 5.10536 9.48043 5.29289 9.29289C5.48043 9.10536 5.73478 9 6 9H9V6C9 5.73478 9.10536 5.48043 9.29289 5.29289C9.48043 5.10536 9.73478 5 10 5C10.2652 5 10.5196 5.10536 10.7071 5.29289C10.8946 5.48043 11 5.73478 11 6V9Z"
                                              fill={
                                                getCart(cart?.id).quantity <
                                                cart?.product?.stock
                                                  ? "#12883D"
                                                  : "#BFC9D9"
                                              }
                                            ></path>
                                          </svg>
                                        </button>
                                        {/* END Add Button */}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                          // }
                        }
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
          <div className={styles.cart_lists_tidak_proses_container}></div>
        </div>
        <div className={styles.cart_summary_outer_container}>
          <div className={styles.cart_summary_inner_container}>
            <div className={styles.cart_summary_container}>
              <section className={styles.cart_summary_section}>
                <div className={styles.promo_outer_container}>
                  <div className={styles.promo_inner_container}>
                    <div className={styles.promo_icon_container}>
                      <Image
                        src={"/logo/icon_promo.svg"}
                        alt=""
                        layout="fill"
                      />
                    </div>
                    <div className={styles.promo_text_container}>
                      <span className={styles.promo_text}>
                        Makin hemat pakai promo
                      </span>
                    </div>
                    <div className={styles.promo_icon_arrow_container}>
                      <Image
                        src={"/logo/icon_arrow_right.svg"}
                        alt=""
                        layout="fill"
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.cart_summary_separator}></div>
                <div className={styles.cart_main_summary_container}>
                  <div>
                    <h6 className={styles.cart_main_summary_header}>
                      Ringkasan belanja
                    </h6>
                    <div className={styles.cart_main_summary_lists_container}>
                      <p className={styles.cart_main_summary_total_item}>
                        Total Harga ({cartSummary.quantity} barang)
                      </p>
                      <p className={styles.cart_main_summary_total_item_price}>
                        {RupiahFormat(cartSummary.original)}
                      </p>
                    </div>
                    {cartSummary.discount > 0 ? (
                      <div className={styles.cart_main_summary_lists_container}>
                        <p className={styles.cart_main_summary_total_item}>
                          Total Diskon Barang
                        </p>
                        <p
                          className={styles.cart_main_summary_total_item_price}
                        >
                          -{RupiahFormat(cartSummary.discount)}
                        </p>
                      </div>
                    ) : null}

                    <hr className={styles.cart_main_summary_separator} />
                    <div
                      className={styles.cart_main_summary_final_price_container}
                    >
                      <h6 className={styles.cart_main_summary_price_label}>
                        Total Harga
                      </h6>
                      <h6 className={styles.cart_main_summary_price_value}>
                        {cartSummary.original > 0
                          ? RupiahFormat(
                              cartSummary.original - cartSummary.discount
                            )
                          : "-"}
                      </h6>
                    </div>
                  </div>
                  <div
                    className={styles.cart_main_summary_buy_button_container}
                  >
                    <button
                      className={
                        cartSummary.quantity > 0
                          ? styles.cart_main_summary_buy_button_available
                          : styles.cart_main_summary_buy_button_disable
                      }
                      onClick={() => {
                        cartSummary.quantity > 0
                          ? router.push("/cart/shipment")
                          : null;
                      }}
                      // onClick={handleBuyCart}
                    >
                      <span
                        className={styles.cart_main_summary_buy_button_text}
                      >
                        Beli ({cartSummary.quantity})
                      </span>
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;
