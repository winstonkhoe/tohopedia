import SellerLayout from "../layout";
import styles from "../add-product.module.scss";
import { useForm } from "react-hook-form";
import { useContext, useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { gql, useMutation, useQuery } from "@apollo/client";
import { userDetailsContext } from "../../../services/UserDataProvider";
import Shop from "../../../models/Shop";
import { DEFAULT_PROFILE_IMAGE } from "../../../misc/global_constant";
import Image from "next/image";
import ReactSwitch from "react-switch";

export default function SellerSettings() {
  const { addToast } = useToasts();
  const { register: updateStoreForm, handleSubmit: handleUpdateStore } =
    useForm();
  const [descriptionLength, setDescriptionLength] = useState(0);
  const [profileImage, setProfileImage] = useState(DEFAULT_PROFILE_IMAGE);
  const [profileImageChosen, setProfileImageChosen] = useState();
  const [openTime, setOpenTime] = useState("08:00");
  const [closeTime, setCloseTime] = useState("18:00");
  const storeData = useContext<Shop>(userDetailsContext)?.shop;
  const [statusToko, setStatusToko] = useState(false);

  const UPDATE_STORE_MUTATION = gql`
    mutation editShop(
      $id: ID!
      $name: String!
      $image: String
      $slug: String!
      $description: String
      $slogan: String
      $openTime: Time!
      $closeTime: Time!
      $isOpen: Boolean!
    ) {
      editShop(
        id: $id
        name: $name
        image: $image
        slug: $slug
        description: $description
        slogan: $slogan
        openTime: $openTime
        closeTime: $closeTime
        isOpen: $isOpen
      ) {
        id
      }
    }
  `;

  useEffect(() => {
    if (storeData?.image !== undefined && storeData?.image !== "") {
      setProfileImage(`/uploads/${storeData?.image}`)
    }
  }, [storeData?.image])

  const [
    mutationEditShop,
    { loading: editShopLoading, error: editShopError, data: editShopData },
  ] = useMutation(UPDATE_STORE_MUTATION);

  const onImageChange = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      setProfileImage(URL.createObjectURL(event.target.files[0]));
      setProfileImageChosen(event.target.files[0]);
    }
  };

  const handleOperasionalChange = (nextChecked: boolean) => {
    setStatusToko(nextChecked);
  };

  function TimeToHourMinute(timeString: string) {
    // 2022-02-17T15:00:00+07:00
    // get the [15:00:00+07:00]
    try {
      let timeAndArea = timeString.split("T")[1];
      return timeAndArea.split("+")[0];
    } catch (error) {
      return "";
    }
  }

  async function onSubmit(formData: any) {
    let name = formData.name.trim();
    let slug = formData.slug.trim();
    let slogan = formData.slogan.trim();
    let description = formData.description.trim();

    let nowDate = new Date().toDateString();
    let shopOpenDate = storeData?.openTime.split("T")[0];
    let tempOperationalHour = {
      openTime: new Date(nowDate + " " + formData.openTime),
      closeTime: new Date(nowDate + " " + formData.closeTime),
    };
    let finalOperationalHour = {
      openTime: new Date(shopOpenDate + " " + formData.openTime),
      closeTime: new Date(shopOpenDate + " " + formData.closeTime),
    };

    let status = statusToko;
    let image;
    let images = [];

    let listFields = [name, slug];
    let successValidation = true;
    for (let index = 0; index < listFields.length; index++) {
      if (listFields[index] == "") {
        successValidation = false;
        break;
      }
    }

    if (!successValidation) {
      addToast("Name and Domain cannot be empty", { appearance: "error" });
      return;
    } else {
      if (
        tempOperationalHour.openTime.getTime() >
        tempOperationalHour.closeTime.getTime()
      ) {
        addToast("Close Time cannot be earlier than Open Time", {
          appearance: "error",
        });
        return;
      } else {
        if (profileImageChosen) {
          const body = new FormData();

          body.append(`file0`, profileImageChosen);

          let response = await fetch("/api/upload", {
            method: "POST",
            body,
          });

          let data = await response.json();
          images = data.map((d: any) => {
            return d.name;
          });
        }

        if (images.length > 0) {
          image = images[0];
        } else {
          image = storeData?.image;
        }

        try {
          await mutationEditShop({
            variables: {
              id: storeData?.id,
              name: name,
              image: image,
              slug: slug,
              description: description,
              slogan: slogan,
              openTime: finalOperationalHour.openTime,
              closeTime: finalOperationalHour.closeTime,
              isOpen: statusToko,
            },
          });
        } catch (error) {}
      }
    }
  }

  function handleDescription(event: any) {
    setDescriptionLength(event.target.value.length);
  }

  return (
    <div className={styles.add_product_container}>
      <div className={styles.add_product_header}>
        <h3>Setting</h3>
      </div>
      <form action="" onSubmit={handleUpdateStore(onSubmit)}>
        <section>
          <span className={styles.input_row_container}>
            <div className={styles.input_info_container}>
              <div className={styles.input_container}>
                <div className={styles.input_label}>
                  <h4>Nama Toko</h4>
                </div>
                <div className={styles.input_box}>
                  <input
                    type="text"
                    {...updateStoreForm("name")}
                    defaultValue={storeData.name ? storeData.name : ""}
                  />
                </div>
              </div>
            </div>
          </span>

          <span className={styles.input_row_container}>
            <div className={styles.input_info_container}>
              <div className={styles.input_container}>
                <div className={styles.input_label}>
                  <h4>Profile Toko</h4>
                </div>
                <div className={styles.input_box_label_container}>
                  <div className={styles.picture_container}>
                    <div className={styles.image_layout}>
                      <Image
                        src={profileImage}
                        alt="Profile Picture"
                        layout="fill"
                        objectFit="cover"
                      ></Image>
                      {/* <Image src={'/assets/login_image.png'} alt="Profile Picture" width={200} height={200} layout="responsive" objectFit="cover"></Image> */}
                    </div>
                  </div>
                  <div className={styles.input_box}>
                    <input
                      name="profileImage"
                      type="file"
                      accept="image/jpeg, image/jpg, image/x-png, image/png"
                      onChange={(event) => onImageChange(event)}
                      // {...register("image")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </span>

          <span className={styles.input_row_container}>
            <div className={styles.input_info_container}>
              <div className={styles.input_container}>
                <div className={styles.input_label}>
                  <h4>Domain</h4>
                </div>
                <div className={styles.input_box}>
                  <input
                    type="text"
                    {...updateStoreForm("slug")}
                    defaultValue={storeData?.slug}
                  />
                </div>
              </div>
            </div>
          </span>

          <span className={styles.input_row_container}>
            <div className={styles.input_info_container}>
              <div className={styles.input_container}>
                <div className={styles.input_label}>
                  <h4>Slogan Toko</h4>
                </div>
                <div className={styles.input_box}>
                  <input
                    type="text"
                    {...updateStoreForm("slogan")}
                    defaultValue={storeData?.slogan}
                  />
                </div>
              </div>
            </div>
          </span>

          <span className={styles.input_row_container}>
            <div className={styles.input_info_container}>
              <div className={styles.input_container}>
                <div className={styles.input_label}>
                  <h4>Deskripsi Toko</h4>
                </div>
                <div className={styles.input_box_textarea}>
                  {/* <input type="textarea" {...updateStoreForm("description")} /> */}
                  <textarea
                    {...updateStoreForm("description")}
                    onChange={(e) => handleDescription(e)}
                    maxLength={2000}
                    defaultValue={storeData?.description}
                  ></textarea>
                </div>
              </div>
              <p>{descriptionLength}/2000</p>
            </div>
          </span>

          <span className={styles.input_row_container}>
            <div className={styles.input_info_container}>
              <div className={styles.input_container}>
                <div className={styles.input_label}>
                  <h4>Jam Operasional Toko</h4>
                </div>

                <div className={styles.input_box_label_container}>
                  <label htmlFor="">Buka Toko</label>
                  <div className={styles.input_box}>
                    <input
                      type="time"
                      {...updateStoreForm("openTime")}
                      onChange={(e) => setOpenTime(e.target.value)}
                      // onChange={handleOpenTime}
                      // value={openTime}
                      defaultValue={TimeToHourMinute(storeData?.openTime)}
                      step={600}
                    />
                  </div>
                </div>
                <div className={styles.input_box_label_container}>
                  <label htmlFor="">Tutup Toko</label>
                  <div className={styles.input_box}>
                    {/* <TimePicker onChange={setOpenTime} value={openTime} /> */}
                    {/* <TimePicker onChange={setCloseTime} value={closeTime} /> */}
                    <input
                      type="time"
                      {...updateStoreForm("closeTime")}
                      onChange={(e) => setCloseTime(e.target.value)}
                      // onChange={handleCloseTime}
                      // value={closeTime}
                      defaultValue={TimeToHourMinute(storeData?.closeTime)}
                      step={600}
                    />
                  </div>
                </div>
              </div>
            </div>
          </span>

          <span className={styles.input_row_container}>
            <div className={styles.input_info_container}>
              <div className={styles.input_container}>
                <div className={styles.input_label}>
                  <h4>Status Toko</h4>
                </div>
                <ReactSwitch
                  onChange={handleOperasionalChange}
                  checked={statusToko}
                  defaultChecked={storeData?.isOpen}
                />
              </div>
            </div>
          </span>
        </section>
        <div className={styles.submit_container}>
          <button type="submit">Simpan</button>
        </div>
      </form>
    </div>
  );
}

SellerSettings.getLayout = function getLayout(page: any) {
  return <SellerLayout>{page}</SellerLayout>;
};
