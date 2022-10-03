export const handleActions = (turn, playerId, turnNumber, chartData, totalFunds, players) => {
  let captures = 0;
  let damageDealt = 0;
  let damageTaken = 0;
  let wholeDamageDealt = 0;
  let wholeDamageTaken = 0;
  let fundsGenerated = {};
  players.forEach((player) => {
    fundsGenerated[player] = {};
    fundsGenerated[player]["funds"] = 0;
    fundsGenerated[player]["turnNumber"] = turnNumber;
    fundsGenerated[player]["turnOrder"] = chartData[playerId]["turnOrder"];
  })
  Object.values(turn.actions).forEach((action) => {
    // Handle powers
    if (action.action === 'Power') {
      chartData[playerId].coPowers[turnNumber]++;
      
      // Handle HP powers
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

      // Handle Money Powers
      if (action.playerReplace) {
        Object.keys(action.playerReplace).forEach((changePlayerId) => {
          if (action.playerReplace[changePlayerId].players_funds) {
            fundsGenerated[changePlayerId]["funds"] = (Math.round(action.playerReplace[changePlayerId].players_funds * 0.333333, 0));
          }
        })
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
      wholeDamageDealt += damageDealt;
      wholeDamageTaken += damageTaken;

      // Handle gained funds
      if (action.gainedFunds) {
        Object.keys(action.gainedFunds).forEach((changePlayerId) => {
          fundsGenerated[changePlayerId]["funds"] += action.gainedFunds[changePlayerId];
        })
      }
    }
  });
  return {captures, chartData, wholeDamageDealt, wholeDamageTaken, fundsGenerated};
}