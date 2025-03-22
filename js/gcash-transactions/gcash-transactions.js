document.addEventListener("DOMContentLoaded", loadTransactions);
        
function loadTransactions() {
    const savedData = localStorage.getItem("gcashTransactions");
    if (!savedData) return;
    
    const transactions = JSON.parse(savedData);
    renderTransactions(transactions);
}

function renderTransactions(transactions) {
    const table = document.getElementById("gcashTransactionsTable");
    table.innerHTML = "";
    let total = 0;
    
    transactions.forEach(({ date, amount, fee, total: transTotal }) => {
        const row = `<tr>
            <td>${date}</td>
            <td>₱${amount}</td>
            <td>₱${fee}</td>
            <td>₱${transTotal}</td>
        </tr>`;
        table.innerHTML += row;
        total += parseFloat(transTotal);
    });
    
    document.getElementById("filteredTotal").textContent = total.toFixed(2);
}

function filterTransactions() {
    const selectedDate = document.getElementById("filterDate").value;
    if (!selectedDate) {
        loadTransactions();
        return;
    }

    const savedData = localStorage.getItem("gcashTransactions");
    if (!savedData) return;

    const transactions = JSON.parse(savedData);
    
    // Ensure the date format matches the input field format (YYYY-MM-DD)
    const filtered = transactions.filter(({ date }) => {
        const transactionDate = new Date(date).toISOString().split("T")[0]; // Convert to YYYY-MM-DD
        return transactionDate === selectedDate;
    });

    renderTransactions(filtered);
}

function resetFilters() {
    document.getElementById("filterDate").value = "";
    loadTransactions();
}