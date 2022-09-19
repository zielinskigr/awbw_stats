// ==UserScript==
// @name          AWBW Stats
// @namespace     https://github.com/zielinskigr/awbw_stats/
// @version       0.2.1
// @author        zielinskigr
// @source        https://github.com/zielinskigr/awbw_stats/
// @match         https://awbw.amarriner.com/2030.php*
// @require       https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js
// @icon          https://raw.githubusercontent.com/zielinskigr/awbw_stats/main/res/img/stats128.png
// @description   Enchanced Stats Charts for Advance Wars By Web
// ==/UserScript==


/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/lib/helpers.js
function docReady(fn) {
  // see if DOM is already available
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    // call on next available tick
    setTimeout(fn, 1);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

async function delay(ms) {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}

;// CONCATENATED MODULE: ./src/api/fetchData.js
async function fetchGameInfo(replayId, ndx = 0) {
  const response = await fetch(
    "https://awbw.amarriner.com/api/game/load_replay.php",
    {
      method: "POST",
      body: JSON.stringify({
        gameId: replayId,
        turn: ndx,
        initial: true,
      }),
    }
  );

  return response.json();
}

;// CONCATENATED MODULE: ./src/lib/getStats.js



async function getStats(gameId) {
  const gameInfo = await fetchGameInfo(gameId);
  const turns = gameInfo.daySelector.length;
  let playerTurns = {};

  if (gameInfo.players.length !== 2) {
    throw new Error("Can only work on 2 players, sorry.");
  }
  gameInfo.players.forEach(async (player) => {
    playerTurns[player.id] = {
      player: player,
      turnsArray: [],
    };
  });
  let turn;
  let i = 0;
  while (i < turns) {
    await delay(250);
    turn = await fetchGameInfo(gameId, i);
    playerTurns[turn.gameState.currentTurnPId].turnsArray.push(turn);
    i++;
  }

  return playerTurns;
}

async function workOnStats() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const gameId = urlSearchParams.get("games_id");
  const playerTurns = await getStats(gameId);

  console.log("playerTurns", playerTurns);

  let chartData = {};
  Object.keys(playerTurns).forEach((playerId) => {
    chartData[playerId] = {
      name: playerTurns[playerId].turnsArray[0].gameState.players[playerId]
        .users_username,
      turns: playerTurns[playerId].turnsArray.length,
      country: playerTurns[playerId].player.countries_id,
      units: [],
      funds: [],
      income: [],
      unitCount: [],
      unitValue: [],
      unitValue2: [],
      unitHP: [],
      unitHPCount: [],
      captureCount: [],
      damageDealt: [],
      damageTaken: [],
      coPowers: [],
    };
  });
  console.log("chartdata", chartData);
  const players = Object.keys(chartData);
  Object.keys(playerTurns).forEach((playerId) => {
    let totalFunds = 0;
    playerTurns[playerId].turnsArray.forEach((turn, turnNumber) => {
      chartData[playerId].coPowers[turnNumber] = 0;
      // Set up Turn.
      if (!chartData[players[0]].damageDealt[turnNumber]) {
        chartData[players[0]].damageDealt[turnNumber] = 0;
      }
      if (!chartData[players[0]].damageTaken[turnNumber]) {
        chartData[players[0]].damageTaken[turnNumber] = 0;
      }
      if (!chartData[players[1]].damageDealt[turnNumber]) {
        chartData[players[1]].damageDealt[turnNumber] = 0;
      }
      if (!chartData[players[1]].damageTaken[turnNumber]) {
        chartData[players[1]].damageTaken[turnNumber] = 0;
      }
      // Store turn units
      if (!chartData[playerId].units[turnNumber]) {
        chartData[playerId].units.push(turn.gameState.units);
      }

      // Prepare funds
      totalFunds += turn.gameState.players[playerId].players_funds;

      // Prepare HP
      let hp = 0;
      Object.values(turn.gameState.units).forEach((unit) => {
        if (unit.units_players_id == playerId) {
          hp += unit.units_hit_points;
        }
      });

      // Prepare HP/Count
      let hpc = hp/turn.gameState.players_units_count[playerId].total

      // Handle Actions
      let captures = 0;
      let damageDealt = 0;
      let damageTaken = 0;
      Object.values(turn.actions).forEach((action) => {
        // Handle powers
        if (action.action === 'Power') {
          chartData[playerId].coPowers[turnNumber]++;
          if (action.hpChange) {
            if (action.hpChange.hpGain) {
              action.hpChange.hpGain.players.forEach((changePlayerId) => {
                Object.values(chartData[changePlayerId].units[turnNumber]).forEach((changeUnit) => {
                  chartData[changePlayerId].units[turnNumber][changeUnit.units_id].units_hit_points += action.hpChange.hpGain.hp;
                  if (chartData[changePlayerId].units[turnNumber][changeUnit.units_id].units_hit_points >= 10) {
                    chartData[changePlayerId].units[turnNumber][changeUnit.units_id].units_hit_points = 10;
                  }
                })
              })
            }
            if (action.hpChange.hpLoss) {
              action.hpChange.hpLoss.players.forEach((changePlayerId) => {
                Object.values(chartData[changePlayerId].units[turnNumber]).forEach((changeUnit) => {
                  chartData[changePlayerId].units[turnNumber][changeUnit.units_id].units_hit_points += action.hpChange.hpLoss.hp;
                  if (chartData[changePlayerId].units[turnNumber][changeUnit.units_id].units_hit_points <= 0) {
                    chartData[changePlayerId].units[turnNumber][changeUnit.units_id].units_hit_points = 0;
                  }
                })
              })
            }
          }
        }
        // Handle captures
        if (action.action === 'Capt' && action.buildingInfo.buildings_capture == 20) {
          captures++;
        }
        // Handle damage
        if (action.action === "Fire") {
          let attackerId = action.attacker.units_id;
          let attackerPlayerId = chartData[playerId].units[turnNumber][attackerId].units_players_id;
          let attackerCost = chartData[playerId].units[turnNumber][attackerId].units_cost;
          let attackerPreHP = chartData[playerId].units[turnNumber][attackerId].units_hit_points;
          let attackerPostHp = action.attacker.units_hit_points;
          if (attackerPostHp != 10) {
            if (attackerPostHp == 0) {
              damageTaken = Math.round(attackerCost / 10 * attackerPreHP);
              chartData[playerId].units[turnNumber][attackerId].units_hit_points = 0;
            } else {
              damageTaken = Math.round(attackerCost / 10 * (attackerPreHP - attackerPostHp));
              chartData[playerId].units[turnNumber][attackerId].units_hit_points = attackerPostHp;

            }
          }
          let defenderId = action.defender.units_id; 
          let defenderPlayerId = turn.gameState.units[defenderId].units_players_id;
          let defenderCost = chartData[playerId].units[turnNumber][defenderId].units_cost;
          let defenderPreHp = chartData[playerId].units[turnNumber][defenderId].units_hit_points;
          let defenderPostHp = action.defender.units_hit_points;
          if (defenderPostHp != 10) {
            if (defenderPostHp == 0) {
              damageDealt = Math.round(defenderCost / 10 * defenderPreHp);
              chartData[playerId].units[turnNumber][defenderId].units_hit_points = 0;
            } else {
              damageDealt = Math.round(defenderCost / 10 * (defenderPreHp - defenderPostHp));
              chartData[playerId].units[turnNumber][defenderId].units_hit_points = defenderPostHp;
            }
          }
          chartData[attackerPlayerId].damageDealt[turnNumber] += damageDealt;
          chartData[defenderPlayerId].damageDealt[turnNumber] += damageTaken;
        }
      });


      // Assign matrixes
      chartData[playerId].funds.push(totalFunds);
      chartData[playerId].income.push(
        turn.gameState.players[playerId].players_income
      );
      chartData[playerId].unitCount.push(
        turn.gameState.players_units_count[playerId].total
      );
      chartData[playerId].unitValue.push(
        turn.gameState.players_units_count[playerId].value
      );
      chartData[playerId].unitValue2.push(
        turn.gameState.players_units_count[playerId].value/1000
      );
      chartData[playerId].unitHP.push(hp);
      chartData[playerId].unitHPCount.push(hpc);
      chartData[playerId].captureCount.push(captures);
    });
  });

  return chartData;
}

