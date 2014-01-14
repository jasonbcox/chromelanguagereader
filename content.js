
var classes = {
	hidden: 'clre-hidden',
	span: 'clre-plugin-span',
	window: 'clre-plugin-window',
	word: 'clre-plugin-word',
	romanization: 'clre-plugin-romanization',
	definition: 'clre-plugin-definition',
};

var g_words = [];

var g_selectedWord = '';
var g_posX, g_posY;

// Activate the plugin functionality on this page
function activate( words ) {
	g_words = words;

	for ( var i = 0; i < words.length; i++ ) {
		var newSpan = $( '<span class="' + classes.span + '" data-word="' + words[i].word + '"></span>' );
		var re = new RegExp( words[i].word, 'g' );
		findAndReplaceDOMText( re, document.getElementsByTagName( 'body' )[0], newSpan[0] );
	}

	$( '.' + classes.span ).mouseover( function ( e ) {
		var t = $( this );

		// Position window near the word with that word's information
		if ( ( g_posX != e.pageX ) || ( g_posY != e.pageY ) ) {
			g_posX = e.pageX;
			g_posY = e.pageY;
			g_selectedWord = '';
		}
		var selectedWord = t.data( 'word' );
		if ( ( g_selectedWord == '' ) || ( selectedWord.indexOf( g_selectedWord ) != -1 ) ) {
			var pluginWindow = $( '.' + classes.window );
			g_selectedWord = selectedWord;
			var html = '';
			for ( var i = 0; i < words.length; i++ ) {
				if ( words[i].word == g_selectedWord ) {
					html = '<span class="' + classes.word + '">' + words[i].word + '</span>';
					html += '<span class="' + classes.romanization + '">' + words[i].romanization + '</span>';
					html += '<span class="' + classes.definition + '">' + words[i].definition + '</span>';
					break;
				}
			}
			pluginWindow.html( html )
						.css( 'top', String( e.pageY + 10 ) + 'px' )
						.css( 'left', String( e.pageX ) + 'px' )
						.removeClass( classes.hidden );
		}
	} );
};

chrome.extension.onMessage.addListener( function ( request, sender, sendResponse ) {
	if ( request.action == "activate" ) {
		activate( request.data.words );
		sendResponse( {} );
	} else {
		console.log( "invalid content script action: " + request.action );
		sendResponse( {} );
	}
} );

$( document ).ready( function () {
	// Create plugin javascript window
	$( '<div class="' + classes.window + ' ' + classes.hidden + '"></div>' ).appendTo( "body" );

	// If this domain is being tracked, then activate the plugin functionality
	chrome.extension.sendMessage( { action: "istracked", domain: location.href } );
} );

