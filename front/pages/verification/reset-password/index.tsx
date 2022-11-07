import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import styles from "../../../styles/login.module.scss";
import { useForm } from "react-hook-form";
import { redirect } from "next/dist/server/api-utils";
import Router, { useRouter } from "next/router";
import { checkCookies, setCookies } from "cookies-next";
import { useToasts } from "react-toast-notifications";
import { stateContext } from "../../../services/StateProvider";
import { Button } from "../../../components/Button/button";
import { init, send } from "@emailjs/browser";

const SERVICE_ID = "service_egdaufp";
const TEMPLATE_ID = "template_fg0ncxa";

const ResetPassword: NextPage = () => {
  const { addToast } = useToasts();
  const { register, handleSubmit } = useForm();
  const [email, setEmail] = useState("");
  const { setPageTitle } = useContext(stateContext);
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  init("user_3FcFw9m04bwuTvX6TklJs");

  useEffect(() => {
    setPageTitle("Reset Password | Tohopedia");
  }, [setPageTitle]);
  const router = useRouter();

  const CREATE_PASSWORD_TOKEN_MUTATION = gql`
    mutation createPasswordToken($email: String!) {
      createPasswordToken(email: $email) {
        id
      }
    }
  `;

  const [createPasswordToken] = useMutation(CREATE_PASSWORD_TOKEN_MUTATION);

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
          <div className={styles.suspend_container} style={{minHeight: "unset"}}>
            <h1></h1>
            <div className={styles.label_fields_container}>
              <label htmlFor="email">Email</label>
              <div tabIndex={-1}>
                <input
                  type="email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
            </div>
            <div
              onClick={() => { re.test(email) ? 
                createPasswordToken({
                  variables: {
                    email: email,
                  },
                })
                  .then((d: any) => {
                    var templateParams = {
                      email_reply: "winstonkcoding@gmail.com",
                      email_destination: email,
                      otp_code: `http://localhost:3000/verification/reset-password/${d?.data?.createPasswordToken?.id}`,
                    };
                    send(SERVICE_ID, TEMPLATE_ID, templateParams).then(
                      function (response) {
                        addToast(
                          "Please check your email to continue the process!",
                          {
                            appearance: "success",
                          }
                        );
                      },
                      function (error) {
                        addToast("Error Sending Email", {
                          appearance: "error",
                        });
                      }
                    );
                  })
                  .catch((e: any) => {
                    addToast("Request failed!", {
                      appearance: "error",
                    });
                  }) : null
              }}
            >
              <Button warning={false} disable={re.test(email) ? false : true}>Reset Password</Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ResetPassword;
