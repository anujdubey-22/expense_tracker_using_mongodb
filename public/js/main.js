let page = 1;

// document.getElementById('board').addEventListener('click',showLeaderBoard());
// document.getElementById('buyPremium').addEventListener('click',buyPremium());
// document.getElementById('report').addEventListener('click',showReport());
// document.getElementById('downloadexpense').addEventListener('click',download());
// document.getElementById('downloadedfiles').addEventListener('click',showDownloadedFiles());

async function getData(page, limit) {
  try {
    //console.log(page, "pageeeeeeeeeeeeee");
    var token = localStorage.getItem("token");
    const response = await axios.get(
      `http://localhost:3000/user/get-expense?page=${page}&limit=${limit}`,
      {
        headers: { authorization: token },
      }
    );
    //console.log(response);

    //let pElement = document.getElementById("message").querySelector("p");
    //let pElement = document.createElement("p");
    // pElement.innerHTML = "Hello, World!";
    // document.getElementById("message").appendChild(pElement);

    //document.getElementById("message").appendChild(pElement);

    // Check if button was hidden before
    if (localStorage.getItem("buttonHidden") === "true") {
      document.getElementById("buyPremium").style.display = "none";
      document.getElementById("board").style.display = "block";
      document.getElementById("downloadexpense").style.display = "block";
      document.getElementById("downloadedfiles").style.display = "block";

      let pElement = document.getElementById("message");
      pElement.innerHTML = "You are a Premium User now";
    }
    let totalPages = response.data.totalPages;
    //console.log(response, "response");
    var list = document.getElementById("list");
    list.innerHTML = "";
    for (let expense of response.data.expenses) {
      //console.log(expense);
      showExpense(expense, page, totalPages);
    }
    showPaginationButton(page, totalPages, limit);
  } catch (error) {
    console.log(error, "error in getting data in main.js");
  }
}

async function showPaginationButton(currentPage, totalPages, limit) {
  var list = document.getElementById("list");
  // Display current page and total pages
  const pageInfo = document.createElement("p");
  pageInfo.innerText = `Page ${currentPage} of ${totalPages}`;
  list.appendChild(pageInfo);

  var label = document.createElement("label");
  label.setAttribute("for", "rowsPerPage");
  label.textContent = "Rows Per Page:";

  var select = document.createElement("select");
  select.setAttribute("id", "rowsPerPage");
  select.setAttribute("name", "rowsPerPage");

  var options = [1, 5, 10, 15, 20, 25];
  options.forEach(function (optionValue) {
    var option = document.createElement("option");
    option.setAttribute("value", optionValue);
    option.textContent = optionValue;
    if (optionValue === limit) {
      option.setAttribute("selected", "selected");
    }
    select.appendChild(option);
  });

  list.appendChild(label);
  list.appendChild(select);

  const limitDropdown = document.getElementById("rowsPerPage");
  limitDropdown.addEventListener("change", function () {
    limit = parseInt(limitDropdown.value);
    // Reset current page to 1 when limit changes
    currentPage = 1;
    getData(currentPage, limit);
  });

  const prevPageBtn = document.createElement("button");
  prevPageBtn.innerText = "Previous Page";
  prevPageBtn.addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage--;
      getData(currentPage, limit);

      // Update page info
      document.querySelector(
        "p"
      ).innerText = `Page ${currentPage} of ${totalPages}`;
    }
  });
  list.appendChild(prevPageBtn);

  const nextPageBtn = document.createElement("button");
  nextPageBtn.innerText = "Next Page";
  nextPageBtn.addEventListener("click", function () {
    if (currentPage < totalPages) {
      currentPage++;
      getData(currentPage, limit);

      // Update page info
      document.querySelector(
        "p"
      ).innerText = `Page ${currentPage} of ${totalPages}`;
    }
  });
  list.appendChild(nextPageBtn);
}

document.addEventListener("DOMContentLoaded", getData(1));

async function forgotPasswordHandler() {
  console.log("click in forgotpasswordhandler in main js");
  window.location.href = "./forgot.html";
}

