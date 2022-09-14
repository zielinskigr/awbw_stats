import { countryColorMap, countryNameMap } from "./mappings";
import { workOnStats } from "./getStats";
import { element } from "./components/element";

export async function generateCharts() {
  const container = document.getElementById("gamecontainer");
  const chartContainer = displayChart();
  container.appendChild(chartContainer);
  let chartsData;
  try {
    chartsData = await workOnStats();
  }
  catch (e) {
    chartContainer.remove();
    console.log(e);
  }
  if (!chartsData) {
    chartContainer.remove();
    throw new Error("Failed to load game data.")    
  }
  const loader = document.getElementById("chartloader");
  loader.remove();
  // console.log("CHARTS DATA", chartsData);
  const players = Object.keys(chartsData);
  const turns = (chartsData) => {
    let turns = [];
    Object.values(chartsData).forEach((playerData) => {
      turns.push(playerData.turns);
    });
    // console.log(turns);
    return turns;
  };

  const maxTurns = Math.max(...turns(chartsData));
  const labels = Array.from(Array(maxTurns).keys());
  let datasets = [];
  Object.values(chartsData).forEach((playerData) => {
    let dataset = {
      label: playerData.name + " Funds",
      backgroundColor: countryColorMap[playerData.country],
      borderColor: countryColorMap[playerData.country],
      data: playerData.funds,
    };
    datasets.push(dataset);
  });
  const data = {
    labels: labels,
    datasets: datasets,
  };
  const config = {
    type: "line",
    data: data,
    options: {},
  };
  const myChart = new Chart(document.getElementById("fundschart"), config);
  datasets = [];
  Object.values(chartsData).forEach((playerData) => {
    let dataset = {
      label: playerData.name + " Income",
      backgroundColor: countryColorMap[playerData.country],
      borderColor: countryColorMap[playerData.country],
      data: playerData.income,
    };
    datasets.push(dataset);
  });

  const data2 = {
    labels: labels,
    datasets: datasets,
  };
  const config2 = {
    type: "line",
    data: data2,
    options: {},
  };
  const myChart2 = new Chart(document.getElementById("incomechart"), config2);
  datasets = [];
  Object.values(chartsData).forEach((playerData) => {
    let dataset = {
      label: playerData.name + " Unit Count",
      backgroundColor: countryColorMap[playerData.country],
      borderColor: countryColorMap[playerData.country],
      data: playerData.unitCount,
    };
    datasets.push(dataset);
  });
  const data3 = {
    labels: labels,
    datasets: datasets,
  };
  const config3 = {
    type: "line",
    data: data3,
    options: {},
  };
  const myChart3 = new Chart(document.getElementById("ucchart"), config3);

  datasets = [];
  Object.values(chartsData).forEach((playerData) => {
    let dataset = {
      label: playerData.name + " Unit Value",
      backgroundColor: countryColorMap[playerData.country],
      borderColor: countryColorMap[playerData.country],
      data: playerData.unitValue,
    };
    datasets.push(dataset);
  });
  const data4 = {
    labels: labels,
    datasets: datasets,
  };
  const config4 = {
    type: "line",
    data: data4,
    options: {},
  };
  const myChart4 = new Chart(document.getElementById("uvchart"), config4);
  document.getElementById("fundschart").setAttribute("style", "display: block;")

}

function displayChart() {

  const fundsButton = element({
    tag: "div",
    attributes: [["id", "fundsbutton"]],
    children: ['Total Funds']
  });
  const incomeButton = element({
    tag: "div",
    attributes: [["id", "incomebutton"]],
    children: ['Income']
  });
  const ucButton = element({
    tag: "div",
    attributes: [["id", "ucbutton"]],
    children: ['Unit Count']
  });
  const uvButton = element({
    tag: "div",
    attributes: [["id", "uvbutton"]],
    children: ['Army Value']
  });
  const closeButton = element({
    tag: "div",
    attributes: [["style", "position:absolute;right: -10px;background: #ddd;padding: 5px;top: -6px;"], ["id", "closebutton"]],
    children: ['X']
  });


  closeButton.onclick = () => {
    chartContainer.remove();
  };


  const fundsCanvas = element({
    tag: "canvas",
    attributes: [["style", "display: none;"], ["id", "fundschart"]],
  });
  const incomeCanvas = element({
    tag: "canvas",
    attributes: [["style", "display: none;"], ["id", "incomechart"]],
  });
  const ucCanvas = element({
    tag: "canvas",
    attributes: [["style", "display: none;"], ["id", "ucchart"]],
  });
  const uvCanvas = element({
    tag: "canvas",
    attributes: [["style", "display: none;"], ["id", "uvchart"]],
  });

  fundsButton.onclick = () => {
    fundsCanvas.setAttribute("style", "display: block;");
    incomeCanvas.setAttribute("style", "display: none;");
    ucCanvas.setAttribute("style", "display: none;");
    uvCanvas.setAttribute("style", "display: none;");
  };
  incomeButton.onclick = () => {
    fundsCanvas.setAttribute("style", "display: none;");
    incomeCanvas.setAttribute("style", "display: block;");
    ucCanvas.setAttribute("style", "display: none;");
    uvCanvas.setAttribute("style", "display: none;");
  };
  ucButton.onclick = () => {
    fundsCanvas.setAttribute("style", "display: none;");
    incomeCanvas.setAttribute("style", "display: none;");
    ucCanvas.setAttribute("style", "display: block;");
    uvCanvas.setAttribute("style", "display: none;");
  };
  uvButton.onclick = () => {
    fundsCanvas.setAttribute("style", "display: none;");
    incomeCanvas.setAttribute("style", "display: none;");
    ucCanvas.setAttribute("style", "display: none;");
    uvCanvas.setAttribute("style", "display: block;");
  };
  const chartsMenu = element({
    tag: "div",
    attributes: [["id", "chartsmenu"],[ "style", "position:relative;display: flex;flex-flow: row;justify-content: space-around;margin-top: -25px;margin-bottom: 10px;cursor: pointer;"]],
    children: [fundsButton, incomeButton, ucButton, uvButton, closeButton]
  })
  const loader = element({
    tag: "div",
    attributes: [["id", "chartloader"]],
    children: ['Fetching game data, this can take up to a minute depending on game length, please wait...']
  })
  const chartContainer = element({
    tag: "div",
    attributes: [["id", "chartscontainer"], ["style", "position: relative; margin-top:20px;top: 33%;width: 600px;height: 320px;padding: 40px 20px 20px;background: #fff;overflow: hidden;display: flex;flex-flow: column;"]],
    children: [chartsMenu, loader, fundsCanvas, incomeCanvas, ucCanvas, uvCanvas]
  })

  return chartContainer;
}