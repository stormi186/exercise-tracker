const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/user');
const Exercise = require('./models/exercise');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors({ optionSuccessStatus: 200 }));
var url = process.env.MONGOLAB_MAROON_URI;
mongoose.connect(url || 'mongodb://localhost/exercise', { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use(express.static(__dirname + '/public'));

app.post('/api/exercise/new-user/', (req, res) => {
  const username = req.body.username;
  
  if (username === '') {
    res.send('Username cannot be blank');
  }
  else if (username.length > 10) {
    res.send('Username cannot be greater than 10 characters');
  } 
  else {
    User.findOne({ username }, (err, user) => {
      if (err) {
        res.send('Error searching database');
      }
      else if (!user) { 
        const newUser = new User({
          username
        });

        newUser.save((err, data) => {
          if (err) {
            res.send('Error occurred while saving user');
          }
          else {
            res.json(data);
          }
        });
      }
      else {
        res.send("Username exists");
      }
    });
  }
});

app.post('/api/exercise/add', (req, res) => {
  const username = req.body.username;
  const description = req.body.description;
  let duration = req.body.duration;
  let date = req.body.date;
  let userId;

  if (username === undefined || description === undefined || duration === undefined) {
    res.send('Required Field(s) are missing.');
  } 
  else if (username === '' || description === '' || duration === '') {
    res.send('Required Field(s) are blank.');
  } 
  else if (username.length > 10) {
    res.send('Username cannot be greater than 10 characters');
  } 
  else if (description.length > 100) {
    res.send('Description cannot be greater than 100 characters');
  } 
  else if (isNaN(duration)) {
    res.send('Duration must be a number');
  } 
  else if (Number(duration) > 1440) {
    res.send('Duration must be less than 1440 minutes (24 hours)');
  } 
  else if (date !== '' && isNaN(Date.parse(date)) === true) {
    res.send('Date is not a valid date');
  } 
  else {
    User.findOne({ username }, (err, user) => {
      if (err) {
        res.send('Error while searching for username, try again');
      } 
      else if (!user) {
        res.send('Username not found');
      } 
      else {
        userId = user.id;

        duration = Number(duration);

        if (date === '') {
          date = new Date();
        } else {
          date = Date.parse(date);
        }

        const newExercise = new Exercise({
          userId,
          description,
          duration,
          date,
        });

        newExercise.save((errSave, data) => {
          if (errSave) {
            res.send('Error occurred while saving exercise');
          } 
          else {
            res.json(data);
          }
        });
      }
    });
  }
});

app.get('/api/exercise/:log', (req, res) => {
  const username = req.query.username;
  let from = req.query.from;
  let to = req.query.to;
  let limit = req.query.limit;
  let userId;
  const query = {};

  if (username === undefined) {
    res.send('Required Field(s) are missing.');
  } 
  else if (username === '') {
    res.send('Required Field(s) are blank.');
  } 
  else if (username.length > 10) {
    res.send('Username cannot be greater than 10 characters');
  } 
  else if (from !== undefined && isNaN(Date.parse(from)) === true) {
    res.send('From is not a valid date');
  } 
  else if (to !== undefined && isNaN(Date.parse(to)) === true) {
    res.send('From is not a valid date');
  } 
  else if (limit !== undefined && isNaN(limit) === true) {
    res.send('Limit is not a valid number');
  } 
  else if (limit !== undefined && Number(limit) < 1) {
    res.send('Limit must be greater than 0');
  } 
  else {
    User.findOne({ username }, (err, user) => {
      if (err) {
        res.send('Error while searching for username, try again');
      } 
      else if (!user) {
        res.send('Username not found');
      } 
      else {
        userId = user.id;
        query.userId = userId;

        if (from !== undefined) {
          from = new Date(from);
          query.date = { $gte: from};
        }

        if (to !== undefined) {
          to = new Date(to);
          to.setDate(to.getDate() + 1); 
          query.date = { $lt: to};
        }

        if (limit !== undefined) {
          limit = Number(limit);
        }

        Exercise.find(query).select('userId description date duration ').limit(limit).exec((errExercise, exercises) => {
          if (err) {
            res.send('Error while searching for exercises, try again');
          } else if (!user) {
            res.send('Exercises not found');
          } else {
            res.json(exercises);
          }
        });
      }
    });
  }
});

app.listen(process.env.PORT || 3000);