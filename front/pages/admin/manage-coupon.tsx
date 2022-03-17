import AdminLayout from "./layout";

export default function ManageCoupon() {
  return <div></div>;
}

ManageCoupon.getLayout = function getLayout(page: any) {
  return <AdminLayout>{page}</AdminLayout>;
};