import { useQuery } from "@apollo/client";
import {
  Bar,
  BarChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Admin } from "../../models/Admin";
import AdminLayout from "./layout";
import styles from "./home.module.scss";
import { useEffect, useState } from "react";

export default function AdminHome() {
  const [transactionPerDay, setTransactionPerDay] = useState();
  const [statisticIndex, setStatisticIndex] = useState(0);
  const [transactionPerShipmentType, setTransactionPerShipmentType] =
    useState();
  const [productPerCategory, setProductPerCategory] = useState();
  const { loading: loading1, data: data1 } = useQuery(
    Admin.TRANSACTION_PER_DAY_QUERY
  );
  const { loading: loading2, data: data2 } = useQuery(
    Admin.TRANSACTION_PER_SHIPMENT_TYPE_QUERY
  );
  const { loading: loading3, data: data3 } = useQuery(
    Admin.PRODUCT_PER_CATEGORY_QUERY
  );
  const [pieState, setPieState] = useState({
    activeIndex: 0,
  });

  useEffect(() => {
    if (data1) {
      let temp = [];
      temp = data1?.transactionsPerDay?.map((data: any) => {
        return {
          date: data?.date.split("T")[0],
          "Total Transactions": data["count"],
        };
      });
      setTransactionPerDay(temp);
    }

    if (data2) {
      let temp = [];
      temp = data2?.transactionsPerShipmentType?.map((data: any) => {
        return {
          "Shipment Type": data["name"],
          "Total Transactions": data["count"],
        };
      });
      setTransactionPerShipmentType(temp);
    }

    if (data3) {
      let temp = [];
      temp = data3?.productsPerCategory?.map((data: any) => {
        return {
          Category: data["name"],
          "Total Products": data["count"],
        };
      });
      setProductPerCategory(temp);
    }
  }, [data1, data2, data3]);

  if (loading1 || loading2 || loading3) {
    return null;
  }

  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      Category,
      value,
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";
    console.log(props);
    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.Category}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >{`${Category} - ${value}`}</text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`(Total Product ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  const onPieEnter = (_: any, index: any) => {
    setPieState({
      activeIndex: index,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.section_wrapper}>
        <div className={styles.section_header}>
          <div
            className={`${styles.header} ${styles.title} ${styles.large} ${styles.bold}`}
          >
            <p>Analisis Tohopedia</p>
          </div>
          <div className={`${styles.header} ${styles.subtitle}`}>
            <span>
              <b>Live Update</b>
            </span>
          </div>
        </div>
      </div>
      <div className={styles.section_wrapper}>
        <section className={styles.data_visual_section}>
          <div className={styles.section_header}>
            <div
              className={`${styles.header} ${styles.title} ${styles.medium} ${styles.bold}`}
            >
              <p>Statistik Tohopedia</p>
            </div>
          </div>
          <div className={styles.tab_section}>
            <section
              className={`${styles.tab} ${
                statisticIndex == 0 ? styles.active_tab : ""
                }`}
              onClick={()=>{setStatisticIndex(0)}}
            >
              <div>
                <div
                  className={`${styles.header} ${styles.title} ${styles.small} ${styles.light}`}
                >
                  Transaksi Setiap
                </div>
              </div>
              <h3>Hari</h3>
            </section>
            <section
              className={`${styles.tab} ${
                statisticIndex == 1 ? styles.active_tab : ""
                }`}
              onClick={()=>{setStatisticIndex(1)}}
            >
              <div>
                <div
                  className={`${styles.header} ${styles.title} ${styles.small} ${styles.light}`}
                >
                  Transaksi Setiap
                </div>
              </div>
              <h3>Jenis Pengiriman</h3>
            </section>
            <section
              className={`${styles.tab} ${
                statisticIndex == 2 ? styles.active_tab : ""
                }`}
              onClick={()=>{setStatisticIndex(2)}}
            >
              <div>
                <div
                  className={`${styles.header} ${styles.title} ${styles.small} ${styles.light}`}
                >
                  Produk Setiap
                </div>
              </div>
              <h3>Kategori</h3>
            </section>
          </div>
          <div className={styles.data_visualization_content}>
            <div className={styles.data_visualization_container}>
              {statisticIndex == 0 && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    width={100}
                    height={100}
                    data={transactionPerDay}
                    // data={data1?.adminData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="Total Transactions"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                    {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
                  </LineChart>
                </ResponsiveContainer>
              )}
              {statisticIndex == 1 && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    width={500}
                    height={300}
                    data={transactionPerShipmentType}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <XAxis dataKey="Shipment Type" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Total Transactions" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              )}
              {statisticIndex == 2 && (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart width={400} height={400}>
                    <Pie
                      activeIndex={pieState?.activeIndex}
                      activeShape={renderActiveShape}
                      data={productPerCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={100}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="Total Products"
                      onMouseEnter={onPieEnter}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

AdminHome.getLayout = function getLayout(page: any) {
  return <AdminLayout>{page}</AdminLayout>;
};
