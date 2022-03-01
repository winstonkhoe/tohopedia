import { NextPage } from "next";
import Layout from "./layout";
import styles from "../../../styles/Settings_Biodata.module.scss";
import Image from "next/image";
const BioData: NextPage = () => {
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
              />
              <picture>
                <div>
                  <Image
                    src={"/uploads/1645900279556_0.jpg"}
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
              <span className={styles.biodata_item_value}>Winston</span>
              <span className={styles.biodata_item_change}>Ubah</span>
            </div>
            <div className={styles.biodata_item_container}>
              <span className={styles.biodata_item_label}>Tanggal Lahir</span>
              <span className={styles.biodata_item_value}>
                19 Februari 2002
              </span>
              <span className={styles.biodata_item_change}>Ubah</span>
            </div>
            <div className={styles.biodata_item_container}>
              <span className={styles.biodata_item_label}>Jenis Kelamin</span>
              <span className={styles.biodata_item_value}>Pria</span>
              <span className={styles.biodata_item_change}>Ubah</span>
            </div>
            <p className={styles.biodata_list_headers}>Ubah Kontak</p>
            <div className={styles.biodata_item_container}>
              <span className={styles.biodata_item_label}>Email</span>
              <span className={styles.biodata_item_value}>
                winstonkhoe@yahoo.com
              </span>
              <span className={styles.biodata_item_change}>Ubah</span>
            </div>
            <div className={styles.biodata_item_container}>
              <span className={styles.biodata_item_label}>Nomor HP</span>
              <span className={styles.biodata_item_value}>6281315174786</span>
              <span className={styles.biodata_item_change}>Ubah</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default BioData;
