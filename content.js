
var windowClass = 'clre-plugin-window';
var spanClass = 'clre-plugin-span';
var wordClass = 'clre-plugin-word';
var romanizationClass = 'clre-plugin-romanization';
var definitionClass = 'clre-plugin-definition';

var g_words = [];

var g_selectedWord = '';
var g_posX, g_posY;

// Activate the plugin functionality on this page
function activate( words ) {
	g_words = words;

	for ( var i = 0; i < words.length; i++ ) {
		/*
		var span = document.createElement( 'span' );
		span.className = 'plugin';
		span.setAttribute( 'data-word', words[i].word );
		var re = new RegExp( words[i].word, 'g' );
		findAndReplaceDOMText( re, document.getElementsByTagName( 'body' )[0], span );
		*/
		var newSpan = $( '<span class="' + spanClass + '" data-word="' + words[i].word + '"></span>' );
		var re = new RegExp( words[i].word, 'g' );
		findAndReplaceDOMText( re, document.getElementsByTagName( 'body' )[0], newSpan[0] );
	}

	$( '.' + spanClass ).mouseover( function ( e ) {
		var t = $( this );

		// Position window near the word with that word's information
		if ( ( g_posX != e.pageX ) || ( g_posY != e.pageY ) ) {
			g_posX = e.pageX;
			g_posY = e.pageY;
			g_selectedWord = '';
		}
		var selectedWord = t.data( 'word' );
		if ( ( g_selectedWord == '' ) || ( selectedWord.indexOf( g_selectedWord ) != -1 ) ) {
			var pluginWindow = $( '.' + windowClass );
			g_selectedWord = selectedWord;
			var html = '';
			for ( var i = 0; i < words.length; i++ ) {
				if ( words[i].word == g_selectedWord ) {
					html = '<span class="' + wordClass + '">' + words[i].word + '</span>';
					html += '<span class="' + romanizationClass + '">' + words[i].romanization + '</span>';
					html += '<span class="' + definitionClass+ '">' + words[i].definition + '</span>';
					break;
				}
			}
			pluginWindow.html( html )
						.css( 'top', String( e.pageY + 10 ) + 'px' )
						.css( 'left', String( e.pageX ) + 'px' );
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
	// Define custom css
	$( '<style type="text/css"> .' + spanClass + ' { background: #fee; position: relative; } </style>' ).appendTo( "head" );
	$( '<style type="text/css"> .' + windowClass + ' { background: #fff; position: absolute; min-width: 128px; min-height: 48px; border-radius: 7px; border: 1px solid #888; padding: 3px; } </style>' ).appendTo( "head" );
	$( '<style type="text/css"> .' + wordClass + ' { font-size: 20px; } </style>' ).appendTo( "head" );
	$( '<style type="text/css"> .' + romanizationClass + ' { margin-left: 5px; } </style>' ).appendTo( "head" );
	$( '<style type="text/css"> .' + definitionClass + ' { margin-left: 5px; } </style>' ).appendTo( "head" );

	// Define plugin javascript window
	$( '<div class="' + windowClass + '"></div>' ).appendTo( "body" );

	// If this domain is being tracked, then activate the plugin functionality
	chrome.extension.sendMessage( { action: "istracked", domain: location.href } );
} );

