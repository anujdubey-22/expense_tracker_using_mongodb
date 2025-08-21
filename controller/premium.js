const sequelize = require("../utils/database");
const Expense = require("../models/expense");
const Order = require("../models/order");
const User = require("../models/user");

exports.getshowLeaderBoard = async (req, res, next) => {
  try {
    console.log("in premium controller");

    const users = await User.find({}, { name: 1, totalAmount: 1 }).sort({
      totalAmount: -1,
    });
    console.log(users)

    res.status(201).json({ data: users });
  } catch (error) {
    console.log(error, "error in getshowLeaderBoard controller");
  }
};
