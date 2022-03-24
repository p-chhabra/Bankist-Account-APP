'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

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

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}€</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createUsernames = accounts => {
  accounts.forEach(function (mov, i) {
    accounts[i].username = accounts[i].owner
      .toLowerCase()
      .split(' ')
      .map(name => {
        return name.charAt(0);
      })
      .join('');
  });
};
createUsernames(accounts);

const users = 'Steven Thomas Williams';
const username = users
  .toLowerCase()
  .split(' ')
  .map(name => {
    return name.charAt(0);
  })
  .join('');

///Balance Printing///
const calcDisplayBalance = account => {
  const balance = account.movements.reduce((acc, mov) => {
    return acc + mov;
  }, 0);
  account.balance = balance;

  labelBalance.textContent = `${balance} EUR`;
};

///Display Summary
const calcDisplaySummary = account => {
  const incomes = account.movements
    .filter(mov => {
      return mov > 0;
    })
    .reduce((acc, mov) => {
      return acc + mov;
    }, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outcomes = account.movements
    .filter(mov => {
      return mov < 0;
    })
    .reduce((acc, mov) => {
      return acc + mov;
    }, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => {
      return (deposit * account.interestRate) / 100;
    })
    .filter(mov => {
      return mov >= 1;
    })
    .reduce((acc, mov) => {
      return acc + mov;
    }, 0);
  labelSumInterest.textContent = `${interest}€`;
};

///UPDATE UI
const updateUI = currentAccount => {
  //Update Account Details
  displayMovements(currentAccount.movements);
  calcDisplayBalance(currentAccount);
  calcDisplaySummary(currentAccount);
};

///EVENT HANDLERS

///LOGIN BUTTON
let currentAccount;
btnLogin.addEventListener('click', event => {
  event.preventDefault();
  currentAccount = accounts.find(acc => {
    return acc.username === inputLoginUsername.value;
  });
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;

    //Clear input fields
    inputLoginPin.value = '';
    inputLoginUsername.value = '';
    inputLoginPin.blur();

    //Display UI
    containerApp.style.opacity = 100;

    updateUI(currentAccount);
    console.log('LOGIN');
  } else {
    console.log('You have entered your account details wrong');
  }
});

///TRANSFER BUTTON
btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const recieverAccount = accounts.find(acc => {
    return acc.username === inputTransferTo.value;
  });

  if (
    amount > 0 &&
    amount <= currentAccount.balance &&
    recieverAccount &&
    recieverAccount.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    recieverAccount.movements.push(amount);

    updateUI(currentAccount);
  }

  //Clean Input Fields
  inputTransferAmount.value = inputTransferTo.value = '';
});

///CLOSE ACCOUNT BUTTON
btnClose.addEventListener('click', function (event) {
  event.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.indexOf(currentAccount);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
    console.log(accounts);
  }
});

///LOAN BUTTON
btnLoan.addEventListener('click', function (event) {
  event.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some(mov => {
      return mov >= amount * 0.1;
    })
  ) {
    currentAccount.movements.push(amount);

    //UI Display
    updateUI(currentAccount);
  }
});

let sortBool = false;
///SORT BUTTON
btnSort.addEventListener('click', function () {
  if (sortBool === true) sortBool = false;
  else sortBool = true;
  displayMovements(currentAccount.movements, sortBool);
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const movementsUSD = movements.map(mov => mov * 1.1);

const movementsDescription = movements.map((mov, i, arr) => {
  if (mov > 0) {
    return `Movement ${i + 1}: You deposited $${mov}`;
  } else {
    return `Movement ${i + 1}: You withdrew $${Math.abs(mov)}`;
  }
});

///Maximum Value///
const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);
