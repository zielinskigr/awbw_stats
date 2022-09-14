import { fetchGameInfo } from "./../api/fetchData";
import { delay } from "./helpers";

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
  // console.log(gameId);
  const playerTurns = await getStats(gameId);

  // console.log(playerTurns);

  let chartData = {};
  Object.keys(playerTurns).forEach((playerId) => {
    let totalFunds = 0;
    chartData[playerId] = {
      name: playerTurns[playerId].turnsArray[0].gameState.players[playerId]
        .users_username,
      turns: playerTurns[playerId].turnsArray.length,
      country: playerTurns[playerId].player.countries_id,
      funds: [],
      income: [],
      unitCount: [],
      unitValue: [],
    };
    playerTurns[playerId].turnsArray.forEach((turn) => {
      totalFunds += turn.gameState.players[playerId].players_funds;
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
    });
  });

  return chartData;
}
