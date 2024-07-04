const mongoose = require("mongoose");

const petrolPumpSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  date: Date,
  diesel_rate: Number,
  diesel_reading_1: Number,
  diesel_reading_2: Number,
  petrol_rate: Number,
  petrol_reading_1: Number,
  petrol_reading_2: Number,
  diesel_sale: {
    liters: Number,
    cash: Number
  },
  petrol_sale: {
    liters: Number,
    cash: Number
  },
  total_sale: Number,
  phonepe: Number,
  pump_expense: Number,
  credit_deposit: Number,
  bank_deposit: Number,
  credit: Number,
  cash_in_hand: Number
});

module.exports = mongoose.model('PetrolPumpData', petrolPumpSchema);