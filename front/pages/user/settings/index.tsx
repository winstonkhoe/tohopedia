import { NextPage } from "next";
import Layout from "./layout";
import styles from "./biodata.module.scss";
import nameStyle from "../../../styles/components/user_name_overlay.module.scss";
import genderStyle from "../../../styles/components/user_gender_overlay.module.scss";
import common from "../../../styles/components/common.module.scss";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import Overlay from "../../../components/overlay/overlay";
import { toIndonesianDate } from "../../../misc/date";
import { userDetailsContext } from "../../../services/UserDataProvider";
import { init, send } from "@emailjs/browser";
import { useToasts } from "react-toast-notifications";
import { User } from "../../../models/User";
import { stateContext } from "../../../services/StateProvider";
import { DEFAULT_PROFILE_IMAGE } from "../../../misc/global_constant";

const SERVICE_ID = "service_egdaufp";
const TEMPLATE_ID = "template_fg0ncxa";

export default function BioData() {
  const { addToast } = useToasts();
  const { tabIndexSetting, setTabIndexSetting} = useContext(stateContext);
  const [profileImage, setProfileImage] = useState(DEFAULT_PROFILE_IMAGE);
  const [profileImageChosen, setProfileImageChosen] = useState();


  const [updateName, setUpdateName] = useState(false);
  const [name, setName] = useState("");

  const [updateEmail, setUpdateEmail] = useState(false);
  const [email, setEmail] = useState("");

  const [updateDob, setUpdateDob] = useState(false);
  const [dob, setDob] = useState("");

  const [updateGender, setUpdateGender] = useState(false);
  const [gender, setGender] = useState<number>(0);

  const [updatePhone, setUpdatePhone] = useState(false);
  const [phone, setPhone] = useState("");

  init("user_3FcFw9m04bwuTvX6TklJs");

  const [overlayStatus, setOverlayStatus] = useState({
    name: false,
    dob: false,
    gender: false,
    email: false,
    phone: false,
  });

  const userData: User = useContext<User>(userDetailsContext);

  const [updateUserImage] = useMutation(User.UPDATE_USER_IMAGE_MUTATION);
  const [updateUserName] = useMutation(User.UPDATE_USER_NAME_MUTATION);
  const [updateUserPhone] = useMutation(User.UPDATE_USER_PHONE_MUTATION);
  const [updateUserEmail] = useMutation(User.UPDATE_USER_EMAIL_MUTATION);
  const [createTokenEmail] = useMutation(User.CREATE_VERIFY_EMAIL_MUTATION);
  const [updateUserGender] = useMutation(User.UPDATE_USER_GENDER_MUTATION);

  const [updateUserDOB] = useMutation(User.UPDATE_USER_DOB_MUTATION);

  useEffect(() => {
    setTabIndexSetting(0)
  }, [setTabIndexSetting])

  useEffect(() => {
    setProfileImage(
      userData?.image ? `/uploads/${userData?.image}` : DEFAULT_PROFILE_IMAGE
    );

    setName(userData?.name);
  }, [DEFAULT_PROFILE_IMAGE, userData]);

  async function onImageChange(event: any) {
    if (event.target.files && event.target.files[0]) {
      setProfileImage(URL.createObjectURL(event.target.files[0]));
      setProfileImageChosen(event.target.files[0]);

      const body = new FormData();
      body.append(`file0`, event.target.files[0]);
      let response = await fetch("/api/upload", {
        method: "POST",
        body,
      });

      let data = await response.json();
      let images = data.map((d: any) => {
        return d.name;
      });
      let image = images[0];
      try {
        await updateUserImage({
          variables: {
            image: image,
          },
        }).then((data) => {});
      } catch (error) {}
    }
  }

  function handleOverlay(key: string, value: boolean) {
    let currStatus: any = overlayStatus;
    currStatus[key] = value;
    setOverlayStatus(currStatus);
  }

  return (
    <div className={styles.container}>
      <div className={styles.biodata_container}>
        <div className={styles.profile_image_container}>
          <section className={styles.profile_image_section}>
            <input
              className={styles.profile_image_input}
              type="file"
              name=""
              id=""
              accept="image/jpeg, .jpeg, .jpg, image/png, .png"
              onChange={(e) => onImageChange(e)}
            />
            <picture>
              <div>
                <Image
                  src={profileImage}
                  alt=""
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </picture>
            <button>
              <span>Pilih Foto</span>
            </button>
            <p>
              Besar file: maksimum 10.000.000 bytes (10 Megabytes). Ekstensi
              file yang diperbolehkan: .JPG .JPEG .PNG
            </p>
          </section>
        </div>
        <div className={styles.biodata_list_container}>
          <p className={styles.biodata_list_headers}>Ubah Biodata Diri</p>
          <div className={styles.biodata_item_container}>
            <span className={styles.biodata_item_label}>Nama</span>
            <span className={styles.biodata_item_value}>{userData?.name}</span>
            <span
              className={styles.biodata_item_change}
              onClick={() => {
                setUpdateName(true);
              }}
            >
              Ubah
            </span>
          </div>
          <div className={styles.biodata_item_container}>
            <span className={styles.biodata_item_label}>Tanggal Lahir</span>
            <span className={styles.biodata_item_value}>
              {userData?.dob
                ? toIndonesianDate(userData?.dob)
                : "Not Specified Yet"}
            </span>
            <span
              className={styles.biodata_item_change}
              onClick={() => setUpdateDob(true)}
            >
              Ubah
            </span>
          </div>
          <div className={styles.biodata_item_container}>
            <span className={styles.biodata_item_label}>Jenis Kelamin</span>
            <span className={styles.biodata_item_value}>
              {userData?.gender
                ? userData?.gender == 0
                  ? "Female"
                  : "Male"
                : "Not Specified Yet"}
            </span>
            <span
              className={styles.biodata_item_change}
              onClick={() => setUpdateGender(true)}
            >
              Ubah
            </span>
          </div>
          <p className={styles.biodata_list_headers}>Ubah Kontak</p>
          <div className={styles.biodata_item_container}>
            <span className={styles.biodata_item_label}>Email</span>
            <span className={styles.biodata_item_value}>{userData?.email}</span>
            <span
              className={styles.biodata_item_change}
              onClick={() => setUpdateEmail(true)}
            >
              Ubah
            </span>
          </div>
          <div className={styles.biodata_item_container}>
            <span className={styles.biodata_item_label}>Nomor HP</span>
            <span className={styles.biodata_item_value}>
              {userData?.phone ? userData?.phone : "Not Specified Yet"}
            </span>
            <span
              className={styles.biodata_item_change}
              onClick={() => setUpdatePhone(true)}
            >
              Ubah
            </span>
          </div>
        </div>
      </div>
      <div>
        {updateName && NameOverlay()}
        {updatePhone && PhoneOverlay()}
        {updateEmail && EmailOverlay()}
        {updateGender && GenderOverlay()}
        {updateDob && DOBOverlay()}
      </div>
    </div>
  );

  function NameOverlay() {
    return (
      <Overlay>
        <div className={nameStyle.container}>
          <button
            className={common.close_button}
            onClick={() => {
              setUpdateName(false);
            }}
          ></button>
          <h2 className={common.overlay_header}>Ubah Nama</h2>
          <div className={common.fields_overlay_container}>
            <label className={common.fields_container_label} htmlFor="">
              Nama
            </label>
            <div>
              <div className={common.input_container}>
                <input
                  className={common.input_fields}
                  type="text"
                  defaultValue={userData?.name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <button
            className={
              name == userData?.name && name == ""
                ? common.button_overlay_disable
                : common.button_overlay
            }
            onClick={() => {
              updateUserName({ variables: { name: name } }).then((data) => {
                setUpdateName(false);
              });
            }}
            // className={
            //   common.button_overlay
            // }
          >
            <span>Simpan</span>
          </button>
        </div>
      </Overlay>
    );
  }

  function PhoneOverlay() {
    return (
      <Overlay>
        <div className={nameStyle.container}>
          <button
            className={common.close_button}
            onClick={() => {
              setUpdatePhone(false);
            }}
          ></button>
          <h2 className={common.overlay_header}>Ubah Nomor HP</h2>
          <div className={common.fields_overlay_container}>
            <label className={common.fields_container_label} htmlFor="">
              Nomor HP
            </label>
            <div>
              <div className={common.input_container}>
                <input
                  className={common.input_fields}
                  type="text"
                  defaultValue={userData?.phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <button
            className={
              phone == userData?.phone && phone == ""
                ? common.button_overlay_disable
                : phone.length > 11 && !isNaN(Number(phone))
                ? common.button_overlay
                : common.button_overlay_disable
            }
            onClick={() => {
              updateUserPhone({ variables: { phone: phone } }).then((data) => {
                setUpdatePhone(false);
              });
            }}
            // className={
            //   common.button_overlay
            // }
          >
            <span>Simpan</span>
          </button>
        </div>
      </Overlay>
    );
  }
  function EmailOverlay() {
    let re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return (
      <Overlay>
        <div className={nameStyle.container}>
          <button
            className={common.close_button}
            onClick={() => {
              setUpdateEmail(false);
            }}
          ></button>
          <h2 className={common.overlay_header}>Ubah Email</h2>
          <div className={common.fields_overlay_container}>
            <label className={common.fields_container_label} htmlFor="">
              Email
            </label>
            <div>
              <div className={common.input_container}>
                <input
                  className={common.input_fields}
                  type="text"
                  defaultValue={userData?.email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <button
            className={
              email == userData?.email && email == ""
                ? common.button_overlay_disable
                : re.test(email)
                ? common.button_overlay
                : common.button_overlay_disable
            }
            onClick={() => {
              createTokenEmail({
                variables: {
                  email: email,
                },
              }).then((d: any) => {
                var templateParams = {
                  email_reply: "winstonkcoding@gmail.com",
                  email_destination: email,
                  otp_code: `http://localhost:3000/verification/email/${d?.data?.createEmailToken?.id}`,
                };
                send(SERVICE_ID, TEMPLATE_ID, templateParams).then(
                  function (response) {
                    addToast("Check your email to verify email change", {
                      appearance: "success",
                    });
                    setUpdateEmail(false);
                  },
                  function (error) {
                    addToast("Error Sending Email", { appearance: "error" });
                  }
                );
              });
              // updateUserEmail({ variables: { email: email } }).then((data) => {
              // });
            }}
            // className={
            //   common.button_overlay
            // }
          >
            <span>Simpan</span>
          </button>
        </div>
      </Overlay>
    );
  }

  function DOBOverlay() {
    return (
      <Overlay>
        <div className={nameStyle.container}>
          <button
            className={common.close_button}
            onClick={() => {
              setUpdateDob(false);
            }}
          ></button>
          <h2 className={common.overlay_header}>Ubah DOB</h2>
          <div className={common.fields_overlay_container}>
            <label className={common.fields_container_label} htmlFor="">
              Date of Birth
            </label>
            <div>
              <div className={common.input_container}>
                <input
                  className={common.input_fields}
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) => {
                    setDob(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <button
            className={
              dob == "" ? common.button_overlay_disable : common.button_overlay
            }
            onClick={() => {
              updateUserDOB({ variables: { dob: new Date(dob) } }).then(
                (data) => {
                  setUpdateDob(false);
                }
              );
            }}
            // className={
            //   common.button_overlay
            // }
          >
            <span>Simpan</span>
          </button>
        </div>
      </Overlay>
    );
  }

  function GenderOverlay() {
    return (
      <Overlay>
        <div className={nameStyle.container}>
          <button
            className={common.close_button}
            onClick={() => {
              setUpdateGender(false);
            }}
          ></button>
          <h2 className={common.overlay_header}>Ubah Gender</h2>
          <div className={common.fields_overlay_container}>
            <label className={common.fields_container_label} htmlFor=""></label>
            <div>
              {/* <div className={common.input_container}> */}

              <div className={genderStyle.container}>
                <div className={genderStyle.radio_container}>
                  <div className={common.image_icon}>
                    <Image src={"/logo/icon_woman.svg"} alt="" layout="fill" />
                  </div>
                  <input
                    type="radio"
                    name="gender"
                    id=""
                    value="female"
                    onClick={(e) => setGender(0)}
                  />
                  <span>Female</span>
                </div>
                <div
                  style={{ marginLeft: "10px" }}
                  className={genderStyle.radio_container}
                >
                  <div className={common.image_icon}>
                    <Image src={"/logo/icon_male.svg"} alt="" layout="fill" />
                  </div>
                  <input
                    type="radio"
                    name="gender"
                    id=""
                    value="male"
                    onClick={(e) => setGender(1)}
                  />
                  <span>Male</span>
                </div>
              </div>
              {/* <input
                  className={common.input_fields}
                  type="text"
                  defaultValue={userData?.email}
                  onChange={(e) => {
                    setGender(e.target.value);
                  }}
                /> */}
              {/* </div> */}
            </div>
          </div>
          <button
            className={
              // gender == ""
              //   ? common.button_overlay_disable
              //   :
                common.button_overlay
            }
            onClick={() => {
              updateUserGender({ variables: { gender: gender } }).then(
                (data) => {
                  setUpdateGender(false);
                }
              );
            }}
            // className={
            //   common.button_overlay
            // }
          >
            <span>Simpan</span>
          </button>
        </div>
      </Overlay>
    );
  }
}

BioData.getLayout = function getLayout(page: any) {
  return <Layout>{page}</Layout>;
};
