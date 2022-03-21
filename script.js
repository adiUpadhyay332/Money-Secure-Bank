'use strict';

// Data
const account1 = {
  owner: 'Aditya Upadhyay',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Raman Ranjan',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Shailendra Singh Thakur',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Rajesh Mathur',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

//Cumulative of all the accounts
const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


//Implementing the date and time
setInterval(() => {

  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const day = `${now.getDate()}`.padStart(2, 0);
  const month = `${now.getMonth() + 1}`.padStart(2, 0);
  const year = now.getFullYear();
  const time = now.toLocaleTimeString();

  labelDate.textContent = `${day}/${month}/${year}, ${time}`
}, 1000);


//Implementing the display of movements container.
const displayMovements = function (movements, sort = false) {

  containerMovements.innerHTML = "";

  //here slice is used as because sort fn will directly mutate the original array so by using slice we can create a copy of movements array. S0, when sort becomes true, true condition will be executed otherwise if false(set to defalt) then normal movements will be executed.
  const movs = sort ? movements.slice().sort((a, b) =>
    a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? `deposit` : `withdrawal`

    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}"> ${i + 1} ${type} </div>
    <div class="movements__value"> ${mov} </div>
  </div>`;

    containerMovements.insertAdjacentHTML(`afterbegin`, html)

  });
};

//will display total balance.
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}rs/-`;
}

// implementing the summary tab that is, deposited, credited and the running interest rate.
const calcDisplaySummary = function (acc) {

  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}/-`;

  const out = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0)
  labelSumOut.textContent = `${Math.abs(out)}/-`;

  //interest is paid in each deposit and if the interest is more than or equals to 1 then only intrest is added.

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => deposit * acc.interestRate / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}%`
};

//accounts(it is holding all the accounts) array, needs to be changed with the shortnames and those short names should be fetched from from owner property of individual account objects.


//accs is the cumulative array of all the accounts
const createUsernames = function (accs) {
  //acc is the individual account
  accs.forEach(function (acc) {
    //below, (acc.username) creates the username property (basically adds) in the individual account. So, that we can use it as username of account login. Here, map created a new array of initials.
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map((name) => name[0])
      .join(``);
  });
};

createUsernames(accounts);

//implementing a common update UI.
const updateUI = function (acc) {
  //display movements
  displayMovements(currentAccount.movements);

  //display balance
  calcDisplayBalance(currentAccount);

  //display summary
  calcDisplaySummary(currentAccount);
}


//implementing logout timer
const startLogoutTimer = function()
{

  let myTime = 300;

  //call the timer every five seconds
  const timer = setInterval(function ()
  {
    const min = String(Math.trunc(myTime / 60)).padStart(2, 0);
    const sec = String(myTime % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    //when 0 seconds, stop timer and log user out
    if(myTime === 0)
    {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`
      containerApp.style.opacity = 0;
    }
    //decrease the timer
    myTime--;

  }, 1000);
}


//implementing the login process
let currentAccount;
btnLogin.addEventListener("click", function (event) {
  event.preventDefault();

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

  // optional chaining is done here to return undefined but not error.
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(` `)[0]}`;

    containerApp.style.opacity = 100;

    //clear input fields as we login
    inputLoginUsername.value = "";
    inputLoginPin.value = "";
    inputLoginPin.blur();

    startLogoutTimer();

    updateUI(currentAccount)
  }
});

//implementing the transfer
btnTransfer.addEventListener("click", function (event) {
  event.preventDefault();
  const amount = Number(inputTransferAmount.value)
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value)

  inputTransferAmount.value = '';
  inputTransferTo.value = '';

  if (amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc.username !== currentAccount.username) {
    currentAccount.movements.push(-amount)
    receiverAcc.movements.push(amount)
  }
  updateUI(currentAccount)
});

//implememting the loan process
btnLoan.addEventListener("click", function (event) {
  event.preventDefault()

  const amount = Number(inputLoanAmount.value)
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //Add loan movement
    currentAccount.movements.push(amount);

    //update the UI
    updateUI(currentAccount);

    inputLoanAmount = '';
  }
})

// implementing close account.
btnClose.addEventListener("click", function (event) {
  event.preventDefault();

  if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username)

    //Delete account
    accounts.splice(index, 1);

    //hide UI
    containerApp.style.opacity = 0;
  }
  //clear the inputs as well after the above cond. happened
  inputCloseUsername.value = "";
  inputClosePin.value = "";
  inputLoginUsername.value = "";
  inputLoginPin.value = "";
});

//implementing the sort btn functionality
let sorted = false;
// created sorted variable outside as because to preserve the value of state change from false to true
btnSort.addEventListener("click", function (event) {
  event.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});