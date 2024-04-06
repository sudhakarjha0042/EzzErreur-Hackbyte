const stripe = require("stripe")(process.env.TEST_STRIPE_KEY);
const User = require("../models/UserModel");

const isPaidUser = async (req, res, next) => {
  try {
    console.log("inside isPaidUser middleware");
    const { userId } = req;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const customer = await stripe.customers.retrieve(user.stripeId);
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeId,
      status: "active",
    });

    // Check if the customer has any active subscriptions
    const activeSubscriptions = subscriptions.data.filter(
      (subscription) =>
        subscription.status === "active" || subscription.status === "trialing"
    );
    req.isPaidUser = activeSubscriptions.length > 0;
    console.log("isPaidUser is", req.isPaidUser);
    next();
  } catch (err) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { isPaidUser };
