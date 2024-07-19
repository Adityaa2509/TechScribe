const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
},
  plan: { 
    type: String, 
   required: true 
},
  startDate: { 
    type: Date, 
    required: true 
},
  expiryDate: { 
    type: Date,
     required: true
},
  amount: { 
    type: Number,
     required: true 
},
  status: { 
    type: String,
     enum: ['Active', 'Expired'],
      default: 'Expired' 
}
 
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
 module.exports = Subscription