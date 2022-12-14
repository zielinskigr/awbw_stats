import { countryColorMap } from "./mappings";
import { charts } from "./charts";

export function generateChartDatasets(chartsData) {
  let datasets = {
    fundsDataSet: [],
    incomeDataSet: [],
    ucDataSet: [],
    uvDataSet: [],
    uvDataSet2: [],
    hpDataSet: [],
    hpcDataSet: [],
    ucuvDataSet: [],
    captureDataSet: [],
    damageDealtDataSet: [],
    damageTakenDataSet: [],
    coPowerDataSet: [],
  };

  // console.log("chartsData", chartsData);
  Object.keys(charts).forEach((chartId) => {
    if (charts[chartId].name == "UC/UV") {
    } else {
      Object.values(chartsData).forEach((playerData) => {
        let dataset = {
          label: playerData.name + " " + charts[chartId].name,
          backgroundColor: countryColorMap[playerData.country].primary,
          borderColor: countryColorMap[playerData.country].primary,
          data: playerData[charts[chartId].data],
        };

        datasets[charts[chartId].dataset[0].name].push(dataset);

        let coDataset = {
          label: playerData.name + " Power",
          backgroundColor: countryColorMap[playerData.country].secondary,
          borderColor: countryColorMap[playerData.country].secondary,
          data: playerData["coPowerData"],
          type: "bubble"
        }
        datasets[charts[chartId].dataset[0].name].push(coDataset);
      });
    }
  });

  return datasets;
}
