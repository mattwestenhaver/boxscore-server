const
  express = require('express'),
  bodyParser = require('body-parser'),
  logger = require('morgan'),
  cors = require('cors'),
  app = express(),
  mongoose = require('mongoose'),
  MONGODB_URI =  process.env.MONGODB_URI || 'mongodb://localhost/boxscore',
  PORT = process.env.PORT || 3001
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

app.listen(PORT, (err) => {
  console.log(err || `👏🏼 Server running on ${PORT}`)
})