

(function($) {

	var $window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$main = $('#main'),
		$panels = $main.children('.panel'),
		$nav = $('#nav'), $nav_links = $nav.children('a');

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1680px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ '361px',   '736px'  ],
			xsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Nav.
		$nav_links
			.on('click', function(event) {

				var href = $(this).attr('href');

				// Not a panel link? Bail.
					if (href.charAt(0) != '#'
					||	$panels.filter(href).length == 0)
						return;

				// Prevent default.
					event.preventDefault();
					event.stopPropagation();

				// Change panels.
					if (window.location.hash != href)
						window.location.hash = href;

			});

	// Panels.

		// Initialize.
			(function() {

				var $panel, $link;

				// Get panel, link.
					if (window.location.hash) {

				 		$panel = $panels.filter(window.location.hash);
						$link = $nav_links.filter('[href="' + window.location.hash + '"]');

					}

				// No panel/link? Default to first.
					if (!$panel
					||	$panel.length == 0) {

						$panel = $panels.first();
						$link = $nav_links.first();

					}

				// Deactivate all panels except this one.
					$panels.not($panel)
						.addClass('inactive')
						.hide();

				// Activate link.
					$link
						.addClass('active');

				// Reset scroll.
					$window.scrollTop(0);

			})();

		// Hashchange event.
			$window.on('hashchange', function(event) {

				var $panel, $link;

				// Get panel, link.
					if (window.location.hash) {

				 		$panel = $panels.filter(window.location.hash);
						$link = $nav_links.filter('[href="' + window.location.hash + '"]');

						// No target panel? Bail.
							if ($panel.length == 0)
								return;

					}

				// No panel/link? Default to first.
					else {

						$panel = $panels.first();
						$link = $nav_links.first();

					}

				// Deactivate all panels.
					$panels.addClass('inactive');

				// Deactivate all links.
					$nav_links.removeClass('active');

				// Activate target link.
					$link.addClass('active');

				// Set max/min height.
					$main
						.css('max-height', $main.height() + 'px')
						.css('min-height', $main.height() + 'px');

				// Delay.
					setTimeout(function() {

						// Hide all panels.
							$panels.hide();

						// Show target panel.
							$panel.show();

						// Set new max/min height.
							$main
								.css('max-height', $panel.outerHeight() + 'px')
								.css('min-height', $panel.outerHeight() + 'px');

						// Reset scroll.
							$window.scrollTop(0);

						// Delay.
							window.setTimeout(function() {

								// Activate target panel.
									$panel.removeClass('inactive');

								// Clear max/min height.
									$main
										.css('max-height', '')
										.css('min-height', '');

								// IE: Refresh.
									$window.triggerHandler('--refresh');

								// Unlock.
									locked = false;

							}, (breakpoints.active('small') ? 0 : 500));

					}, 250);

			});

	// IE: Fixes.
		if (browser.name == 'ie') {

			// Fix min-height/flexbox.
				$window.on('--refresh', function() {

					$wrapper.css('height', 'auto');

					window.setTimeout(function() {

						var h = $wrapper.height(),
							wh = $window.height();

						if (h < wh)
							$wrapper.css('height', '100vh');

					}, 0);

				});

				$window.on('resize load', function() {
					$window.triggerHandler('--refresh');
				});

			// Fix intro pic.
				$('.panel.intro').each(function() {

					var $pic = $(this).children('.pic'),
						$img = $pic.children('img');

					$pic
						.css('background-image', 'url(' + $img.attr('src') + ')')
						.css('background-size', 'cover')
						.css('background-position', 'center');

					$img
						.css('visibility', 'hidden');

				});

		}

})(jQuery);



/////////////////////////////////////////////////////////

// Load nem-browser library
var nem = require("nem-sdk").default;


// Create an NIS endpoint object
var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);

// Get an empty un-prepared transfer transaction object
var transferTransaction = nem.model.objects.get("transferTransaction");



// Get an empty common object to hold pass and key
var common = nem.model.objects.get("common");

var passwordEncrypt = decodeURI(urlParam('seed'));


