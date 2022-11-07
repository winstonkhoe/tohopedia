import { NextPage } from "next";
import Layout from "./layout";
import styles from "./authentication.module.scss";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { userDetailsContext } from "../../../services/UserDataProvider";
import { useToasts } from "react-toast-notifications";
import { User } from "../../../models/User";
import { DEFAULT_PROFILE_IMAGE } from "../../../misc/global_constant";
import { Button } from "../../../components/Button/button";
import { stateContext } from "../../../services/StateProvider";

export default function BioData() {
  const { addToast } = useToasts();

  const userData: User = useContext<User>(userDetailsContext);
  const { tabIndexSetting, setTabIndexSetting } = useContext(stateContext);

  const [updateAuthentication] = useMutation(
    User.UPDATE_USER_AUTHENTICATION_MUTATION
  );

  useEffect(() => {
    setTabIndexSetting(2)
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.biodata_container}>
        <div className={styles.profile_image_container}>
          <section className={styles.profile_image_section}>
            <picture>
              <div>
                <Image
                  src={"/assets/2fa-illustration.jpg"}
                  // src={"/assets/authentication.png"}
                  alt=""
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </picture>
            <span
              onClick={() => {
                updateAuthentication({
                  variables: {
                    verification: userData?.verification == 0 ? 1 : 0,
                  },
                })
                  .then((d) => {
                    addToast("Successfully Update 2FA", {
                      appearance: "success",
                    });
                  })
                  .catch((e) => {
                    addToast("Successfully Update 2FA", {
                      appearance: "error",
                    });
                  });
              }}
            >
              <Button
                warning={userData?.verification == 0 ? false : true}
                disable={false}
              >
                {userData?.verification == 0 ? "Enable" : "Disable"} 2FA
              </Button>
            </span>
          </section>
        </div>
      </div>
      <div></div>
    </div>
  );
}

BioData.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};
