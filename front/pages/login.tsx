import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import Navbar from "../components/navbar";
import styles from "../styles/login.module.scss";
import { useForm } from "react-hook-form";
import { redirect } from "next/dist/server/api-utils";
import Router, { useRouter } from "next/router";
import { checkCookies, setCookies } from "cookies-next";
import { useToasts } from "react-toast-notifications";
import { stateContext } from "../services/StateProvider";
import { Button } from "../components/Button/button";
import { REQUEST_UNSUSPEND_USER_MUTATION } from "../misc/global_mutation";

const Login: NextPage = () => {
  const { addToast } = useToasts();
  const { register, handleSubmit } = useForm();
  const [suspend, setSuspend] = useState(false);
  const [userId, setUserId] = useState("");
  const { setPageTitle } = useContext(stateContext);

  useEffect(() => {
    setPageTitle("Masuk / Login | Tohopedia");
  }, [setPageTitle]);
  var element = "";
  const router = useRouter();

  const LOGIN_MUTATION = gql`
    mutation auth($email: String!, $password: String!) {
      auth {
        login(email: $email, password: $password)
      }
    }
  `;

  const [requestUnsuspend] = useMutation(REQUEST_UNSUSPEND_USER_MUTATION);
  const [getLogin, { loading, error, data }] = useMutation(LOGIN_MUTATION);

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
            if (data.data.auth.login.isSuspended === true) {
              addToast("You are suspended", { appearance: "warning" });
              setUserId(data.data.auth.login.userId);
              setSuspend(true);
            } else {
              setCookies("tokenid", data.data.auth.login.token);
              const returnUrl = router.query.returnUrl || "/";
              router.push(returnUrl);
            }
          })
          .catch((error: any) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
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
          {suspend === false ? (
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
                    <Link href={"/reset-password"}>
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
                  }).then(() => {
                    addToast("Your Request Is Successful!", {appearance: "success"})
                  }).catch((e: any) => {
                    addToast("Your Request Is Failed!", {appearance: "error"})
                  });
                  
                }}
              >
                <Button warning={false}>Request Unsuspend</Button>
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
