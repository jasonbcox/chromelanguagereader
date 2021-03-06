
function domainIsTracked( thisDomain, domains ) {
	for ( i = 0; i < domains.length; i++ ) {
		var url = thisDomain;
		var check = domains[i];
		if ( check.charAt( check.length - 1 ) == '*' ) {
			var len = check.length - 1;
			check = check.substr( 0, len );
			url = url.substr( 0, len );
		}
		if ( url == check ) return true;
	}
	return false;
}

chrome.extension.onMessage.addListener( function ( request, sender, sendResponse ) {
	if ( request.action == "istracked" ) {
		var domains = [];
		var isTracked = false;
		chrome.storage.local.get( 'domains', function ( items ) {
			if ( items.domains instanceof Array ) domains = items.domains;
			isTracked = domainIsTracked( request.domain, domains );
			if ( isTracked == true ) {
				chrome.storage.local.get( 'words', function ( words ) {
					chrome.tabs.getSelected( null, function ( tab ) {
						chrome.tabs.sendMessage( tab.id, { action: 'activate', data: words } );
					} );
				} );
			}
		} );
		sendResponse( {} );
	} else {
		console.log( "invalid message action: " + request.action );
		//sendResponse({ domain: localStorage["domain"] + ": " + localStorage["page"] });
		sendResponse({});
	}
} );

