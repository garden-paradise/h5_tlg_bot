const mongoose = require('mongoose');

const userDataSchema = mongoose.Schema({
  userId: Number,
  ref_code: {
    type: String,
    default: null,
  },
  invite_ref_code: {
    type: String,
    default: null,
  },
  balance: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('UserDataTelegram', userDataSchema);
