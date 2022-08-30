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

export const ProblemChart = ({ chartData, title, chartType, onDisplay }) => {
  return (
    <div>
      <Chart
        data={chartData}
        options={{
          plugins: {
            title: { display: onDisplay, text: `${title}` },
            legend: { display: onDisplay, position: "bottom" },
          },
        }}
        type={chartType}
      />
    </div>
  );
};
