function submitFinance(type) {

    let container = document.getElementById(type + '-data');
    
    let table;
    let selection

    container.innerHTML = '';
    if (document.getElementById('evaluationTable-' + type)) {
        document.getElementById('evaluationTable-' + type).remove();
        container.classList.remove('dontGlow');
    } else {
        container.classList.add('dontGlow');
    }

    switch (type) {
        case 'expenses':
            if (expensesSelection.length == 0) {
                if (document.getElementById('evaluationTable-expenses')) {
                    document.getElementById('evaluationTable-expenses').remove();
                }
                container.style.justifyContent = 'center';
                container.textContent = '+';
                return;
            }
            container.style.justifyContent = 'flex-start';
            table = document.createElement('table');
            table.id = 'evaluationTable-' + type;
            selection = expensesSelection;
            break;
        case 'income':
            if (incomeSelection.length == 0) {
                if (document.getElementById('evaluationTable-income')) {
                    document.getElementById('evaluationTable-income').remove();
                }
                container.style.justifyContent = 'center';
                container.textContent = '+';
                return;
            }
            container.style.justifyContent = 'flex-start';
            table = document.createElement('table');
            table.id = 'evaluationTable-' + type;
            selection = incomeSelection;
            break;
        }


    // Iterate through the data object
    for (var item of selection) {

        // Create table row
        var row = document.createElement('tr');
        var amountCell = document.createElement('td');
        amountCell.textContent = item.amount + 'x';
        row.appendChild(amountCell);
        var itemCell = document.createElement('td');
        itemCell.textContent = item.name;
        itemCell.classList.add('item-name');
        row.appendChild(itemCell);
        var priceCell = document.createElement('td');
        priceCell.textContent = Number(item.price) * Number(item.amount);
        priceCell.classList.add('item-price');
        row.appendChild(priceCell);
        table.appendChild(row);
    }

    container.appendChild(table);
}