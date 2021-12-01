const express = require('express')
const cors = require('cors')
const fs = require('fs')
const axios = require('axios').default
const caesarCypher = require('./caesar')

const app = express()
const port = 3000
const dbURL = 'http://localhost:3001'
let db = []

const logFile = './log.txt';

const writeLog = (data) => {
  fs.writeFile(logFile, data, { flag: 'a+' }, (err) => {
    if (err) {
      console.log(err);
    }
  });
}

const getCurrentTime = () => new Date().toLocaleTimeString('en-US', {
  hour12: false,
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
});


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static('.'))


axios.get(`${dbURL}/users`).then(({ data }) => {
  db = data
})

app.post('/login', async (req, res) => {
  let { username, password } = req.body;

  password = caesarCypher(password, 13)

  const logData = { time: getCurrentTime(), path: req.path, username, password }

  writeLog(JSON.stringify(logData) + '\n')

  const foundUser = db.filter(user => user.name == username)
  if (foundUser.length > 0) {
    if (foundUser[0].password == password) {
      let data = { ...foundUser[0], status: 200 }
      if (foundUser[0].name == 'Admin') {
        data = { ...data, users: db }
      }
      res.send(data)
    } else {
      res.send({ status: 401 });
    }
  } else {
    res.send({ status: 401 });
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