;// CONCATENATED MODULE: ./src/lib/components/element.js
const element_element = (options) => {
  options.attributes = options.attributes || [];
  options.classes = options.classes || [];
  options.children = options.children || [];

  const tag = document.createElement(options.tag);
  tag.classList.add(...options.classes);
  options.attributes.forEach(([name, value]) => {
    tag.setAttribute(name, value);
  });
  tag.innerText = "";
  options.children.forEach((child) => {
    if (typeof child === "string") {
      tag.innerText += child;
    } else {
      tag.appendChild(child);
    }
  });

  return tag;
};

;// CONCATENATED MODULE: ./src/lib/charts.js
const charts = {
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

;// CONCATENATED MODULE: ./src/lib/mappings.js
const countryColorMap = {
  1: {
    primary: "#F46243",
    secondary: "#F89F8B",
    tertiary: "#D4310C",
  },
  2: {
    primary: "#446EFF",
    secondary: "#99AFFF",
    tertiary: "#001F8F",
  },
  3: {
    primary: "#12D815",
    secondary: "#8EF690",
    tertiary: "#064B07",
  },
  4: {
    primary: "#FBD412",
    secondary: "#FDE986",
    tertiary: "#B59703",
  },
  5: {
    primary: "#8A3E96",
    secondary: "#C78BD0",
    tertiary: "#5D2965",
  },
  6: {
    primary: "#C4443D",
    secondary: "#CF6863",
    tertiary: "#9C3530",
  },
  7: {
    primary: "#999B98",
    secondary: "#C2C2C1",
    tertiary: "#525251",
  },
  8: {
    primary: "#C58950",
    secondary: "#DBB694",
    tertiary: "#8A5A2E",
  },
  9: {
    primary: "#FCA339",
    secondary: "#FDC886",
    tertiary: "#DD7B03",
  },
  10: {
    primary: "#CBDDBA",
    secondary: "#A2C284",
    tertiary: "#6F964A",
  },
  16: {
    primary: "#1B43BD",
    secondary: "#3B65E3",
    tertiary: "#122D7D",
  },
  17: {
    primary: "#FE68CF",
    secondary: "#FE9ADF",
    tertiary: "#FD0DB1",
  },
  19: {
    primary: "#3ACFC1",
    secondary: "#7CDFD5",
    tertiary: "#208379",
  },
  20: {
    primary: "#CE64FE",
    secondary: "#DF9AFE",
    tertiary: "#A602F2",
  },
  21: {
    primary: "#5F7C0C",
    secondary: "#8DBA12",
    tertiary: "#B3E920",
  },
  22: {
    primary: "#BB534F",
    secondary: "#C66F6C",
    tertiary: "#E2B7B6",
  },
};

const countryNameMap = {
  1: "Orange Star",
  2: "Blue Moon",
  3: "Green Earth",
  4: "Yellow Comet",
  5: "Black Hole",
  6: "Red Fire",
  7: "Grey Sky",
  8: "Brown Desert",
  9: "Amber Blaze",
  10: "Jade Sun",
  16: "Cobalt Ice",
  17: "Pink Cosmos",
  19: "Teal Galaxy",
  20: "Pruple Lightning",
  21: "Acid Rain",
  22: "White Nova",
};

;// CONCATENATED MODULE: ./src/lib/datasets.js



function generateChartDatasets(chartsData) {
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
  };
  

  // console.log("chartsData", chartsData);
  Object.keys(charts).forEach((chartId) => {
    if (charts[chartId].name == "UC/UV") {

    } else {
      Object.values(chartsData).forEach((playerData) => {
        let dataset = {
          label: playerData.name + ' ' + charts[chartId].name,
          backgroundColor: countryColorMap[playerData.country].primary,
          borderColor: countryColorMap[playerData.country].primary,
          data: playerData[charts[chartId].data],
        };

        datasets[charts[chartId].dataset[0].name].push(dataset);
      });
    };
  });
    datasets.ucuvDataSet = [...datasets.ucDataSet, ...datasets.uvDataSet2];
    return datasets;
}