var connectedPeers = {};

	$("#chaticon").hide();
	

	if( urlParam('join') != null) {
		$("#chaticon").show();
		$("#connect").show();

		$('#rid').val(decodeURI(urlParam('seed')));


		peer = new Peer(); 

		// Show this peer's ID.
		peer.on('open', function(id){
			$('#pid').text(id);
			
			
		});


		// Await connections from others
		peer.on('connection', connect);

		peer.on('error', function(err) {
		console.log(err);
		})  

		


	}
	if( urlParam('host') != null) {
		$("#chaticon").show();
		$("#connect").hide();

		


		peer = new Peer( decodeURI(urlParam('seed')) ); 

		// Show this peer's ID.
		peer.on('open', function(id){
		$('#pid').text(id);
		});


		// Await connections from others
		peer.on('connection', connect);

		peer.on('error', function(err) {
		console.log(err);
		})  


	}





// Handle a connection object.
function connect(c) {
  // Handle a chat connection.
  if (c.label === 'chat') {
    var chatbox = $('<div></div>').addClass('connection').addClass('active').attr('id', c.peer);
    var header = $('<h1></h1>').html('Chat with <strong>' + c.peer + '</strong>');
    var messages = $('<div><em>Peer connected.</em></div>').addClass('messages');
    chatbox.append(header);
    chatbox.append(messages);
 
    // Select connection handler.
    chatbox.on('click', function() {
      if ($(this).attr('class').indexOf('active') === -1) {
        $(this).addClass('active');
      } else {
        $(this).removeClass('active');
      }
    });
    $('.filler').hide();
    $('#connections').append(chatbox);

    // Just to fix the connection receiver to successfully send a message to the connection requester
    c.open = true;
    
    c.on('data', function(data) {
		var decrypted = CryptoJS.AES.decrypt(data, decodeURI(urlParam('seed')) );
		data = decrypted.toString(CryptoJS.enc.Utf8);
      messages.append('<div><span class="peer">' + c.peer + '</span>: ' + data +   //// encrypt
        '</div>');
        });
        c.on('close', function() {
          alert(c.peer + ' has left the chat.');
          chatbox.remove();
          if ($('.connection').length === 0) {
            $('.filler').show();
          }
          delete connectedPeers[c.peer];
        });
  } else if (c.label === 'file') {
    c.on('data', function(data) {
      // If we're getting a file, create a URL for it.
      if (data.constructor === ArrayBuffer) {
        var dataView = new Uint8Array(data);
        var dataBlob = new Blob([dataView]);
        var url = window.URL.createObjectURL(dataBlob);
        $('#' + c.peer).find('.messages').append('<div><span class="file">' +
            c.peer + ' has sent you a <a target="_blank" href="' + url + '">file</a>.</span></div>');
      }
    });
  }
  connectedPeers[c.peer] = 1;
}

$(document).ready(function() {


  // Prepare file drop box.
  var box = $('#box');
  box.on('dragenter', doNothing);
  box.on('dragover', doNothing);
  box.on('drop', function(e){
    e.originalEvent.preventDefault();
    var file = e.originalEvent.dataTransfer.files[0];
    eachActiveConnection(function(c, $c) {
      if (c.label === 'file') {
        c.send(file);
        $c.find('.messages').append('<div><span class="file">You sent a file.</span></div>');
      }
    });
  });
  function doNothing(e){
    e.preventDefault();
    e.stopPropagation();
  }

  // Connect to a peer
  $('#connect').click(function() {
    var requestedPeer = $('#rid').val();
    if (!connectedPeers[requestedPeer]) {
      // Create 2 connections, one labelled chat and another labelled file.
      var c = peer.connect(requestedPeer, {
        label: 'chat',
        serialization: 'none',
        metadata: {message: 'hi i want to chat with you!'}
      });
      c.on('open', function() {
        connect(c);
      });
      c.on('error', function(err) { alert(err); });
      var f = peer.connect(requestedPeer, { label: 'file', reliable: true });
      f.on('open', function() {
        connect(f);
      });
      f.on('error', function(err) { alert(err); });
    }
    connectedPeers[requestedPeer] = 1;
  });

  // Close a connection.
  $('#close').click(function() {
    eachActiveConnection(function(c) {
      c.close();
    });
  });

  // Send a chat message to all active connections.
  $('#send').submit(function(e) {
    e.preventDefault();
    // For each active connection, send the message.
    var msg = $('#text').val();
    eachActiveConnection(function(c, $c) {
      if (c.label === 'chat') {
        c.send( CryptoJS.AES.encrypt(msg, decodeURI(urlParam('seed')) ) );
        $c.find('.messages').append('<div><span class="you">You: </span>' + msg
          + '</div>');
      }
    });
    $('#text').val('');
    $('#text').focus();
  });

  // Goes through each active peer and calls FN on its connections.
  function eachActiveConnection(fn) {
    var actives = $('.connection');
    var checkedIds = {};
    actives.each(function() {
	  var peerId = $(this).attr('id');

	  //alert(JSON.stringify(actives, null, 4));
	  

      if (!checkedIds[peerId] && peerId!=undefined ) {
		var conns = peer.connections[peerId];

        for (var i = 0, ii = conns.length; i < ii; i += 1) {
          var conn = conns[i];
          fn(conn, $(this));
        }
      }

      checkedIds[peerId] = 1;
    });
  }

  // Show browser version
  $('#browsers').text(navigator.userAgent);

 
});

