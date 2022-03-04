import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Footer } from "../../components/Footer/Powered";
import HeadIcon from "../../components/head_icon";
import InitFont from "../../components/initialize_font";
import Navbar from "../../components/navbar";
import RupiahFormat from "../../misc/currency";
import Shop from "../../models/Shop";
import styles from "../../styles/Shipment.module.scss";
import addressStyle from "../../styles/components/address_overlay.module.scss";
import common from "../../styles/components/common.module.scss";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import LocationSearchInput from "./test";
import Overlay from "../../components/overlay/overlay";
import { useToasts } from "react-toast-notifications";
import { useRouter } from "next/router";

const Shipment: NextPage = () => {
  const { addToast } = useToasts();
  const router = useRouter();
  const [updateAddress, setUpdateAddress] = useState({
    label: "",
    receiver: "",
    phone: "",
    city: "",
    postalCode: "",
    address: "",
  });

  const [newAddress, setNewAddress] = useState({
    label: "",
    receiver: "",
    phone: "",
    city: "",
    postalCode: "",
    address: "",
  });

  const [inputStyle, setInputStyle] = useState({
    label: "",
    receiver: "",
    phone: "",
    city: "",
    postalCode: "",
    address: "",
  });

  const [choosingPayment, setChoosingPayment] = useState(false);

  const [tambahAlamat, setTambahAlamat] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currAddress, setCurrAddress] = useState();
  const [ubahAlamat, setUbahAlamat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [chooseAddress, setChooseAddress] = useState(false);

  const [chosenShipment, setChosenShipment] = useState({});

  const [cartsQty, setCartsQty] = useState([]);
  const [cartSummary, setCartSummary] = useState({
    quantity: 0,
    original: 0,
    discount: 0,
  });

  const GET_SHIPMENTS_QUERY = gql`
    query getShipments {
      getShipments {
        id
        name
        duration
        price
        shipmentType {
          id
          name
        }
      }
    }
  `;

  const {
    loading: shipmentsLoading,
    error: shipmentsErr,
    data: shipmentsData,
  } = useQuery(GET_SHIPMENTS_QUERY);

  const GET_ADDRESS_QUERY = gql`
    query getAddress($query: String!) {
      getAddress(query: $query) {
        id
        label
        receiver
        phone
        city
        postalCode
        address
        main
      }
    }
  `;

  const {
    loading: addressLoading,
    error: addressErr,
    data: addressData,
  } = useQuery(GET_ADDRESS_QUERY, {
    variables: {
      query: searchQuery,
    },
    pollInterval: 1000,
  });

  const CHECKOUT_CARTS_QUERY = gql`
    query GetUserCheckedCart {
      getUserCheckedCart {
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
        user {
          topay {
            balance
          }
        }
      }
    }
  `;

  const {
    loading: checkoutLoading,
    error: checkoutError,
    data: checkoutData,
  } = useQuery(CHECKOUT_CARTS_QUERY, {
    pollInterval: 500,
  });

  const ADD_ADDRESS_MUTATION = gql`
    mutation addAddress(
      $label: String!
      $receiver: String!
      $phone: String!
      $city: String!
      $postalCode: String!
      $address: String!
    ) {
      addAddress(
        input: {
          label: $label
          receiver: $receiver
          phone: $phone
          city: $city
          postalCode: $postalCode
          address: $address
        }
      ) {
        id
      }
    }
  `;

  const [addAddress, { loading, error, data }] =
    useMutation(ADD_ADDRESS_MUTATION);

  const UPDATE_ADDRESS_MUTATION = gql`
    mutation updateAddress(
      $id: ID!
      $label: String!
      $receiver: String!
      $phone: String!
      $city: String!
      $postalCode: String!
      $address: String!
    ) {
      updateAddress(
        id: $id
        input: {
          label: $label
          receiver: $receiver
          phone: $phone
          city: $city
          postalCode: $postalCode
          address: $address
        }
      ) {
        id
      }
    }
  `;

  const [
    updateAddressMutation,
    {
      loading: updateAddressLoad,
      error: updateAddressErr,
      data: updateAddressData,
    },
  ] = useMutation(UPDATE_ADDRESS_MUTATION);

  const DELETE_ADDRESS_MUTATION = gql`
    mutation deleteAddress($id: ID!) {
      deleteAddress(id: $id) {
        id
      }
    }
  `;

  const [
    deleteAddress,
    {
      loading: deleteAddressLoad,
      error: deleteAddressErr,
      data: deleteAddressData,
    },
  ] = useMutation(DELETE_ADDRESS_MUTATION);

  const SET_MAIN_ADDRESS_MUTATION = gql`
    mutation setMainAddress($id: ID!) {
      setMainAddress(id: $id) {
        id
      }
    }
  `;

  const [
    setMainAddress,
    { loading: setMainLoad, error: setMainErr, data: setMainData },
  ] = useMutation(SET_MAIN_ADDRESS_MUTATION);

  const ADD_TRANSACTION_MUTATION = gql`
    mutation addTransaction(
      $addressId: String!
      $shipmentId: String!
      $shopId: String!
      $productIds: [String!]!
      $quantity: [Int!]!
      $couponId: String
      $method: String!
      $total: Int!
    ) {
      addTransaction(
        input: {
          addressId: $addressId
          shipmentId: $shipmentId
          shopId: $shopId
          productIds: $productIds
          quantity: $quantity
          couponId: $couponId
          method: $method
          total: $total
        }
      ) {
        id
      }
    }
  `;

  const [
    addTransaction,
    {
      loading: addTransactionLoad,
      error: addTransactionErr,
      data: addTransactionData,
    },
  ] = useMutation(ADD_TRANSACTION_MUTATION);

  function getAddress(addressId: string) {
    return addressData?.getAddress?.filter((address: any) => {
      return address?.id === addressId;
    });
  }

  // function handleSetValue(addressId: string) {
  //   let addressObj = getAddress(addressId)[0]
  //   setUpdateAddress({
  //     id: addressId,
  //     label: addressObj?.label,
  //     receiver: addressObj?.receiver,
  //     phone: addressObj?.phone,
  //     city: addressObj?.city,
  //     postalCode: addressObj?.postalCode,
  //     address: addressObj?.address,
  //   })
  // }

  function handleUpdateProcess(addressId: string) {
    let addressObj = getAddress(addressId)[0];
    console.log(addressObj);
    setUpdateAddress({
      id: addressId,
      label: addressObj?.label,
      receiver: addressObj?.receiver,
      phone: addressObj?.phone,
      city: addressObj?.city,
      postalCode: addressObj?.postalCode,
      address: addressObj?.address,
    });
    // setUpdateAddress(addressObj)
    console.log(updateAddress);
    setUbahAlamat(true);
    console.log(updateAddress);
  }

  function handleNewAddress(attribute: string, value: string) {
    let currValue = newAddress;
    currValue[attribute] = value;
    setNewAddress(currValue);
    console.log(newAddress);
    console.log(Object.keys(currValue));
  }

  function handleUpdateAddress(attribute: string, value: string) {
    let currValue = updateAddress;
    console.log(currValue);
    console.log(updateAddress);
    currValue[attribute] = value;
    setUpdateAddress(currValue);
    console.log(Object.keys(currValue));
  }

  function handleSubmitNewAddress() {
    let currStyle = inputStyle;
    console.log("masuk");
    let allow = true;
    setSubmitted(true);
    console.log(submitted && checkEmptyField(newAddress, "label"));
    Object.keys(newAddress).map((key: any) => {
      console.log("key: " + key);
      console.log(checkEmptyField(newAddress, key));
      if (checkEmptyField(newAddress, key)) {
        currStyle[key] = addressStyle.warning;
        allow = false;
      } else {
        currStyle[key] = addressStyle.non_warning;
      }
    });
    setInputStyle(currStyle);
    console.log(inputStyle);
    if (allow) {
      addAddress({
        variables: {
          label: newAddress["label"],
          receiver: newAddress["receiver"],
          phone: newAddress["phone"],
          city: newAddress["city"],
          postalCode: newAddress["postalCode"],
          address: newAddress["address"],
        },
      }).then((data) => {
        setTambahAlamat(false);
      });
    }
  }

  function handleSubmitUpdateAddress() {
    let currStyle = inputStyle;
    console.log("masuk");
    let allow = true;
    setSubmitted(true);
    console.log(submitted && checkEmptyField(updateAddress, "label"));
    Object.keys(updateAddress).map((key: any) => {
      console.log("key: " + key);
      console.log(checkEmptyField(updateAddress, key));
      if (checkEmptyField(updateAddress, key)) {
        currStyle[key] = addressStyle.warning;
        allow = false;
      } else {
        currStyle[key] = addressStyle.non_warning;
      }
    });
    setInputStyle(currStyle);
    console.log(inputStyle);
    if (allow) {
      updateAddressMutation({
        variables: {
          id: updateAddress["id"],
          label: updateAddress["label"],
          receiver: updateAddress["receiver"],
          phone: updateAddress["phone"],
          city: updateAddress["city"],
          postalCode: updateAddress["postalCode"],
          address: updateAddress["address"],
        },
      }).then((data: any) => {
        setUbahAlamat(false);
      });
    }
  }

  useEffect(() => {
    setCurrAddress(addressData?.getAddress[0]);

    let totalQuantity = 0;
    let totalOriginalPrice = 0;
    let totalDiscountedPrice = 0;
    checkoutData?.getUserCheckedCart?.map((cart: any) => {
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
    console.log(
      checkoutData?.getUserCheckedCart
        ?.map((cart: any) => cart?.product?.shop)
        .filter(
          (value: any, index: any, self: string | any[]) =>
            self.indexOf(value) === index
        )
    );
    // console.log(checkoutData)
    // console.log(checkoutData?.getUserCheckedCart?.carts.map((cart: any) => cart?.product?.shop).filter((value: any, index: any, self: string | any[]) => self.indexOf(value) === index))
  }, [checkoutData]);

  function getCart(cartId: string) {
    return checkoutData?.getUserCheckedCart?.filter((cart: any) => {
      return cart.id === cartId;
    })[0];
  }

  function getShopSubTotal(shopId: string) {
    let subTotal = 0;
    getShopCarts(shopId).map((cart: any) => {
      subTotal +=
        (cart?.product?.price *
          cart?.quantity *
          (100 - cart?.product?.discount)) /
        100;
    });

    return subTotal;
  }

  function getShopCarts(shopId: string) {
    return checkoutData?.getUserCheckedCart?.filter((cart: any) => {
      return cart?.product?.shop?.id === shopId;
    });
  }

  function checkEmptyField(addressObj: any, key: string) {
    return addressObj[key].trim().length == 0;
  }

  function handleShipment(shopId: string, value: string) {
    let curr = chosenShipment;
    curr[shopId] = value;
    setChosenShipment(curr);
  }

  console.log(chosenShipment);
  console.log(currAddress);

  function handleBayar(paymentMethod: string) {
    if (paymentMethod == "topay") {
      if (
        checkoutData?.getUserCheckedCart[0]?.user?.topay?.balance <
        cartSummary.original - cartSummary.discount
      ) {
        addToast("Saldo anda tidak cukup", { appearance: "error" });
      } else {
        checkoutData?.getUserCheckedCart
          ?.map((cart: any) => cart?.product?.shop)
          .filter(
            (value: any, index: any, self: string | any[]) =>
              self.indexOf(value) === index
          )
          .map((shop: any) => {
            let productList = [];
            let quantityList = [];
            getShopCarts(shop?.id).map((cart: any) => {
              productList.push(cart?.product?.id);
              quantityList.push(Number(cart?.quantity));
            });
            addTransaction({
              variables: {
                addressId: currAddress?.id,
                shipmentId: chosenShipment[shop?.id],
                shopId: shop?.id,
                productIds: productList,
                quantity: quantityList,
                couponId: null,
                method: paymentMethod,
                total: cartSummary.original - cartSummary.discount
              },
            }).then((data: any) => {
              console.log(data);
            });
            // console.log(productList);
            // console.log(quantityList);
          });
        addToast("Pembayaran Berhasil", { appearance: "success" });
        router.push("/");
      }
    }
  }

  console.log(currAddress);
  console.log(
    getAddress(currAddress?.id) ? getAddress(currAddress?.id)[0] : ""
  );
  return (
    <div className={styles.container}>
      <Head>
        <title>Checkout | Tohopedia</title>
        <meta name="description" content="Generated by create next app" />
        {1 == 1 ? (
          <link rel="icon" href="/logo/tohopedia-favicon.png" />
        ) : (
          <link rel="icon" href="/logo/tohopedia-favicon-notif.ico" />
        )}
      </Head>
      <InitFont />
      <Navbar />
      <main className={styles.main}>
        <div className={styles.main_checkout_container}>
          <div className={styles.checkout_left_outer_container}>
            <div className={styles.checkout_left_inner_container}>
              <div className={styles.checkout_left_container}>
                <div>
                  <h1 className={styles.checkout_header_h1}>Checkout</h1>
                  <div className={styles.checkout_address_outer_container}>
                    <div className={styles.checkout_address_inner_container}>
                      <div className={styles.checkout_address_header}>
                        Alamat Pengiriman
                      </div>
                      <div className={styles.checkout_address_main_container}>
                        <div>
                          <div
                            className={styles.checkout_address_label_container}
                          >
                            <b
                              className={styles.checkout_address_label_receiver}
                            >
                              {currAddress?.receiver}
                            </b>
                            <span className={styles.checkout_address_label_tag}>
                              ({currAddress?.label})
                            </span>
                            {getAddress(currAddress?.id) ? (
                              getAddress(currAddress?.id)[0]?.main == true ? (
                                <div
                                  className={styles.checkout_address_label_main}
                                >
                                  Utama
                                </div>
                              ) : null
                            ) : null}
                          </div>
                        </div>
                        <div className={styles.checkout_address_phone}>
                          {currAddress?.phone}
                        </div>
                        <div
                          className={styles.checkout_address_detail_container}
                        >
                          <div className={styles.checkout_address_detail}>
                            {currAddress?.address}
                          </div>
                        </div>
                      </div>
                      <div
                        className={styles.checkout_address_options_container}
                      >
                        <button
                          className={styles.checkout_address_options_button}
                          onClick={() => setChooseAddress(true)}
                        >
                          <span className={styles.checkout_address_button_text}>
                            Pilih Alamat Lain
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* LIST PESANAN Container */}
                  <div className={styles.checkout_order_list_container}>
                    {checkoutData?.getUserCheckedCart
                      ?.map((cart: any) => cart?.product?.shop)
                      .filter(
                        (value: any, index: any, self: string | any[]) =>
                          self.indexOf(value) === index
                      )
                      .map((shop: any, index: number) => {
                        {
                          /* ONE PESANAN CONTAINER */
                        }
                        return (
                          <div
                            key={shop?.id}
                            className={styles.checkout_order_container}
                          >
                            <p className={styles.checkout_order_header}>
                              Pesanan {index + 1}
                            </p>
                            <div
                              className={styles.checkout_order_detail_container}
                            >
                              <div>
                                <div
                                  className={styles.checkout_order_shop_details}
                                >
                                  <div
                                    className={
                                      styles.checkout_order_shop_details_inner
                                    }
                                  >
                                    <div
                                      className={
                                        styles.checkout_order_shop_details_inner_left
                                      }
                                    >
                                      <div>
                                        <div
                                          className={
                                            styles.checkout_order_shop_name_type
                                          }
                                        >
                                          <div
                                            className={
                                              styles.checkout_order_shop_type_relative
                                            }
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
                                          <span
                                            className={
                                              styles.checkout_order_shop_name
                                            }
                                          >
                                            {shop?.name}
                                          </span>
                                        </div>
                                        <div
                                          className={
                                            styles.checkout_order_shop_city_container
                                          }
                                        >
                                          <p
                                            className={
                                              styles.checkout_order_shop_city
                                            }
                                          >
                                            {shop?.city}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={
                                    styles.checkout_order_details_outer_container
                                  }
                                >
                                  <div
                                    className={
                                      styles.checkout_order_details_inner_container
                                    }
                                  >
                                    {/* Item Container */}
                                    <div
                                      className={
                                        styles.checkout_order_details_products_container
                                      }
                                    >
                                      {getShopCarts(shop?.id).map(
                                        (cart: any, index: number) => {
                                          return (
                                            <div
                                              key={cart?.id}
                                              className={
                                                styles.checkout_order_details_products_inner_container
                                              }
                                            >
                                              <div
                                                className={
                                                  styles.checkout_order_individual_detail_product_outer_container
                                                }
                                              >
                                                <div
                                                  className={
                                                    styles.checkout_order_individual_detail_product_inner_container
                                                  }
                                                >
                                                  <div
                                                    className={
                                                      styles.checkout_order_individual_detail_product_container
                                                    }
                                                  >
                                                    <div
                                                      className={
                                                        styles.checkout_order_product_image
                                                      }
                                                    >
                                                      <div
                                                        className={
                                                          styles.checkout_order_product_image_container
                                                        }
                                                      >
                                                        <div
                                                          className={
                                                            styles.checkout_order_product_image_relative
                                                          }
                                                        >
                                                          <Image
                                                            src={`/uploads/${cart?.product?.images[0]?.image}`}
                                                            alt=""
                                                            layout="fill"
                                                            objectFit="cover"
                                                          />
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div
                                                      className={
                                                        styles.checkout_order_product_detail_container
                                                      }
                                                    >
                                                      <p
                                                        className={
                                                          styles.checkout_order_product_name
                                                        }
                                                      >
                                                        {cart?.product?.name}
                                                      </p>
                                                      <div
                                                        className={
                                                          styles.checkout_order_product_variant_quantity
                                                        }
                                                      >
                                                        <p
                                                          className={
                                                            styles.checkout_order_product_variant
                                                          }
                                                        >
                                                          1400 GSM
                                                        </p>
                                                        <p
                                                          className={
                                                            styles.checkout_order_product_quantity
                                                          }
                                                        >
                                                          {cart?.quantity}{" "}
                                                          barang
                                                        </p>
                                                      </div>
                                                      <div
                                                        className={
                                                          styles.checkout_order_product_price_container
                                                        }
                                                      >
                                                        {cart?.product
                                                          ?.discount > 0 ? (
                                                          <p
                                                            className={
                                                              styles.checkout_order_product_price_discount
                                                            }
                                                          >
                                                            {RupiahFormat(
                                                              cart?.product
                                                                ?.price *
                                                                cart?.quantity
                                                            )}
                                                          </p>
                                                        ) : null}

                                                        <p
                                                          className={
                                                            styles.checkout_order_product_price_original
                                                          }
                                                        >
                                                          {RupiahFormat(
                                                            (cart?.product
                                                              ?.price *
                                                              cart?.quantity *
                                                              (100 -
                                                                cart?.product
                                                                  ?.discount)) /
                                                              100
                                                          )}
                                                        </p>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        }
                                      )}
                                    </div>
                                    {/* END Item Container */}
                                    <div
                                      className={
                                        styles.checkout_order_details_delivery_container
                                      }
                                    >
                                      <div
                                        className={
                                          styles.checkout_order_details_delivery_header
                                        }
                                      >
                                        Pilih Durasi
                                      </div>
                                      <select
                                        className={
                                          styles.checkout_order_details_delivery_options
                                        }
                                        name=""
                                        id=""
                                        onChange={(e) => {
                                          handleShipment(
                                            shop?.id,
                                            e.target.value
                                          );
                                        }}
                                      >
                                        <option value="">
                                          Pilih Opsi Pengiriman
                                        </option>
                                        {shipmentsData?.getShipments?.map(
                                          (shipment: any) => {
                                            return (
                                              <option
                                                key={shipment?.id}
                                                value={shipment?.id}
                                              >
                                                {shipment?.name} (
                                                {shipment?.shipmentType?.name})
                                                -{" "}
                                                {RupiahFormat(shipment?.price)}
                                              </option>
                                            );
                                          }
                                        )}
                                        {/* <option value="">Reguler</option>
                                        <option value="">Kargo</option>
                                        <option value="">Ekonomi</option> */}
                                      </select>
                                    </div>
                                  </div>
                                </div>

                                <div
                                  className={
                                    styles.checkout_order_detail_subtotal
                                  }
                                >
                                  <div
                                    className={
                                      styles.checkout_order_detail_subtotal_inner
                                    }
                                  >
                                    <div
                                      className={
                                        styles.checkout_order_detail_subtotal_container
                                      }
                                    >
                                      <p
                                        className={
                                          styles.checkout_order_detail_subtotal_label
                                        }
                                      >
                                        Subtotal
                                      </p>
                                      <p
                                        className={
                                          styles.checkout_order_detail_subtotal_price
                                        }
                                      >
                                        {RupiahFormat(
                                          getShopSubTotal(shop?.id)
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                        {
                          /* END ONE PESANAN CONTAINER */
                        }
                      })}
                  </div>
                  {/* END LIST PESANAN Container */}
                </div>
              </div>
            </div>
          </div>

          {/* Summary Container */}
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
                        <p
                          className={styles.cart_main_summary_total_item_price}
                        >
                          {RupiahFormat(cartSummary.original)}
                        </p>
                      </div>
                      {cartSummary.discount > 0 ? (
                        <div
                          className={styles.cart_main_summary_lists_container}
                        >
                          <p className={styles.cart_main_summary_total_item}>
                            Total Diskon Barang
                          </p>
                          <p
                            className={
                              styles.cart_main_summary_total_item_price
                            }
                          >
                            -{RupiahFormat(cartSummary.discount)}
                          </p>
                        </div>
                      ) : null}

                      <hr className={styles.cart_main_summary_separator} />
                      <div
                        className={
                          styles.cart_main_summary_final_price_container
                        }
                      >
                        <h6 className={styles.cart_main_summary_price_label}>
                          Total Tagihan
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
                          setChoosingPayment(true);
                        }}
                      >
                        <span
                          className={styles.cart_main_summary_buy_button_text}
                        >
                          Bayar
                        </span>
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
          {/* END SUMMARY CONTAINER */}
          <div>
            {chooseAddress && ChooseAddressOverlay()}
            {tambahAlamat && TambahOverlay()}
            {ubahAlamat && UbahOverlay()}
            {choosingPayment && ChoosePaymentOverlay()}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );

  function ChooseAddressOverlay() {
    return (
      <Overlay>
        <div className={addressStyle.choose_address_overlay_container}>
          <button
            className={common.close_button}
            onClick={() => {
              setChooseAddress(false);
            }}
          ></button>
          <h2 className={common.overlay_header}>Ubah Pengiriman</h2>
          <div className={addressStyle.address_search_add_address_container}>
            <div>
              <div>
                <button></button>
                <input
                  type="text"
                  placeholder="Cari alamat atau nama penerima"
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <button
            className={addressStyle.add_address_button}
            onClick={() => {
              setTambahAlamat(true);
            }}
          >
            <span>Tambah Alamat Baru</span>
          </button>
          <div className={addressStyle.overflow_address_container}>
            {addressData?.getAddress.map((address: any) => {
              return (
                <section
                  key={address?.id}
                  className={
                    currAddress?.id == address?.id
                      ? addressStyle.address_item_selected
                      : ""
                  }
                  // onClick={() => {
                  //   setCurrAddress(getAddress(address?.id)[0]);
                  //   setChooseAddress(false);
                  // }}
                >
                  <div className={addressStyle.address_item_detail}>
                    <h5>
                      <span>{address?.label}</span>
                      {address?.main === true ? <div>Utama</div> : null}
                    </h5>
                    <h4>
                      <span>{address?.receiver}</span>
                    </h4>
                    <p>{address?.phone}</p>
                    <p>
                      <span>{address?.address}</span>
                    </p>

                    <div className={addressStyle.flex_options_container}>
                      <div className={addressStyle.ubah_container}>
                        <div>
                          <a
                            onClick={() => {
                              handleUpdateProcess(address?.id);
                            }}
                          >
                            <b>Ubah Alamat</b>
                          </a>
                        </div>
                      </div>
                      <div
                        className={`${addressStyle.ubah_container} ${addressStyle.hapus_container}`}
                      >
                        <div>
                          <a
                            onClick={() => {
                              deleteAddress({
                                variables: { id: address?.id },
                              });
                            }}
                          >
                            <b>Hapus</b>
                          </a>
                        </div>
                      </div>
                      <div
                        className={`${addressStyle.ubah_container} ${addressStyle.hapus_container}`}
                      >
                        <div>
                          <a
                            onClick={() => {
                              setMainAddress({
                                variables: { id: address?.id },
                              });
                            }}
                          >
                            <b>Jadikan Alamat Utama</b>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Checklist */}
                  {address?.id === currAddress?.id ? (
                    <div className={addressStyle.address_checklist_container}>
                      <picture>
                        <div>
                          <Image
                            src={"/logo/icon_check_green.svg"}
                            alt=""
                            layout="fill"
                          />
                        </div>
                      </picture>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        // setMainAddress({ variables: { id: address?.id } });
                        setCurrAddress(getAddress(address?.id)[0]);
                        setChooseAddress(false);
                      }}
                    >
                      <span>Pilih</span>
                    </button>
                  )}
                </section>
              );
            })}
          </div>
        </div>
      </Overlay>
    );
  }

  function ChoosePaymentOverlay() {
    return (
      <Overlay>
        <div className={common.overlay_container}>
          <button
            className={common.close_button}
            onClick={() => {
              setChoosingPayment(false);
            }}
          ></button>
          <h2 className={common.overlay_header}>Choose Payment Method</h2>
          <div className={common.fields_overlay_container}>
            <label className={common.fields_container_label} htmlFor=""></label>
            <div>
              <div className={common.container_flex_align_center}>
                <button
                  className={common.text_button}
                  onClick={() => {
                    handleBayar("topay");
                  }}
                >
                  <span>ToPay</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Overlay>
    );
  }

  function TambahOverlay() {
    return (
      <Overlay>
        <div className={addressStyle.input_container}>
          <button
            className={common.close_button}
            onClick={() => {
              setTambahAlamat(false);
            }}
          ></button>
          {/* Inner Form Container */}
          <div className={addressStyle.input_inner_container}>
            <h3 className={addressStyle.input_header}>Tambah Alamat</h3>
            <div className={addressStyle.form_container}>
              <div>
                <div className={addressStyle.alamat_container}>
                  <label htmlFor="">Label Alamat</label>
                  <div>
                    <div className={inputStyle["label"]}>
                      {/* <div className={submitted && checkEmptyField(newAddress, "label") ? address.warning : null}> */}
                      <input
                        name="label"
                        type="text"
                        onChange={(e) => {
                          handleNewAddress(e.target.name, e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className={addressStyle.splitted_fields_container}>
                  <div>
                    <div className={addressStyle.splitted_flex_container}>
                      <div className={addressStyle.field_outer_container_half}>
                        <div className={addressStyle.field_inner_container}>
                          <label htmlFor="">Nama Penerima</label>
                          <div className={inputStyle["receiver"]}>
                            <input
                              name="receiver"
                              type="text"
                              onChange={(e) => {
                                handleNewAddress(e.target.name, e.target.value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className={addressStyle.field_outer_container_half}>
                        <div className={addressStyle.field_inner_container}>
                          <label htmlFor="">Nomor Ponsel</label>
                          <div className={inputStyle["phone"]}>
                            <input
                              name="phone"
                              type="text"
                              onChange={(e) => {
                                handleNewAddress(e.target.name, e.target.value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={addressStyle.splitted_fields_container}>
                  <div>
                    <div className={addressStyle.splitted_flex_container}>
                      <div
                        className={addressStyle.field_outer_container_twothird}
                      >
                        <div className={addressStyle.field_inner_container}>
                          <label htmlFor="">Kota atau Kecamatan</label>
                          <div className={inputStyle["city"]}>
                            <input
                              name="city"
                              type="text"
                              onChange={(e) => {
                                handleNewAddress(e.target.name, e.target.value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div
                        className={addressStyle.field_outer_container_onethird}
                      >
                        <div className={addressStyle.field_inner_container}>
                          <label htmlFor="">Kode Pos</label>
                          <div className={inputStyle["postalCode"]}>
                            <input
                              name="postalCode"
                              type="text"
                              maxLength={5}
                              onChange={(e) => {
                                handleNewAddress(e.target.name, e.target.value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={addressStyle.splitted_fields_container}>
                  <div>
                    <div className={addressStyle.splitted_flex_container}>
                      <div className={addressStyle.field_outer_container_full}>
                        <div className={addressStyle.field_inner_container}>
                          <label htmlFor="">Alamat</label>
                          <div className={inputStyle["address"]}>
                            <input
                              name="address"
                              type="text"
                              onChange={(e) => {
                                handleNewAddress(e.target.name, e.target.value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={addressStyle.form_button_container}>
              <button
                onClick={() => {
                  setTambahAlamat(false);
                }}
              >
                <span>Batal</span>
              </button>
              {/* <button style={{ marginLeft: "8px" }} className={address.green} onClick={()=>{console.log("kepencet")}}> */}
              <button
                style={{ marginLeft: "8px" }}
                className={addressStyle.green}
                onClick={(e) => {
                  handleSubmitNewAddress();
                }}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      </Overlay>
    );
  }

  function UbahOverlay() {
    return (
      <Overlay>
        <div className={addressStyle.input_container}>
          <button
            className={common.close_button}
            onClick={() => {
              setUbahAlamat(false);
            }}
          ></button>
          {/* Inner Form Container */}
          <div className={addressStyle.input_inner_container}>
            <h3 className={addressStyle.input_header}>Ubah Alamat</h3>
            <div className={addressStyle.form_container}>
              <div>
                <div className={addressStyle.alamat_container}>
                  <label htmlFor="">Label Alamat</label>
                  <div>
                    <div className={inputStyle["label"]}>
                      {/* <div className={submitted && checkEmptyField(newAddress, "label") ? address.warning : null}> */}
                      <input
                        name="label"
                        type="text"
                        defaultValue={updateAddress["label"]}
                        onChange={(e) => {
                          handleUpdateAddress(e.target.name, e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className={addressStyle.splitted_fields_container}>
                  <div>
                    <div className={addressStyle.splitted_flex_container}>
                      <div className={addressStyle.field_outer_container_half}>
                        <div className={addressStyle.field_inner_container}>
                          <label htmlFor="">Nama Penerima</label>
                          <div className={inputStyle["receiver"]}>
                            <input
                              name="receiver"
                              type="text"
                              defaultValue={updateAddress["receiver"]}
                              onChange={(e) => {
                                handleUpdateAddress(
                                  e.target.name,
                                  e.target.value
                                );
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className={addressStyle.field_outer_container_half}>
                        <div className={addressStyle.field_inner_container}>
                          <label htmlFor="">Nomor Ponsel</label>
                          <div className={inputStyle["phone"]}>
                            <input
                              name="phone"
                              type="text"
                              defaultValue={updateAddress["phone"]}
                              onChange={(e) => {
                                handleUpdateAddress(
                                  e.target.name,
                                  e.target.value
                                );
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={addressStyle.splitted_fields_container}>
                  <div>
                    <div className={addressStyle.splitted_flex_container}>
                      <div
                        className={addressStyle.field_outer_container_twothird}
                      >
                        <div className={addressStyle.field_inner_container}>
                          <label htmlFor="">Kota atau Kecamatan</label>
                          <div className={inputStyle["city"]}>
                            <input
                              name="city"
                              type="text"
                              defaultValue={updateAddress["city"]}
                              onChange={(e) => {
                                handleUpdateAddress(
                                  e.target.name,
                                  e.target.value
                                );
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div
                        className={addressStyle.field_outer_container_onethird}
                      >
                        <div className={addressStyle.field_inner_container}>
                          <label htmlFor="">Kode Pos</label>
                          <div className={inputStyle["postalCode"]}>
                            <input
                              name="postalCode"
                              type="text"
                              maxLength={5}
                              defaultValue={updateAddress["postalCode"]}
                              onChange={(e) => {
                                handleUpdateAddress(
                                  e.target.name,
                                  e.target.value
                                );
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={addressStyle.splitted_fields_container}>
                  <div>
                    <div className={addressStyle.splitted_flex_container}>
                      <div className={addressStyle.field_outer_container_full}>
                        <div className={addressStyle.field_inner_container}>
                          <label htmlFor="">Alamat</label>
                          <div className={inputStyle["address"]}>
                            <input
                              name="address"
                              type="text"
                              defaultValue={updateAddress["address"]}
                              onChange={(e) => {
                                handleUpdateAddress(
                                  e.target.name,
                                  e.target.value
                                );
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={addressStyle.form_button_container}>
              <button
                onClick={() => {
                  setUbahAlamat(false);
                }}
              >
                <span>Batal</span>
              </button>
              {/* <button style={{ marginLeft: "8px" }} className={address.green} onClick={()=>{console.log("kepencet")}}> */}
              <button
                style={{ marginLeft: "8px" }}
                className={addressStyle.green}
                onClick={(e) => {
                  handleSubmitUpdateAddress();
                }}
              >
                Ubah
              </button>
            </div>
          </div>
        </div>
      </Overlay>
    );
  }
};
export default Shipment;
