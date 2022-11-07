import AdminLayout from "./layout";

export default function ManageCoupon() {
  return <div>Manage Coupon</div>;
}

ManageCoupon.getLayout = function getLayout(page: any) {
  return <AdminLayout>{page}</AdminLayout>;
};