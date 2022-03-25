import ReviewLayout from "../../layout";
import styles from "./input_review.module.scss";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { userDetailsContext } from "../../../../services/UserDataProvider";
import { stateContext } from "../../../../services/StateProvider";
import Router, { useRouter } from "next/router";
import { Transaction } from "../../../../models/Transaction";
import Link from "next/link";
import { toHourMinute, toIndonesianDateShort } from "../../../../misc/date";
import { RedLabel } from "../../../../components/transaction/TransactionStatus";
import { Button } from "../../../../components/Button/button";
import { TransactionDetail } from "../../../../models/TransactionDetail";
import { useToasts } from "react-toast-notifications";
import {
  Dropdown,
  DropdownItemList,
  DropdownItemProfile,
} from "../../../../components/Dropdown/dropdown";
import { User } from "../../../../models/User";
import { AnonymousNameConverter } from "../../../../misc/name";
import { Review } from "../../../../models/Review";

export default function InputReviewPage() {
  const router = useRouter();
  const { addToast } = useToasts();
  const [data, setData] = useState<TransactionDetail>();
  const { TransactionID, TransactionDetailID } = router.query;
  const { tabIndexSetting, setTabIndexSetting } = useContext(stateContext);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(5);
  const [desc, setDesc] = useState(5);
  const [tipsHidden, setTipsHidden] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [message, setMessage] = useState("");
  const [imagesDisplay, setImagesDisplay] = useState<
    (string | Blob | MediaSource)[]
  >([]);
  const [imageFiles, setImageFiles] = useState<(any)[]>([]);
  const ratingDesc = [
    "",
    "Sangat Buruk",
    "Buruk",
    "Cukup",
    "Baik",
    "Sangat Baik",
  ];

  const userData = useContext<User>(userDetailsContext);
  const transactionData =
    useContext<Transaction[]>(userDetailsContext)?.transactions;

  const [addReview] = useMutation(Review.ADD_REVIEW_MUTATION);
  useEffect(() => {
    setTabIndexSetting(0);
  }, []);

  function getTransaction(transactionID: string | string[] | undefined) {
    return transactionData?.filter((transaction: any) => {
      return transaction?.id === transactionID;
    })[0];
  }

  function getTransactionDetail(
    transactionID: string | string[] | undefined,
    transactionDetailID: string | string[] | undefined
  ) {
    return getTransaction(transactionID)?.details?.filter((detail: any) => {
      return detail?.id === transactionDetailID;
    })[0];
  }

  useEffect(() => {
    setData(getTransactionDetail(TransactionID, TransactionDetailID));
  }, [TransactionDetailID, TransactionID, transactionData]);

  function checkEmptyField(addressObj: any, key: string) {
    return addressObj[key].trim().length == 0;
  }
  if (!data) {
    return null;
  }

  const onImageChange = (event: any) => {
    if (event.target.files && event.target.files.length > 0) {
      let tempImagesDisplay: (string | Blob | MediaSource)[] = [
        ...imagesDisplay,
      ];
      let tempImageFiles: (FileList | File)[] = [...imageFiles];

      for (
        let index = 0;
        index < event.target.files.length && tempImagesDisplay.length <= 5;
        index++
      ) {
        if (tempImagesDisplay.length == 5) {
          addToast("Maximum 5 Images!", { appearance: "info" });
          break;
        }
        tempImagesDisplay.push(URL.createObjectURL(event.target.files[index]));
        tempImageFiles.push(event.target.files[index]);
      }

      setImagesDisplay(tempImagesDisplay);
      setImageFiles(tempImageFiles);
    }
  };

  const handleRemoveImage = (index: number) => {
    let tempImagesDisplay: (string | Blob | MediaSource)[] = [...imagesDisplay];
    tempImagesDisplay.splice(index, 1);
    setImagesDisplay(tempImagesDisplay);

    let tempImageFiles: (FileList | File)[] = [...imageFiles];
    tempImageFiles.splice(index, 1);
    setImageFiles(tempImageFiles);
  };

  const handleAddReview = async (shopId: string) => {
    let transactionDetailId = TransactionDetailID;
    let images = [];
    const body = new FormData();
    for (let index = 0; index < imageFiles.length; index++) {
      body.append(`file${index}`, imageFiles[index]);
    }
    let response = await fetch("/api/upload", {
      method: "POST",
      body,
    })
    let data = await response.json();
    images = data.map((d: any) => {
      return d.name;
    });

    addReview({
      variables: {
        transactionDetailId: transactionDetailId,
        shopId: shopId,
        rating: rating,
        message: message,
        anonymous: anonymous,
        images: images
      }
    }).then((data: any) => {
      addToast("Add Review Success!", { appearance: "success" })
      Router.back()
    }).catch((e) => {
      addToast("Add Review Failed!", {appearance: "error"})
    })
  };

  return (
    <div className={styles.container}>
      <button className={styles.back_button}>
        <div className={styles.back_image}>
          <div className={styles.back_image_relative}>
            <Image src={"/logo/icon_arrow_left.svg"} layout="fill" alt="" />
          </div>
        </div>
        <span
          onClick={() => {
            Router.back();
          }}
        >
          Kembali
        </span>
      </button>
      <div className={styles.transaction_wrapper}>
        <div className={styles.card_header}>
          <span>
            Penjual:
            <Link href={`/${data?.product?.shop?.slug}`}>
              {` ${data?.product?.shop?.name}`}
            </Link>
          </span>
          <div className={styles.timestamp}>
            Pesanan dibuat:{" "}
            {toIndonesianDateShort(data?.transaction?.date) +
              ", " +
              toHourMinute(data?.transaction?.date)}
          </div>
        </div>
        <div className={styles.card_body}>
          <div className={styles.card_body_inner}>
            <div className={styles.product_image}>
              <Image
                src={`/uploads/${data?.product?.images[0]?.image}`}
                alt=""
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className={styles.content}>
              <Link href={`/${data?.product?.shop?.slug}/${data?.product?.id}`}>
                {data?.product?.name}
              </Link>
              <fieldset>
                <legend>
                  Bagaimana kualitas produk ini secara keseluruhan?
                </legend>
                <div className={styles.rating_flex}>
                  <div>
                    {/* {[...Array(5)].map((star: any, index: number) => {
                      return ( */}
                    <input
                      type="radio"
                      name=""
                      id=""
                      className={
                        1 <= (hover || rating)
                          ? styles.rating_star_filled
                          : styles.rating_star_empty
                      }
                      onClick={() => {
                        setRating(1);
                        setDesc(1);
                      }}
                      onMouseEnter={() => {
                        setHover(1);
                        setDesc(1);
                      }}
                      onMouseLeave={() => {
                        setHover(rating);
                        setDesc(rating);
                      }}
                    />
                    <input
                      type="radio"
                      name=""
                      id=""
                      className={
                        2 <= (hover || rating)
                          ? styles.rating_star_filled
                          : styles.rating_star_empty
                      }
                      onClick={() => {
                        setRating(2);
                        setDesc(2);
                      }}
                      onMouseEnter={() => {
                        setHover(2);
                        setDesc(2);
                      }}
                      onMouseLeave={() => {
                        setHover(rating);
                        setDesc(rating);
                      }}
                    />
                    <input
                      type="radio"
                      name=""
                      id=""
                      className={
                        3 <= (hover || rating)
                          ? styles.rating_star_filled
                          : styles.rating_star_empty
                      }
                      onClick={() => {
                        setRating(3);
                        setDesc(3);
                      }}
                      onMouseEnter={() => {
                        setHover(3);
                        setDesc(3);
                      }}
                      onMouseLeave={() => {
                        setHover(rating);
                        setDesc(rating);
                      }}
                    />
                    <input
                      type="radio"
                      name=""
                      id=""
                      className={
                        4 <= (hover || rating)
                          ? styles.rating_star_filled
                          : styles.rating_star_empty
                      }
                      onClick={() => {
                        setRating(4);
                        setDesc(4);
                      }}
                      onMouseEnter={() => {
                        setHover(4);
                        setDesc(4);
                      }}
                      onMouseLeave={() => {
                        setHover(rating);
                        setDesc(rating);
                      }}
                    />
                    <input
                      type="radio"
                      name=""
                      id=""
                      className={
                        5 <= (hover || rating)
                          ? styles.rating_star_filled
                          : styles.rating_star_empty
                      }
                      onClick={() => {
                        setRating(5);
                        setDesc(5);
                      }}
                      onMouseEnter={() => {
                        setHover(5);
                        setDesc(5);
                      }}
                      onMouseLeave={() => {
                        setHover(rating);
                        setDesc(rating);
                      }}
                    />
                    {/* );
                    })} */}
                  </div>
                  <div className={styles.rating_description}>
                    {ratingDesc[desc]}
                  </div>
                </div>
              </fieldset>
              <div className={styles.review_content_wrapper}>
                <div className={styles.review_content_container}>
                  <div className={styles.review_text}>
                    <div className={styles.review_text_field}>
                      <label htmlFor="review-text">
                        Berikan ulasan untuk produk ini
                      </label>
                      <textarea
                        name=""
                        id=""
                        value={message}
                        placeholder="Tulis deskripsi Anda mengenai produk ini..."
                        onChange={(e) => {
                          setMessage(e.target.value);
                        }}
                      ></textarea>
                    </div>
                    <div className={styles.review_tips}>
                      <aside>
                        <div className={styles.title}>
                          <div className={styles.icon_bulb}></div>
                          <div className={styles.text}>Tips Menulis Ulasan</div>
                        </div>
                        <div
                          className={
                            tipsHidden === false
                              ? styles.content
                              : styles.content_hide
                          }
                        >
                          <ul className={styles.content_list}>
                            <li>
                              <p className={styles.title}>
                                Kesesuaian dengan deskripsi
                              </p>
                              <p>Cth: Ukuran dan warna sesuai dengan foto.</p>
                            </li>
                            <li>
                              <p className={styles.title}>
                                Fungsionalitas Produk
                              </p>
                              <p>Cth: Produk bekerja dengan baik & kuat</p>
                            </li>
                            <li>
                              <p className={styles.title}>
                                Keinginan merekomendasikan produk ini kepada
                                teman
                              </p>
                              <p>
                                Cth: Barang bagus, cepat sampai, recommended!
                              </p>
                            </li>
                          </ul>
                        </div>
                        <button
                          onClick={() => {
                            setTipsHidden(!tipsHidden);
                          }}
                        >
                          Sembunyikan
                        </button>
                      </aside>
                    </div>
                  </div>
                  <p className={styles.section}>
                    Bagikan foto-foto dari produk yang Anda terima
                  </p>
                  <ul className={styles.review_image_list}>
                    {imagesDisplay.map(
                      (image: any, index: number) => {
                        return (
                          <li key={index}>
                            <button>
                              <div className={styles.image_relative}>
                                <Image
                                  src={image}
                                  alt=""
                                  layout="fill"
                                  objectFit="cover"
                                />
                              </div>
                              <div className={styles.remove_wrapper}>
                                <div className={styles.remove_wrapper_static}>
                                  <div
                                    onClick={() => {
                                      handleRemoveImage(index);
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </button>
                          </li>
                        );
                      }
                    )}

                    <li>
                      <input
                        type="file"
                        id="upload-img"
                        accept="image/jpg,image/jpeg,image/png"
                        onChange={(event) => onImageChange(event)}
                        multiple
                      />
                      <label
                        htmlFor="upload-img"
                        className={styles.upload_image_label}
                      >
                        <span>Upload Image</span>
                        <div></div>
                      </label>
                    </li>
                  </ul>
                  <p className={styles.section}>Tampilkan sebagai</p>
                  <div className={styles.anonymous_field}>
                    <div className={styles.anonymous_wrapper}>
                      <Dropdown
                        selected={
                          anonymous === false ? (
                            <DropdownItemProfile
                              name={userData?.name}
                              image={`/uploads/${userData?.image}`}
                              desc={"Profil Anda dapat dilihat semua orang"}
                            />
                          ) : (
                            <DropdownItemProfile
                              name={AnonymousNameConverter(userData?.name)}
                              image={"/logo/icon_anonymous.png"}
                              desc={"Profil Anda hanya dapat dilihat penjual"}
                            />
                          )
                        }
                      >
                        <span
                          onClick={() => {
                            setAnonymous(false);
                          }}
                        >
                          <DropdownItemList
                            active={anonymous === false ? true : false}
                          >
                            <DropdownItemProfile
                              name={userData?.name}
                              image={`/uploads/${userData?.image}`}
                              desc={"Profil Anda dapat dilihat semua orang"}
                            />
                          </DropdownItemList>
                        </span>
                        <span
                          onClick={() => {
                            setAnonymous(true);
                          }}
                        >
                          <DropdownItemList
                            active={anonymous === true ? true : false}
                          >
                            <DropdownItemProfile
                              name={AnonymousNameConverter(userData?.name)}
                              image={"/logo/icon_anonymous.png"}
                              desc={"Profil Anda hanya dapat dilihat penjual"}
                            />
                          </DropdownItemList>
                        </span>
                      </Dropdown>
                    </div>
                  </div>
                  <div className={styles.action_wrapper}>
                    <div
                      onClick={() => {
                        handleAddReview(data?.product?.shop?.id);
                      }}
                    >
                      <Button disable={false} warning={false}>
                        Kirim
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.product_list}>
            <div className={styles.product_list_container}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

InputReviewPage.getLayout = function getLayout(page: any) {
  return <ReviewLayout>{page}</ReviewLayout>;
};
