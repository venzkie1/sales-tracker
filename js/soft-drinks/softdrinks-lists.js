async function loadSoftDrinks() {
    try {
        const response = await fetch('http://localhost:3000/api/softdrinks');
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        displaySoftDrinks(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
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

async function applyFilters() {
    try {
        const response = await fetch('http://localhost:3000/api/softdrinks');
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
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
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function resetFilters() {
    document.getElementById("filterDate").value = "";
    document.getElementById("filterCategory").value = "";
    loadSoftDrinks();
}

document.addEventListener("DOMContentLoaded", loadSoftDrinks);