let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let balance = 0;
let income = 0;
let expense = 0
let editIndex = -1;
let chart;
window.onload = function () {
    updateUI();
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        document.getElementById("themeBtn").innerHTML =
            "☀️ Light Mode";
    }
};
function addTransaction() {
    let description =
        document.getElementById("description").value.trim();
    let amount =
        Number(document.getElementById("amount").value);
    let category =
        document.getElementById("category").value;
    let date =
        document.getElementById("date").value;
    if (description === "" || amount === 0 || date === "") {
        alert("Please fill all fields.");
        return;
    }
    let transaction = {
        description: description,
        amount: amount,
        category: category,
        date: date
    };
    if (editIndex === -1) {
        transactions.push(transaction);
    } else {
        transactions[editIndex] = transaction;
        editIndex = -1;
        document.getElementById("addBtn").innerHTML =
            "Add Transaction";
    }
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
    clearForm();
    updateUI();
}
function updateUI() {
    balance = 0;
    income = 0;
    expense = 0;
    transactions.forEach(transaction => {
        if (transaction.amount > 0) {
            income += transaction.amount;
        } else {
            expense += Math.abs(transaction.amount);
        }
    });
    balance = income - expense;
    document.getElementById("balance").innerHTML =
        "₹" + balance.toFixed(2);
    document.getElementById("income").innerHTML =
        "₹" + income.toFixed(2);
    document.getElementById("expense").innerHTML =
        "₹" + expense.toFixed(2);
    displayTransactions(transactions);
    drawChart();

}
function displayTransactions(data) {
    let history =
        document.getElementById("history");
    history.innerHTML = "";
    data.forEach((transaction, index) => {
        let item =
            document.createElement("li");
        item.className = "transaction-card";
        item.innerHTML = `
        <h3>💼 ${transaction.description}</h3>
        <p><strong>💰 Amount :</strong> ₹${transaction.amount}</p>
        <p><strong>📂 Category :</strong> ${transaction.category}</p>
        <p><strong>📅 Date :</strong> ${transaction.date}</p>
        <div class="button-group">
            <button
                class="edit-btn"
                onclick="editTransaction(${index})">
                ✏️ Edit
            </button>
            <button
                class="delete-btn"
                onclick="deleteTransaction(${index})">
                🗑 Delete
            </button>
        </div>
        `;
        history.appendChild(item);
    });
}
function deleteTransaction(index) {
    if (confirm("Are you sure you want to delete this transaction?")) {
        transactions.splice(index, 1);
        localStorage.setItem(
            "transactions",
            JSON.stringify(transactions)
        );
        updateUI();
    }
}
function editTransaction(index) {
    let transaction = transactions[index];
    document.getElementById("description").value =
        transaction.description;
    document.getElementById("amount").value =
        transaction.amount;
    document.getElementById("category").value =
        transaction.category;
    document.getElementById("date").value =
        transaction.date;
    editIndex = index;
    document.getElementById("addBtn").innerHTML =
        "Update Transaction";
}
function searchTransaction() {
    let search =
        document.getElementById("search").value.toLowerCase();
    let filtered = transactions.filter(transaction =>
        transaction.description
            .toLowerCase()
            .includes(search)
    );
    displayTransactions(filtered);
}
function filterTransactions() {
    let category =
        document.getElementById("filter").value;
    if (category === "All") {
        displayTransactions(transactions);
        return;
    }
    let filtered = transactions.filter(transaction =>
        transaction.category === category
    );
    displayTransactions(filtered);
}
function clearForm() {
    document.getElementById("description").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("category").value = "Salary";
    document.getElementById("date").value = "";
}
function drawChart() {
    let totals = {};
    transactions.forEach(transaction => {
        if (transaction.amount < 0) {
            let category = transaction.category;
            let amount = Math.abs(transaction.amount);
            if (totals[category]) {
                totals[category] += amount;
            } else {
                totals[category] = amount;
            }
        }
    });
    let labels = Object.keys(totals);
    let values = Object.values(totals);
    let ctx = document.getElementById("expenseChart");
    if (chart) {
        chart.destroy();
    }
    chart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    "#3498db",
                    "#2ecc71",
                    "#f39c12",
                    "#e74c3c",
                    "#9b59b6",
                    "#1abc9c"
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: "Expense Analysis"
                },
                legend: {
                    position: "bottom"
                }
            }
        }
    });
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    let btn = document.getElementById("themeBtn");
    if (document.body.classList.contains("dark-mode")) {
        btn.innerHTML = "☀️";
        localStorage.setItem("theme", "dark");
    } else {
        btn.innerHTML = "🌙 ";
        localStorage.setItem("theme", "light");
    }
}