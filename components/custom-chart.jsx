import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const LineChartGradient = ({ chartData, title }) => {
  const options = {
    // maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
    },
    elements: {
      line: {
        tension: 0.35,
      },
    },
    plugins: {
      title: { display: title ? true : false, text: `${title}` },
      legend: { display: false, position: "bottom" },
      filler: {
        propagate: false,
      },
    },
    interaction: {
      intersect: true,
    },
  };

  return (
    <div>
      <Line data={chartData} options={options} />
    </div>
  );
};
