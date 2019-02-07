const
  express = require('express'),
  bodyParser = require('body-parser'),
  logger = require('morgan'),
  cors = require('cors'),
  app = express(),
  mongoose = require('mongoose'),
  MONGODB_URI =  process.env.MONGODB_URI || 'mongodb://localhost/boxscore',
  PORT = process.env.PORT || 3001,
  gamesRoutes = require('./routes/games.js'),
  request = require('request'),
  nbaUrl = 'https://chumley.barstoolsports.com/dev/data/games/6c974274-4bfc-4af8-a9c4-8b926637ba74.json',
  mlbUrl = 'https://chumley.barstoolsports.com/dev/data/games/eed38457-db28-4658-ae4f-4d4d38e9e212.json'
;

mongoose.connect(MONGODB_URI, (err) => {
  console.log(err || `🤘🏼 Connected to Mongo @ ${MONGODB_URI}`)
});

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({message:'Boxscore server root'})
})

app.use('/games', gamesRoutes)

app.get('/nba', (req, res) => {
  request(nbaUrl, function(error, response, body) {
  res.json(JSON.parse(body))
  })
})

app.get('/mlb', (req, res) => {
  request(mlbUrl, function(error, response, body) {
    res.json(JSON.parse(body))
  })
})

app.listen(PORT, (err) => {
  console.log(err || `👏🏼 Server running on ${PORT}`)
})