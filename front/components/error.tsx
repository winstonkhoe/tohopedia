import Image from "next/image";
import Link from "next/link";
import Router from "next/router";
import styles from "../styles/error.module.scss";

function DefaultError(props: { header: string; text: string; href?: any }) {
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
            <h1 className={styles.error_description_header}>{props.header}</h1>
            <p>{props.text}</p>
            <div className={styles.error_button_container}>
              <div className={styles.error_button_inner_container}>
                <Link href={props?.href !== undefined ? props?.href : "/"}>
                  <a href="">
                    <button
                      className={styles.error_button_return}
                      onClick={() => {
                        props?.href !== undefined ? null : Router.back();
                      }}
                    >
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
function ErrorNotFound() {
  return (
    <DefaultError
      header="Waduh, tujuanmu nggak ada!"
      text="Mungkin kamu salah jalan atau alamat. Ayo balik sebelum gelap!"
    />
    // <div className={styles.big_container}>
    //   <div className={styles.error_container}>
    //     <div className={styles.error_container_display}>
    //       <div className={styles.error_image_relative}>
    //         <Image
    //           src={"/assets/error-not-found.png"}
    //           alt=""
    //           layout="fill"
    //           objectFit="cover"
    //         />
    //       </div>
    //       <div className={styles.error_description_container}>
    //         <h1 className={styles.error_description_header}>
    //           Waduh, tujuanmu nggak ada!
    //         </h1>
    //         <p>
    //           Mungkin kamu salah jalan atau alamat. Ayo balik sebelum gelap!
    //         </p>
    //         <div className={styles.error_button_container}>
    //           <div className={styles.error_button_inner_container}>
    //             <Link href={"/"}>
    //               <a href="">
    //                 <button
    //                   className={styles.error_button_return}
    //                   onClick={() => {
    //                     Router.back();
    //                   }}
    //                 >
    //                   <span className={styles.error_button_span_text}>
    //                     Kembali
    //                   </span>
    //                 </button>
    //               </a>
    //             </Link>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}

function ErrorNoKeyword() {
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
              Ayo masukkan keyword dulu!
            </h1>
            <p>
              {/* Mungkin kamu salah jalan atau alamat. Ayo balik sebelum gelap! */}
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

export { DefaultError, ErrorNotFound, ErrorNoKeyword };