async function showLeaderBoard() {
  //console.log("show Leader btn clicked");
  const token = localStorage.getItem("token");
  const userArr = await axios.get(
    "http://localhost:3000/premium/showLeaderBoard",
    { headers: { authorization: token } }
  );
  //console.log(userArr);
  const leaderEle = document.getElementById("leaderboard");
  leaderEle.innerHTML = `<h1>Leader Board</h1>`;
  for (let item of userArr.data.data) {
    //console.log(item.name,item.expenseAmount)
    //console.log(`Name - ${item.name} Total Expense - ${item.expenseAmount}`)
    const div = document.createElement("div");
    div.appendChild(
      document.createTextNode(
        `Name - ${item.name} Total Expense - ${
          item.totalAmount != null ? item.totalAmount : 0
        }`
      )
    );
    div.style.color = "green";
    //leaderEle.innerHTML += `Name - ${item} Total Expense - ${userArr.data.data[item]}`;
    leaderEle.appendChild(div);
  }
}

document.getElementById("buyPremium").addEventListener("click", buyPremium);

async function buyPremium() {
  try {
    //console.log("btn clicked");
    obj = {};
    const token = localStorage.getItem("token");
    //console.log(token, "token to send in post premium in main.js");
    const response = await axios.post(
      "http://localhost:3000/user/premium",
      obj,
      { headers: { authorization: token } }
    );
    //console.log(response);
    //console.log(response.razorpay_payment_id, "paymentId");

    var options = {
      key: response.data.key_id,
      order_id: response.data.order.id,
      handler: async function (response) {
        const output = await axios.post(
          "http://localhost:3000/user/updatetransactions",
          {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id,
          },
          { headers: { authorization: token } }
        );
        //console.log(output);
        alert("you are premium user now");

        localStorage.setItem("token", output.data.token);
        document.getElementById("buyPremium").style.display = "none";
        document.getElementById("board").style.display = "block";
        document.getElementById("downloadexpense").style.display = "block";
        document.getElementById("downloadedfiles").style.display = "block";

        // Store hidden state in local storage
        localStorage.setItem("buttonHidden", "true");
        let pElement = document.getElementById("message");
        pElement.innerHTML = "You are a Premium User now";
      },
    };
    const rzp1 = new Razorpay(options);
    rzp1.open();
    //e.preventDefault();

    rzp1.on("payment.failed", async function (response) {
      //console.log(response, "response in buyPremium in main.js");
      const failed = await axios.post(
        "http://localhost:3000/user/failedTransaction",
        {
          order_id: response.error.metadata.order_id,
          payment_id: response.error.metadata.payment_id,
        },
        { headers: { authorization: token } }
      );
      alert("Somethimg went Wrong");
    });
  } catch (error) {
    console.log(error, "error in buy premium");
  }
}

function showExpense(expenseData, currentPage, totalPages) {
  //console.log(expenseData)
  const { expenseAmount, description, category, _id } = expenseData;
  var list = document.getElementById("list");
  //list.innerHTML=''

  var li = document.createElement("li");
  var btn = document.createElement("button");
  //var edit = document.createElement("button");

  btn.id = "button";
  btn.appendChild(document.createTextNode("DeleteExpense"));
  //edit.appendChild(document.createTextNode("EditExpense"));

  li.appendChild(
    document.createTextNode(`${expenseAmount} - ${description} - ${category}`)
  );
  li.appendChild(btn);
  //li.appendChild(edit);
  list.appendChild(li);
  //console.log(li);

  // Styling for the li element
  li.style.fontSize = "16px";
  //li.style.display = "flex";
  //li.style.alignContent= "center";
  li.style.color = "blue";
  //li.style.backgroundColor = "lightgray";

  // Styling for the button element
  btn.style.padding = "5px 10px";
  btn.style.margin = "5px";
  btn.style.border = "1px solid black";
  btn.style.borderRadius = "15px";
  btn.style.backgroundColor = "white";
  btn.style.color = "red";
  btn.style.cursor = "pointer";

  // var objString=JSON.stringify(obj);

  // localStorage.setItem(description,objString);

  btn.addEventListener("click", clicked);

  async function clicked(e) {
    try {
      //console.log(e.target,_id)

      //console.log("hi", e.target, id);
      var li = e.target.parentElement;
      list.removeChild(li);

      //localStorage.removeItem(obj.description);

      const response = await axios.delete(
        `http://localhost:3000/user/delete-expense/${_id}`
      );
      //console.log(response);
    } catch (error) {
      console.log(error, "error in deleting expense");
    }
  }

  //     edit.addEventListener('click',edited);

  //    async function edited(e){
  //         try{
  //             console.log('hi',e.target,id)
  //             var li = e.target.parentElement;
  //             list.removeChild(li);
  //         //localStorage.removeItem(obj.description);

  //             document.getElementById('Expenseamount').value=expenseAmount
  //             document.getElementById('Description').value=description
  //             document.getElementById('Category').value=category

  //             //localStorage.removeItem(obj.description);

  //             const response = await axios.delete(`http://localhost:3000/expense/delete-expense/${id}`);
  //             console.log(response);
  //             }
  //             catch (error){
  //                 console.log(error,'error in deleting expense');
  //             }
  //     }
}

