function generateTable(data, type) {

    var table;
    switch (type) {
        case 'expenses':
            if (document.getElementById('expenses-table')) {
                break;
            }
            table = document.createElement('expenses-table');
            table.id = 'expenses-table';
            break;
        case 'income':
            if (document.getElementById('income-table')) {
                break;
            }
            table = document.createElement('income-table');
            table.id = 'income-table';
            break;
    }


    // Create table header
    // var headerRow = document.createElement('tr');
    // var itemHeader = document.createElement('th');
    // itemHeader.textContent = 'Item';
    // headerRow.appendChild(itemHeader);
    // var priceHeader = document.createElement('th');
    // priceHeader.textContent = 'Price';
    // headerRow.appendChild(priceHeader);
    // var amountHeader = document.createElement('th');
    // amountHeader.textContent = 'Amount';
    // headerRow.appendChild(amountHeader);
    // table.appendChild(headerRow);

    // Iterate through the data object
    for (var category in data) {
    var categoryRow = document.createElement('tr');
    categoryRow.classList.add('categoryRow');
    var categoryCell = document.createElement('td');
    categoryCell.textContent = category;
    categoryCell.classList.add('categoryCell');
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
        itemCell.classList.add('itemCell');
        
        row.appendChild(itemCell);

        // Create price cell
        var priceCell = document.createElement('td');
        priceCell.classList.add('priceCell');
        if (category === "Smrt personálu" && isNaN(items[item])) {
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
            addToSelection(itemName, itemPrice, itemAmount, type);
        } else {
            // Remove the item from the array and reset the input value
            removeFromSelection(itemName, type);
        }
        });

        // Add input event listener to the amount input
        amountInput.addEventListener('input', function(event) {
        var row = event.target.parentNode.parentNode;
        var itemName = row.cells[0].textContent;
        var itemPrice = parseFloat(row.cells[1].textContent);
        var itemAmount = parseInt(event.target.value);

        // Update the selection array with the new amount
        updateSelectionAmount(itemName, itemPrice, itemAmount, type);
        });

            table.appendChild(row);
        }
    }

    switch (type) {
        case 'expenses':
            expensesModal.appendChild(table);
            break;
        case 'income':
            incomeModal.appendChild(table);
            break;
    }
}


var expensesSelection = [];
var incomeSelection = [];

// Function to add item to the selection array
function addToSelection(itemName, itemPrice, itemAmount, type) {
    var item = {
    name: itemName,
    price: itemPrice,
    amount: itemAmount
    };

    switch (type) {
        case 'expenses':
            expensesSelection.push(item);
            break;
        case 'income':
            incomeSelection.push(item);
            break;
    }

    // list.textContent = JSON.stringify(selection);
    calcTotal(type);
}

// Function to remove item from the selection array
function removeFromSelection(itemName, type) {

    switch (type) {
        case 'expenses':
            for (var i = 0; i < expensesSelection.length; i++) {
                if (expensesSelection[i].name === itemName) {
                    expensesSelection.splice(i, 1);
                    break;
                }
            }
            break;
        case 'income':
            for (var i = 0; i < incomeSelection.length; i++) {
                if (incomeSelection[i].name === itemName) {
                    incomeSelection.splice(i, 1);
                    break;
                }
            }
            break;
    }

    calcTotal(type);
    // list.textContent = JSON.stringify(selection);
}

function updateSelectionAmount(itemName, itemPrice, itemAmount, type) {

    switch (type) {
        case 'expenses':
            for (var i = 0; i < expensesSelection.length; i++) {
                if (expensesSelection[i].name === itemName) {
                    expensesSelection[i].amount = itemAmount;
                    break;
                }
            }
            break;
        case 'income':
            for (var i = 0; i < incomeSelection.length; i++) {
                if (incomeSelection[i].name === itemName) {
                    incomeSelection[i].amount = itemAmount;
                    break;
                }
            }
            break;
    }

    calcTotal(type);
    // list.textContent = JSON.stringify(selection);
}

function calcTotal(type) {
    switch (type) {
        case 'expenses':
            var total = 0;
            if (expensesSelection.length === 0) {document.getElementById('expensesTotal').textContent = '0 $';}
            for (var i = 0; i < expensesSelection.length; i++) {
                total += Number(expensesSelection[i].price) * expensesSelection[i].amount;

                document.getElementById('expensesTotal').textContent = total + ' $';
            }
            // totalElement.textContent = total;
            break;
        case 'income':
            var total = 0;
            if (incomeSelection.length === 0) {document.getElementById('incomeTotal').textContent = '0 $';}
            for (var i = 0; i < incomeSelection.length; i++) {
                total += Number(incomeSelection[i].price) * incomeSelection[i].amount;
                document.getElementById('incomeTotal').textContent = total + ' $';
            }
            // totalElement.textContent = total;
            break;
    }

    submitFinance(type);
}