const
  express = require('express'),
  gamesRouter = new express.Router(),
  gamesController = require('../controllers/games.js')
;

gamesRouter.route('/')
  .get(gamesController.index)
  .post(gamesController.create)
;

gamesRouter.route('/init')
  .get(gamesController.initialize)
;

gamesRouter.route('/:id')
  .get(gamesController.show)
  // .patch(gamesController.update)
;

module.exports = gamesRouter