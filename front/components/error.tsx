import Image from "next/image";
import Link from "next/link";
import styles from "../styles/error.module.scss";

export function ErrorNotFound() {
  return (
    <div className={styles.big_container}>
      <div className={styles.error_container}>
        <div className={styles.error_container_display}>
          <div className={styles.error_image_relative}>
            <Image
              src={"/assets/error-not-found.png"}
              alt=""
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className={styles.error_description_container}>
            <h1 className={styles.error_description_header}>
              Waduh, tujuanmu nggak ada!
            </h1>
            <p>
              Mungkin kamu salah jalan atau alamat. Ayo balik sebelum gelap!
            </p>
            <div className={styles.error_button_container}>
              <div className={styles.error_button_inner_container}>
                <Link href={"/"}>
                  <a href="">
                    <button className={styles.error_button_return}>
                      <span className={styles.error_button_span_text}>
                        Kembali
                      </span>
                    </button>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
