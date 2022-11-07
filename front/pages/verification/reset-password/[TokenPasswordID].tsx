import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import styles from "../../../styles/login.module.scss";
import Router, { useRouter } from "next/router";
import { useToasts } from "react-toast-notifications";
import { stateContext } from "../../../services/StateProvider";
import { Button } from "../../../components/Button/button";
import { DefaultError, ErrorNotFound } from "../../../components/error";

const ResetPasswordFill: NextPage = () => {
  const router = useRouter();
  const { addToast } = useToasts();
  const { TokenPasswordID } = router.query;
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const { setPageTitle } = useContext(stateContext);

  useEffect(() => {
    setPageTitle("Reset Password | Tohopedia");
  }, [setPageTitle]);

  const GET_PASSWORD_TOKEN_QUERY = gql`
    query getPasswordToken($id: ID!) {
      getPasswordToken(id: $id) {
        id
        email
        redeemed
        __typename
        validTo
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_PASSWORD_TOKEN_QUERY, {
    variables: {
      id: TokenPasswordID,
    },
  });

  const UPDATE_USER_PASSWORD_MUTATION = gql`
    mutation updateUserPassword($email: String!, $password: String!) {
      updateUserPassword(email: $email, password: $password) {
        id
      }
    }
  `;

  const [updatePassword] = useMutation(UPDATE_USER_PASSWORD_MUTATION);

  if (loading) {
    return null;
  }

  if (
    data !== undefined &&
    new Date().getTime() > new Date(data?.getPasswordToken?.validTo).getTime()
  ) {
    return (
      <DefaultError
        header="Token Expired!"
        text="Ayo Request Ulang!"
        href={"/verification/reset-password"}
      />
    );
  }

  if (error) {
    return <ErrorNotFound />;
  }

  const handleUpdatePassword = () => {
    new Date().getTime() > new Date(data?.getPasswordToken?.validTo).getTime();
    if (password === cPassword && password !== "") {
      if (
        new Date().getTime() >
        new Date(data?.getPasswordToken?.validTo).getTime()
      ) {
        addToast("Token has expired!", {
          appearance: "error",
        });
      } else {
        updatePassword({
          variables: {
            email: data?.getPasswordToken?.email,
            password: password,
          },
        })
          .then((d: any) => {
            addToast("Reset Password Is Successful!", {
              appearance: "success",
            });
            Router.push("/login");
          })
          .catch((e: any) => {
            addToast("Reset Password Failed!", {
              appearance: "error",
            });
          });
      }
    }
  };

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
          <div
            className={styles.suspend_container}
            style={{ minHeight: "unset" }}
          >
            <div className={styles.label_fields_container}>
              <label htmlFor="email">Password</label>
              <div tabIndex={-1}>
                <input
                  type="password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className={styles.label_fields_container}>
              <label htmlFor="email">Confirm Password</label>
              <div tabIndex={-1}>
                <input
                  type="password"
                  onChange={(e) => {
                    setCPassword(e.target.value);
                  }}
                />
              </div>
            </div>
            <div
              onClick={() => {
                handleUpdatePassword();
              }}
            >
              <Button
                warning={false}
                disable={
                  cPassword === password && password !== "" ? false : true
                }
              >
                Reset Password
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ResetPasswordFill;
