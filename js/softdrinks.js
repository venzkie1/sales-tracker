function loadDataSoftDrinks() {
    const softDrinksData = JSON.parse(localStorage.getItem('softDrinksData')) || [];
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // Filter only today's transactions
    const filteredData = softDrinksData.filter(entry => {
        const entryDate = new Date(entry.dateTime).toISOString().split("T")[0];
        return entryDate === today;
    });

    rebuildTableSoftDrinks('softDrinksTable', filteredData);
    updateTotalsSoftDrinks();
}

function saveDataSoftDrinks() {
    const softDrinksRows = Array.from(document.querySelectorAll('#softDrinksTable tr'));
    const softDrinksData = softDrinksRows.map(row => {
        const cells = row.querySelectorAll("td");
        if (cells.length < 5) return null; // Ensure all columns exist
        return {
            dateTime: cells[0].textContent,
            category: cells[1].textContent,
            item: cells[2].textContent,
            quantity: cells[3].textContent,
            total: cells[4].textContent.replace('₱', '').trim()
        };
    }).filter(entry => entry !== null);
    localStorage.setItem('softDrinksData', JSON.stringify(softDrinksData));
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

function deleteRowSoftDrinks(button) {
    button.parentNode.parentNode.remove();
    saveDataSoftDrinks();
    updateTotalsSoftDrinks();
}

function rebuildTableSoftDrinks(tableId, data) {
    const table = document.getElementById(tableId);
    table.innerHTML = ''; // Clear previous rows
    data.forEach(entry => {
        const row = `<tr>
            <td>${entry.dateTime}</td>
            <td>${entry.category}</td>
            <td>${entry.item}</td>
            <td>${entry.quantity}</td>
            <td>₱${entry.total}</td>
            <td>
                <button class='action-btn' onclick='editRowSoftDrinks(this)'>Edit</button>
                <button class='delete-btn' onclick='deleteRowSoftDrinks(this)'>Delete</button>
            </td>
        </tr>`;
        table.innerHTML += row;
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