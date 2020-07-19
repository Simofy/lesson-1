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

const db = require('./db');
const dbConfig = require('./db/db.config');

const Role = db.role;

function initial() {
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
