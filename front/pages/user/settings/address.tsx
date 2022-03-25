import { NextPage } from "next";
import Layout from "./layout";
import styles from "./address.module.scss";
import Image from "next/image";
import Overlay from "../../../components/overlay/overlay";
import address from "../../../styles/components/address_overlay.module.scss";
import common from "../../../styles/components/common.module.scss";
import { useContext, useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { userDetailsContext } from "../../../services/UserDataProvider";
import { stateContext } from "../../../services/StateProvider";
import Router from "next/router";
import { Address } from "../../../models/Address";

export default function AddressPage() {
  const { tabIndexSetting, setTabIndexSetting} = useContext(stateContext);
  const [tambahAlamat, setTambahAlamat] = useState<any>(false);
  const [ubahAlamat, setUbahAlamat] = useState<any>(false);
  const [submitted, setSubmitted] = useState<any>(false);
  const {addressQuery, setAddressQuery} = useContext(stateContext)
  const [newAddress, setNewAddress] = useState<any>({
    label: "",
    receiver: "",
    phone: "",
    city: "",
    postalcode: "",
    address: "",
  });
  var updateAddressDefault = {}
  const [updateAddress, setUpdateAddress] = useState<any>({
    label: "",
    receiver: "",
    phone: "",
    city: "",
    postalcode: "",
    address: "",
  }
  );
  const [inputStyle, setInputStyle] = useState<any>({
    label: "",
    receiver: "",
    phone: "",
    city: "",
    postalcode: "",
    address: "",
  });

  const addressData = useContext(userDetailsContext)?.addresses
  const { setPollInterval } = useContext(stateContext);
  useEffect(() => {
    setPollInterval(3000)
    setTabIndexSetting(1)
  }, []);


  const [addAddress] = useMutation(Address.ADD_ADDRESS_MUTATION);
  const [updateAddressMutation] = useMutation(Address.UPDATE_ADDRESS_MUTATION);
  const [deleteAddress] = useMutation(Address.DELETE_ADDRESS_MUTATION);
  const [setMainAddress] = useMutation(Address.SET_MAIN_ADDRESS_MUTATION);

  function getAddress(addressId: string) {
    return addressData?.filter((address: any) => {
      return address?.id === addressId;
    });
  }

  function handleUpdateProcess(addressId: string) {
    let addressObj = getAddress(addressId)[0]
    setUpdateAddress({
      id: addressId,
      label: addressObj?.label,
      receiver: addressObj?.receiver,
      phone: addressObj?.phone,
      city: addressObj?.city,
      postalcode: addressObj?.postalCode,
      address: addressObj?.address,
    })
    setUbahAlamat(true)
  }

  function handleNewAddress(attribute: string, value: string) {
    let currValue = newAddress;
    currValue[attribute] = value;
    setNewAddress(currValue);
  }

  function handleUpdateAddress(attribute: string, value: string) {
    let currValue = updateAddress;
    currValue[attribute] = value;
    setUpdateAddress(currValue);
  }

  function handleSubmitNewAddress() {
    let currStyle = inputStyle;
    let allow = true;
    setSubmitted(true);
    Object.keys(newAddress).map((key: any) => {
      if (checkEmptyField(newAddress, key)) {
        currStyle[key] = address.warning;
        allow = false;
      } else {
        currStyle[key] = address.non_warning;
      }
    });
    setInputStyle(currStyle);
    if (allow) {
      addAddress({
        variables: {
          label: newAddress["label"],
          receiver: newAddress["receiver"],
          phone: newAddress["phone"],
          city: newAddress["city"],
          postalCode: newAddress["postalcode"],
          address: newAddress["address"],
        },
      }).then((data) => {
        setTambahAlamat(false);
      });
    }
  }

  function handleSubmitUpdateAddress() {
    let currStyle = inputStyle;
    let allow = true;
    setSubmitted(true);
    Object.keys(updateAddress).map((key: any) => {
      if (checkEmptyField(updateAddress, key)) {
        currStyle[key] = address.warning;
        allow = false;
      } else {
        currStyle[key] = address.non_warning;
      }
    });
    setInputStyle(currStyle);
    if (allow) {
      updateAddressMutation({
        variables: {
          id: updateAddress["id"],
          label: updateAddress["label"],
          receiver: updateAddress["receiver"],
          phone: updateAddress["phone"],
          city: updateAddress["city"],
          postalCode: updateAddress["postalcode"],
          address: updateAddress["address"]
        },
      }).then((data: any) => {
        setUbahAlamat(false);
      });
    }
  }

  function checkEmptyField(addressObj: any, key: string) {
    return addressObj[key].trim().length == 0;
  }

  return (
    <>
      <div className={styles.address_container}>
        <div className={styles.address_search_add_address_container}>
          <div>
            <div>
              <button></button>
              <input
                type="text"
                placeholder="Cari alamat atau nama penerima"
                onChange={(e) => {
                  setAddressQuery(e.target.value);
                }}
              />
            </div>
          </div>
          <button
            onClick={() => {
              setTambahAlamat(true);
            }}
          >
            <span>Tambah Alamat Baru</span>
          </button>
        </div>
        {addressData?.map((address: any) => {
          return (
            <section
              key={address?.id}
              className={
                address?.main == true ? styles.address_item_selected : ""
              }
            >
              <div className={styles.address_item_detail}>
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
                {/* <p className={styles.paragraph_flex}>
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="var(--color-icon-enabled, #525867)"
              >
                <path d="M11.5 21.87a1 1 0 00.5.13 1 1 0 00.514-.138C12.974 21.587 20 17.399 20 10a7.909 7.909 0 00-8-8 7.91 7.91 0 00-8 8c0 7.399 7.025 11.587 7.486 11.862l.014.008zM9.694 4.44A5.94 5.94 0 0112 4a5.94 5.94 0 016 6c0 5.28-4.48 8.81-6 9.81-1.52-1.03-6-4.51-6-9.81a5.94 5.94 0 013.694-5.56zm.084 8.886a4 4 0 104.444-6.652 4 4 0 00-4.444 6.652zm1.11-4.989a2 2 0 112.223 3.326 2 2 0 01-2.222-3.326z"></path>
                          </svg>
                          <span></span>
            </p> */}
                <div className={styles.flex_options_container}>
                  <div className={styles.ubah_container}>
                    <div>
                      <a onClick={() => {handleUpdateProcess(address?.id)}}>
                        <b>Ubah Alamat</b>
                      </a>
                    </div>
                  </div>
                  <div
                    className={`${styles.ubah_container} ${styles.hapus_container}`}
                  >
                    <div>
                      <a
                        onClick={() => {
                          deleteAddress({ variables: { id: address?.id } });
                        }}
                      >
                        <b>Hapus</b>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              {/* Checklist */}
              {address?.main === true ? (
                <div className={styles.address_checklist_container}>
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
                      setMainAddress({ variables: { id: address?.id } });
                  }}
                >
                  <span>Pilih</span>
                </button>
              )}
            </section>
          );
        })}
      </div>
      <div>
        {tambahAlamat && TambahOverlay()}
        {ubahAlamat && UbahOverlay()}
      </div>
    </>
  );

  function TambahOverlay() {
    return (
      <Overlay>
        <div className={address.input_container}>
          <button
            className={common.close_button}
            onClick={() => {
              setTambahAlamat(false);
            }}
          ></button>
          {/* Inner Form Container */}
          <div className={address.input_inner_container}>
            <h3 className={address.input_header}>Tambah Alamat</h3>
            <div className={address.form_container}>
              <div>
                <div className={address.alamat_container}>
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
                <div className={address.splitted_fields_container}>
                  <div>
                    <div className={address.splitted_flex_container}>
                      <div className={address.field_outer_container_half}>
                        <div className={address.field_inner_container}>
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
                      <div className={address.field_outer_container_half}>
                        <div className={address.field_inner_container}>
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
                <div className={address.splitted_fields_container}>
                  <div>
                    <div className={address.splitted_flex_container}>
                      <div className={address.field_outer_container_twothird}>
                        <div className={address.field_inner_container}>
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
                      <div className={address.field_outer_container_onethird}>
                        <div className={address.field_inner_container}>
                          <label htmlFor="">Kode Pos</label>
                          <div className={inputStyle["postalcode"]}>
                            <input
                              name="postalcode"
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
                <div className={address.splitted_fields_container}>
                  <div>
                    <div className={address.splitted_flex_container}>
                      <div className={address.field_outer_container_full}>
                        <div className={address.field_inner_container}>
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
            <div className={address.form_button_container}>
              <button
                onClick={() => {
                  setTambahAlamat(false);
                }}
              >
                <span>Batal</span>
              </button>
              <button
                style={{ marginLeft: "8px" }}
                className={address.green}
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
        <div className={address.input_container}>
          <button
            className={common.close_button}
            onClick={() => {
              setUbahAlamat(false);
            }}
          ></button>
          {/* Inner Form Container */}
          <div className={address.input_inner_container}>
            <h3 className={address.input_header}>Ubah Alamat</h3>
            <div className={address.form_container}>
              <div>
                <div className={address.alamat_container}>
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
                <div className={address.splitted_fields_container}>
                  <div>
                    <div className={address.splitted_flex_container}>
                      <div className={address.field_outer_container_half}>
                        <div className={address.field_inner_container}>
                          <label htmlFor="">Nama Penerima</label>
                          <div className={inputStyle["receiver"]}>
                            <input
                              name="receiver"
                              type="text"
                              defaultValue={updateAddress["receiver"]}
                              onChange={(e) => {
                                handleUpdateAddress(e.target.name, e.target.value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className={address.field_outer_container_half}>
                        <div className={address.field_inner_container}>
                          <label htmlFor="">Nomor Ponsel</label>
                          <div className={inputStyle["phone"]}>
                            <input
                              name="phone"
                              type="text"
                              defaultValue={updateAddress["phone"]}
                              onChange={(e) => {
                                handleUpdateAddress(e.target.name, e.target.value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={address.splitted_fields_container}>
                  <div>
                    <div className={address.splitted_flex_container}>
                      <div className={address.field_outer_container_twothird}>
                        <div className={address.field_inner_container}>
                          <label htmlFor="">Kota atau Kecamatan</label>
                          <div className={inputStyle["city"]}>
                            <input
                              name="city"
                              type="text"
                              defaultValue={updateAddress["city"]}
                              onChange={(e) => {
                                handleUpdateAddress(e.target.name, e.target.value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className={address.field_outer_container_onethird}>
                        <div className={address.field_inner_container}>
                          <label htmlFor="">Kode Pos</label>
                          <div className={inputStyle["postalcode"]}>
                            <input
                              name="postalcode"
                              type="text"
                              maxLength={5}
                              defaultValue={updateAddress["postalcode"]}
                              onChange={(e) => {
                                handleUpdateAddress(e.target.name, e.target.value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={address.splitted_fields_container}>
                  <div>
                    <div className={address.splitted_flex_container}>
                      <div className={address.field_outer_container_full}>
                        <div className={address.field_inner_container}>
                          <label htmlFor="">Alamat</label>
                          <div className={inputStyle["address"]}>
                            <input
                              name="address"
                              type="text"
                              defaultValue={updateAddress["address"]}
                              onChange={(e) => {
                                handleUpdateAddress(e.target.name, e.target.value);
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
            <div className={address.form_button_container}>
              <button
                onClick={() => {
                  setUbahAlamat(false);
                }}
              >
                <span>Batal</span>
              </button>
              <button
                style={{ marginLeft: "8px" }}
                className={address.green}
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


AddressPage.getLayout = function getLayout(page: any) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}