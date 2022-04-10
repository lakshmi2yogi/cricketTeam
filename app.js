const express = require("express");

const path = require("path");

const { open } = require("sqlite");

const sqlite3 = require("sqlite3");

const app = express();

app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,

      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);

    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/players/", async (request, response) => {
  const playersListQuery = `


SELECT * FROM cricket_team`;

  const playersList = await db.all(playersListQuery);

  response.send(playersList);
});

app.post("/players", async (request, response) => {
  let playerDetails = request.body;

  let { player_id, player_name, jersey_number, role } = playerDetails;

  const addPlayerQuery = `


INSERT INTO


cricket_team(player_id,player_name,jersey_number,role)


VALUES


(


${player_id},"${player_name}",${jersey_number},"${role}"


);


`;

  const dbResponse = await db.run(addPlayerQuery);

  response.send("Player Added to Team'");
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;

  const getPlayerQuery = `SELECT * FROM cricket_team


WHERE player_id=${playerId}`;

  const player = await db.get(getPlayerQuery);

  response.send(player);
});

app.put("/players/:playerId/", async (request, response) => {
  let { playerId } = request.params;

  let playerDetails = request.body;

  let { player_id, player_name, jersey_number, role } = playerDetails;

  const updatePlayerQuery = `


UPDATE cricket_team


SET


player_id=${player_id},


player_name="${player_name}",


jersey_number=${jersey_number},


role="${role}"


WHERE player_id=${playerId};


`;

  await db.run(updatePlayerQuery);

  response.send("Player Details Updated");
});

app.delete("/players/:playerId", async (request, response) => {
  let { playerId } = request.params;

  const deletePlayerQuery = `


DELETE FROM cricket_team


WHERE player_id=${playerID};`;

  await db.run(deletePlayerQuery);

  response.send("Player Removed");
});

module.exports = app;
