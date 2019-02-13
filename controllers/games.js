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

  initialize: (req, res) => {

      request(nbaUrl, function(error, response, body) {
        if(error) return res.json({ success:false, code: error.code })
        body = JSON.parse(body)
        const nbaData = {
          league: body.league,
          awayTeam: {
            team: body.away_team,
            period_scores: body.away_period_scores,
            stats: body.away_stats,
            totals: body.away_totals
          },
          homeTeam: {
            team: body.home_team,
            period_scores: body.home_period_scores,
            stats: body.home_stats,
            totals: body.home_totals
          },
          gameInfo: {
            officials: body.officials,
            event_information: body.event_information
          },
          lastUpdate: new Date()
        }
        Game.create(nbaData, (err, nbaGame) => {
          if(err) return res.json({ success:false, code: err.code })
        })
      })
    
      request(mlbUrl, (error, response, body) => {
        if(error) return res.json({ success:false, code: error.code })
        body = JSON.parse(body)
        const mlbData = {
          league: body.league,
          awayTeam: {
            batter_totals: body.away_batter_totals,
            batters: body.away_batters,
            errors: body.away_errors,
            fielding: body.away_fielding,
            period_scores: body.away_period_scores,
            pitchers: body.away_pitchers,
            team: body.away_team
          },
          homeTeam: {
            batter_totals: body.home_batter_totals,
            batters: body.home_batters,
            errors: body.home_errors,
            fielding: body.home_fielding,
            period_scores: body.home_period_scores,
            pitchers: body.home_pitchers,
            team: body.home_team
          },
          gameInfo: {
            officials: body.officials,
            event_information: body.event_information
          },
          lastUpdate: new Date()
        }
        Game.create(mlbData, (err, mlbGame) => {
          if(err) return res.json({ success:false, code: err.code })
        })
      })

      res.json({ success: true })
    
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
              awayTeam: {
                team: body.away_team,
                period_scores: body.away_period_scores,
                stats: body.away_stats,
                totals: body.away_totals
              },
              homeTeam: {
                team: body.home_team,
                period_scores: body.home_period_scores,
                stats: body.home_stats,
                totals: body.home_totals
              },
              gameInfo: {
                officials: body.officials,
                event_information: body.event_information
              },
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
              awayTeam: {
                batter_totals: body.away_batter_totals,
                batters: body.away_batters,
                errors: body.away_errors,
                fielding: body.away_fielding,
                period_scores: body.away_period_scores,
                pitchers: body.away_pitchers,
                team: body.away_team
              },
              homeTeam: {
                batter_totals: body.home_batter_totals,
                batters: body.home_batters,
                errors: body.home_errors,
                fielding: body.home_fielding,
                period_scores: body.home_period_scores,
                pitchers: body.home_pitchers,
                team: body.home_team
              },
              gameInfo: {
                officials: body.officials,
                event_information: body.event_information
              },
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