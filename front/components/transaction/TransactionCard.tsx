import Image from "next/image";
import RupiahFormat from "../../misc/currency";
import styles from "./TransactionCard.module.scss";
import { SelesaiOtomatis, YellowLabel } from "./TransactionStatus";
function TransactionCard(props: {
  date: string;
  transactionId: string;
  shopName: string;
  shopType: number;
  productName: string;
  productQuantity: number;
  productPrice: number;
  productImage: string;
}) {
  return (
    <section className={styles.order_card_container}>
      <div className={styles.order_detail_top}>
        <div className={styles.order_detail_top_left}>
          <div className={styles.order_detail_icon}></div>
          <div className={styles.order_detail_header}>
            <p>Belanja</p>
          </div>
          <div className={styles.order_detail_date}>
            <p>{props.date}</p>

            {/* 28 Feb 2022 */}
          </div>
          <div className={styles.order_status}>
            <p>
              <YellowLabel text="Tiba di Tujuan" />
            </p>
          </div>
          <div className={styles.order_invoice}>
            <p>{props.transactionId}</p>
          </div>
        </div>
        <div className={styles.order_detail_top_right}>
          <p>Selesai Otomatis</p>
          <SelesaiOtomatis hour={"1 Hari 8 Jam"} />
        </div>
      </div>
      <div className={styles.order_detail_shop}>
        {props.shopType > 0 ? <div className={styles.icon_image_relative}>
          <Image
            src={`/logo/${
              props?.shopType == 1
                ? "badge_pm.png"
                : props?.shopType == 2
                ? "badge_pmp.svg"
                : props?.shopType == 3
                ? "badge_os.png"
                : null
            }`}
            alt=""
            layout="fill"
          />
        </div> : null}
        
        <p>{props.shopName}</p>
      </div>
      <div className={styles.order_detail_product}>
        <div className={styles.order_detail_product_item}>
          <div className={styles.order_detail_product_item_flex}>
            <div className={styles.order_detail_product_image_wrapper}>
              <div className={styles.order_detail_product_image_relative}>
                <Image
                  src={`/uploads/${props.productImage}`}
                  alt=""
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>
            <div className={styles.product_detail_flex}>
              <div className={styles.product_detail_name}>
                <h6>{props.productName}</h6>
              </div>
              <div className={styles.product_detail_price_quantity}>
                {props.productQuantity} barang x{" "}
                {RupiahFormat(props.productPrice)}
              </div>
              <div className={styles.product_detail_extras}>
                +1 produk lainnya
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
