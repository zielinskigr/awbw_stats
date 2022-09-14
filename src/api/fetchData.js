export async function fetchGameInfo(replayId, ndx = 0) {
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
