import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React, {
  LegacyRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "../../styles/register.module.scss";
import { useForm } from "react-hook-form";
import Router from "next/router";
import { init, send } from "@emailjs/browser";
import { OTPGenerator } from "../../misc/otp";
import { useToasts } from "react-toast-notifications";
import { stateContext } from "../../services/StateProvider";
import { User } from "../../models/User";
import ReCAPTCHA from "react-google-recaptcha";

const SERVICE_ID = "service_egdaufp";
const TEMPLATE_ID = "template_fg0ncxa";

const Register: NextPage = () => {
  const { addToast } = useToasts();
  const { register, handleSubmit } = useForm();
  const [first, setFirst] = useState(true);
  const [second, setSecond] = useState(false);
  const [third, setThird] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  // const recaptchaRef = useRef();
  const recaptchaRef = React.createRef<ReCAPTCHA>();
  // const recaptchaRef = React.createRef<LegacyRef>();

  const [email, setEmail] = useState("");
  const [generatedOTP, setGeneratedOTP] = useState("");
  const { setPageTitle } = useContext(stateContext);

  useEffect(() => {
    setPageTitle("Daftar / Register | Tohopedia");
  }, [setPageTitle]);
  init("user_3FcFw9m04bwuTvX6TklJs");

  function First() {
    async function sendMail(formData: any) {
      if (formData.email == "") {
        addToast("Field harus diisi semua", { appearance: "error" });
      } else {
        let re =
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(formData.email) && recaptchaRef.current) {
          recaptchaRef.current.reset();
          recaptchaRef.current.execute();
          setEmail(formData.email);
        } else {
          addToast("Format email salah", { appearance: "error" });
        }
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
                  <input
                    type="email"
                    {...register("email")}
                    defaultValue={email}
                  />
                </div>
              </div>
              <button type="submit">
                <span>Daftar</span>
              </button>
              <ReCAPTCHA
                sitekey={"6Lfav-4eAAAAAJQ54m1cgb9vy5lRdmP3T_xFViCj"}
                // sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                size="invisible"
                ref={recaptchaRef}
                onChange={onReCAPTCHAChange}
              />
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
            <a
              className={styles.back_arrow}
              data-testid="back_arrow"
              onClick={InitializeFirst}
            >
              &nbsp;
            </a>
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

  const onReCAPTCHAChange = async (captchaCode: any) => {
    // If the reCAPTCHA code is null or undefined indicating that
    // the reCAPTCHA was expired then return early
    if (!captchaCode) {
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({ email: email, captcha: captchaCode }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        // If the response is ok than show the success alert
        var temp = OTPGenerator();
        setGeneratedOTP(temp);
        var templateParams = {
          email_reply: "winstonkcoding@gmail.com",
          email_destination: email,
          otp_code: temp,
        };
        send(SERVICE_ID, TEMPLATE_ID, templateParams).then(
          function (response) {
            setSecond(true);
            setFirst(false);
          },
          function (error) {
            addToast("Error send email!", { appearance: "error" });
          }
        );
      } else {
        // Else throw an error with the message returned
        // from the API
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error: any) {
      addToast(error?.message || "Something went wrong", {
        appearance: "error",
      });
    } finally {
      // Reset the reCAPTCHA when the request has failed or succeeeded
      // so that it can be executed again if user submits another email.
      // recaptchaRef.current.reset();
    }
  };

  function Third() {
    async function onSubmit(formData: any) {
      try {
        await getRegister({
          variables: {
            name: formData.name,
            email: email,
            password: formData.password,
          },
        }).then((data) => {});
        Router.push("/login");
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
            <a
              className={styles.back_arrow}
              data-testid="back_arrow"
              onClick={InitializeFirst}
            >
              &nbsp;
            </a>
            <h3>Daftar dengan Email </h3>
            <p>{email}</p>
          </div>
          <div className={styles.section_body}>
            <form autoComplete="on" onSubmit={handleSubmit(onSubmit)}>
              <ReCAPTCHA
                sitekey={"6Lfav-4eAAAAAJQ54m1cgb9vy5lRdmP3T_xFViCj"}
                // sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                ref={recaptchaRef}
                size="invisible"
                onChange={onReCAPTCHAChange}
              />
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

  const [getRegister, { loading, error, data }] = useMutation(
    User.REGISTER_MUTATION
  );

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

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/" passHref>
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
  );
};

export default Register;
