const
  mongoose = require('mongoose'),
  // potentially split up games with discriminators for each league
  gameSchema = new mongoose.Schema({
    league: { type: String, required: true },
    awayTeam: [],
    homeTeam: [],
    gameInfo: [],
    lastUpdate: { type: String, default: new Date() }
  })
;

const Game = mongoose.model('Game', gameSchema)
module.exports = Game