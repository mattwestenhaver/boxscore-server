const
  Game = require('../models/Game.js'),
  request = require('request'),
  nbaUrl = 'https://chumley.barstoolsports.com/dev/data/games/6c974274-4bfc-4af8-a9c4-8b926637ba74.json',
  mlbUrl = 'https://chumley.barstoolsports.com/dev/data/games/eed38457-db28-4658-ae4f-4d4d38e9e212.json'
;

module.exports = {
  
  index: (req, res) => {
    Game.find({}, (err, games) => {
      if(err) return res.json({ success: false, code: err.code })
      res.json({ success: true, games })
    })
  },

  show: (req, res) => {
    Game.findById(req.params.id, (err, game) => {
      if(err) return res.json({ success: false, code: err.code })
      if(Math.abs(Date.parse(game.lastUpdate) - Date.parse(new Date())) > 20000) {
        // res.json({ success: false, message: 'longer than 15 seconds. need to update game score.' })
        if(game.league === 'NBA') {
          request(nbaUrl, (error, response, body) => {
            if(error) return res.json({ success:false, code: error.code })
            body = JSON.parse(body)
            const newData = {
              league: body.league,
              awayTeam: [
                body.away_team,
                body.away_period_scores,
                body.away_stats,
                body.away_totals
              ],
              homeTeam: [
                body.home_team,
                body.home_period_scores,
                body.home_stats,
                body.home_totals
              ],
              gameInfo: [
                body.officials,
                body.event_information
              ],
              lastUpdate: new Date()
            }
            Object.assign(game, newData)
            game.save((err, updatedGame) => {
              if(err) res.json({ success: false, code: err.code })
              res.json({ success: true, message: "NBA game updated", updatedGame })
            })
          })
        } else {
          request(mlbUrl, (error, response, body) => {
            if(error) return res.json({ success:false, code: error.code })
            body = JSON.parse(body)
            const newData = {
              league: body.league,
              awayTeam: [
                body.away_batter_totals,
                body.away_batters,
                body.away_errors,
                body.away_fielding,
                body.away_period_scores,
                body.away_pitchers,
                body.away_team
              ],
              homeTeam: [
                body.home_batter_totals,
                body.home_batters,
                body.home_errors,
                body.home_fielding,
                body.home_period_scores,
                body.home_pitchers,
                body.home_team
              ],
              gameInfo: [
                body.officials,
                body.event_information
              ],
              lastUpdate: new Date()
            }
            Object.assign(game, newData)
            game.save((err, updatedGame) => {
              if(err) res.json({ success: false, code: err.code })
              res.json({ success: true, message: "MLB game updated", updatedGame })
            })
          })
        }
      } else {
        res.json({ success: true, game })
      }
    })
  },

  create: (req, res) => {
    Game.create(req.body, (err, game) => {
      if(err) return res.json({ success:false, code: err.code })
      res.json({ success: true, message: "Game successfully created.", game })
    })
  }

}