// Make sure things clean up properly.

window.onunload = window.onbeforeunload = function(e) {
  if (!!peer && !peer.destroyed) {
    peer.destroy();
  }
};

function urlParam(name) {

	try {
		var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
		return results[1] || 0;
   
	}
	catch(err) {
		
	}


}




$("#subChat").click(function(){


    
    if (nem.utils.helpers.isPrivateKeyValid( $('#privateKey').val() )!=1 ) {

        alert('Private key is not valid !');
        throw new Error('Private key is not valid !');

	}else if( !nem.model.address.isValid(nem.model.address.clean($("#recipient").val())) ){

		alert('Address is not valid !');
        throw new Error('Address is not valid !');

	}else{


		// Request recipent public key
		nem.com.requests.account.data(endpoint, nem.model.address.clean($("#recipient").val())).then(function(res) {
			
			console.log(JSON.stringify(res['account']['publicKey']));

			var recipPublic = res['account']['publicKey'];

			// Create random bytes from PRNG
			var rBytes = nem.crypto.nacl.randomBytes(32);
			// Convert the random bytes to hex
			var encryptionKey = nem.utils.convert.ua2hex(rBytes);	

			// Set the private key in common object
			common.privateKey = $("#privateKey").val();


			// Check private key for errors
			if (common.privateKey.length !== 64 && common.privateKey.length !== 66) return alert('Invalid private key, length must be 64 or 66 characters !');
			if (!nem.utils.helpers.isHexadecimal(common.privateKey)) return alert('Private key must be hexadecimal only !');


			// Set the cleaned amount into transfer transaction object
			transferTransaction.amount = nem.utils.helpers.cleanTextAmount(0);

			// Recipient address must be clean (no hypens: "-")
			transferTransaction.recipient = nem.model.address.clean($("#recipient").val());


			var pathname = window.location.href;
			var uriJoin = pathname.replace('#contact','') + '?join=true' + '&seed=' + encodeURI(encryptionKey)+'#chat';
			var uriHost= pathname.replace('#contact','') + '?host=true' + '&seed=' + encodeURI(encryptionKey)+'#chat';
	

			// Set message
			transferTransaction.message = uriJoin;
			transferTransaction.messageType =2;
			transferTransaction.recipientPublicKey =recipPublic;
			//transferTransaction.isEncrypted =true;

			// Prepare the updated transfer transaction object
			var transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.testnet.id);



			//alert(JSON.stringify(transactionEntity, null, 2));
			console.log(transferTransaction.message);

			


			
			// Serialize transfer transaction and announce
			nem.model.transactions.send(common, transactionEntity, endpoint).then(function(res){
				// If code >= 2, it's an error
				if (res.code >= 2) {
					alert(res.message);
				} else {
					alert(res.message);
					location.replace(uriHost);
				}
			}, function(err) {
				alert(err);
			});
			
			

		}, function(err) {
			console.error(err);
		});

		
		



	};
	
});

