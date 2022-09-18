export const charts = {
  fundschart: {
    name: "Total Funds Generated",
    button: {
      id: "fundsbutton",
      children: 'Total Funds',
      chartName: "fundschart"
    },
    dataset: [{
      name: "fundsDataSet",
      type: "line"
    }],
    data: "funds",
  },
  incomechart: {
    name: "Income",
    button: {
      id: "incomebutton",
      children: 'Income',
      chartName: "incomechart"
    },
    dataset:  [{
      name: "incomeDataSet",
      type: "line"
    }],
    data: "income",
  },
  ucchart: {
    name: "Unit Count",
    button: {
      id: "ucbutton",
      children: 'Unit Count',
      chartName: "ucchart"
    },
    dataset: [{
      name: "ucDataSet",
      type: "line"
    }],
    data: "unitCount",
  },
  uvchart: {
    name: "Unit Value",
    button: {
      id: "uvbutton",
      children: 'Army Value',
      chartName: "uvchart"
    },
    dataset: [{
      name: "uvDataSet",
      type: "line"
    }],
    data: "unitValue",
  },
  // uvchart2: {
  //   name: "Unit Value2",
  //   button: {
  //     id: "uvbutton2",
  //     children: 'Army Value',
  //     chartName: "uvchart2"
  //   },
  //   dataset: "uvDataSet2",
  //   data: "unitValue2",
  //   type: "line"
  // },
  hpchart: {
    name: "Unit HP",
    button: {
      id: "hpbutton",
      children: 'Unit HP',
      chartName: "hpchart"
    },
    dataset: [{
      name: "hpDataSet",
      type: "line"
    }],
    data: "unitHP",
  },
  // hpcchart: {
  //   name: "Unit HP/Count",
  //   button: {
  //     id: "hpcbutton",
  //     children: 'Unit HP/Count',
  //     chartName: "hpcchart"
  //   },
  //   dataset: [{
  //     name: "hpcDataSet",
  //     type: "line"
  //   }],
  //   data: "unitHPCount",
  // },
  capturechart: {
    name: "Caps",
    button: {
      id: "capturebutton",
      children: "Caps",
      chartName: "capturechart"
    },
    dataset: [{
      name: "captureDataSet",
      type: "bar"
    }],
    data: "captureCount",
  },
  damagedealtchart: {
    name: "Damage Dealt",
    button: {
      id: "damagedealtbutton",
      children: "Damage Dealt",
      chartName: "damagedealtchart"
    },
    dataset: [{
      name: "damageDealtDataSet",
      type: "bar"
    }],
    data: "damageDealt",
  },
  // ucuvchart: {
  //   name: "UC/UV",
  //   button: {
  //     id: "ucuvbutton",
  //     children: "UC/UV",
  //     chartName: "ucuvchart",
  //   },
  //   dataset: "ucuvDataSet",
  // }
};
