// ======================================================================
// Make Markdown and HTML tables sortable
// ======================================================================

// This function takes a table row (tr) and an index (idx) as arguments,
// and returns the inner text or text content of the cell at the specified index in the row.
function getCellValue(tr, idx) {
    return tr.children[idx].innerText || tr.children[idx].textContent;
}

// This function takes an index (idx) and a boolean value (asc) as arguments,
// and returns a function that compares two rows (a and b) based on the values in the cell
// at the specified index. If asc is true, the rows will be sorted in ascending order.
// If asc is false, the rows will be sorted in descending order.
function comparer(idx, asc) {
    return (a, b) => {
        // Get the values of the cells to be compared
        const v1 = getCellValue(asc ? a : b, idx);
        const v2 = getCellValue(asc ? b : a, idx);
        // Compare the values
        if (v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2)) {
            // If the values are not empty and are numbers, compare them as numbers
            return v1 - v2;
        }
        // If the values are not numbers, compare them as strings
        return v1.toString().localeCompare(v2);
    };
}

// Add an event listener to each table header (th) element
document.querySelectorAll('th').forEach((th) => {
    // add cursor pointer to all th elements
    th.style.cursor = "pointer";
    
    th.addEventListener('click', (() => {
        // When a header is clicked, sort the rows in the table based on the values in the column
        // corresponding to the clicked header
        const table = th.closest('table');
        Array.from(table.querySelectorAll('tr:nth-child(n+2)'))
            .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
            .forEach((tr) => table.appendChild(tr));
    }));
});

