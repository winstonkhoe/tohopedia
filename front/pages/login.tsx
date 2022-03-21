import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import styles from "../styles/login.module.scss";
import { useForm } from "react-hook-form";
import Router, { useRouter } from "next/router";
import { checkCookies, setCookies } from "cookies-next";
import { useToasts } from "react-toast-notifications";
import { stateContext } from "../services/StateProvider";
import { Button } from "../components/Button/button";
import { REQUEST_UNSUSPEND_USER_MUTATION } from "../misc/global_mutation";
import { User } from "../models/User";
import { init, send } from "@emailjs/browser";
import { OTPGenerator } from "../misc/otp";

const SERVICE_ID = "service_egdaufp";
const TEMPLATE_ID = "template_fg0ncxa";

const Login: NextPage = () => {
  const { addToast } = useToasts();
  const { register, handleSubmit } = useForm();
  const [suspend, setSuspend] = useState(false);
  const [userId, setUserId] = useState("");
  const [otp, setOTP] = useState("");
  const [token, setToken] = useState("");
  const [typedOTP, setTypedOTP] = useState("");
  const [fillOTP, setFillOTP] = useState(false);
  const { setPageTitle } = useContext(stateContext);

  init("user_3FcFw9m04bwuTvX6TklJs");

  useEffect(() => {
    setPageTitle("Masuk / Login | Tohopedia");
  }, [setPageTitle]);
  const router = useRouter();

  const [requestUnsuspend] = useMutation(REQUEST_UNSUSPEND_USER_MUTATION);
  const [getLogin] = useMutation(User.LOGIN_MUTATION);

  async function onSubmit(formData: any) {
    if (formData.email == "" || formData.password == "") {
      addToast("Field harus diisi semua", { appearance: "error" });
    } else {
      try {
        getLogin({
          variables: {
            email: formData.email,
            password: formData.password,
          },
        })
          .then((data: any) => {
            console.log(data.data)
            setToken(data.data.auth.login.token);
            if (data.data.auth.login.isSuspended === true) {
              addToast("You are suspended", { appearance: "warning" });
              setUserId(data.data.auth.login.userId);
              setSuspend(true);
            } else {
              if (data.data.auth.login.authentication === 0) {
                setCookies("tokenid", data.data.auth.login.token);
                router.push("/").then(() => router.reload());
              } else if(data.data.auth.login.authentication === 1) {
                let otpTemp = OTPGenerator();
                setOTP(otpTemp);
                var templateParams = {
                  email_reply: "winstonkcoding@gmail.com",
                  email_destination: data.data.auth.login.email,
                  otp_code: otpTemp,
                };
                send(SERVICE_ID, TEMPLATE_ID, templateParams).then(
                  function (response) {
                    addToast(
                      "Please check your email to continue the process!",
                      {
                        appearance: "success",
                      }
                    );
                    setFillOTP(true);
                  },
                  function (error) {
                    addToast("Error Sending Email", {
                      appearance: "error",
                    });
                  }
                );
              }
            }
          })
          .catch((error: any) => {
            addToast("Invalid Credentials!", { appearance: "error" });
          });
      } catch (error) {
        console.log(error);
      }
    }
  }

  const handle2FA = () => {};

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
              priority
            />
          </div>
        </Link>
      </div>

      {/* Login Body */}
      <div className={styles.body}>
        <div className={styles.login_image}>
          <Image
            src="/assets/login_image.png"
            alt="tohopedia logo"
            layout="fill"
            priority
          />
        </div>
        <section>
          {fillOTP === true ? (
            <div className={styles.suspend_container}>
              <h1>Authentication 2FA</h1>
              <div className={styles.label_fields_container}>
                <label htmlFor="name">OTP</label>
                <div tabIndex={-1}>
                  <input
                    type="text"
                    onChange={(e) => setTypedOTP(e.target.value)}
                  />
                </div>
              </div>
              <div
                onClick={() => {
                  if (typedOTP === otp && typedOTP !== "") {
                    setCookies("tokenid", token);
                    addToast("Login Success!", { appearance: "success" });
                    router.push("/").then(() => router.reload());
                  } else if (typedOTP !== "" && typedOTP !== otp) {
                    addToast("Invalid OTP!", { appearance: "error" });
                  }
                }}
              >
                <Button
                  disable={
                    typedOTP !== "" && typedOTP.length === 6 ? false : true
                  }
                  warning={false}
                >
                  Login
                </Button>
              </div>
            </div>
          ) : suspend === false ? (
            <>
              <div className={styles.section_header}>
                <h3>Masuk</h3>
                <Link href="/register/user">
                  <a>Daftar</a>
                </Link>
              </div>
              <div className={styles.section_body}>
                <form autoComplete="on" onSubmit={handleSubmit(onSubmit)}>
                  <div className={styles.label_fields_container}>
                    <label htmlFor="email">Email</label>
                    <div tabIndex={-1}>
                      <input type="email" {...register("email")} />
                    </div>
                  </div>

                  <div className={styles.label_fields_container}>
                    <label htmlFor="email">Kata Sandi</label>
                    <div tabIndex={-1}>
                      <input type="password" {...register("password")} />
                    </div>
                  </div>

                  {/* Ingat Saya && Lupa kata sandi */}
                  <div className={styles.remember_forget_container}>
                    {/* Remember Me */}
                    <div>
                      <div className={styles.remember_me}>
                        <label htmlFor="remember-me">
                          <input type="checkbox" name="" id="remember_me" />
                          <span></span>
                        </label>
                      </div>
                      <span>Ingat Saya</span>
                    </div>
                    <Link href={"/verification/reset-password"}>
                      <p className={styles.link_text}>Reset Password</p>
                    </Link>
                  </div>
                  <button type="submit">
                    <span>Masuk</span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className={styles.suspend_container}>
              <h1>You Are Suspended!</h1>
              <div
                onClick={() => {
                  requestUnsuspend({
                    variables: {
                      id: userId,
                    },
                  })
                    .then(() => {
                      addToast("Your Request Is Successful!", {
                        appearance: "success",
                      });
                    })
                    .catch((e: any) => {
                      addToast("Your Request Is Failed!", {
                        appearance: "error",
                      });
                    });
                }}
              >
                <Button disable={false} warning={false}>
                  Request Unsuspend
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>
      {/* End Login Body */}
    </div>
  );
};

export default Login;
