let express = require('express')
let path = require('path')
let {open} = require('sqlite')
let sqlite3 = require('sqlite3')
let app = express()
let dbpath = path.join(__dirname, 'cricketTeam.db')
let db = null

let initializeDbServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.get('/players/', async (request, response) => {
      let query = `
                SELECT
                *
                FROM
                cricket_team
                ORDER BY
                player_id
            `
      let players = await db.all(query)
      response.send(players)
    })
    app.post('/players/', async (request, response) => {
      let reqBody = request.body
      let {playerName, jerseyNumber, role} = reqBody
      let addquery = `
                INSERT INTO
                  cricket_team(player_name,jersey_number,role)
                VALUES
                  ('${playerName}',
                  ${jerseyNumber},
                  '${role}')
            `
      await db.run(addquery)
      response.send('Player Added to Team')
    })
    app.get('/players/:playerId/', async (request, response) => {
      let {playerId} = request.params
      let query = `
              SELECT *
              FROM cricket_team
              WHERE player_id = ${playerId}
            `
      let player = await db.get(query)
      response.send(player)
    })
    app.put('/players/:playerId/', async (request, response) => {
      let {playerId} = request.params
      let body = request.body
      let {playerName, jerseyNumber, role} = body
      let query = `
              UPDATE cricket_team
              SET
              player_name = ${playerName},
              jersey_number = ${jerseyNumber},
              role = ${role}
              WHERE
              player_id = ${playerId}
            `
      await db.run(query)
      response.send('Profile Details Updated')
    })
    app.delete('/players/:playerId/', async (request, response) => {
      let {playerId} = request.params
      let query = `
            DELETE FROM cricket_team
            WHERE player_id = ${playerId}
            `
      await db.run(query)
      response.send('Player Removed')
    })
    app.listen(3000)
  } catch (e) {
    console.log(`Server error ${e.message}`)
    process.exit(1)
  }
}


initializeDbServer()
module.exports = app
