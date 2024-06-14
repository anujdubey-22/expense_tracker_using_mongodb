require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const User = require('./models/user');
const Expense = require("./models/expense");
const Order = require('./models/order');
const Forgotpassword = require('./models/forgotpassword');
const Router = require('./routes/expense');
const forgotrouter = require('./routes/forgotpassword');
const premiumRoutes = require('./routes/premium');
const sequelize = require('./database');
const Downloadedfiles = require("./models/downlodedfiles");
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const mongoose = require('./database');

const accessLogstream = fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'});

const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan('combined',{stream: accessLogstream}));

app.use(bodyParser.json({ extended: true }));

// Serve static files from the 'public' directory
// app.use(express.static(path.join(__dirname, 'public')));

 app.use("/user",Router);
 app.use("/premium",premiumRoutes);
 app.use('/password',forgotrouter);

// app.use((req,res) => {
//   console.log(req.url,'urlll');
//   //console.log(path.join(__dirname,`/${req.url}`),'pathhhhh')
//   res.sendFile(path.join(__dirname,`${req.url}`))
// })

// User.hasMany(Expense);
// Expense.belongsTo(User);

// User.hasMany(Order);
// Order.belongsTo(User);

// User.hasMany(Forgotpassword);
// Forgotpassword.belongsTo(User);

// User.hasMany(Downloadedfiles);
// Downloadedfiles.belongsTo(User);

async function sync() {
  try {
    const data = await mongoose();
    //console.log(data);
    app.listen(process.env.PORT || 3000 , () => {
      console.log(`server started on Port, ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error, "error in sync database in app.js");
  }
}

sync();
