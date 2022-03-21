import { useMutation, useQuery } from "@apollo/client";
import Image from "next/image";
import { DEFAULT_PROFILE_IMAGE } from "../../misc/global_constant";
import { GET_ALL_USER_QUERY } from "../../misc/global_query";
import AdminLayout from "./layout";
import styles from "./manage-user.module.scss";
import common from "../../styles/components/common.module.scss";
import { Button } from "../../components/Button/button";
import { useContext, useEffect, useState } from "react";
import { stateContext } from "../../services/StateProvider";
import { SUSPEND_USER_MUTATION } from "../../misc/global_mutation";
import { useToasts } from "react-toast-notifications";
import { RedLabel } from "../../components/transaction/TransactionStatus";

export default function ManageUser() {
  const { addToast } = useToasts();
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const {
    loading: load,
    error: err,
    data: allData,
  } = useQuery(GET_ALL_USER_QUERY, {
    variables: {
      limit: 9999999,
      offset: 0,
    },
  });
  const { loading, error, data } = useQuery(GET_ALL_USER_QUERY, {
    pollInterval: 2000,
    variables: {
      limit: limit,
      offset: offset,
    },
  });

  const [suspendUser] = useMutation(SUSPEND_USER_MUTATION);
  const { setPageTitle } = useContext(stateContext);

  var page = 1;
  var pages = 1;
  var nProd = allData?.users?.length;
  page = Math.ceil(offset / limit + 1);
  pages =
    nProd % limit == 0
      ? Math.floor(nProd / limit)
      : Math.floor(nProd / limit + 1);

  useEffect(() => {
    setPageTitle("Manage User | Tohopedia");
  }, [setPageTitle]);

  if (loading) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.container_wrapper}>
        <div className={styles.user_list_flex}>
          {data?.users?.map((user: any, index: number) => {
            return (
              <span key={index} className={styles.empty_span}>
                {user?.isAdmin === false ? (
                  <div className={styles.user_item_card}>
                    <div className={styles.user_profile_image}>
                      <div className={styles.user_profile_image_relative}>
                        <Image
                          src={
                            user?.image == ""
                              ? DEFAULT_PROFILE_IMAGE
                              : `/uploads/${user?.image}`
                          }
                          alt=""
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                    </div>
                    <div className={styles.user_detail_wrapper}>
                      <div className={styles.user_detail_left}>
                        <h1>{user?.name}</h1>
                        <span>{user?.email}</span>
                      </div>
                      {user?.requestUnsuspend === true ? (
                        <div className={styles.user_detail_right}>
                          <RedLabel text="Request for Unsuspend" />
                        </div>
                      ) : null}
                    </div>
                    {/* <button className={common.button_overlay}>
                      <span>
                        {user?.isSuspended === false
                          ? "Suspend User"
                          : "Unsuspend User"}
                      </span>
                        </button> */}

                    <div
                      className={styles.button_wrapper}
                      onClick={() => {
                        suspendUser({
                          variables: {
                            id: user?.id,
                            bool: !user?.isSuspended,
                          },
                        })
                          .then((data: any) => {
                            console.log(data);
                            addToast(
                              !user?.isSuspended === true
                                ? `Suspend ${user?.name} is successful`
                                : `Unsuspend ${user?.name} is successful`,
                              { appearance: "success" }
                            );
                          })
                          .catch((e: any) => {
                            addToast(
                              !user?.isSuspended === true
                                ? `Suspend ${user?.name} failed`
                                : `Unsuspend ${user?.name} failed`,
                              { appearance: "error" }
                            );
                          });
                      }}
                    >
                      {user?.isSuspended === false ? (
                        <Button warning={user?.isSuspended} disable={false}>
                          Suspend User
                        </Button>
                      ) : (
                        <Button warning={user?.isSuspended} disable={false}>
                          Unsuspend User
                        </Button>
                      )}
                    </div>
                  </div>
                ) : null}
              </span>
            );
          })}
        </div>
        <div className={styles.pagination_container}>
          <ul>
            {offset - 1 >= 0 && (
              <a onClick={() => setOffset(offset - limit)}>❮</a>
            )}
            {/* {page} */}
            {page + 1 <= pages && (
              <a
                onClick={() => {
                  setOffset(limit * page);
                }}
              >
                ❯
              </a>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

ManageUser.getLayout = function getLayout(page: any) {
  return <AdminLayout>{page}</AdminLayout>;
};
