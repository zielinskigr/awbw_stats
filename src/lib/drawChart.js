import { workOnStats } from "./getStats";
import { element } from "./components/element";
import { charts } from "./charts";
import { generateChartDatasets } from "./datasets";

export async function generateCharts() {
  const container = document.getElementById("gamecontainer");
  const chartContainer = displayChart();
  container.appendChild(chartContainer);
  let chartsData;
  try {
    chartsData = await workOnStats();
  } catch (e) {
    chartContainer.remove();
    console.log(e);
  }
  if (!chartsData) {
    chartContainer.remove();
    throw new Error("Failed to load game data.");
  }
  const loader = document.getElementById("chartloader");
  loader.remove();
  const players = Object.keys(chartsData);
  const turns = (chartsData) => {
    let turns = [];
    Object.values(chartsData).forEach((playerData) => {
      turns.push(playerData.turns);
    });
    return turns;
  };

  const maxTurns = Math.max(...turns(chartsData));
  const labels = Array.from(Array(maxTurns).keys(), x => x + 1);
  drawCharts(chartsData, labels);
}

function displayChart() {
  let buttons = [];
  let chartsCanvases = [];
  Object.keys(charts).forEach((chartId) => {
    let button = element({
      tag: "div",
      attributes: [["id", charts[chartId].button.id]],
      children: [charts[chartId].button.children],
    });

    button.onclick = () => {
      Object.keys(charts).forEach((subChartId) => {
        document
          .getElementById(charts[subChartId].button.chartName)
          .setAttribute("style", "display: none;");
      });
      document
        .getElementById(charts[chartId].button.chartName)
        .setAttribute("style", "display: block;");
    };

    let canvas = element({
      tag: "canvas",
      attributes: [
        ["style", "display: none;"],
        ["id", charts[chartId].button.chartName],
      ],
    });

    buttons.push(button);
    chartsCanvases.push(canvas);
  });

  const closeButton = element({
    tag: "div",
    attributes: [
      [
        "style",
        "position:absolute;right: -10px;background: #ddd;padding: 5px;top: -6px;",
      ],
      ["id", "closebutton"],
    ],
    children: ["X"],
  });
  closeButton.onclick = () => {
    chartContainer.remove();
  };

  const chartsMenu = element({
    tag: "div",
    attributes: [
      ["id", "chartsmenu"],
      [
        "style",
        "position:relative;display: flex;flex-flow: row;justify-content: space-around;margin-top: -25px;margin-bottom: 10px;cursor: pointer;",
      ],
    ],
    children: [...buttons, closeButton],
  });
  const loader = element({
    tag: "div",
    attributes: [["id", "chartloader"]],
    children: [
      "Fetching game data, this can take up to a minute depending on game length, please wait...",
    ],
  });
  const chartContainer = element({
    tag: "div",
    attributes: [
      ["id", "chartscontainer"],
      [
        "style",
        "position: relative; margin-top:20px;top: 33%;max-width: 1000px;width: 100%;height: 500px;padding: 40px 20px 20px;background: #fff;overflow: hidden;display: flex;flex-flow: column;",
      ],
    ],
    children: [chartsMenu, loader, ...chartsCanvases],
  });

  return chartContainer;
}

export function drawCharts(chartsData, labels) {
  let datasets = generateChartDatasets(chartsData);
  console.log("datasets", datasets);

  Object.keys(charts).forEach((chartId) => {
    const data = {
      labels: labels,
      datasets: datasets[charts[chartId].dataset[0].name],
    };
    const config = {
      type: charts[chartId].dataset[0].type,
      data: data,
      options: {},
    };
    new Chart(document.getElementById(chartId), config);
  })
  
  document.getElementById("fundschart").setAttribute("style", "display: block;");
}