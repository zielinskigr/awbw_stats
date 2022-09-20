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
    await delay(250);
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
      unitHP: [],
      unitHPCount: [],
      captureCount: [],
      damageDealt: [],
      damageTaken: [],
      coPowers: [],
    };
  });
  // console.log("chartdata", chartData);
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
      chartData[players[0]].units[turnNumber] = turn.gameState.units;
      chartData[players[1]].units[turnNumber] = turn.gameState.units;

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
      let hpc = hp / turn.gameState.players_units_count[playerId].total;

      // Handle Actions

      const actionsHandled = handleActions(turn, playerId, turnNumber, chartData);
      chartData = actionsHandled.chartData;
      const captures = actionsHandled.captures;
      
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
      chartData[playerId].unitHP.push(hp);
      chartData[playerId].unitHPCount.push(hpc);
      chartData[playerId].captureCount.push(captures);
    });
  });

  return chartData;
}
