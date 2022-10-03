import { fetchGameInfo } from "./../api/fetchData";
import { delay } from "./helpers";
import { handleActions } from "./actionParser";

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
    await delay(200);
    turn = await fetchGameInfo(gameId, i);
    playerTurns[turn.gameState.currentTurnPId].turnsArray.push(turn);
    i++;
  }
  return playerTurns;
}

export async function workOnStats() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const gameId = urlSearchParams.get("games_id");
  const playerTurns = await getStats(gameId);

  // console.log("playerTurns", playerTurns);

  let chartData = {};
  const players = Object.keys(playerTurns);
  let turnOrder = {};
  Object.keys(playerTurns).forEach((playerId) => {
    if (playerId == players[0]) {
      turnOrder[playerId] =
        playerTurns[players[0]].player.order >
        playerTurns[players[1]].player.order
          ? 2
          : 1;
    } else {
      turnOrder[playerId] =
        playerTurns[players[1]].player.order >
        playerTurns[players[0]].player.order
          ? 2
          : 1;
    }
  });
  Object.keys(playerTurns).forEach((playerId) => {
    chartData[playerId] = {
      name: playerTurns[playerId].turnsArray[0].gameState.players[playerId]
        .users_username,
      turns: playerTurns[playerId].turnsArray.length,
      country: playerTurns[playerId].player.countries_id,
      turnOrder: turnOrder[playerId],
      units: [],
      funds: [],
      income: [],
      unitCount: [],
      unitValue: [],
      unitHP: [],
      unitHPCount: [],
      captureCount: [],
      damageDealt: [],
      damageTaken: [],
      coPowers: [],
      coPowerData: [],
    };
  });
  // console.log("chartdata", chartData);
  let fundsGenerated = [];

  Object.keys(playerTurns).forEach((playerId) => {
    let totalFunds = 0;
    playerTurns[playerId].turnsArray.forEach((turn, turnNumber) => {
      chartData[playerId].coPowers[turnNumber] = 0;

      // Store turn units
      chartData[players[0]].units[turnNumber] = turn.gameState.units;
      chartData[players[1]].units[turnNumber] = turn.gameState.units;

      // Prepare funds
      totalFunds += turn.gameState.players[playerId].players_income;

      // Prepare HP
      let hp = 0;
      Object.values(turn.gameState.units).forEach((unit) => {
        if (unit.units_players_id == playerId) {
          hp += unit.units_hit_points;
        }
      });

      // Prepare HP/Count
      let hpc = hp / turn.gameState.players_units_count[playerId].total;

      // Handle Actions

      const actionsHandled = handleActions(
        turn,
        playerId,
        turnNumber,
        chartData,
        totalFunds,
        players
      );

      chartData = actionsHandled.chartData;
      const captures = actionsHandled.captures;
      const damageDealt = actionsHandled.wholeDamageDealt;
      const damageTaken = actionsHandled.wholeDamageTaken;
      fundsGenerated.push(actionsHandled.fundsGenerated);

      // Assign matrixes
      chartData[playerId].funds.push({
        x: `${turnNumber + 1}.${turnOrder[playerId]}`,
        y: totalFunds,
      });
      chartData[playerId].income.push({
        x: `${turnNumber + 1}.${turnOrder[playerId]}`,
        y: turn.gameState.players[playerId].players_income,
      });
      chartData[playerId].unitCount.push({
        x: `${turnNumber + 1}.${turnOrder[playerId]}`,
        y: turn.gameState.players_units_count[playerId].total,
      });
      chartData[playerId].unitValue.push({
        x: `${turnNumber + 1}.${turnOrder[playerId]}`,
        y: turn.gameState.players_units_count[playerId].value,
      });
      chartData[playerId].unitHP.push({
        x: `${turnNumber + 1}.${turnOrder[playerId]}`,
        y: hp,
      });
      chartData[playerId].unitHPCount.push({
        x: `${turnNumber + 1}.${turnOrder[playerId]}`,
        y: hpc,
      });
      chartData[playerId].captureCount.push({
        x: `${turnNumber + 1}.${turnOrder[playerId]}`,
        y: captures,
      });
      if (playerId == players[0]) {
        chartData[players[0]].damageDealt.push({
          x: `${turnNumber + 1}.${turnOrder[playerId]}`,
          y: damageDealt,
        });
        chartData[players[1]].damageDealt.push({
          x: `${turnNumber + 1}.${turnOrder[playerId]}`,
          y: damageTaken,
        });
      } else {
        chartData[players[1]].damageDealt.push({
          x: `${turnNumber + 1}.${turnOrder[playerId]}`,
          y: damageDealt,
        });
        chartData[players[0]].damageDealt.push({
          x: `${turnNumber + 1}.${turnOrder[playerId]}`,
          y: damageTaken,
        });
      }
    });
  });

  Object.values(fundsGenerated).forEach((addFundsData) => {
    Object.keys(playerTurns).forEach((playerId) => {
      if (addFundsData[playerId].funds != 0) {
        let searchX = `${addFundsData[playerId]["turnNumber"] + 1}.${addFundsData[playerId]["turnOrder"]}`;
        let handled = false;
        chartData[playerId].funds.forEach((fundArrayItem, i) => {
          if (handled == true) {
            chartData[playerId].funds[i].y += addFundsData[playerId]["funds"];
          }
          if (fundArrayItem.x == searchX) {
            chartData[playerId].funds[i].y += addFundsData[playerId]["funds"];
            handled = true;
          } 
        });
        if (!handled) {
          if (chartData[playerId].turnOrder < addFundsData[playerId]["turnOrder"]) {
            let previousFunds = chartData[playerId].funds[addFundsData[playerId]["turnNumber"]].y;
            chartData[playerId].funds.forEach((fundArrayItem, i) => {
              if (i > addFundsData[playerId]["turnNumber"]) {
                chartData[playerId].funds[i].y += addFundsData[playerId]["funds"];
              }
            });
            chartData[playerId].funds.push({
              x: searchX,
              y: previousFunds + addFundsData[playerId]["funds"],
            });
          }
          else {
            let previousFunds = chartData[playerId].funds[addFundsData[playerId]["turnNumber"] - 1].y;
            chartData[playerId].funds.forEach((fundArrayItem, i) => {
              if (i > addFundsData[playerId]["turnNumber"] - 1) {
                chartData[playerId].funds[i].y += addFundsData[playerId]["funds"];
              }
            });
            chartData[playerId].funds.push({
              x: searchX,
              y: previousFunds + addFundsData[playerId]["funds"],
            });
          }
        }
      }
    });
  })
  
  Object.keys(playerTurns).forEach((playerId) => {
    chartData[playerId].funds.sort((a, b) => a.y - b.y);
    chartData[playerId].coPowers.forEach((cop, i) => {
      if (cop == 1) {
        chartData[playerId].coPowerData.push({
          x: `${i + 1}.${turnOrder[playerId]}`,
          y: 0,
          r: 10
        })
      }
    })
  })
  return chartData;
}