async function handleSubmit(event) {
  try {
    event.preventDefault();
    //console.log('hi')
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const data = await axios.post("http://localhost:3000/user/signup", {
      name: name,
      email: email,
      password: password,
    });
    //console.log(data);
    if (data.status === 201) {
      //console.log(201);
      window.location.href = "./login.html";
    }
  } catch (error) {
    console.log(error, "error in post request in main.js");
    const div = document.getElementById("error");

    div.innerHTML = `<div style="color: red;"><h3>ERROR HERE ...${error.response.status}  ${error.response.data}</h3> </div>`;
    console.log(error.response.data);
  }
}

async function validLogin(event) {
  try {
    event.preventDefault();
    //console.log(event.target.email.value);
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const obj = {
      email: email,
      password: password,
    };
    const data = await axios.post("http://localhost:3000/user/validate", obj);
    //console.log(data);
    if (data.status === 201) {
      //console.log(data.data);
      localStorage.setItem("token", data.data.token);
      alert("User Login Success");
      window.location.href = "./expense.html";
    }
  } catch (error) {
    console.log(error, "error in validating user");
    const div = document.getElementById("error");
    div.innerHTML = "";
    div.innerHTML = `<div style="color: red;"><h3>ERROR HERE ...404 ${error.response.data}</h3> </div>`;
    console.log(error.response.data);
  }
}

async function expenseHandler(event) {
  event.preventDefault();

  var amount = document.getElementById("Expenseamount").value;
  var description = document.getElementById("Description").value;
  var category = document.getElementById("Category").value;
  var token = localStorage.getItem("token");
  //console.log(amount, description, category);
  //console.log(token);

  axios
    .post("http://localhost:3000/user/post-expense", {
      amount: amount,
      description: description,
      category: category,
      token: token,
    })
    .then((result) => {
      //console.log(result, "result in axios post in main.js");
      const newToken = result.data.token;
      //console.log(newToken, "newtokennnnnnn");
      localStorage.setItem("token", newToken);
      //showExpense(result.data.newExpenseDetail);
      getData(1);
    })
    .catch((error) => console.log(error, "error in axios post in main.js"));

  var obj = {
    amount: amount,
    description: description,
    category: category,
  };
}

// async function showReport() {
//   const reportEle = document.getElementById("reportList");
//   reportEle.innerHTML = "Report Generation";
// }

function download() {
  //console.log("download clicked");
  const token = localStorage.getItem("token");
  axios
    .get("http://localhost:3000/user/download", {
      headers: { Authorization: token },
    })
    .then((response) => {
      //console.log(response);
      if (response.status === 201) {
        //the bcakend is essentially sending a download link
        //  which if we open in browser, the file would download
        var a = document.createElement("a");
        a.href = response.data.fileUrl;
        a.download = "myexpense.csv";
        a.click();
      } else {
        throw new Error(response.data.message);
      }
    })
    .catch((err) => {
      console.log(err, "error in download in main js");
    });
}

async function showDownloadedFiles() {
  try {
    let token = localStorage.getItem("token");
    //console.log("show download files clicked");
    const allfFiles = await axios.get(
      "http://localhost:3000/user/downloadedfiles",
      { headers: { Authorization: token } }
    );
    //console.log(allfFiles.data["allFiles"],'allfiles')
    if (allfFiles) {
      let showDownload = document.getElementById("showDownload");
      let showDownloadedFilesInScreen = document.createElement("ul");
      showDownloadedFilesInScreen.innerHTML = `<h2>All Downloaded Files Till Now</h2>`;
      for (let files of allfFiles.data["allFiles"]) {
        let li = document.createElement("li");
        li.innerText = `${files.datedownloaded} - ${files.url}`;
        showDownloadedFilesInScreen.appendChild(li);
      }
      showDownload.appendChild(showDownloadedFilesInScreen);
    }
  } catch (error) {
    console.log(error, "error in showdownloadFiles");
  }
}
