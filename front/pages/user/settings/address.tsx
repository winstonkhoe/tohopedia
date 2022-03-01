import { NextPage } from "next";
import Layout from "./layout";
import styles from "../../../styles/Settings_Address.module.scss";
import Image from "next/image";
import Overlay from "../../../components/overlay/overlay";
import address from "../../../styles/components/address_overlay.module.scss";
import { useState } from "react";

const Address: NextPage = () => {
  const [tambahAlamat, setTambahAlamat] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [newAddress, setNewAddress] = useState({label: "", receiver: "", phone: "", city: "", postalcode: "", address: ""})


  function handleNewAddress(attribute: string, value: string) {
    let currValue = newAddress
    currValue[attribute] = value
    setNewAddress(currValue)
    console.log(newAddress)
    console.log(Object.keys(currValue))
  }

  function handleSubmitNewAddress() {
    let allow = true
    setSubmitted(true)
    Object.keys(newAddress).map((key: any ) => {
      if (checkEmptyField(newAddress, key)) {
      // if (newAddress[key].trim().length == 0) {
        allow = false
      }
    })
    if (allow) {
      
    }
  }

  function checkEmptyField(addressObj: any, key: string) {
    return addressObj[key].trim().length == 0
  }

  return (
    <Layout>
      <div className={styles.address_container}>
        <div className={styles.address_search_add_address_container}>
          <div>
            <div>
              <button></button>
              <input type="text" placeholder="Cari alamat atau nama penerima" />
            </div>
          </div>
          <button
          onClick={()=>{setTambahAlamat(true)}}
          >
            <span>Tambah Alamat Baru</span>
          </button>
        </div>
        <section className={styles.address_item_selected}>
          <div className={styles.address_item_detail}>
            <h5>
              <span>Winston Khoe Main</span>
              <div>Utama</div>
            </h5>
            <h4>
              <span>Winston Khoe</span>
            </h4>
            <p>6281315174786</p>
            <p>
              <span>Jl. Janur Hijau 1 Blok AF 15 No.7, Sektor 1A</span>
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
            <div className={styles.ubah_container}>
              <div>
                <a href="">
                  <b>Ubah Alamat</b>
                </a>
              </div>
            </div>
          </div>
          {/* Checklist */}
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
        </section>
        <section>
          <div className={styles.address_item_detail}>
            <h5>
              <span>Winston Khoe Main</span>
              <div>Utama</div>
            </h5>
            <h4>
              <span>Winston Khoe</span>
            </h4>
            <p>6281315174786</p>
            <p>
              <span>Jl. Janur Hijau 1 Blok AF 15 No.7, Sektor 1A</span>
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
                  <a href="">
                    <b>Ubah Alamat</b>
                  </a>
                </div>
              </div>
              <div
                className={`${styles.ubah_container} ${styles.hapus_container}`}
              >
                <div>
                  <a href="">
                    <b>Hapus</b>
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* Checklist */}
          <button>
            <span>Pilih</span>
          </button>
        </section>
      </div>
      <div>
        {tambahAlamat && (
          <Overlay>
          <div className={address.input_container}>
            <button className={address.close_button} onClick={()=>{setTambahAlamat(false)}}></button>
            {/* Inner Form Container */}
            <div className={address.input_inner_container}>
              <h3 className={address.input_header}>Tambah Alamat</h3>
              <div className={address.form_container}>
                <div>
                  <div className={address.alamat_container}>
                    <label htmlFor="">Label Alamat</label>
                    <div>
                      <div>
                        <input name="label" type="text" onChange={e => {handleNewAddress(e.target.name, e.target.value)}}/>
                      </div>
                    </div>
                  </div>
                  <div className={address.splitted_fields_container}>
                    <div>
                      <div className={address.splitted_flex_container}>
                        <div className={address.field_outer_container_half}>
                          <div className={address.field_inner_container}>
                            <label htmlFor="">Nama Penerima</label>
                            <div>
                              <input name="receiver" type="text" onChange={e => {handleNewAddress(e.target.name, e.target.value)}}/>
                            </div>
                          </div>
                        </div>
                        <div className={address.field_outer_container_half}>
                          <div className={address.field_inner_container}>
                            <label htmlFor="">Nomor Ponsel</label>
                            <div>
                              <input name="phone" type="text" onChange={e => {handleNewAddress(e.target.name, e.target.value)}}/>
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
                            <div>
                              <input name="city" type="text" onChange={e => {handleNewAddress(e.target.name, e.target.value)}}/>
                            </div>
                          </div>
                        </div>
                        <div className={address.field_outer_container_onethird}>
                          <div className={address.field_inner_container}>
                            <label htmlFor="">Kode Pos</label>
                            <div>
                              <input name="postalcode" type="text" maxLength={5} onChange={e => {handleNewAddress(e.target.name, e.target.value)}}/>
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
                            <div>
                              <input name="address" type="text" onChange={e => {handleNewAddress(e.target.name, e.target.value)}}/>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            <div className={address.form_button_container}>
              <button onClick={()=>{setTambahAlamat(false)}}>
                <span>Batal</span>
              </button>
              <button style={{ marginLeft: "8px" }} className={address.green}>
                Simpan
              </button>
            </div>
            </div>
          </div>
        </Overlay>
        )}
        
      </div>
    </Layout>
  );
};
export default Address;
