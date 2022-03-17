import { useMutation } from "@apollo/client";
import type { NextPage } from "next";
import { useContext, useEffect, useState } from "react";
import styles from "../../../styles/login.module.scss";
import Router, { useRouter } from "next/router";
import { useToasts } from "react-toast-notifications";
import { stateContext } from "../../../services/StateProvider";
import { VERIFY_EMAIL_MUTATION } from "../../../misc/global_mutation";
import { DefaultError } from "../../../components/error";

const EmailVerification: NextPage = () => {
  const { addToast } = useToasts();
  const router = useRouter();
  const [notValid, setNotValid] = useState(false);
  const { setPageTitle } = useContext(stateContext);
  const { TokenEmailID } = router.query;
  useEffect(() => {
    setPageTitle("Email Verification | Tohopedia");
  }, [setPageTitle]);

  const [verifyEmail, { loading, error, data }] = useMutation(
    VERIFY_EMAIL_MUTATION
  );

  useEffect(() => {
    if (TokenEmailID !== undefined && TokenEmailID !== "") {
      verifyEmail({
        variables: {
          id: TokenEmailID,
        },
      })
        .then((data: any) => {
          if (data?.data?.verifyEmailAddress === true) {
            addToast("Email has been successfully verified", {
              appearance: "success",
            });
            // const returnUrl = router.query.returnUrl || "/";
            // router.push(returnUrl);
            router.push('/user/settings')
          } else {
              setNotValid(true)
            addToast("Email Is Verified or Token Doesn't Exist", {
              appearance: "warning",
            });
          }
        })
        .catch(() => {
          addToast("Error", { appearance: "error" });
        });
    }
  }, [TokenEmailID]);

  return (
    <div className={styles.container}>
      {notValid ? (
        <DefaultError
          header="Email Is Verified or Token Doesn't Exist"
          text="Silahkan cek kembali linknya"
        />
      ) : null}
    </div>
  );
};

export default EmailVerification;
