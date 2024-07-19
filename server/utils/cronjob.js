// cronJobs/subscriptionCleaner.js
const cron = require('node-cron');
const Subscription = require('../models/Subscription.model');
const User = require('../models/User.model');

cron.schedule('0 0 * * *', async () => {  // Runs every day at midnight
  try {
    const now = new Date();
    const expiredSubscriptions = await Subscription.find({ expiryDate: { $lt: now }, status: 'Active' });

    for (const subscription of expiredSubscriptions) {
      await User.findByIdAndUpdate(subscription.user, {
        $set: {
          'subscription.plan': null,
          'subscription.startDate': null,
          'subscription.expiryDate': null
        }
      });
      subscription.status = 'Expired';
      await subscription.save();
    }

    console.log('Expired subscriptions cleaned up successfully');
  } catch (error) {
    console.error('Error cleaning up expired subscriptions:', error);
  }
});
