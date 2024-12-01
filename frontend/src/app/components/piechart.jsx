"use client";

import {gradeColors} from "../constants";
import {Pie} from "react-chartjs-2";
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function GradePieChart({itemData}) {
  const dataset = itemData ? [
    itemData["A"] || 0,
    itemData["B+"] || 0,
    itemData["B"] || 0,
    itemData["C+"] || 0,
    itemData["C"] || 0,
    itemData["D+"] || 0,
    itemData["D"] || 0,
    itemData["F"] || 0,
    itemData["W"] || 0,
  ] : [0, 0, 0, 0, 0, 0, 0, 0, 0];

  const data = itemData ? {
    labels: ["A", "B+", "B", "C+", "C", "D+", "D", "F", "W"],
    datasets: [
      {
        label: "จำนวน",
        data: dataset,
        backgroundColor:
          [
            gradeColors["A"],
            gradeColors["B+"],
            gradeColors["B"],
            gradeColors["C+"],
            gradeColors["C"],
            gradeColors["D+"],
            gradeColors["D"],
            gradeColors["F"],
            gradeColors["W"],
          ],
        hoverOffset: 4,
      },
    ],
  } : {
    labels: ["no data"],
    datasets: [
      {
        label: "no data",
        data: [999],
        backgroundColor:
          [
            "#9E9E9E",
          ],
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          color: "#8d8d8d",
          font: {
            size: 14,
          },
        },
        position: "left",
      },
    },
  };

  return <Pie data={data} options={options} className="border rounded"/>;
}