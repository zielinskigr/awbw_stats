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
                // console.log(playerId, changePlayerId, action.hpChange)
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
      chartData[playerId].unitHP.push(hp);
      chartData[playerId].unitHPCount.push(hpc);
      chartData[playerId].captureCount.push(captures);
    });
  });

  return chartData;
}
