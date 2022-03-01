import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import styles from "../../styles/register.module.scss";
import { useForm } from "react-hook-form";
import { redirect } from "next/dist/server/api-utils";
import Router from "next/router";
import { init, send } from "@emailjs/browser";
import { OTPGenerator } from "../../misc/otp";
import { useToasts } from "react-toast-notifications";
import InitFont from "../../components/initialize_font";


const SERVICE_ID = "service_egdaufp";
const TEMPLATE_ID = "template_fg0ncxa";

const Register: NextPage = () => {
  const { addToast } = useToasts();
  const { register, handleSubmit } = useForm();
  const [first, setFirst] = useState(true);
  const [second, setSecond] = useState(false);
  const [third, setThird] = useState(false);

  const [email, setEmail] = useState("");
  const [generatedOTP, setGeneratedOTP] = useState("");

  init("user_3FcFw9m04bwuTvX6TklJs");

  const REGISTER_QUERY = gql`
    mutation register($name: String!, $email: String!, $password: String!) {
      auth {
        register(input: { name: $name, email: $email, password: $password })
      }
    }
  `;

  function First() {
    async function sendMail(formData: any) {
      console.log("SendMailFunction")
      console.log(formData.email)
      console.log("email: " + email)
      var temp = OTPGenerator();
      setGeneratedOTP(temp);
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      
      if (re.test(formData.email)) {
        setEmail(formData.email);
        console.log("1 Original: " + generatedOTP)
        var templateParams = {
          email_reply: "winstonkcoding@gmail.com",
          email_destination: formData.email,
          otp_code: temp,
        };
        send(SERVICE_ID, TEMPLATE_ID, templateParams).then(
          function (response) {
            console.log("SUCCESS!", response.status, response.text);
            console.log("2 Original: " + generatedOTP)
            setSecond(true);
            setFirst(false);
          },
          function (error) {
            console.log("FAILED...", error);
          }
        );
      } else {
        addToast("Format email salah", { appearance: "error" });
      }
    }

    return (
      // {/* Register Body */}
      <div className={styles.body}>
        <div className={styles.login_image}>
          <Image
            src="/assets/login_image.png"
            alt="tohopedia logo"
            layout="fill"
          />
        </div>
        <section>
          <div className={styles.section_header}>
            <h3>Daftar</h3>
            <Link href="/login">
              <a>Masuk</a>
            </Link>
          </div>
          <div className={styles.section_body}>
            <form autoComplete="on" onSubmit={handleSubmit(sendMail)}>
              <div className={styles.label_fields_container}>
                <label htmlFor="email">Email</label>
                <div tabIndex={-1}>
                  <input type="email" {...register("email")} defaultValue={email}/>
                </div>
              </div>
              <button type="submit">
                <span>Daftar</span>
              </button>
            </form>
          </div>
        </section>
      </div>
      // {/* End Register Body */}
    );
  }

  function Second() {
    async function onChange(otpVal: any) {
      var otp = otpVal.target.value;

      if (otp.length == 6) {
        if (otp == generatedOTP) {
          setSecond(false);
          setThird(true);
        } else {
          addToast("Kode yang kamu masukkan salah", { appearance: "error" });
        }
      }
    }

    return (
      <div className={styles.body}>
        <div className={styles.login_image}>
          <Image
            src="/assets/login_image.png"
            alt="tohopedia logo"
            layout="fill"
          />
        </div>
        <section>
          <div className={styles.section_header}>
          <a className={styles.back_arrow} data-testid="back_arrow" onClick={InitializeFirst}>&nbsp;</a>
            <h3 className={styles.extra_margin}>Verification</h3>
          </div>
          <div className={styles.section_body}>
            <form autoComplete="on" onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.label_fields_container}>
                <label htmlFor="email">OTP</label>
                <div tabIndex={-1}>
                  <input
                    type="email"
                    maxLength={6}
                    onChange={(e) => onChange(e)}
                  />
                </div>
              </div>
            </form>
          </div>
        </section>
      </div>
    );
  }

  function InitializeFirst() {
    setFirst(true);
    setSecond(false);
    setThird(false);
  }

  function Third() {

    async function onSubmit(formData: any) {
      try {
        await getRegister({
          variables: {
            name: formData.name,
            email: email,
            password: formData.password,
          },
        }).then((data) => {
          
        });
        Router.push("/");
      } catch (error) {
        console.log(error);
      }
    }

    return (
      // {/* Register Body */}
      <div className={styles.body}>
        <div className={styles.login_image}>
          <Image
            src="/assets/login_image.png"
            alt="tohopedia logo"
            layout="fill"
          />
        </div>
        <section>
          <div className={styles.register_ending_header}>
            <a className={styles.back_arrow} data-testid="back_arrow" onClick={InitializeFirst}>&nbsp;</a>
            <h3>Daftar dengan Email </h3>
            <p>{email}</p>
          </div>
          <div className={styles.section_body}>
            <form autoComplete="on" onSubmit={handleSubmit(onSubmit)}>
              <div className={styles.label_fields_container}>
                <label htmlFor="name">Nama Lengkap</label>
                <div tabIndex={-1}>
                  <input type="text" {...register("name")} />
                </div>
              </div>

              <div className={styles.label_fields_container}>
                <label htmlFor="password">Kata Sandi</label>
                <div tabIndex={-1}>
                  <input type="password" {...register("password")} />
                </div>
              </div>
              <button type="submit">
                <span>Selesai</span>
              </button>
            </form>
          </div>
        </section>
      </div>
      // {/* End Register Body */}
    );
  }

  const [getRegister, { loading, error, data }] = useMutation(REGISTER_QUERY);

  async function onSubmit(formData: any) {
    try {
      await getRegister({
        variables: {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
      });
      Router.push("/");
    } catch (error) {
      console.log(error);
    }
  }

  if (data) {
    console.log(data);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Daftar / Register | Tohopedia</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <InitFont/>
      </Head>
      {/* <Navbar/> */}
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <Link href="/">
            <div>
              <Image
                src="/logo/tohopedia_logo.png"
                alt="tohopedia logo"
                layout="fill"
              />
            </div>
          </Link>
        </div>
        {first && First()}
        {second && Second()}
        {third && Third()}
      </div>
    </div>
  );
};

export default Register;
