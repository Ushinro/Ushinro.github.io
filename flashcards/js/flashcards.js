//
// AUTHOR: Ushinro
// DATE CREATED:  2014-12-16
// LAST MODIFIED: 2014-12-27
//


"use strict";


var cards,              // Array of Card objects
	cardSets = [],      // Array of CardSet objects
	flipped  = false,
	newSet   = false;


var backSideHtml,
	cardHtml,
	cardPreviewHtml,
	cardsHtml,
	frontSideHtml,
	setDescriptionHtml,
	setNameHtml,
	setsHtml;


var Card = {
	front : "",
	back  : ""
};

var CardSet = {
	cards       : [],
	description : "",
	name        : ""
};


function alertNoStorage() {
	alert("This browser does NOT support local storage.");
} // END alertNoStorage


function createNewCard() {
	sessionStorage["newCard"] = true;
	sessionStorage.removeItem('currentCard');
	
	reloadPage(false);
} // END createNewCard


function deleteCard(index) {
	var cards = cardSets[sessionStorage["currentSet"]].cards,
	    deleteConfirmed = window.confirm("Delete card " + (index + 1) + "?");

	if (isStorageAvailable()) {
		if (deleteConfirmed) {
			cards.splice(index, 1);
		}

		localStorage["cardSets"] = JSON.stringify(cardSets);
	}

	reloadPage(false);
} // END deleteCard


function deleteSet(index) {
	var deleteConfirmed = window.confirm("Delete \"" + cardSets[index]["name"] + "\"?");
	
	if (isStorageAvailable()) {
		if (deleteConfirmed) {
			cardSets.splice(index, 1);
		}

		localStorage["cardSets"] = JSON.stringify(cardSets);
	}

	reloadPage(false);
} // END deleteSet


function displayCards() {
	var currentCardSet = cardSets[sessionStorage["currentSet"]].cards,
		currentCardSetLength = currentCardSet.length,
		htmlString = "";

	if (currentCardSetLength < 1) {
		htmlString = "<h1>There are no cards saved in this set.</h1>";
	} else {
		if (currentCardSetLength > 1) {
			htmlString += "<button>Previous</button>" +
				      "<button>Next</button>";
		}

		for (var i = 0; i < currentCardSetLength; i++) {
			htmlString += "<div class='card' onclick='sessionStorage.setItem(\"selectedCard\"," + i + ");'>" +
				      "<figure class='front face'>" + currentCardSet[i]["front"] + "</figure>" +
				      "<figure class='back face'>" + currentCardSet[i]["back"] + "</figure>" +
				      "</div>";
		}
	}

	cardsHtml.innerHTML = htmlString;
} // END displayCards


function displayCardThumbnails() {
	var currentCardSet = cardSets[sessionStorage["currentSet"]].cards,
		currentCardSetLength = currentCardSet.length,
		htmlString = "";

	for (var i = 0; i < currentCardSetLength; i++) {
		htmlString += "<tr>" +
			      "<td>" + (i + 1) + "</td>" +
			      "<td>" + currentCardSet[i]["front"] + "</td>" +
			      "<td>" + currentCardSet[i]["back"] + "</td>" +
			      "<td><a href='card.html'><button onclick='sessionStorage.setItem(\"currentCard\"," + i + ");'>Edit</button></a></td>" +
			      "<td><button onclick='deleteCard(" + i + ");'>Delete</button></td>" +
			      "</tr>";
	}

	cardPreviewHtml.innerHTML += htmlString;
} // END displayCardThumbnails


function displayNextCard() {
	var currentCardSet = cardSets[sessionStorage["currentSet"]].cards,
	    currentCardSetLength = currentCardSet.length;

	if (sessionStorage["selectedCard"] < currentCardSetLength) {
		sessionStorage["selectedCard"]++;
	} else {
		sessionStorage["selectedCard"] = 0;
	}
} // END displayNextCard


function displayPreviousCard() {
	var currentCardSet = cardSets[sessionStorage["currentSet"]].cards,
		currentCardSetLength = currentCardSet.length;

	if (sessionStorage.selectedCard > -1) {
		sessionStorage["selectedCard"]--;
	} else {
		sessionStorage["selectedCard"] = currentCardSetLength - 1;
	}
} // END displayPreviousCard


function displaySetsList() {
	var cardSetsLength = cardSets.length,
		htmlString = "";

	for (var i = 0; i < cardSetsLength; i++) {
		htmlString += "<tr>" +
			      "<td><a href='set.html' onclick='sessionStorage.setItem(\"currentSet\"," + i + ");'>" + cardSets[i]["name"] + "</a></td>" +
			      "<td>" + cardSets[i]["description"] + "</td>" +
			      "<td><a href='view.html'><button onclick='sessionStorage.setItem(\"currentSet\"," + i + ");'>View</button></a></td>" +
			      "<td><a href='set.html'><button onclick='sessionStorage.setItem(\"currentSet\"," + i + ");'>Edit</button></a></td>" +
			      "<td><button onclick='deleteSet(" + i + ");'>Delete</button></td>" +
			      "</tr>";
	}

	setsHtml.innerHTML += htmlString;
} // END displaySetsList


