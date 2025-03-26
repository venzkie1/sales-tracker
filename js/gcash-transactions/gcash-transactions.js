document.addEventListener("DOMContentLoaded", loadTransactions);

async function loadTransactions() {
    try {
        const response = await fetch("http://localhost:3000/api/gcash"); // Fetch data from your backend
        if (!response.ok) throw new Error("Failed to fetch transactions");

        const transactions = await response.json();
        renderTransactions(transactions);
    } catch (error) {
        console.error("Error loading transactions:", error);
    }
}

function renderTransactions(transactions) {
    const table = document.getElementById("gcashTransactionsTable");
    table.innerHTML = "";
    let total = 0;

    transactions.forEach(({ dateTime, amount, fee, total: transTotal }) => {
        const row = `<tr>
            <td>${dateTime}</td>
            <td>₱${amount}</td>
            <td>₱${fee}</td>
            <td>₱${transTotal}</td>
        </tr>`;
        table.innerHTML += row;
        total += parseFloat(transTotal);
    });

    document.getElementById("filteredTotal").textContent = total.toFixed(2);
}

async function filterTransactions() {
    const selectedDate = document.getElementById("filterDate").value;
    if (!selectedDate) {
        loadTransactions();
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/gcash"); // Fetch all transactions
        if (!response.ok) throw new Error("Failed to fetch transactions");

        const transactions = await response.json();
        
        // Ensure the date format matches the input field format (YYYY-MM-DD)
        const filtered = transactions.filter(({ dateTime }) => {
            const transactionDate = new Date(dateTime).toISOString().split("T")[0]; // Convert to YYYY-MM-DD
            return transactionDate === selectedDate;
        });

        renderTransactions(filtered);
    } catch (error) {
        console.error("Error filtering transactions:", error);
    }
}

function resetFilters() {
    document.getElementById("filterDate").value = "";
    loadTransactions();
}