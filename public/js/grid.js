window.onload = function () {
    (function () {
        var input = document.querySelector("input"),
            table = document.querySelector("tbody"),

            idCellSelector = "td.id",
            textCellsSelector = "td.text",
            selectedClassName = "selected";

        input.addEventListener("input", function () {
            var rows = makeArray(table.querySelectorAll("tr")),
                value = this.value;

            updateRowsSelection(rows, value);
            sortRows(rows);
        }, false);



        function updateRowsSelection(rows, value) {
            rows.forEach(function (row) {
                var cells = makeArray(row.querySelectorAll(textCellsSelector)),
                    idCell = row.querySelector(idCellSelector);

                cells.forEach(function (cell) {
                    if (cellHasMatches(cell, value) && value) {
                        cell.classList.add(selectedClassName);
                    } else {
                        cell.classList.remove(selectedClassName);
                    }
                });

                if (isRowSelected(row)) {
                    idCell.classList.add(selectedClassName);
                } else {
                    idCell.classList.remove(selectedClassName);
                }
            });
        }

        function sortRows(rows) {
            var selectedRows = [],
                unselectedRows = [];

            rows.sort(function (a, b) {
                return getRowId(a) > getRowId(b);
            });

            rows.forEach(function (row) {
                if (isRowSelected(row)) {
                    selectedRows.push(row);
                } else {
                    unselectedRows.push(row);
                }
            });

            selectedRows.concat(unselectedRows).forEach(function (row) {
                row.parentNode.appendChild(row);
            });
        }



        function makeArray(object) {
            return Array.prototype.slice.call(object);
        }

        function cellHasMatches(cell, value) {
            return cell.textContent.toLowerCase().indexOf(value.toLowerCase()) != -1;
        }

        function getRowId(row) {
            return +row.querySelector(idCellSelector).textContent;
        }

        function isRowSelected(row) {
            var cells = makeArray(row.querySelectorAll(textCellsSelector));

            return cells.some(function (cell) {
                return cell.classList.contains(selectedClassName);
            });
        }

    })();
}