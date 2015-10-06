const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Firebase = require('firebase');
const db = new Firebase("https://blinding-inferno-2117.firebaseio.com");
const FirebaseTokenGenerator = require("firebase-token-generator");
const tokenGenerator = new FirebaseTokenGenerator("AZm3fv824Lw3p58CXJjSDcfzE5cy0jxHst2vrm0p");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/conversations/', (req, res) => {
  if (!req.body || !req.body.type || !req.body.users || (req.body.type === 'match' && !req.body.matchID)) {
    return res.status(400);
  }
  const newConversationRef = db.child('conversations').push({
    createdAt: Date.now()
  });

  req.body.users.forEach((user) => {
    return db.child(`users/${user._id}/${req.body.type}/${newConversationRef.key()}`).set({
      lastRead: Date.now()
    });
  });

  return res.send(newConversationRef.key());
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/chat.html');
});

app.post('/', function(req, res) {
  res.send(tokenGenerator.createToken(req.body));
});

const server = app.listen(6040, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`BattleChat listening at http://${host}:${port}`);
});