import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import styles from "../../styles/registerSeller.module.scss";
import { useForm } from "react-hook-form";
import { redirect } from "next/dist/server/api-utils";
import Router from "next/router";
import InitFont from "../../components/initialize_font";
import Footer from "../../components/Footer/Footer";
import { stateContext } from "../../services/StateProvider";

const Register: NextPage = () => {
  const { register, handleSubmit } = useForm();
  const [result, setResult] = useState("");
  const { setPageTitle } = useContext(stateContext);

  useEffect(() => {
    setPageTitle("Situs Jual Beli Online Terlengkap, Mudah & Aman | Tohopedia");
  }, [setPageTitle]);
  
  const SHOP_REGISTER_QUERY = gql`
    mutation register(
      $name: String!
      $slug: String!
      $phone: String!
      $city: String!
      $postalCode: String!
      $address: String!
    ) {
      openShop(
        input: {
          name: $name
          slug: $slug
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

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {}, 3000);

    return () => clearTimeout(delayDebounceFn);
  });

  const [getRegister, { loading, error, data }] = useMutation(SHOP_REGISTER_QUERY);

  async function onSubmit(formData: any) {
    try {
      await getRegister({
        variables: {
          name: formData.name,
          slug: formData.slug,
          phone: formData.phone,
          city: formData.city,
          postalCode: formData.postalCode,
          address: formData.address,
        }
      });
      Router.push("/");
    } catch (error) {
      console.log(error);
    }
  }


  return (
      <div className={styles.container}>
        {/* Sisi Kiri */}
        <div className={styles.container_left}>
          {/* Sisi Kiri - Atas */}
          <div>
            <h2>Nama toko yang unik, selalu terlihat menarik</h2>
            <p>
              Gunakan nama yang singkat dan sederhana agar tokomu mudah dingat
              pembeli.
            </p>
          </div>

          {/* Sisi Kiri - Bawah */}
          <div className={styles.container_left_image}>
            <Image
              src="/assets/shop_register_image.png"
              alt="Nama toko yang unik, selalu terlihat menarik"
              // layout="fill"
              width={360}
              height={270}
            />
          </div>
        </div>

        {/* Login Body */}
        <div className={styles.container_right}>
          <div className={styles.container_right_inner}>
            <p>
              Halo, <b>Winston</b> ayo isi detail tokomu!
            </p>

            {/* Step1. HP */}
            {/* <div className={styles.register_seller_hp}> */}

            {/* Step1. HP - Atas */}
            {/* <div className={styles.register_seller_hp_top}> */}

            {/* <div className={styles.register_seller_hp_top_label}>
                <div>
                  <Image
                  src="/logo/centang_slim.svg"
                  alt="Nama toko yang unik, selalu terlihat menarik"
                  layout="fill"
                  />
                </div>
              </div> */}

            {/* <h4>Masukkan No. HP-mu</h4> */}
            {/* </div> */}

            {/* Step1. HP - Bawah */}
            {/* <div className={styles.register_seller_hp_bottom}>
              <p>+62 813 15174786</p>
            </div> */}

            {/* </div> */}
            {/* END Step1. HP */}

            {/* Step2. Toko, Domain */}
            <div className={styles.register_seller_nama}>
              {/* Step2. Toko, Domain - Atas */}
              <div className={styles.register_seller_hp_top}>
                {/* <div className={styles.register_seller_hp_top_label}>

              </div> */}
                {/* <h4>Masukan Nama Toko dan Domain</h4> */}
              </div>

              {/* Step2. Toko, Domain - Bawah */}
              <div className={styles.register_seller_nama_bottom}>
                <form action="" onSubmit={handleSubmit(onSubmit)}>
                  {/* Nama Toko */}
                  <div>
                    <label htmlFor="">Masukkan No. HP-mu</label>
                    <div
                      className={styles.register_seller_nama_input_container}
                    >
                      <div>
                        <input type="text" maxLength={60} {...register("phone")} />
                      </div>
                    </div>
                  </div>
                  {/* END Nama Toko */}

                  {/* Nama Toko */}
                  <div>
                    <label htmlFor="">Nama Toko</label>
                    <div
                      className={styles.register_seller_nama_input_container}
                    >
                      <div>
                        <input
                          type="text"
                          maxLength={60}
                          {...register("name")}
                        />
                      </div>
                    </div>
                  </div>
                  {/* END Nama Toko */}

                  {/* Nama Toko */}
                  <div>
                    <label htmlFor="">Domain</label>
                    <div
                      className={styles.register_seller_nama_input_container}
                    >
                      <div>
                        <input
                          type="text"
                          maxLength={60}
                          {...register("slug")}
                        />
                      </div>
                    </div>
                  </div>
                  {/* END Nama Toko */}
                  
                  {/* City Toko */}
                  <div>
                    <label htmlFor="">City</label>
                    <div
                      className={styles.register_seller_nama_input_container}
                    >
                      <div>
                        <input
                          type="text"
                          maxLength={20}
                          {...register("city")}
                        />
                      </div>
                    </div>
                  </div>
                  {/* END City Toko */}

                  {/* Address Toko */}
                  <div>
                    <label htmlFor="">Address</label>
                    <div
                      className={styles.register_seller_nama_input_container}
                    >
                      <div>
                        <input
                          type="text"
                          maxLength={60}
                          {...register("address")}
                        />
                      </div>
                    </div>
                  </div>
                  {/* END Address Toko */}

                  {/* Postal Code Toko */}
                  <div>
                    <label htmlFor="">Postal Code</label>
                    <div
                      className={styles.register_seller_nama_input_container}
                    >
                      <div>
                        <input
                          type="text"
                          maxLength={20}
                          {...register("postalCode")}
                        />
                      </div>
                    </div>
                  </div>
                  {/* END Postal Code Toko */}
                  <button type="submit" className={styles.button_daftar}>
                    <span>Daftar</span>
                  </button>
                </form>
              </div>
            </div>
            {/* END Step2. Toko, Domain */}
          </div>
        </div>
        {/* End Login Body */}
      </div>
  );
};

export default Register;
