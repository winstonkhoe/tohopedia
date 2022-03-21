import styles from "../../styles/seller.module.scss";
import SellerLayout from "./layout";

const SellerHome = () => {

  return (
    <div className={styles.container}>
    </div>
  );
};

export default SellerHome;

SellerHome.getLayout = function getLayout(page: any) {
  return <SellerLayout>{page}</SellerLayout>;
};
