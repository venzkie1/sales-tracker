function loadSoftDrinks() {
    const data = JSON.parse(localStorage.getItem('softDrinksData')) || [];
    displaySoftDrinks(data);
}

function displaySoftDrinks(data) {
    const tableBody = document.getElementById("softDrinksList");
    const totalEarnings = document.getElementById("totalEarnings");
    tableBody.innerHTML = "";

    let total = 0;

    data.forEach(entry => {
        const row = `<tr>
            <td>${entry.dateTime}</td>
            <td>${entry.category}</td>
            <td>${entry.item}</td>
            <td>${entry.quantity}</td>
            <td>₱${entry.total}</td>
        </tr>`;
        tableBody.innerHTML += row;
        total += parseFloat(entry.total);
    });

    totalEarnings.textContent = total.toFixed(2);
}

function applyFilters() {
    const data = JSON.parse(localStorage.getItem('softDrinksData')) || [];
    const selectedDate = document.getElementById("filterDate").value;
    const selectedCategory = document.getElementById("filterCategory").value;

    const filteredData = data.filter(entry => {
        let matchesDate = true;
        let matchesCategory = true;

        if (selectedDate) {
            let entryDate = new Date(entry.dateTime).toISOString().split('T')[0]; // Converts to YYYY-MM-DD
            matchesDate = entryDate === selectedDate;
        }

        if (selectedCategory) {
            matchesCategory = entry.category === selectedCategory;
        }

        return matchesDate && matchesCategory;
    });

    displaySoftDrinks(filteredData);
}

function resetFilters() {
    document.getElementById("filterDate").value = "";
    document.getElementById("filterCategory").value = "";
    loadSoftDrinks();
}

document.addEventListener("DOMContentLoaded", loadSoftDrinks);