function init() {
	loadSets();

	cardHtml           = document.getElementsByClassName("card");
	cardsHtml          = document.getElementById("cards");

	cardPreviewHtml    = document.getElementById("cardPreview");

	backSideHtml       = document.getElementById("backSide");
	frontSideHtml      = document.getElementById("frontSide");

	setDescriptionHtml = document.getElementById("setDescription");
	setNameHtml        = document.getElementById("setName");
	setsHtml           = document.getElementById("sets");

	// Show card set information if editing a set
	if (typeof(sessionStorage["currentSet"]) !== "undefined") {
		CardSet = cardSets[sessionStorage["currentSet"]];

		if (setDescriptionHtml && setNameHtml) {
			setDescriptionHtml.value = CardSet["description"];
			setNameHtml.value        = CardSet["name"];
		}

		if (cardPreviewHtml) {
			displayCardThumbnails();
		}

		// Show card information if editing a card
		if (typeof(sessionStorage["currentCard"]) !== "undefined" && sessionStorage["newCard"] === "false") {
			var currentCard = CardSet.cards[sessionStorage["currentCard"]];
			
			backSideHtml.value = currentCard["back"];
			frontSideHtml.value = currentCard["front"];
		}
	}

	// If the index cards are displayed, make them clickable and flippable
	if (cardHtml.length > 0) {
		var cardHtmlLength = cardHtml.length;

		displayCards();

		for (var i = 0; i < cardHtmlLength; i++) {
			cardHtml[i].addEventListener("click", flipCard, false);
		}
	}
	
	// If we're on a screen that needs to display the card sets
	if (setsHtml) {
		displaySetsList();
	}
} // END init


// Check to see if the required set information is provided
// Things such as the set's name and its description
function isInformationProvided() {
	if (setNameHtml && setDescriptionHtml) {
		if (setNameHtml.value.trim().length > 0) {
			return true;
		} else {
			return false;
		}
	} else if (backSideHtml && frontSideHtml) {
		if (backSideHtml.value.trim().length > 0 && frontSideHtml.value.trim().length > 0) {
			return true;
		} else {
			return false;
		}
	}
} // END isInformationProvided


function isSetSaved() {
	if (sessionStorage["currentSet"] && CardSet["name"]) {
		return true;
	} else {
		return false;
	}
} // END IsSetSaved


function isStorageAvailable() {
	if (typeof(Storage) === "undefined") {
		return false;
	} else {
		return true;
	}
} // END isStorageAvailable


function flipCard() {
	// This will flip the card
	cardHtml[sessionStorage["selectedCard"]].classList.toggle("flipped");
} // END flipCard


function loadSetByIndex() {
	CardSet = cardSets[sessionStorage["currentSet"]];
} // END loadSetByIndex


function loadSets() {
	// If the browser supports local storage
	if (isStorageAvailable()) {
		// Read data from local storage
		cardSets = localStorage["cardSets"];
		
		if (typeof(cardSets) !== "undefined") {
			cardSets = JSON.parse(cardSets);
		} else if (cardSets === null || typeof(cardSets) === "undefined") {
			cardSets = [];
		}
	} else {
		alertNoStorage();
	}
} // END loadSets


function reloadPage(reloadFromServer) {
	window.location.reload(reloadFromServer);
} // END reloadPage


function resetSessionStorage() {
	var i = sessionStorage.length,
		key;

	while (i--) {
		key = sessionStorage.key(i);
		
		sessionStorage.removeItem(key);
	}
} // END resetSessionStorage


function saveCard() {
	if (isStorageAvailable()) {
		if (backSide && frontSide && isInformationProvided()) {
			Card["back"]  = backSide.value.trim();
			Card["front"] = frontSide.value.trim();

			if (sessionStorage.newCard === "true") {
				CardSet.cards.push(Card);

				sessionStorage["newCard"] = false;
				sessionStorage["currentCard"] = cardSets[sessionStorage.currentSet].cards.length - 1;
			} else {
				CardSet.cards[sessionStorage["currentCard"]] = Card;
			}

			saveSet();
		}
	} else {
		// Sorry, no web storage support
		alertNoStorage();
	}
} // END saveCard


function saveSet() {
	// If the browser supports local storage
	if (isStorageAvailable()) {
		if (isInformationProvided()) {
			if (setNameHtml && setDescriptionHtml) {
				CardSet["name"]        = setName.value.trim();
				CardSet["description"] = setDescription.value.trim();
			}


			if (sessionStorage.newSet === "true") {
				cardSets.push(CardSet);

				sessionStorage["newSet"]     = false;
				sessionStorage["currentSet"] = cardSets.length - 1;
			} else {
				cardSets[sessionStorage["currentSet"]] = CardSet;
			}
		}

		localStorage["cardSets"] = JSON.stringify(cardSets);
	} else {
		// Sorry, no web storage support
		alertNoStorage();
	}
} // END saveSet


window.addEventListener("DOMContentLoaded", init, false);