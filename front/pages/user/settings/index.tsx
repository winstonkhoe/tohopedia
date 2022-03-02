import { NextPage } from "next";
import Layout from "./layout";
import styles from "../../../styles/Settings_Biodata.module.scss";
import nameStyle from "../../../styles/components/user_name_overlay.module.scss";
import genderStyle from "../../../styles/components/user_gender_overlay.module.scss";
import common from "../../../styles/components/common.module.scss";
import Image from "next/image";
import { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import Overlay from "../../../components/overlay/overlay";

const BioData: NextPage = () => {
  const DEFAULT_PROFILE_IMAGE = `/logo/user_profile.jpg`;
  const [profileImage, setProfileImage] = useState(DEFAULT_PROFILE_IMAGE);
  const [profileImageChosen, setProfileImageChosen] = useState();

  const [updateName, setUpdateName] = useState(false);
  const [name, setName] = useState("");

  const [updateEmail, setUpdateEmail] = useState(false);
  const [email, setEmail] = useState("");

  const [updateDob, setUpdateDob] = useState(true);
  const [dob, setDob] = useState("");

  const [updateGender, setUpdateGender] = useState(false);
  const [gender, setGender] = useState("");

  const [updatePhone, setUpdatePhone] = useState(false);
  const [phone, setPhone] = useState("");

  const [overlayStatus, setOverlayStatus] = useState({
    name: false,
    dob: false,
    gender: false,
    email: false,
    phone: false,
  });

  const USER_DATA_QUERY = gql`
    query GetUser {
      getCurrentUser {
        name
        dob
        gender
        email
        phone
        image
      }
    }
  `;

  const {
    loading: userLoad,
    error: userErr,
    data: userData,
  } = useQuery(USER_DATA_QUERY, {
    pollInterval: 2000,
  });

  const UPDATE_USER_IMAGE_MUTATION = gql`
    mutation updateUserImage($image: String!) {
      updateUserImage(image: $image) {
        id
        image
      }
    }
  `;
  const [
    updateUserImage,
    {
      loading: updateUserImageLoad,
      error: updateUserImageErr,
      data: updateUserImageData,
    },
  ] = useMutation(UPDATE_USER_IMAGE_MUTATION);

  const UPDATE_USER_NAME_MUTATION = gql`
    mutation updateUserName($name: String!) {
      updateUserName(name: $name) {
        id
        name
      }
    }
  `;
  const [
    updateUserName,
    {
      loading: updateUserNameLoad,
      error: updateUserNameErr,
      data: updateUserNameData,
    },
  ] = useMutation(UPDATE_USER_NAME_MUTATION);

  const UPDATE_USER_PHONE_MUTATION = gql`
    mutation updateUserPhone($phone: String!) {
      updateUserPhone(phone: $phone) {
        id
        phone
      }
    }
  `;
  const [
    updateUserPhone,
    {
      loading: updateUserPhoneLoad,
      error: updateUserPhoneErr,
      data: updateUserPhoneData,
    },
  ] = useMutation(UPDATE_USER_PHONE_MUTATION);

  const UPDATE_USER_EMAIL_MUTATION = gql`
    mutation updateUserEmail($email: String!) {
      updateUserEmail(email: $email) {
        id
        email
      }
    }
  `;
  const [
    updateUserEmail,
    {
      loading: updateUserEmailLoad,
      error: updateUserEmailErr,
      data: updateUserEmailData,
    },
  ] = useMutation(UPDATE_USER_EMAIL_MUTATION);

  const UPDATE_USER_GENDER_MUTATION = gql`
    mutation updateUserGender($gender: String!) {
      updateUserGender(gender: $gender) {
        id
        gender
      }
    }
  `;
  const [
    updateUserGender,
    {
      loading: updateUserGenderLoad,
      error: updateUserGenderErr,
      data: updateUserGenderData,
    },
  ] = useMutation(UPDATE_USER_GENDER_MUTATION);

  const UPDATE_USER_DOB_MUTATION = gql`
    mutation updateUserDOB($dob: String!) {
      updateUserDOB(dob: $dob) {
        id
      }
    }
  `;
  const [
    updateUserDOB,
    {
      loading: updateUserDOBLoad,
      error: updateUserDOBErr,
      data: updateUserDOBData,
    },
  ] = useMutation(UPDATE_USER_DOB_MUTATION);

  useEffect(() => {
    setProfileImage(
      userData?.getCurrentUser?.image
        ? `/uploads/${userData?.getCurrentUser?.image}`
        : DEFAULT_PROFILE_IMAGE
    );

    setName(userData?.getCurrentUser?.name);
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
      console.log(image);
      try {
        await updateUserImage({
          variables: {
            image: image,
          },
        }).then((data) => {
          console.log(data);
        });
      } catch (error) {}
    }
  }

  function toIndonesianDate(date: string) {
    let bulans = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
    let newDate = new Date(date)
    let day = newDate.getDate()
    let month = newDate.getMonth()
    let year = newDate.getFullYear()

    return day + " " + bulans[month] + " " + year
  }

  function handleOverlay(key: string, value: boolean) {
    let currStatus = overlayStatus;
    currStatus[key] = value;
    setOverlayStatus(currStatus);
    console.log("masuk");
  }

  // console.log(overlayStatus);
  console.log(gender);
  console.log(new Date(dob))

  // console.log(NameOverlay() && overlayStatus.name);
  return (
    <Layout>
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
              <span className={styles.biodata_item_value}>
                {userData?.getCurrentUser?.name}
              </span>
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
                {userData?.getCurrentUser?.dob
                  ? toIndonesianDate(userData?.getCurrentUser?.dob)
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
                {userData?.getCurrentUser?.gender
                  ? (userData?.getCurrentUser?.gender == 0 ? "Female" : "Male")
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
              <span className={styles.biodata_item_value}>
                {userData?.getCurrentUser?.email}
              </span>
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
                {userData?.getCurrentUser?.phone
                  ? userData?.getCurrentUser?.phone
                  : "Not Specified Yet"}
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
    </Layout>
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
                  defaultValue={userData?.getCurrentUser?.name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <button
            className={
              name == userData?.getCurrentUser?.name && name == ""
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
                  defaultValue={userData?.getCurrentUser?.phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <button
            className={
              phone == userData?.getCurrentUser?.phone && phone == ""
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
                  defaultValue={userData?.getCurrentUser?.email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <button
            className={
              email == userData?.getCurrentUser?.email && email == ""
                ? common.button_overlay_disable
                : re.test(email)
                ? common.button_overlay
                : common.button_overlay_disable
            }
            onClick={() => {
              updateUserEmail({ variables: { email: email } }).then((data) => {
                setUpdateEmail(false);
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
                  max={new Date().toISOString().split('T')[0]}
                  onChange={(e) => {
                    setDob(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <button
            className={
              dob == ""
                ? common.button_overlay_disable
                : common.button_overlay
            }
            onClick={() => {
              updateUserDOB({ variables: { dob: new Date(dob) } }).then((data) => {
                setUpdateDob(false);
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
                  <input type="radio" name="gender" id="" value="female" onClick={e=>setGender(e.target.value)} />
                  <span>Female</span>
                </div>
                <div style={{marginLeft: "10px"}} className={genderStyle.radio_container}>
                  <div className={common.image_icon}>
                    <Image src={"/logo/icon_male.svg"} alt="" layout="fill" />
                  </div>
                  <input type="radio" name="gender" id="" value="male" onClick={e=>setGender(e.target.value)} />
                  <span>Male</span>
                </div>
              </div>
              {/* <input
                  className={common.input_fields}
                  type="text"
                  defaultValue={userData?.getCurrentUser?.email}
                  onChange={(e) => {
                    setGender(e.target.value);
                  }}
                /> */}
              {/* </div> */}
            </div>
          </div>
          <button
            className={
              gender == ""
                ? common.button_overlay_disable
                : common.button_overlay
            }
            onClick={() => {
              updateUserGender({ variables: { gender: gender } }).then((data) => {
                setUpdateGender(false);
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
};
export default BioData;
