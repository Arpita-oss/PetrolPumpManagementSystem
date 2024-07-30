var express = require('express');
var router = express.Router();
const passport = require("passport");
const user = require('./users');
const localStrategy = require("passport-local");
const PetrolPumpData = require("./petrolpumpData");

passport.use(new localStrategy(user.authenticate()));

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('register');
});

router.get("/login", function (req, res) {
  res.render("login");
});

router.get("/home", function (req, res) {
  res.render("home");
});

router.get("/register", function (req, res) {
  res.render("login");
});

router.get("/submit-pump-data", async function (req, res) {
  try {
    // Fetch all submitted entries, sorted by date descending
    const submittedData = await PetrolPumpData.find({})
      .sort({ date: -1 })
      .exec();
    
    res.render("data", { submittedData: submittedData });
  } catch (error) {
    console.error("Error fetching submitted data:", error);
    res.render("data", { submittedData: [], error: "Error fetching data" });
  }
});

router.post('/register', (req, res, next) => {
  var newUser = { username: req.body.username };
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
  (req, res, next) => {}
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

router.post('/submit-pump-data', isloggedIn, async (req, res) => {
  try {
    // Parse credit deposits and credits from JSON strings
    const creditDeposits = JSON.parse(req.body.credit_deposits || '[]');
    const credits = JSON.parse(req.body.credits || '[]');
    console.log(req.body);
    const newData = new PetrolPumpData({
      user: req.user._id,
      date: new Date(req.body.date),
      diesel_rate: parseFloat(req.body.diesel_rate),
      diesel_reading_1: parseFloat(req.body.diesel_reading_1),
      diesel_reading_2: parseFloat(req.body.diesel_reading_2),
      petrol_rate: parseFloat(req.body.petrol_rate),
      petrol_reading_1: parseFloat(req.body.petrol_reading_1),
      petrol_reading_2: parseFloat(req.body.petrol_reading_2),
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
      credit_deposits: creditDeposits,
      credits: credits,
      bank_deposit: parseFloat(req.body.bank_deposit),
      cash_in_hand: parseFloat(req.body.cash_in_hand)
    });

    await newData.save();
    res.redirect('/submit-pump-data');
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Error saving data', details: error.message });
  }
});
module.exports = router;