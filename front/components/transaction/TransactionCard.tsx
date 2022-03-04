import Image from "next/image";
import styles from "./TransactionCard.module.scss";
import { SelesaiOtomatis, TibaDiTujuan } from "./TransactionStatus";
function TransactionCard() {
  return (
    <section className={styles.order_card_container}>
      <div className={styles.order_detail_top}>
        <div className={styles.order_detail_top_left}>
          <div className={styles.order_detail_icon}></div>
          <div className={styles.order_detail_header}>
            <p>Belanja</p>
          </div>
          <div className={styles.order_detail_date}>
            <p>28 Feb 2022</p>
          </div>
          <div className={styles.order_status}>
            <p>
              <TibaDiTujuan />
            </p>
          </div>
          <div className={styles.order_invoice}>
            <p>INV/129308123</p>
          </div>
        </div>
        <div className={styles.order_detail_top_right}>
          <p>Selesai Otomatis</p>
          <SelesaiOtomatis hour={"1 Hari 8 Jam"} />
        </div>
      </div>
      <div className={styles.order_detail_shop}>
        <div className={styles.icon_image_relative}>
          <Image src={"/logo/badge_os.png"} layout="fill" alt="" />
        </div>
        <p>Detail Guy</p>
      </div>
      <div className={styles.order_detail_product}>
        <div className={styles.order_detail_product_item}>
          <div className={styles.order_detail_product_item_flex}>
            <div className={styles.order_detail_product_image_wrapper}>
              <div className={styles.order_detail_product_image_relative}>
                <Image
                  src={"/uploads/1646309888081_0.png"}
                  alt=""
                  layout="fill"
                />
              </div>
            </div>
            <div className={styles.product_detail_flex}>
              <div className={styles.product_detail_name}>
                <h6>Baju bajuan hahahahahhaha</h6>
              </div>
              <div className={styles.product_detail_price_quantity}>
                1 barang x Rp200.000
              </div>
            </div>
          </div>
        </div>
        <div className={styles.order_detail_total_purchase}>
          <div>
            <p className={styles.order_total_header}>Total Belanja</p>
            <p className={styles.order_total_value}>Rp 200.000</p>
          </div>
        </div>
      </div>
      <div className={styles.order_detail_buttons}>
        <div className={styles.order_detail_button_detail}>
          <p>Lihat Detail Transaksi</p>
        </div>
        <div className={styles.order_detail_button_action}>
          <button>
            <span>Selesai</span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default TransactionCard;
