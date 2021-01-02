class UI {
  constructor() {
    // thông báo đầu
    this.budgetFeedback = document.querySelector(".budget-feedback");
    // thông báo sau
    this.expenseFeedback = document.querySelector(".expense-feedback");
    // toàn bộ form đầu
    this.budgetForm = document.getElementById("budget-form");
    // thanh input đầu
    this.budgetInput = document.getElementById("budget-input");
    // số 0 trong budget 
    this.budgetAmount = document.getElementById("budget-amount");
    // số 0 trong expense
    this.expenseAmount = document.getElementById("expense-amount");
    // số 0 và $ trong balance
    this.balance = document.getElementById("balance");
    // số 0 trong balance
    this.balanceAmount = document.getElementById("balance-amount");
    // toàn bộ form 2
    this.expenseForm = document.getElementById("expense-form");
    // input đầu của form 2
    this.expenseInput = document.getElementById("expense-input");
    // input 2 của form 2
    this.amountInput = document.getElementById("amount-input");
    // bao 3 cái tiêu đề cuối
    this.expenseList = document.getElementById("expense-list");
    this.itemList = [];
    this.itemID = 0;
  }
  submitExpenseForm() {
    const expenseValue = this.expenseInput.value;
    const amountValue = this.amountInput.value;
    if (expenseValue === "" || amountValue === "" || amountValue < 0) {
      this.expenseFeedback.classList.add("showItem");
      this.expenseFeedback.innerHTML = '<p>value cannot be empty or negative</p>';
      const self = this;
      setTimeout(function () {
        self.expenseFeedback.classList.remove("showItem");
      }, 3000);
    }
    else {
      let amount = parseInt(amountValue);
      this.expenseInput.value = "";
      this.amountInput.value = "";
      let expense = {
        id: this.itemID,
        title: expenseValue,
        amount: amount
      }
      this.itemID++;
      this.itemList.push(expense);
      this.addExpense(expense);
      this.showBalance();
    }
  }
  submitBudgetForm() {
    const value = this.budgetInput.value;
    if (value === "" || value < 0) {
      this.budgetFeedback.classList.add("showItem");
      this.budgetFeedback.innerHTML = '<p>value cannot be empty or negative</p>';
      const self = this;
      setTimeout(function () {
        self.budgetFeedback.classList.remove("showItem");
      }, 3000);
    }
    else {
      this.budgetAmount.innerHTML = value;
      this.budgetInput.value = '';
      this.showBalance();
    }
  }
  showBalance() {
    const expense = this.totalExpense();
    // .textContent or innerHTML là 1
    const total = parseInt(this.budgetAmount.innerHTML) - expense;
    this.balanceAmount.innerHTML = total;
    if (total < 0) {
      this.balance.classList.remove("showGreen", "showBlack");
      this.balance.classList.add("showRed");
    }
    else if (total > 0) {
      this.balance.classList.remove("showRed", "showBlack");
      this.balance.classList.add("showGreen");
    }
    else {
      this.balance.classList.remove("showGreen", "showRed");
      this.balance.classList.add("showBlack");
    }
  }
  totalExpense() {
    let total = 0;
    if (this.itemList.length > 0) {
      total = this.itemList.reduce(function (acc, curr) {
        // acc là tổng = 0
        // curr.amount là số lượng ở vị trí hiện tại
        acc += curr.amount;
        return acc;
      }, 0);
    }
    console.log(total);
    this.expenseAmount.innerHTML = total;
    return total;
  }
  addExpense(expense) {
    const div = document.createElement('div');
    div.classList.add('expense');
    div.innerHTML = `
    <div class="expense-item d-flex justify-content-between align-items-baseline">
  
      <h6 class="expense-title mb-0 text-uppercase list-item">- ${expense.title}</h6>
      <h5 class="expense-amount mb-0 list-item">${expense.amount}</h5>
  
      <div class="expense-icons list-item">
  
          <a href="#" class="edit-icon mx-2" data-id="${expense.id}">
              <i class="fas fa-edit"></i>
          </a>
          <a href="#" class="delete-icon" data-id="${expense.id}">
              <i class="fas fa-trash"></i>
          </a>
      </div>
    </div>
    `;
    this.expenseList.appendChild(div);
  }
  editExpense(element) {
    let id = parseInt(element.dataset.id);

    let parent = element.parentElement.parentElement.parentElement;
    // xóa toàn bộ thẻ div class="expense" trong thẻ div cha expenseList
    this.expenseList.removeChild(parent);

    // lấy all thông tin object thuộc id này
    let expense = this.itemList.filter(function (item) {
      return item.id === id;
    });
    this.expenseInput.value = expense[0].title;
    this.amountInput.value = expense[0].amount;
    //cập nhật lại cái list sau khi xóa data thằng edit đi để sửa
    let tempList = this.itemList.filter(function (item) {
      return item.id !== id;
    });
    this.itemList = tempList;
    this.showBalance();
  }
  deleteExpense(element) {
    let id = parseInt(element.dataset.id);

    let parent = element.parentElement.parentElement.parentElement;
    // xóa toàn bộ thẻ div class="expense" trong thẻ div cha expenseList
    this.expenseList.removeChild(parent);

    //cập nhật lại cái list sau khi xóa data thằng edit đi để sửa
    let tempList = this.itemList.filter(function (item) {
      return item.id !== id;
    });
    this.itemList = tempList;
    this.showBalance();
  }
}

function eventListeners() {
  const budgetForm = document.getElementById("budget-form");
  const expenseForm = document.getElementById("expense-form");
  const expenseList = document.getElementById("expense-list");
  const ui = new UI();
  budgetForm.addEventListener('submit', function (event) {
    event.preventDefault();
    ui.submitBudgetForm();
  });
  expenseForm.addEventListener('submit', function (event) {
    event.preventDefault();
    ui.submitExpenseForm();
  });
  expenseList.addEventListener('click', function (event) {
    // click vào icon nào thì hiện ra icon i
    console.log(event.target);
    // nếu thằng cha bộc icon i có class là edit-icon thì
    // nói đơn giản thì khi click vào icon edit
    if (event.target.parentElement.classList.contains('edit-icon')) {
      ui.editExpense(event.target.parentElement);
    }
    // nói đơn giản thì khi click vào icon edit
    else if (event.target.parentElement.classList.contains('delete-icon')) {
      ui.deleteExpense(event.target.parentElement);
    }
  });
}
document.addEventListener('DOMContentLoaded', function () {
  eventListeners();
});
