/*
 * Create a list that holds all of your cards
 */
var icon = ["bomb", "diamond", "bolt", "paper-plane-o","leaf","bicycle", "cube", "anchor"]

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

//UDACITY CODE End

// design
function establishDesign() {
	var boardUl = $('#board');
	var symbolType = icon.concat(icon);
	var shuffledicon = shuffle(symbolType);
	shuffledicon.forEach(function(elem, index, arr) {
		boardUl.append(findselectedCards(index, elem));
	});
}


// show card symbol
function showCardSymbol(card) {
	var sepIndex = card.id.indexOf('_');
	return card.id.substr(sepIndex + 1);
}

// card symbol choice
function symbolChoice(index, symbol) {
	return 'card' + index + '_' + symbol;
}



// open cards established
function findselectedCards(index, symbol) {
	return '<li id="' + symbolChoice(index, symbol) + '" class="card"><span class="fa fa-' + symbol + '"></span></li>';
}



//define variables
var selectedCard;
var clickCounter;
var needMatch;
var startTimer;
var timerEnd;

 // show card
function showCard(card) {
		$('#' + card.id).toggleClass("show open");
}

// show matched stars
function lockMatchCard(card) {
		$('#' + card.id).toggleClass("show open match");
}

// Starts Levels
var starLevel = [14, 25, 50];
var starsNumber = starLevel.length;
var starsRevealed;


function CreateStarsLevel() {
	var starsUL = $('#stars');
	for (var i = 0; i < starsNumber; i++) {
		starsUL.append(CreateStarPic(i));
	}
}

function CreateStarPic(index) {
	return '<li id="star' + index + '"><span class="fa fa-star"></span></li>';
}



//Reset Stars
function starReset() {
	var starsUL = $('#stars');
	starsUL.empty();
	CreateStarsLevel();
}

// Count matches to declare completion
function addMatch() {
	needMatch -= 1;
	if (needMatch === 0) {
		var starString = starsRevealed + " stars";
		if (starsRevealed === 1) {
			starString = starsRevealed + " star";
		}
		var formatedTime = formatSeconds(secondCounter());
    //tells player game has ended and asks if want to play again
		if (confirm("Great Job! You are a winner with " + clickCounter + " moves in " + formatedTime + ". You are awarded a " + starString + " rating" +
			"\nWould you want to play again?")) {
			restartGame();
		} else {
			stopTimer();
		}
	}
}


// shows failed game in color red and then hides the card
function showFailedCard(card) {
		$('#' + card.id).toggleClass("show open failed");
	setTimeout(function() {
		$('#' + card.id).toggleClass("failed");
	}, 500);
}


// show matched cards and end game
function holdCards(card1, card2) {
	lockMatchCard(card1);
	lockMatchCard(card2);
	setTimeout(function() {
		addMatch();
	}, 300);
}


function hideCard(card1, card2) {
	showFailedCard(card1);
	showFailedCard(card2);
}

// hides star if number of moves required met
function hideStars() {
	var stars = $('#stars').children();
	starsRevealed = starsNumber;
	starLevel.forEach(function(elem, index, arr) {
				if (clickCounter > elem) {
			var starIndex = starLevel.length - index - 1;
			var starLi = $('#star' + starIndex);
			var starSpan = starLi.children();
			starSpan.removeClass("fa-star");
			starSpan.addClass("fa-star-o");
			starsRevealed --;
		}
	});
}

// manages the movement of cards, first card selected, second selected, match, and not match
function manageMove(card) {
	showCard(card);
	if (selectedCard == null) {
		selectedCard = card;
	} else {
		incrementMove();
		if (showCardSymbol(card) === showCardSymbol(selectedCard)) {
			holdCards(card, selectedCard);
		} else {
			hideCard(card, selectedCard);
		}
		selectedCard = null;
	}
}

// incrementer for number of moves
function incrementMove() {
	clickCounter += 1;
	$('#counter').text(clickCounter);
	hideStars();
}



// Listeners and reset button
function addListeners() {
	$('#board').on('click', 'span', function(event) {
		event.stopPropagation();
		manageMove(event.target.parentElement);
	});
	$('#board').on('click', 'li', function(event) {
		event.stopPropagation();
		manageMove(event.target);
	});
	$('.restart').on('click', 'span', function(event) {
		restartGame();
	})
}



// calculates number of seconds to time
function secondCounter() {
	var currentTime = new Date().getTime();
	var seconds = (currentTime - startTimer) / 1000;
	return seconds;
}

// fomats seconds
function formatSeconds(seconds)
{    var date = new Date(1970,0,1);
    date.setSeconds(seconds);
    return date.toTimeString().replace(/.*(\d{2}:\d{2}).*/, "$1");
}

// timer function to update
function Timerupdate() {
	var formatedTime = formatSeconds(secondCounter());
	$('#timer').text(formatedTime);
	timerEnd =  setTimeout(Timerupdate, 1000);
}


// timer display
function showTimer() {
	Timerupdate();
}

// function to stop the timer
function stopTimer() {
	clearTimeout(timerEnd);
}



// initiate new game variables
function initiateCounters() {
	selectedCard = null;
	clickCounter = 0;
	needMatch = icon.length;
	starsRevealed = starsNumber;
	startTimer = new Date().getTime();
}

// counter reset
function resetCounter() {
	initiateCounters();
	$('#counter').text(clickCounter);
}

// resets the board layout
function resetBoardLayout() {
	var boardUl = $('#board');
	boardUl.empty();
	establishDesign();
}


// restart the games
function restartGame() {
  resetCounter();
	resetTimer();
  resetBoardLayout();
	starReset();
}

// Reset the timer
function resetTimer() {
	stopTimer();
	Timerupdate();
}

// To run new game
function startGame() {
	establishDesign();
	CreateStarsLevel();
	initiateCounters();
	addListeners();
	showTimer();
}

startGame();