;// CONCATENATED MODULE: ./src/lib/drawChart.js





async function generateCharts() {
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
    let button = element_element({
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

    let canvas = element_element({
      tag: "canvas",
      attributes: [
        ["style", "display: none;"],
        ["id", charts[chartId].button.chartName],
      ],
    });

    buttons.push(button);
    chartsCanvases.push(canvas);
  });

  const closeButton = element_element({
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

  const chartsMenu = element_element({
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
  const loader = element_element({
    tag: "div",
    attributes: [["id", "chartloader"]],
    children: [
      "Fetching game data, this can take up to a minute depending on game length, please wait...",
    ],
  });
  const chartContainer = element_element({
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

function drawCharts(chartsData, labels) {
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
;// CONCATENATED MODULE: ./src/index.js




function app() {
  const buttonText = element_element({
    tag: "div",
    classes: ["game-tools-bg"],
    children: ['Stats']
  });

  const button = element_element({
    tag: "div",
    classes: ["game-tools-btn", "enchanced-stats"],
    children: [buttonText],
  });

  button.onclick = () => {
    generateCharts();
  };

  const section = element_element({
    tag: "section",
    children: [button],
  });

  const menu = document.getElementById("game-menu-controls");
  menu.prepend(section);
}

docReady(app());

/******/ })()
;