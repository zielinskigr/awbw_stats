import { countryColorMap, countryNameMap } from "./mappings";

export function generateChartDatasets(chartsData) {
  let fundsDataSet = [];
  let incomeDataSet = [];
  let ucDataSet = [];
  let uvDataSet = [];
  let hpDataSet = [];
  let hpcDataSet = [];
  // console.log("chartsData", chartsData);
  Object.values(chartsData).forEach((playerData) => {
    let dataset = {
      label: playerData.name + " Funds",
      backgroundColor: countryColorMap[playerData.country].primary,
      borderColor: countryColorMap[playerData.country].primary,
      data: playerData.funds,
    };
      fundsDataSet.push(dataset);
      let dataset2 = {
        label: playerData.name + " Income",
        backgroundColor: countryColorMap[playerData.country].primary,
        borderColor: countryColorMap[playerData.country].primary,
        data: playerData.income,
      };
      incomeDataSet.push(dataset2);
      let dataset3 = {
        label: playerData.name + " Unit Count",
        backgroundColor: countryColorMap[playerData.country].primary,
        borderColor: countryColorMap[playerData.country].primary,
        data: playerData.unitCount
      };
      ucDataSet.push(dataset3);
      let dataset4 = {
        label: playerData.name + " Unit Value",
        backgroundColor: countryColorMap[playerData.country].primary,
        borderColor: countryColorMap[playerData.country].primary,
        data: playerData.unitValue,
      };
      uvDataSet.push(dataset4);
      let dataset5 = {
        label: playerData.name + " Unit HP",
        backgroundColor: countryColorMap[playerData.country].primary,
        borderColor: countryColorMap[playerData.country].primary,
        data: playerData.unitHP,
      };
      hpDataSet.push(dataset5);
      let dataset6 = {
        label: playerData.name + " Unit HP/Count",
        backgroundColor: countryColorMap[playerData.country].primary,
        borderColor: countryColorMap[playerData.country].primary,
        data: playerData.unitHPCount,
      };
      hpcDataSet.push(dataset6);
    });

    return {
      fundsDataSet,
      incomeDataSet,
      ucDataSet,
      uvDataSet,
      hpDataSet,
      hpcDataSet
    }
}

export function drawCharts(chartsData, labels) {
  let datasets = generateChartDatasets(chartsData);
  console.log("datasets", datasets);
  const data1 = {
    labels: labels,
    datasets: datasets.fundsDataSet,
  };
  const config1 = {
    type: "line",
    data: data1,
    options: {},
  };
  const myChart1 = new Chart(document.getElementById("fundschart"), config1);
  const data2 = {
    labels: labels,
    datasets: datasets.incomeDataSet,
  };
  const config2 = {
    type: "line",
    data: data2,
    options: {},
  };
  const myChart2 = new Chart(document.getElementById("incomechart"), config2);

  const data3 = {
    labels: labels,
    datasets: datasets.ucDataSet,
  };
  const config3 = {
    type: "line",
    data: data3,
    options: {},
  };
  const myChart3 = new Chart(document.getElementById("ucchart"), config3);

  const data4 = {
    labels: labels,
    datasets: datasets.uvDataSet,
  };
  const config4 = {
    type: "line",
    data: data4,
    options: {},
  };
  const myChart4 = new Chart(document.getElementById("uvchart"), config4);
  const data5 = {
    labels: labels,
    datasets: datasets.hpDataSet,
  };
  const config5 = {
    type: "line",
    data: data5,
    options: {},
  };
  const myChart5 = new Chart(document.getElementById("hpchart"), config5);
  const data6 = {
    labels: labels,
    datasets: datasets.hpcDataSet,
  };
  const config6 = {
    type: "line",
    data: data6,
    options: {},
  };
  const myChart6 = new Chart(document.getElementById("hpcchart"), config6);
  document.getElementById("fundschart").setAttribute("style", "display: block;");
}
