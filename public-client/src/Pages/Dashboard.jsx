import { Spin } from "antd";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { useGetDashboardDataQuery } from "../app/features/api/dashboardApiSlice";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const auth = useSelector((state) => state.auth);
  const { data: dashboardData, isLoading } = useGetDashboardDataQuery();

  if (auth.userData.role !== "Admin")
    return (
      <h1 className="text-center mt-24 text-red-300 uppercase">
        You are not authorized to view this page
      </h1>
    );

  const options = {
    responsive: true,
    scales: {
      y: {
        ticks: {
          stepSize: 1,
          callback: (yValue) => {
            return Math.floor(yValue); // format to your liking
          },
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
        display: false,
      },
      title: {
        display: true,
        text: "Items Stock Data",
      },
    },
  };

  return (
    <main className="mt-14 p-2 md:p-4 lg:max-w-[1800px] mx-auto w-full">
      {isLoading && (
        <div className="mt-8 mx-auto flex justify-center items-center min-h-[500px]">
          <Spin size="large" />
        </div>
      )}
      {!isLoading && (
        <section>
          <div className="md:flex justify-around">
            <div className="w-80 h-80 mx-auto md:m-0">
              <h3 className="text-slate-600 text-center mt-3 mb-4">Orders</h3>
              <Doughnut
                data={{
                  labels: ["Open", "Confirmed", "Completed", "Cancelled"],
                  datasets: [
                    {
                      data: [
                        dashboardData.orders.open,
                        dashboardData.orders.confirmed,
                        dashboardData.orders.completed,
                        dashboardData.orders.cancelled,
                      ],
                      backgroundColor: [
                        "#94a3b8",
                        "#eab308",
                        "#4ade80",
                        "#fca5a5",
                      ],
                      borderColor: ["#94a3b8", "#eab308", "#4ade80", "#fca5a5"],
                      borderWidth: 1,
                    },
                  ],
                }}
              />
            </div>

            <div className="w-80 h-80 mt-12 mx-auto md:m-0">
              <h3 className="text-slate-600 text-center mt-3 mb-4">Returns</h3>
              <Doughnut
                data={{
                  labels: ["Pending", "Approved", "Completed"],
                  datasets: [
                    {
                      data: [
                        dashboardData.returns.pending,
                        dashboardData.returns.approved,
                        dashboardData.returns.completed,
                      ],
                      backgroundColor: ["#94a3b8", "#eab308", "#4ade80"],
                      borderColor: ["#94a3b8", "#eab308", "#4ade80"],
                      borderWidth: 1,
                    },
                  ],
                }}
              />
            </div>
          </div>

          <div className="md:max-w-xl mt-12 mx-auto px-2 mb-6 nd:mb-0">
            <Bar
              options={options}
              data={{
                labels: ["On Stock", "Low On Stock", "Out Of Stock"],
                datasets: [
                  {
                    data: [
                      dashboardData.items.onStock,
                      dashboardData.items.lowOnStock,
                      dashboardData.items.outOfStock,
                    ],
                    backgroundColor: ["#4ade80", "#eab308", "#fca5a5"],
                  },
                ],
              }}
            />
          </div>
        </section>
      )}
    </main>
  );
};

export default Dashboard;
