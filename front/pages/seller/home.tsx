import { gql, useMutation, useQuery } from "@apollo/client";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useToasts } from "react-toast-notifications";
import InitFont from "../../components/initialize_font";
import Navbar from "../../components/navbar";
import styles from "../../styles/seller.module.scss";
import Switch from "react-switch";
// import TimePicker from 'react-time-picker/dist/entry.nostyle'
import TimePicker from "react-time-picker";
import Shop from "../../models/Shop";
import { ErrorNotFound } from "../../components/error";
import { Footer } from "../../components/Footer/Powered";

const Home: NextPage = () => {
  const { addToast } = useToasts();
  const { register: productForm, handleSubmit: handleProduct } = useForm();
  const { register: updateStoreForm, handleSubmit: handleUpdateStore } = useForm();

  // const [currentShop?, setCurrentShop] = useState(new Shop);
  const DEFAULT_PROFILE_IMAGE = `/logo/user_profile.jpg`;
  const [addProduct, setAddProduct] = useState(false);
  const [setting, setSetting] = useState(false);
  const [descriptionLength, setDescriptionLength] = useState(0);
  const [metadatas, setMetadatas] = useState([{ label: "", value: "" }]);

  const [profileImageChosen, setProfileImageChosen] = useState();
  const [openTime, setOpenTime] = useState("08:00");
  const [closeTime, setCloseTime] = useState("18:00");

  const STORE_QUERY = gql`
    query GetStore {
      getCurrentShop {
        id
        name
        slug
        image
        slogan
        description
        openTime
        closeTime
        isOpen
      }
    }
  `;

  const [currentShop, setCurrentShop] = useState(null);
  const [profileImage, setProfileImage] = useState(DEFAULT_PROFILE_IMAGE);
  const [statusToko, setStatusToko] = useState(false);

  const {
    loading: storeLoading,
    error: storeError,
    data: storeData,
  } = useQuery(STORE_QUERY);

  useEffect(() => {
    setCurrentShop(storeData?.getCurrentShop);
    setProfileImage(storeData?.getCurrentShop?.image ? `/uploads/${storeData?.getCurrentShop?.image}` : DEFAULT_PROFILE_IMAGE)
    setStatusToko(storeData?.getCurrentShop?.isOpen)
  }, [DEFAULT_PROFILE_IMAGE, storeData]);

  
  const CATEGORY_QUERY = gql`
    query GetAllCategories {
      categories {
        id
        name
      }
    }
  `;

  const {
    loading: categoryLoading,
    error: categoryError,
    data: categoryData,
  } = useQuery(CATEGORY_QUERY);

  const ADD_PRODUCT_MUTATION = gql`
    mutation addProduct(
      $name: String!
      $description: String!
      $images: [String!]!
      $stock: Int!
      $price: Int!
      $discount: Int!
      $metadata: String
      $categoryId: String!
    ) {
      addProduct(
        input: {
          name: $name
          description: $description
          images: $images
          stock: $stock
          price: $price
          discount: $discount
          metadata: $metadata
          categoryId: $categoryId
        }
      ) {
        id
      }
    }
  `;
  const [
    mutationAddProduct,
    {
      loading: addProductLoading,
      error: addProductError,
      data: addProductData,
    },
  ] = useMutation(ADD_PRODUCT_MUTATION);

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
  const [
    mutationEditShop,
    { loading: editShopLoading, error: editShopError, data: editShopData },
  ] = useMutation(UPDATE_STORE_MUTATION);

  function handleTambahProduk() {
    setAddProduct(true);
    setSetting(false);
  }

  function handleSetting() {
    setSetting(true);
    setAddProduct(false);
  }

  function TambahProduk(this: any) {
    if (categoryLoading) {
    }

    async function onSubmit(formData: any) {
      let name = formData.name.trim();
      let description = formData.description.trim();
      let price = formData.price;
      let discount = formData.discount;
      let metadata = `${JSON.stringify([...metadatas])}`;
      let categoryId = formData.category;
      let stock = formData.stock;
      let images = [];

      console.log(typeof metadata);
      let listFields = [name, description, categoryId];
      let successValidation = true;
      for (let index = 0; index < listFields.length; index++) {
        if (listFields[index] == "") {
          successValidation = false;

          break;
        }
      }
      if (formData.image.length == 0) {
        successValidation = false;
      }
      if (!successValidation) {
        addToast("Fields cannot be empty", { appearance: "error" });
      } else {
        const body = new FormData();
        body.append("length", formData.image.length);
        for (let index = 0; index < formData.image.length; index++) {
          // var extension = formData.image[index].name.split('.')[1]
          // formData.image[index].name = `${Date.now().toString()}.${extension}`
          body.append(`file${index}`, formData.image[index]);
        }
        console.log(body);
        let response = await fetch("/api/upload", {
          method: "POST",
          body,
        });
        console.log(response);

        let data = await response.json();
        console.log(data);
        // console.log(data.length);
        images = data.map((d: any) => {
          return d.name;
        });

        try {
          await mutationAddProduct({
            variables: {
              id: currentShop?.id,
              name: name,
              description: description,
              images: images,
              stock: stock,
              price: price,
              discount: discount,
              metadata: metadata,
              categoryId: categoryId,
            },
          });
          setAddProduct(false);
        } catch (error) {
          console.log(error);
        }
      }
    }

    function addFields() {
      // displayData.push(field)
      // console.log(displayData)
      setMetadatas([...metadatas, { label: "", value: "" }]);
    }

    function handleChange(index: any, event: any) {
      const values = [...metadatas];
      values[index][event.target.name] = event.target.value;
      console.log(values);
      setMetadatas(values);
    }

    function handleDescription(event: any) {
      setDescriptionLength(event.target.value.length);
      console.log(event.target.value);
    }
    
    return ( 
      <div className={styles.add_product_container}>
        <div className={styles.add_product_header}>
          <h3>Tambah Produk</h3>
        </div>
        <form action="" onSubmit={handleProduct(onSubmit)}>
          <section>
            <span className={styles.input_row_container}>
              <div className={styles.input_info_container}>
                <div className={styles.input_container}>
                  <div className={styles.input_label}>
                    <h4>Nama Produk</h4>
                  </div>
                  <div className={styles.input_box}>
                    <input type="text" {...productForm("name")} />
                  </div>
                </div>
              </div>
            </span>

            <span className={styles.input_row_container}>
              <div className={styles.input_info_container}>
                <div className={styles.input_container}>
                  <div className={styles.input_label}>
                    <h4>Nama Kategori</h4>
                  </div>
                  <div className={styles.input_box}>
                    <select id="" {...productForm("category")}>
                      <option value="">Choose Category</option>
                      {categoryData?.categories.map((category: any) => {
                        return (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        );
                      })}
                    </select>
                    {/* <input type="" /> */}
                  </div>
                </div>
              </div>
            </span>

            <span className={styles.input_row_container}>
              <div className={styles.input_info_container}>
                <div className={styles.input_container}>
                  <div className={styles.input_label}>
                    <h4>Gambar Produk</h4>
                  </div>
                  <div className={styles.input_box}>
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg, image/jpg, image/x-png, image/png"
                      {...productForm("image")}
                    />
                  </div>
                </div>
              </div>
            </span>

            <span className={styles.input_row_container}>
              <div className={styles.input_info_container}>
                <div className={styles.input_container}>
                  <div className={styles.input_label}>
                    <h4>Deskripsi Produk</h4>
                  </div>
                  <div className={styles.input_box_textarea}>
                    {/* <input type="textarea" {...register("description")} /> */}
                    <textarea
                      {...productForm("description")}
                      onChange={(e) => handleDescription(e)}
                      maxLength={2000}
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
                    <h4>Harga Produk</h4>
                  </div>
                  <div className={styles.input_box}>
                    <input type="textarea" {...productForm("price")} />
                  </div>
                </div>
              </div>
            </span>

            <span className={styles.input_row_container}>
              <div className={styles.input_info_container}>
                <div className={styles.input_container}>
                  <div className={styles.input_label}>
                    <h4>Diskon Produk</h4>
                  </div>
                  <div className={styles.input_box}>
                    <input type="number" {...productForm("discount")} />
                  </div>
                </div>
              </div>
            </span>

            <span className={styles.input_row_container}>
              <div className={styles.input_info_container}>
                <div className={styles.input_container}>
                  <div className={styles.input_label}>
                    <h4>Stok Produk</h4>
                  </div>
                  <div className={styles.input_box}>
                    <input type="number" {...productForm("stock")} min="1"/>
                  </div>
                </div>
              </div>
            </span>
          </section>
          <section>
            <div className={styles.metadata_container}>
              <div className={styles.input_container}>
                <div
                  className={styles.input_label}
                  style={{ display: "flex", alignItems: "start" }}
                >
                  <h4>Metadata Produk</h4>
                </div>
                <div
                  id="metadata_roll_container"
                  className={styles.metadata_roll_container}
                >
                  {metadatas.map((metadata, index) => {
                    return (
                      <span key={index}>
                        <div className={styles.input_box}>
                          <input
                            type="text"
                            name="label"
                            placeholder="Label"
                            value={metadata.label}
                            onChange={(e) => {
                              handleChange(index, e);
                            }}
                          />
                        </div>
                        <div className={styles.input_box}>
                          <input
                            type="text"
                            name="value"
                            placeholder="Value"
                            value={metadata.value}
                            onChange={(e) => {
                              handleChange(index, e);
                            }}
                          />
                        </div>
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className={styles.metadata_button_container}>
                <button type="button" onClick={addFields}>Tambah</button>
              </div>
            </div>
          </section>
          <div className={styles.submit_container}>
            <button type="submit">Simpan</button>
          </div>
        </form>
      </div>
    );
  }

  function Setting(this: any) {
    // setProfileImage(`/uploads/${currentShop?.image}`)

    const onImageChange = (event: any) => {
      if (event.target.files && event.target.files[0]) {
        setProfileImage(URL.createObjectURL(event.target.files[0]));
        setProfileImageChosen(event.target.files[0])
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
      let shopOpenDate = currentShop?.openTime.split("T")[0];
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
          if (
            profileImageChosen
          ) {
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
            image = currentShop?.image;
          }

          console.log(image)
          try {
            await mutationEditShop({
              variables: {
                id: currentShop?.id,
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
      console.log(event.target.value);
    }
    console.log(currentShop?.isOpen);

    if (currentShop != null) {
      console.log(currentShop)
      console.log(storeData)
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
                        defaultValue={currentShop.name ? currentShop.name : ""}
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
                        defaultValue={currentShop?.slug}
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
                        defaultValue={currentShop?.slogan}
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
                        defaultValue={currentShop?.description}
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
                        {/* <TimePicker onChange={setOpenTime} value={openTime} /> */}
                        {/* <TimePicker onChange={setCloseTime} value={closeTime} /> */}
  
                        <input
                          type="time"
                          {...updateStoreForm("openTime")}
                          onChange={(e) => setOpenTime(e.target.value)}
                          // onChange={handleOpenTime}
                          // value={openTime}
                          defaultValue={TimeToHourMinute(currentShop?.openTime)}
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
                          defaultValue={TimeToHourMinute(currentShop?.closeTime)}
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
                    <Switch
                      onChange={handleOperasionalChange}
                      checked={statusToko}
                      defaultChecked={currentShop?.isOpen}
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
    return <h5>Loading...</h5>;
  }

  if (storeError) {
    console.log(storeError)
    console.log("Store Data undefine")
    return (
      <div className={styles.container}>
        <Head>
        <title>Seller Dashboard</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <InitFont />
      <Navbar />
        <ErrorNotFound />
        <Footer/>
      </div>
    )
  }
  console.log(currentShop)
  console.log(storeData)
  return (
    <div className={styles.container}>
      <Head>
        <title>Seller Dashboard</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <InitFont />
      <Navbar />

      <div className={styles.container}>
        {/* Left Navbar */}
        <div className={styles.seller_navbar}>
          <nav>
            <div>
              {/* Header */}
              <ul className={styles.seller_header}>
                <li>
                  <div className={styles.seller_header_container}>
                    <div className={styles.seller_image}>
                      <Image src={profileImage} alt="PM Logo" layout="fill" />
                    </div>
                    <div className={styles.seller_header_detail_container}>
                      <div className={styles.seller_name}>
                        <Link href="">
                          {/* <a>bai</a> */}
                          <a>{currentShop?.name}</a>
                        </Link>
                      </div>
                      <div>badge</div>
                    </div>
                  </div>
                </li>
                <li>Merchant Type</li>
                <li>{currentShop?.isOpen ? 'Toko Buka' : 'Toko Tutup'}</li>
              </ul>
              {/* End Header */}

              {/* Menus */}

              {/* HOME */}
              <ItemSellerNavbar href={"/home"} name={"Home"}>
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="var(--NN900, #2E3137)"
                >
                  <path d="M13.17 2l9.33 8.44a.76.76 0 01-.748 1.289.748.748 0 01-.252-.149L19.75 10v10A1.76 1.76 0 0118 21.75H6A1.76 1.76 0 014.25 20V10L2.5 11.56a.75.75 0 11-1-1.12L10.83 2a1.75 1.75 0 012.34 0zm-2.92 14v4.25h3.5V16a.25.25 0 00-.25-.25h-3a.25.25 0 00-.25.25zm7.927 4.177A.25.25 0 0018.25 20V8.63l-6.08-5.47a.25.25 0 00-.34 0L5.75 8.63V20a.25.25 0 00.25.25h2.75V16a1.76 1.76 0 011.75-1.75h3A1.76 1.76 0 0115.25 16v4.25H18a.25.25 0 00.177-.073zM13.5 9.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path>
                </svg>
              </ItemSellerNavbar>

              <span onClick={() => handleSetting()}>
                <ItemSellerNavbar href={"/home"} name={"Setting"}>
                  <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="var(--NN900, #2E3137)"
                  >
                    <path d="M13.17 2l9.33 8.44a.76.76 0 01-.748 1.289.748.748 0 01-.252-.149L19.75 10v10A1.76 1.76 0 0118 21.75H6A1.76 1.76 0 014.25 20V10L2.5 11.56a.75.75 0 11-1-1.12L10.83 2a1.75 1.75 0 012.34 0zm-2.92 14v4.25h3.5V16a.25.25 0 00-.25-.25h-3a.25.25 0 00-.25.25zm7.927 4.177A.25.25 0 0018.25 20V8.63l-6.08-5.47a.25.25 0 00-.34 0L5.75 8.63V20a.25.25 0 00.25.25h2.75V16a1.76 1.76 0 011.75-1.75h3A1.76 1.76 0 0115.25 16v4.25H18a.25.25 0 00.177-.073zM13.5 9.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path>
                  </svg>
                </ItemSellerNavbar>
              </span>

              {/* Tambah Produk */}
              <span onClick={() => handleTambahProduk()}>
                <ItemSellerNavbar href={"/add-product"} name={"Tambah Produk"}>
                  {/* <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="var(--GN500, #00AA5B)"
                >
                  <path d="M20 6.75H4a.76.76 0 01-.7-.47.76.76 0 01.18-.82l1.68-1.61a2 2 0 011.32-.61h11a2 2 0 011.33.62l1.7 1.59a.75.75 0 01-.51 1.3zm-5 1.5h5a.76.76 0 01.75.75v10A1.76 1.76 0 0119 20.75H5A1.76 1.76 0 013.25 19V9A.76.76 0 014 8.25h5v3.25a.5.5 0 00.76.42L12 10.43l2.22 1.49a.5.5 0 00.78-.42V8.25z"></path>
                </svg> */}
                  <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="var(--NN900, #2E3137)"
                  >
                    <path d="M20.7 19V7v-.1c0-.1 0-.2-.1-.3L18.9 4l-.1-.1c-.3-.4-.8-.6-1.3-.6h-11c-.5 0-1 .3-1.3.6L5 4 3.3 6.6c0 .1-.1.2-.1.3V19c0 .9.7 1.7 1.6 1.7h14.1c1 .1 1.8-.7 1.8-1.7 0 .1 0 0 0 0zM6.3 4.9c.1-.1.1-.1.2-.1h11c.1 0 .2.1.2.1l.9 1.4H5.4l.9-1.4zm7.9 2.8V10l-2-.7c-.2-.1-.3-.1-.5 0l-2 .7V7.7h4.5zm5 11.3c0 .2-.1.2-.2.2H5c-.2 0-.2-.1-.2-.2V7.7h3.5V11c0 .2.1.5.3.6.2.1.4.2.7.1l2.8-.9 2.8.9h.1c.2 0 .3 0 .4-.1.2-.1.3-.4.3-.6V7.7h3.5V19z"></path>
                  </svg>
                </ItemSellerNavbar>
              </span>

              {/* Daftar Produk */}
              <ItemSellerNavbar href={"/manage-product"} name={"Daftar Produk"}>
                {/* <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="var(--GN500, #00AA5B)"
                >
                  <path d="M20 6.75H4a.76.76 0 01-.7-.47.76.76 0 01.18-.82l1.68-1.61a2 2 0 011.32-.61h11a2 2 0 011.33.62l1.7 1.59a.75.75 0 01-.51 1.3zm-5 1.5h5a.76.76 0 01.75.75v10A1.76 1.76 0 0119 20.75H5A1.76 1.76 0 013.25 19V9A.76.76 0 014 8.25h5v3.25a.5.5 0 00.76.42L12 10.43l2.22 1.49a.5.5 0 00.78-.42V8.25z"></path>
                </svg> */}
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="var(--NN900, #2E3137)"
                >
                  <path d="M20.7 19V7v-.1c0-.1 0-.2-.1-.3L18.9 4l-.1-.1c-.3-.4-.8-.6-1.3-.6h-11c-.5 0-1 .3-1.3.6L5 4 3.3 6.6c0 .1-.1.2-.1.3V19c0 .9.7 1.7 1.6 1.7h14.1c1 .1 1.8-.7 1.8-1.7 0 .1 0 0 0 0zM6.3 4.9c.1-.1.1-.1.2-.1h11c.1 0 .2.1.2.1l.9 1.4H5.4l.9-1.4zm7.9 2.8V10l-2-.7c-.2-.1-.3-.1-.5 0l-2 .7V7.7h4.5zm5 11.3c0 .2-.1.2-.2.2H5c-.2 0-.2-.1-.2-.2V7.7h3.5V11c0 .2.1.5.3.6.2.1.4.2.7.1l2.8-.9 2.8.9h.1c.2 0 .3 0 .4-.1.2-.1.3-.4.3-.6V7.7h3.5V19z"></path>
                </svg>
              </ItemSellerNavbar>
              {/* End Menus */}
            </div>
          </nav>
        </div>

        {/* Display */}
        <div className={styles.seller_display}>
          {addProduct && TambahProduk()}
          {setting && Setting()}
        </div>
      </div>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            {/* <Image src="/logo/tohopedia_logo.png" alt='Tohopedia Logo' width={800} height={200}/> */}
            <Image
              src="/logo/tohopedia_logo.png"
              alt="Vercel Logo"
              width={72}
              height={16}
            />
            {/* <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} /> */}
          </span>
        </a>
      </footer>
    </div>
  );
};

function ItemSellerNavbar(props: { href?: any; name: string; children?: any }) {
  return (
    <li>
      {/* <Link href={props.href ? props.href : ""}> */}
      <a className={styles.item_seller_container}>
        <div className={styles.item_seller_logo}>
          <span style={{ marginRight: "8px" }}>{props.children}</span>
          <div className={styles.item_seller_name}>{props.name}</div>
        </div>
      </a>
      {/* </Link> */}
    </li>
  );
}

export default Home;
