require("dotenv").config();
const AWS = require("aws-sdk");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Expense = require("../models/expense");
const Order = require("../models/order");
const jwt = require("jsonwebtoken");
const Razorpay = require("razorpay");
const sequelize = require("../database");
const Downloadedfiles = require("../models/downlodedfiles");
const mongoose = require("mongoose");

const saltRounds = 10;

function isValid(string) {
  if (string == null || string == undefined || string.length == 0) {
    return false;
  } else {
    return true;
  }
}

function uploadtoS3(data, filename) {
  return new Promise((resolve, reject) => {
    //console.log(process.env.IAM_USER_KEY,' process.env.IAM_USER_KEYyyyyy');
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    let s3bucket = new AWS.S3({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET,
    });

    var params = {
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: data,
      ACL: "public-read",
    };
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log(err, "Something went wrong in s3 createbucket");
        reject("Something went wrong in s3 createbucket");
      } else {
        console.log(s3response, "success in s3 createbucket");
        console.log(s3response.Location, "urlllll");
        resolve(s3response.Location);
      }
    });
  });
}

exports.postUser = async (req, res, next) => {
  try {
    console.log(req.body);
    const { name, email, password } = req.body;
    if (isValid(name) && isValid(email) && isValid(password)) {
      console.log("user sign up post request");
      bcrypt.hash(password, saltRounds, async function (err, hash) {
        try {
          if (!err) {
            // Store hash in your password DB.
            const user = new User({
              name: name,
              email: email,
              password: hash,
            });
            await user.save();
            res.status(201).json("Done");
          } else {
            console.log(err, "error in hashing");
            return res.status(404).send("Error in hashing");
          }
        } catch (error) {
          console.log(error, "error in creating User in app.js");
          res.status(400).send("Duplicate Email Found");
        }
      });
    } else {
      res.status(400).send("Some field must be missing, Fill every Field.");
    }
  } catch (error) {
    console.log(error, "error in creating User in app.js");
    res.status(400).send("Duplicate Email Found");
  }
};
function generateToken(id, isPremium, expenseId) {
  console.log(id, "id in generateToken");
  var token = jwt.sign(
    { userId: id, isPremium, expenseId: expenseId },
    "shhhhh fir koi hai"
  );
  return token;
}
exports.postValidate = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //console.log(email,password);
    const data = await User.findOne({ email: email });
    //console.log(data, "data in postvalidate in expense controller");
    if (data === null) {
      return res.status(404).json("email does not exist");
    }
    //console.log(data)
    //console.log(data.email);
    if (data.password == null) {
      return res.status(401).json("password does not match");
    }
    if (data.password != null) {
      const hash = data.password;
      const match = bcrypt.compareSync(password, hash);
      console.log(match);
      //console.log(email,data.email)
      if (match && email === data.email) {
        res.status(201).json({
          message: "User Login Successfully",
          data: data,
          token: generateToken(data.id, data.isPremium),
        });
      } else {
        res.status(401).json("password does not match");
      }
    }
  } catch (error) {
    console.log(error, "error in validate Post in controller");
  }
};

exports.postExpense = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    console.log(req.body);
    const { amount, description, category, token } = req.body;
    const user = jwt.verify(token, "shhhhh fir koi hai");
    console.log(user, "user, hihihihhi");
    //console.log(amount,description, category);

    const data = await Expense.create({
      userId: user.userId,
      expenseAmount: amount,
      description: description,
      category: category,
      session: session,
    });
    //console.log(data, "data after creating expense table in app.js");

    // Update the total amount in the User record
    const userFound = await User.findById(user.userId).session(session);
    userFound.totalAmount += parseInt(amount);
    await userFound.save();

    newToken = generateToken(user.userId, userFound.isPremium, data._id);
    console.log(
      data._id,
      "iddddddddddddddddd",
      newToken,
      "newtokennnnnnnnnnnnnnn"
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ newExpenseDetail: data, token: newToken });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log(err, "error in creating Expense");
  }
};

exports.getExpense = async (req, res, next) => {
  try {
    const user = req.user;
    console.log(user, "user");
    console.log(req.query, "req.queryyyyyyy");

    const page = parseInt(req.query.page || 1);
    console.log(page, "pageeeeeeeeee");

    const limit = parseInt(req.query.limit) || 3;
    console.log(typeof limit, limit, "limittttttttttttt");

    const skip = (page - 1) * limit;

    const totalExpenses = await Expense.countDocuments({ userId: user.userId });
    const expenses = await Expense.find({ userId: user.userId })
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    console.log(
      totalExpenses,
      expenses,
      "totalExpenses and expenses in getexpense expense controller"
    );
    //console.log(typeof totalExpenses,totalExpenses,typeof limit,limit,'total expenseeeeeee/limittt')
    res.status(201).json({
      expenses: expenses,
      totalPages: Math.ceil(totalExpenses / limit),
    });

    // const user = req.user;
    // console.log(user, "user");
    // console.log(req.query,'req.queryyyyyyy')
    // const page = parseInt(req.query.page || 1);
    // console.log(page,'pageeeeeeeeee')
    // const limit = parseInt(req.query.limit) || 3;
    // console.log(typeof(limit),'limittttttttttttt')
    // const offset = (page - 1) * limit;
    // const { rows, count } = await Expense.findAndCountAll({
    //   where: {
    //     userId: user.userId
    //   },
    //   limit,
    //   offset,
    //   order: [['createdAt', 'DESC']]
    // });
    // //console.log(rows,count,'data in finding All in app.js');
    // res.status(201).json({ expenses: rows,
    //   totalPages: Math.ceil(count / limit) });
  } catch (error) {
    console.log(error, "error in creating in app.js");
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log(id);
    const expense = await Expense.findById(id);
    const response = await Expense.deleteOne({ _id: id });
    const user = await User.findById(expense.userId);
    user.totalAmount -= expense.expenseAmount;
    await user.save();
    res.status(201).json({ response });

    // const id = req.params.id;
    // console.log(id);
    // const expense = await Expense.findByPk(id);
    // const response = await Expense.destroy({ where: { id: id } });
    // const user = await User.findByPk(expense.userId);
    // user.totalAmount -= expense.expenseAmount;
    // await user.save();
    // res.status(201).json({ response });
  } catch (error) {
    console.log(error, "error in deleting expense in app.js");
  }
};

