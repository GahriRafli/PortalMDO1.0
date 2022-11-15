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

const data = (canvas) => {
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, 0, 450);

  gradient.addColorStop(0, "rgba(255, 0,0, 0.5)");
  gradient.addColorStop(0.5, "rgba(255, 0, 0, 0.25)");
  gradient.addColorStop(1, "rgba(255, 0, 0, 0)");

  return {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Custom Label Name",
        backgroundColor: gradient,
        pointBackgroundColor: "white",
        borderWidth: 1,
        borderColor: "#911215",
        data: [50, 55, 80, 81, 54, 50],
      },
    ],
  };
};

const options = {
  responsive: true,
  maintainAspectRatio: true,
  animation: {
    easing: "easeInOutQuad",
    duration: 520,
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          color: "rgba(200, 200, 200, 0.05)",
          lineWidth: 1,
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          color: "rgba(200, 200, 200, 0.08)",
          lineWidth: 1,
        },
      },
    ],
  },
  elements: {
    line: {
      tension: 0.4,
    },
  },
  legend: {
    display: false,
  },
  point: {
    backgroundColor: "white",
  },
  tooltips: {
    backgroundColor: "rgba(0,0,0,0.3)",
    titleFontColor: "red",
    caretSize: 5,
    cornerRadius: 2,
    xPadding: 10,
    yPadding: 10,
  },
};

export const CustomChart = () => {
  return (
    <div>
      <Chart type={"line"} data={data} options={options} />
    </div>
  );
};
