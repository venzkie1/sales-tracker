async function loadDataSoftDrinks() {
    try {
        const response = await fetch('http://localhost:3000/api/softdrinks');
        if (!response.ok) throw new Error('Failed to fetch data');

        const softDrinksData = await response.json();

        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split("T")[0];

        // Filter only today's transactions
        const filteredData = softDrinksData.filter(entry => {
            const entryDate = new Date(entry.dateTime).toISOString().split("T")[0];
            return entryDate === today;
        });

        rebuildTableSoftDrinks('softDrinksTable', filteredData);
        updateTotalsSoftDrinks();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// function saveDataSoftDrinks() {
//     const softDrinksRows = Array.from(document.querySelectorAll('#softDrinksTable tr'));
//     const softDrinksData = softDrinksRows.map(row => {
//         const cells = row.querySelectorAll("td");
//         if (cells.length < 5) return null; // Ensure all columns exist
//         return {
//             dateTime: cells[0].textContent,
//             category: cells[1].textContent,
//             item: cells[2].textContent,
//             quantity: cells[3].textContent,
//             total: cells[4].textContent.replace('₱', '').trim()
//         };
//     }).filter(entry => entry !== null);
//     localStorage.setItem('softDrinksData', JSON.stringify(softDrinksData));
// }

async function saveDataSoftDrinks() {
    const rows = Array.from(document.querySelectorAll('#softDrinksTable tr'));
    const softDrinksData = rows.map(row => {
        const cells = row.querySelectorAll("td");
        if (cells.length < 5) return null; // Ensure all columns exist
        return {
            dateTime: cells[0].textContent,
            category: cells[1].textContent,
            item: cells[2].textContent,
            quantity: parseInt(cells[3].textContent),
            total: parseFloat(cells[4].textContent.replace('₱', '').trim())
        };
    }).filter(entry => entry !== null);

    try {
        for (const entry of softDrinksData) {
            const response = await fetch('http://localhost:3000/api/softdrinks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(entry)
            });

            if (!response.ok) throw new Error('Failed to save entry');
        }
        console.log('All data saved successfully!');
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

function addSoftDrinkSale() {
    const category = document.getElementById('category').value;
    const item = document.getElementById('item').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const price = category === 'Big' ? 20 : 15;
    const total = price * quantity;
    const dateTime = new Date().toLocaleString();

    if (editingRow) {
        // Update existing row
        editingRow.cells[0].textContent = dateTime;
        editingRow.cells[1].textContent = category;
        editingRow.cells[2].textContent = item;
        editingRow.cells[3].textContent = quantity;
        editingRow.cells[4].textContent = `₱${total}`;
        editingRow = null; // Reset edit mode
    } else {
        // Create new row
        const table = document.getElementById('softDrinksTable');
        const row = `<tr>
            <td>${dateTime}</td>
            <td>${category}</td>
            <td>${item}</td>
            <td>${quantity}</td>
            <td>₱${total}</td>
            <td>
                <button class='action-btn' onclick='editRowSoftDrinks(this)'>Edit</button>
                <button class='delete-btn' onclick='deleteRowSoftDrinks(this)'>Delete</button>
            </td>
        </tr>`;
        table.innerHTML += row;
    }

    saveDataSoftDrinks();
    updateTotalsSoftDrinks();
}

let editingRow = null; // Store the row being edited
function editRowSoftDrinks(button) {
    editingRow = button.parentNode.parentNode; // Store the row reference

    // Get category and item from the row
    const selectedCategory = editingRow.cells[1].textContent;
    const selectedItem = editingRow.cells[2].textContent;

    // Populate the item dropdown based on the category
    populateItemDropdown(selectedCategory, selectedItem);

    // Pre-fill other fields
    document.getElementById('editCategory').value = selectedCategory;
    document.getElementById('editQuantity').value = parseInt(editingRow.cells[3].textContent);

    // Show modal
    document.getElementById('editModal').style.display = 'block';
}

// Function to populate item dropdown dynamically
function populateItemDropdown(category, selectedItem) {
    const itemDropdown = document.getElementById('editItem');
    itemDropdown.innerHTML = ''; // Clear previous options

    const items = category === 'Big' ? ['Coke', 'Sprite', 'Royal'] : ['Coke', 'Sprite', 'Royal'];
    
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        option.textContent = item;
        if (item === selectedItem) {
            option.selected = true; // Preserve previous selection
        }
        itemDropdown.appendChild(option);
    });
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

function saveEditedRow() {
    if (editingRow) {
        // Get updated values
        const updatedCategory = document.getElementById('editCategory').value;
        const updatedItem = document.getElementById('editItem').value;
        const updatedQuantity = parseInt(document.getElementById('editQuantity').value);

        // Update table row
        editingRow.cells[1].textContent = updatedCategory;
        editingRow.cells[2].textContent = updatedItem;
        editingRow.cells[3].textContent = updatedQuantity;

        // Recalculate total
        const price = updatedCategory === 'Big' ? 20 : 15;
        editingRow.cells[4].textContent = `₱${price * updatedQuantity}`;

        // Save changes and close modal
        saveDataSoftDrinks();
        updateTotalsSoftDrinks();
        closeEditModal();
    }
}

async function deleteRowSoftDrinks(button) {
    const row = button.parentNode.parentNode;
    const id = row.getAttribute('data-id'); // Get _id from row attribute

    if (!id) {
        console.error("No ID found for deletion");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/softdrinks/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete entry');

        row.remove(); // Remove from UI only if deletion is successful
        updateTotalsSoftDrinks();
        console.log('Entry deleted successfully!');
    } catch (error) {
        console.error('Error deleting entry:', error);
    }
}

function rebuildTableSoftDrinks(tableId, data) {
    const table = document.getElementById(tableId);
    table.innerHTML = ''; // Clear previous rows

    data.forEach(entry => {
        const row = document.createElement("tr");
        row.setAttribute("data-id", entry._id); // Ensure _id is included

        row.innerHTML = `
            <td>${entry.dateTime}</td>
            <td>${entry.category}</td>
            <td>${entry.item}</td>
            <td>${entry.quantity}</td>
            <td>₱${entry.total}</td>
            <td>
                <button class='action-btn' onclick='editRowSoftDrinks(this)'>Edit</button>
                <button class='delete-btn' onclick='deleteRowSoftDrinks(this)'>Delete</button>
            </td>
        `;
        table.appendChild(row);
    });
}

function updateTotalsSoftDrinks() {
    let softDrinksTotal = 0;
    document.querySelectorAll("#softDrinksTable td:nth-child(5)").forEach(td => {
        let value = parseFloat(td.textContent.replace('₱', '').trim());
        if (!isNaN(value)) {
            softDrinksTotal += value;
        }
    });
    document.getElementById("softDrinksTotal").textContent = softDrinksTotal.toFixed(2);
}

document.addEventListener("DOMContentLoaded", loadDataSoftDrinks);