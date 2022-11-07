import AdminLayout from "./layout";

export default function AdminIndex() {
  return <div></div>;
}

AdminIndex.getLayout = function getLayout(page: any) {
  return <AdminLayout>{page}</AdminLayout>;
};
