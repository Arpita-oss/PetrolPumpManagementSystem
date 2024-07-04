var express = require('express');
var router = express.Router();
const passport = require("passport")
const user = require('./users')
const localStrategy = require("passport-local")
const PetrolPumpData = require("./form")


passport.use(new localStrategy(user.authenticate()))

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('register');
});

router.get("/login", function (req, res) {
  res.render("home");
})

router.get("/home", function (req, res) {
  res.render("home");
})


router.get("/register", function (req, res) {
  res.render("login");
})

router.post('/register', (req, res, next) => {
var newUser = {
username: req.body.username,

};
user
.register(newUser, req.body.password)
.then((result) => {
passport.authenticate('local')(req, res, () => {
//destination after user register
res.redirect('/login');
});
})
.catch((err) => {
res.send(err);
});
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
  }),
  (req, res, next) => { }
);

router.get('/logout', (req, res, next) => {
if (req.isAuthenticated())
req.logout((err) => {
if (err) res.send(err);
else res.redirect('/login');
});
else {
res.redirect('/');
}
});

function isloggedIn(req, res, next) {
if (req.isAuthenticated()) return next();
else res.redirect('/login');
}



router.post('/submit-pump-data',isloggedIn, async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const newData = new PetrolPumpData({
      user: req.user._id,
      date: new Date(req.body.date),
      diesel_rate: req.body.diesel_rate,
      diesel_reading_1: req.body.diesel_reading_1,
      diesel_reading_2: req.body.diesel_reading_2,
      petrol_rate: req.body.petrol_rate,
      petrol_reading_1: req.body.petrol_reading_1,
      petrol_reading_2: req.body.petrol_reading_2,
      diesel_sale: {
        liters: parseFloat(req.body.diesel_sale_liters),
        cash: parseFloat(req.body.diesel_sale_cash)
      },
      petrol_sale: {
        liters: parseFloat(req.body.petrol_sale_liters),
        cash: parseFloat(req.body.petrol_sale_cash)
      },
      total_sale: parseFloat(req.body.total_sale),
      phonepe: parseFloat(req.body.phonepe),
      pump_expense: parseFloat(req.body.pump_expense),
      credit_deposit: parseFloat(req.body.credit_deposit),
      bank_deposit: parseFloat(req.body.bank_deposit),
      credit: parseFloat(req.body.credit),
      cash_in_hand: parseFloat(req.body.cash_in_hand)
    });

    await newData.save();
    res.status(200).json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Error saving data', details: error.message });
  }
});

module.exports = router;
