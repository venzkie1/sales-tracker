function addGCashTransaction() {
    const amount = parseFloat(document.getElementById("gcashAmount").value);
    if (isNaN(amount) || amount < 1) {
        alert("Enter a valid amount!");
        return;
    }

    let fee = calculateGCashFee(amount);
    let total = amount + fee;
    const dateTime = new Date().toLocaleString();

    const table = document.getElementById("gcashTable");
    const row = `<tr>
        <td>${dateTime}</td>
        <td>₱${amount}</td>
        <td>₱${fee}</td>
        <td>₱${total}</td>
        <td>
            <button class="delete-btn" onclick="deleteRow(this)">Delete</button>
        </td>
    </tr>`;
    table.innerHTML += row;

    saveData();
    updateGCashTotal();
}

function calculateGCashFee(amount) {
    if (amount <= 199) return 5;
    if (amount <= 200) return 10;
    if (amount <= 500) return 15;
    if (amount <= 1000) return 20;
    if (amount <= 1500) return 30;
    if (amount <= 2000) return 40;
    if (amount <= 2500) return 50;
    if (amount <= 3000) return 60;
    if (amount <= 3500) return 70;
    if (amount <= 4000) return 80;
    if (amount <= 4500) return 90;
    if (amount <= 5000) return 100;
    if (amount <= 5500) return 110;
    if (amount <= 6000) return 120;
    if (amount <= 6500) return 130;
    if (amount <= 7000) return 140;
    if (amount <= 7500) return 150;
    if (amount <= 8000) return 160;
    if (amount <= 8500) return 170;
    if (amount <= 9000) return 180;
    if (amount <= 9500) return 190;
    return 200;
}

function updateGCashTotal() {
    let gcashTotal = 0;
    document.querySelectorAll("#gcashTable tr td:nth-child(4)").forEach(td => {
        let value = parseFloat(td.textContent.replace('₱', '').trim());
        if (!isNaN(value)) {
            gcashTotal += value;
        }
    });
    document.getElementById("gcashTotal").textContent = gcashTotal.toFixed(2);
}

function saveData() {
    const rows = [];
    document.querySelectorAll("#gcashTable tr").forEach(row => {
        const columns = row.querySelectorAll("td");
        if (columns.length > 0) {
            rows.push({
                date: columns[0].textContent,
                amount: columns[1].textContent.replace('₱', ''),
                fee: columns[2].textContent.replace('₱', ''),
                total: columns[3].textContent.replace('₱', '')
            });
        }
    });
    localStorage.setItem("gcashTransactions", JSON.stringify(rows));
}

function loadData() {
    const savedData = localStorage.getItem("gcashTransactions");
    if (!savedData) return;

    const transactions = JSON.parse(savedData);
    const table = document.getElementById("gcashTable");
    table.innerHTML = "";

    // Get today's date in `M/D/YYYY` format
    const today = new Date().toLocaleDateString("en-US"); 

    // Filter transactions to only show today's entries
    const filteredTransactions = transactions.filter(({ date }) => {
        let transactionDate = date.split(",")[0]; // Extract `M/D/YYYY`
        return transactionDate === today;
    });

    filteredTransactions.forEach(({ date, amount, fee, total }) => {
        const row = `<tr>
            <td>${date}</td>
            <td>₱${amount}</td>
            <td>₱${fee}</td>
            <td>₱${total}</td>
            <td>
                <button class="delete-btn" onclick="deleteRow(this)">Delete</button>
            </td>
        </tr>`;
        table.innerHTML += row;
    });

    updateGCashTotal();
}

function deleteRow(button) {
    button.closest("tr").remove();
    saveData();
    updateGCashTotal();
}

document.addEventListener("DOMContentLoaded", loadData);