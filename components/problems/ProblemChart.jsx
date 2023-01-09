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
  PieController,
} from "chart.js";

import { Chart } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineController,
  BarController,
  PieController,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const ProblemChart = ({
  chartData,
  indexAxis,
  title,
  chartType,
  onDisplay,
  stringLimit,
}) => {
  return (
    <Chart
      data={chartData}
      options={{
        plugins: {
          title: { display: onDisplay, text: `${title}` },
          legend: { display: onDisplay, position: "bottom" },
        },
        indexAxis: indexAxis,
        scales: {
          x: {
            ticks: {
              callback: function (value, index, ticks_array) {
                let characterLimit = stringLimit;
                let label = this.getLabelForValue(value);
                if (!label.includes(".")) {
                  if (label.length >= characterLimit) {
                    return (
                      label
                        .slice(0, label.length)
                        .substring(0, characterLimit - 1)
                        .trim() + "..."
                    );
                  }
                  return label;
                }
              },
              beginAtZero: true,
              min: 0,
            },
          },
          y: {
            ticks: {
              callback: function (value, index, ticks_array) {
                let characterLimit = stringLimit;
                let label = this.getLabelForValue(value);
                if (!label.includes(".")) {
                  if (label.length >= characterLimit) {
                    return (
                      label
                        .slice(0, label.length)
                        .substring(0, characterLimit - 1)
                        .trim() + "..."
                    );
                  }
                  return label;
                }
              },
            },
            beginAtZero: true,
            min: 0,
          },
        },
      }}
      type={chartType}
    />
  );
};
