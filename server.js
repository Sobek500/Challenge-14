const express = require('express');
const session = require('express-session');
const handlebars = require('express-handlebars');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('./models');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

const sess = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: db.sequelize,
  }),
};

app.use(session(sess));

const apiRoutes = require('./routes/api-routes');
const htmlRoutes = require('./routes/html-routes');

app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

db.sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});