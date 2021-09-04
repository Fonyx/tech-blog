const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const controllers = require('./controllers');
const connection = require('./config/connection');
const cRequests = require('./middleware/cRequests');
const helpers = require('./utils/hjsHelpers');

const hbs = exphbs.create({ helpers });

const app = express();
const PORT = process.env.PORT || 3001;

const sessionTemplate = {
  secret: 'Super secret secret',
  cookie: {
    sameSite: "strict",
    // 5 minute session timeout
    expires: 1000 * 60 * 5

    // 10 seconds
    // expires: 1000 * 10
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: connection,
  }),
};

// enable use of the session template which includes a cookie and db connection
app.use(session(sessionTemplate));
// use color logger middleware for all requests
app.use(cRequests);
// recognizes incoming request objects as json objects. Enables json parsing for request bodies - used for post and put requests
app.use(express.json());
// recognizes the incoming request object as strings or arrays, for receiving request objects that aren't in json format
app.use(express.urlencoded({ extended: true }));

// use the controllers
app.use(controllers);
// enable the handlebars engineer
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
// open the public folder up for express public
app.use(express.static(path.join(__dirname, 'public')));

connection.sync({ force: false }).then(() => {
  app.listen(PORT, () =>
    console.log(`Server Listening @ http://localhost:${PORT}`)
  );
});
