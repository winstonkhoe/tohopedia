import AdminLayout from "./layout";

export default function AdminHome() {
    return (<div>
      
        diagrams
  </div>);
}

AdminHome.getLayout = function getLayout(page: any) {
  return <AdminLayout>{page}</AdminLayout>;
};