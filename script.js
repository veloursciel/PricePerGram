document.addEventListener('DOMContentLoaded', function() {
    const table = document.getElementById('priceTable');
    const tbody = table.querySelector('tbody');

    function calculateUnitPrice(row) {
        const weightInput = row.querySelector('.weight-input');
        const priceInput = row.querySelector('.price-input');
        const unitPriceCell = row.querySelector('.unit-price');

        const weight = parseFloat(weightInput.value);
        const price = parseFloat(priceInput.value);

        if (weight && price && weight > 0) {
            const unitPrice = price / weight;
            unitPriceCell.textContent = unitPrice.toFixed(2);
        } else {
            unitPriceCell.textContent = '-';
        }

        highlightLowestPrice();
    }

    function highlightLowestPrice() {
        const unitPriceCells = document.querySelectorAll('.unit-price');
        let lowestPrice = Infinity;
        let lowestCells = [];

        unitPriceCells.forEach(cell => {
            cell.classList.remove('lowest');
            const price = parseFloat(cell.textContent);
            if (!isNaN(price)) {
                if (price < lowestPrice) {
                    lowestPrice = price;
                    lowestCells = [cell];
                } else if (price === lowestPrice) {
                    lowestCells.push(cell);
                }
            }
        });

        if (lowestCells.length > 0 && lowestPrice !== Infinity) {
            lowestCells.forEach(cell => {
                cell.classList.add('lowest');
            });
        }
    }

    function addNewRow() {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td><input type="number" class="weight-input" placeholder="重さを入力"></td>
            <td><input type="number" class="price-input" placeholder="価格を入力"></td>
            <td class="unit-price">-</td>
        `;
        
        tbody.appendChild(newRow);
        setupRowEventListeners(newRow);
        
        const firstInput = newRow.querySelector('.weight-input');
        firstInput.focus();
    }

    function setupRowEventListeners(row) {
        const weightInput = row.querySelector('.weight-input');
        const priceInput = row.querySelector('.price-input');

        weightInput.addEventListener('input', () => calculateUnitPrice(row));
        priceInput.addEventListener('input', () => calculateUnitPrice(row));

        weightInput.addEventListener('keydown', handleKeyNavigation);
        priceInput.addEventListener('keydown', handleKeyNavigation);
    }

    function handleKeyNavigation(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            
            const currentInput = event.target;
            const currentRow = currentInput.closest('tr');
            const allRows = Array.from(tbody.querySelectorAll('tr'));
            const currentRowIndex = allRows.indexOf(currentRow);
            
            if (currentInput.classList.contains('weight-input')) {
                const priceInput = currentRow.querySelector('.price-input');
                priceInput.focus();
            } else if (currentInput.classList.contains('price-input')) {
                if (currentRowIndex < allRows.length - 1) {
                    const nextRow = allRows[currentRowIndex + 1];
                    const nextWeightInput = nextRow.querySelector('.weight-input');
                    nextWeightInput.focus();
                } else {
                    addNewRow();
                }
            }
        }
    }

    function initializeTable() {
        const existingRows = tbody.querySelectorAll('tr');
        existingRows.forEach(row => {
            setupRowEventListeners(row);
        });

        const firstInput = tbody.querySelector('.weight-input');
        if (firstInput) {
            firstInput.focus();
        }
    }

    function clearAll() {
        const inputs = document.querySelectorAll('input[type="number"]');
        const unitPriceCells = document.querySelectorAll('.unit-price');

        inputs.forEach(input => input.value = '');
        unitPriceCells.forEach(cell => {
            cell.textContent = '-';
            cell.classList.remove('lowest');
        });

        const firstInput = tbody.querySelector('.weight-input');
        if (firstInput) {
            firstInput.focus();
        }
    }

    document.getElementById('clearAllBtn').addEventListener('click', clearAll);

    initializeTable();
});