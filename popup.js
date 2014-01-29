
var thisDomain;
var domains = [];
var words = [];

// Remove a domain from the list
function removeDomain( removeDomain ) {
	if ( !$.inArray( removeDomain, domains ) ) {
		for ( i = 0; i < domains.length; i++ ) {
			if ( domains[i] == removeDomain ) {
				domains.splice( i, 1 );
				break;
			}
		}
	}
	chrome.storage.local.set( { 'domains': domains }, function () {
		fillTrackingList();
	} );
}

// Remove a word from the list
function removeWord( removeWord ) {
	for ( var i = 0; i < words.length; i++ ) {
		if ( words[i].word == removeWord ) {
			words.splice( i, 1 );
			break;
		}
	}
	chrome.storage.local.set( { 'words': words }, function () {
		fillWordList();
	} );
}

// Fill the popup.html list of currently tracked domains
function fillTrackingList() {
	var list = $( '#currentlyTracking' );
	list.empty();
	for ( i = 0; i < domains.length; i++ ) {
		list.append("<div><span>" + domains[i] + "</span> <button class='removeDomainButton right'>Remove</button></div><div class='clearer'></div>");
	}
	$( '.removeDomainButton' ).each( function() {
		var thisButton = $(this);
		var thisDiv = thisButton.parent();
		var thisDomain = thisDiv.children('span')[0].innerHTML;
		thisButton.click( function () {
			removeDomain( thisDomain );
		} );
	} );
}

// Fill the popup.html list of words
function fillWordList() {
	var list = $( '#currentWords' );
	list.empty();
	for ( var i = 0; i < words.length; i++ ) {
		var word = words[i].word;
		var romanization = words[i].romanization;
		var definition = words[i].definition;
		var newWordElements = $( '<div><span>' + word + '</span><span> (' + romanization + ') </span><span>' + definition + '</span>' );
		var newRemoveButton = $( '<button class="removeWordButton right">X</button></div><div class="clearer"></div>' );
		list.append( newWordElements );
		//list.append( newRemoveButton );
		newWordElements.append( newRemoveButton );
		newRemoveButton.click( function() {
			removeWord( word );
		} );
	}
}

// Button press to add the current domain to the tracking list
function addTracking() {
	var thisDomain = $( '#newDomainInput' ).val();
	if ( ( thisDomain != null ) && ( thisDomain.length > 0 ) ) {
		if ( $.inArray( thisDomain, domains ) == -1 ) domains.push( thisDomain );
		chrome.storage.local.set( { 'domains': domains }, function () {
			fillTrackingList();
		} );
	}
}

// Button press to add a new word to the word list
function addWord() {
	var thisWord = $( '#newWordInput' ).val();
	var thisRomanization = $( '#newWordRomanization' ).val();
	var thisDefinition = $( '#newWordDefinition' ).val();
	if ( ( thisWord != null ) && ( thisWord.length > 0 ) ) {
		var entry = { word: thisWord, romanization: thisRomanization, definition: thisDefinition };
		var found = false;
		for ( var i = 0; i < words.length; i++ ) {
			if ( words[i].word == thisWord ) {
				found = true;
				break;
			}
		}
		if ( found == false ) words.push( entry );
		chrome.storage.local.set( { 'words': words }, function () {
			fillWordList();
		} );
	}
}

$(document).ready( function() {
	chrome.tabs.query( {active: true}, function( tab ) {
		$( '#newDomainInput' ).val( tab[0].url );

		// To implement multi-language support, consider the following:
		//	var obj = {};
		//	var wordsVar = 'words-' + language;
		//	obj[wordsVar] = words;
		//	chrome.storage.local.set( obj, function () {} );
		//	chrome.storage.local.get( wordsVar, function () {} );
		chrome.storage.local.get( 'words', function ( local ) {
			if ( local.words instanceof Array ) words = local.words;
			fillWordList();

			$( '#addWordButton' ).click( function () {
				addWord();
			} );
		} );
	});

	chrome.storage.local.get( 'domains', function ( local ) {
		if ( local.domains instanceof Array ) domains = local.domains;
		fillTrackingList();
		$( '#trackButton' ).click( function () {
			addTracking();
		} );
	} );
});

