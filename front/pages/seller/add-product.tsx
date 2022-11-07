import SellerLayout from "./layout";
import styles from "./add-product.module.scss";
import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { useToasts } from "react-toast-notifications";
import { gql, useMutation, useQuery } from "@apollo/client";
import { userDetailsContext } from "../../services/UserDataProvider";
import { ADD_PRODUCT_MUTATION } from "../../misc/global_mutation";
import { CATEGORY_QUERY } from "../../misc/global_query";
import { Shop } from "../../models/Shop";

export default function AddProduct() {
  const { addToast } = useToasts();
  const { register: productForm, handleSubmit: handleProduct } = useForm();
  const [metadatas, setMetadatas] = useState([{ label: "", value: "" }]);
  const [descriptionLength, setDescriptionLength] = useState(0);
  const storeData: Shop = useContext(userDetailsContext)?.shop;

  
  const [
    mutationAddProduct,
  ] = useMutation(ADD_PRODUCT_MUTATION);

  

  const {
    loading: categoryLoading,
    error: categoryError,
    data: categoryData,
  } = useQuery(CATEGORY_QUERY);

  async function onSubmit(formData: any) {
    let name = formData.name.trim();
    let description = formData.description.trim();
    let price = formData.price;
    let discount = formData.discount;
    let metadata = `${JSON.stringify([...metadatas])}`;
    let categoryId = formData.category;
    let stock = formData.stock;
    let images = [];

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
        body.append(`file${index}`, formData.image[index]);
      }
      let response = await fetch("/api/upload", {
        method: "POST",
        body,
      });

      let data = await response.json();
      images = data.map((d: any) => {
        return d.name;
      });

      try {
        await mutationAddProduct({
          variables: {
            id: storeData?.id,
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
      } catch (error) {
        console.log(error);
      }
    }
  }

  function addFields() {
    setMetadatas([...metadatas, { label: "", value: "" }]);
  }

  function handleChange(index: any, event: any) {
    const values: any = [...metadatas];
    values[index][event.target.name] = event.target.value;
    setMetadatas(values);
  }

  function handleDescription(event: any) {
    setDescriptionLength(event.target.value.length);
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
                  <input type="number" {...productForm("stock")} min="1" />
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
              <button type="button" onClick={addFields}>
                Tambah
              </button>
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

AddProduct.getLayout = function getLayout(page: any) {
  return <SellerLayout>{page}</SellerLayout>;
};