exports.postPremium = async (req, res, next) => {
  try {
    const user = req.user;
    var rzp = new Razorpay({
      key_id: process.env.key_id,
      key_secret: process.env.key_secret,
    });

    rzp.orders.create(
      {
        amount: 5000,
        currency: "INR",
      },
      async (error, order) => {
        if (error) {
          console.log(error, "error in postpremium");
          throw new Error(JSON.stringify(error));
        }
        console.log(order, "order in postPremium in controller.js");
        await Order.create({
          userId: req.user.userId,
          orderId: order.id,
          status: "PENDING",
        })
          // req.user
          //   .createOrder({ orderId: order.id, })
          .then(() => {
            return res.status(201).json({ order, key_id: rzp.key_id });
          })
          .catch((error) => {
            throw new Error(err);
          });
      }
    );
  } catch (error) {
    console.log(error, "error in postPremium in controller");
  }
};

exports.postUpdatetransactions = async (req, res, next) => {
  try {
    console.log(req.user, "req.user in postUpdatetransaction in controller.js");
    const { order_id, payment_id } = req.body;
    console.log(
      order_id,
      payment_id,
      "order and paymentId in postUpdatetransactions in controller.js"
    );

    // const order = await Order.findOne({ orderId: order_id });
    // console.log(order, "order in postUpdatetransaction");

    const orderUpdate = await Order.findOneAndUpdate(
      { orderId: order_id },
      { paymentId: payment_id },
      {
        new: true,
      }
    );

    const user = await User.findByIdAndUpdate(req.user.userId, {
      isPremium: true,
    },{new: true});
    console.log(user,'user');
    console.log(user.isPremium,'userpremium');
    //const user = await User.findOne({ where: { id: req.user.userId } });
    //console.log(user.id,user.isPremium,'user id and isPremium in postUpdatetransactions in Controllerline 183');
    
    //const response = req.user.update({ isPremium: true });

    // Concurrently await all promises using Promise.all
    await Promise.all([orderUpdate, user]);
    const token = generateToken(user.id, user.isPremium);

    return res.status(201).json({
      success: true,
      message: "Transaction successfull",
      token: token,
    });
  } catch (error) {
    console.log(error, "error in post updatetransaction in controller.js");
  }
};

exports.postFailedTransaction = async (req, res, next) => {
  try {
    const { order_id, payment_id } = req.body;
    console.log(
      order_id,
      payment_id,
      "orderId and paymentid in failedTransaction in controller"
    );

    const filter = { userId: req.user.userId, orderId: order_id };
    const update = { status: "Failed", paymentId: payment_id };

    await Order.findOneAndUpdate(filter, update);

    // await Order.update(
    //   { status: "Failed", paymentId: payment_id },
    //   {
    //     where: {
    //       userId: req.user.userId,
    //       orderId: order_id,
    //     },
    //   }
    // );
    res.status(400).json({ message: "Failed transaction" });
  } catch (error) {
    console.log(error, "error in poastFailedTransaction in controller");
  }
};

exports.getDownload = async (req, res, next) => {
  try {
    console.log(req.user, "req.userrrrrr in getDownload");
    const userId = req.user.userId;

    const expenses = await Expense.find({ userId: userId });
    //const expenses = await req.user.getExpense();
    console.log(expenses, "expensessss in expense controllerrrrr ");
    const stringified = JSON.stringify(expenses);
    console.log(stringified);

    const filename = `Expense${userId}/${new Date()}.txt`;
    const fileUrl = await uploadtoS3(stringified, filename);
    console.log(fileUrl, "fileUrl in getDownloaddd");
    //console.log(new Date().toLocaleDateString())

    const response = await Downloadedfiles.create({
      userId: userId,
      url: fileUrl,
      datedownloaded: new Date().toLocaleDateString(),
    });
    res.status(201).json({ fileUrl, success: true });
  } catch (error) {
    console.log(error, "error in getDownload");
    res.status(500).json({ success: false });
  }
};

exports.getDownloadedFiles = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    console.log(userId, "userIddd in getDownloadedFiles");

    const allFiles = await Downloadedfiles.find({ userId: userId });
    console.log(allFiles, "all files in getdownloaded files");

    if (allFiles.length > 0) {
      res.status(201).json({ allFiles, success: true });
    } else {
      throw new Error("error in getDownloadfiles");
    }
  } catch (error) {
    console.log(error, "error in getDownloadedFiles");
  }
};
