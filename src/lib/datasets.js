import { countryColorMap } from "./mappings";
import { charts } from "./charts";

export function generateChartDatasets(chartsData) {
  let datasets = {
    fundsDataSet: [],
    incomeDataSet: [],
    ucDataSet: [],
    uvDataSet: [],
    hpDataSet: [],
    hpcDataSet: [],
  };
  

  // console.log("chartsData", chartsData);
  Object.keys(charts).forEach((chartId) => {
    Object.values(chartsData).forEach((playerData) => {
      let dataset = {
        label: playerData.name + ' ' + charts[chartId].name,
        backgroundColor: countryColorMap[playerData.country].primary,
        borderColor: countryColorMap[playerData.country].primary,
        data: playerData[charts[chartId].data],
      };

      datasets[charts[chartId].dataset].push(dataset);
    });
  })

    return datasets;
}

export function drawCharts(chartsData, labels) {
  let datasets = generateChartDatasets(chartsData);
  console.log("datasets", datasets);

  Object.keys(charts).forEach((chartId) => {
    const data = {
      labels: labels,
      datasets: datasets[charts[chartId].dataset],
    };
    const config = {
      type: "line",
      data: data,
      options: {},
    };
    new Chart(document.getElementById(chartId), config);
  })
  
  document.getElementById("fundschart").setAttribute("style", "display: block;");
}
