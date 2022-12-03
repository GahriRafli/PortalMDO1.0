import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineController,
  BarController,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineController,
  BarController,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const CustomChart = ({ chartData, title, chartType }) => {
  return (
    <div>
      <Chart
        type={chartType}
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            title: { display: true, text: `${title}` },
            legend: { display: false, position: "bottom" },
          },
          scale: {
            ticks: {
              precision: 0,
            },
          },
        }}
      />
    </div>
  );
};
