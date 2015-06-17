'use strict';

var tableFilter = {
	Rows : document.getElementById('data').getElementsByTagName('TR'),
	RowsLength : null,
	RowsText : [],

	init : function () {
		tableFilter.RowsLength = tableFilter.Rows.length;

		for (var i = 0; i < tableFilter.RowsLength; i++) {
		    tableFilter.RowsText[i] = (tableFilter.Rows[i].innerText) ? tableFilter.Rows[i].innerText.toUpperCase() : tableFilter.Rows[i].textContent.toUpperCase();
		}
	},

	runSearch : function () {
		// Get the search term
		var term = document.getElementById('search').value.toUpperCase();

		// Loop through the rows and hide rows that do not match the search query
		for (var i = 0, row, rowText; row = tableFilter.Rows[i], rowText = tableFilter.RowsText[i]; i++) {
			row.style.display = ((rowText.indexOf(term) != -1) || term === '') ? '' : 'none';
		}
	}
	

};

document.addEventListener('DOMContentLoaded', tableFilter.init, true);

document.getElementById('search').addEventListener('input', tableFilter.runSearch, false);