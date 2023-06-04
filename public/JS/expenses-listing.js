function generateTable(data) {
    var table = document.createElement('table');

    // Create table header
    var headerRow = document.createElement('tr');
    var itemHeader = document.createElement('th');
    itemHeader.textContent = 'Item';
    headerRow.appendChild(itemHeader);
    var priceHeader = document.createElement('th');
    priceHeader.textContent = 'Price';
    headerRow.appendChild(priceHeader);
    var amountHeader = document.createElement('th');
    amountHeader.textContent = 'Amount';
    headerRow.appendChild(amountHeader);
    table.appendChild(headerRow);

    // Iterate through the data object
    for (var category in data) {
    var categoryRow = document.createElement('tr');
    var categoryCell = document.createElement('td');
    categoryCell.textContent = category;
    categoryCell.setAttribute('colspan', '3');
    categoryRow.appendChild(categoryCell);
    table.appendChild(categoryRow);

    var items = data[category];

    // Create rows for each item in the category
    for (var item in items) {
        var row = document.createElement('tr');

    // Create item cell
    var itemCell = document.createElement('td');
    itemCell.textContent = item;
    
    row.appendChild(itemCell);

    // Create price cell
    var priceCell = document.createElement('td');
    if (category === "Death of personnel" && isNaN(items[item])) {
        priceCell.textContent = 0;
        priceCell.classList.add('priceless');
    } else {
        priceCell.textContent = items[item];
    }
    row.appendChild(priceCell);
    

    // Create amount cell
    var amountCell = document.createElement('td');
    var amountInput = document.createElement('input');
    amountInput.type = 'text';
    amountInput.value = 1;
    amountCell.appendChild(amountInput);
    row.appendChild(amountCell);

    // Add click event listener to the row
    row.addEventListener('click', function(event) {
    if (event.target.nodeName === 'INPUT') {
        return; // Skip if the click target is an input element
    }

    this.classList.toggle('selected'); // Toggle the 'selected' class on click
    var itemName = this.cells[0].textContent;
    var itemPrice = parseFloat(this.cells[1].textContent);
    var itemAmount = parseInt(this.cells[2].querySelector('input').value);

    if (this.classList.contains('selected')) {
        // Add the selected item to the array
        addToSelection(itemName, itemPrice, itemAmount);
    } else {
        // Remove the item from the array and reset the input value
        removeFromSelection(itemName);
    }
    });

    // Add input event listener to the amount input
    amountInput.addEventListener('input', function(event) {
    var row = event.target.parentNode.parentNode;
    var itemName = row.cells[0].textContent;
    var itemPrice = parseFloat(row.cells[1].textContent);
    var itemAmount = parseInt(event.target.value);

    // Update the selection array with the new amount
    updateSelectionAmount(itemName, itemPrice, itemAmount);
    });

        table.appendChild(row);
    }
    }

    financeModal.appendChild(table);
}

// Example selection array
var selection = [];
var list = document.getElementById('list');
var totalElement = document.getElementById('total');

// Function to add item to the selection array
function addToSelection(itemName, itemPrice, itemAmount) {
    var item = {
    name: itemName,
    price: itemPrice,
    amount: itemAmount
    };
    selection.push(item);

    list.textContent = JSON.stringify(selection);
    calcTotal();
}

// Function to remove item from the selection array
function removeFromSelection(itemName) {
    for (var i = 0; i < selection.length; i++) {
        if (selection[i].name === itemName) {
            selection.splice(i, 1);
            break;
        }
    }
    calcTotal();
    list.textContent = JSON.stringify(selection);
}

function updateSelectionAmount(itemName, itemPrice, itemAmount) {
    for (var i = 0; i < selection.length; i++) {
        if (selection[i].name === itemName) {
            selection[i].amount = itemAmount;
            break;
        }
    }
    calcTotal();
    list.textContent = JSON.stringify(selection);
}

function calcTotal() {
    var total = 0;
    for (var i = 0; i < selection.length; i++) {
        total += Number(selection[i].price) * selection[i].amount;
    }
    totalElement.textContent = total;
}