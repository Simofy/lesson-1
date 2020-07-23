const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static('dist'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
});

app.use('/api', require('./api'));

const expressWs = require('express-ws')(app);
const bcryptjs = require('bcryptjs');
const db = require('./db');
const dbConfig = require('./db/db.config');

const Role = db.role;
const Table = db.table;

function initial() {
  Table.estimatedDocumentCount(async (err, count) => {
    if (!err && count === 0) {
      for (let i = 0; i < 100; i += 1) {
        new Table({
          _id: i,
          random: bcryptjs.genSaltSync(1).substring(0, 8),
          text: bcryptjs.genSaltSync(1).substring(0, 8),
          test: bcryptjs.genSaltSync(1).substring(0, 8),
        }).save((errTable) => {
          if (errTable) {
            console.log('error', errTable);
          }
        });
      }
    }
  });
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: 'user'
      }).save((errRole) => {
        if (errRole) {
          console.log('error', errRole);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: 'moderator'
      }).save((errRole) => {
        if (errRole) {
          console.log('error', errRole);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: 'admin'
      }).save((errRole) => {
        if (errRole) {
          console.log('error', errRole);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Successfully connect to MongoDB.');
    initial();
  })
  .catch((err) => {
    console.error('Connection error', err);
    process.exit();
  });

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));

app.ws('/ws', (ws, req) => {
  ws.on('message', (msg) => {
    console.log(msg);
  });
  console.log('alio');
  Table.schema.addListener('update', (doc) => {
    ws.send(JSON.stringify({
      doc,
    }));
  });

  console.log('socket', req.testing);
});
