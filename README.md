# nempeers



![image](https://i.imgur.com/3IwZPCI.png)


nempeers illustrate how you can use the nem blockchain for encrypted peer 2 peer chat and file transfer. The encryption keys and initial connection info are shared between participants using the blockchain, this ensures that the peer 2 peer connection can remain private and without interference from a thirds party. The application is browser based, which mean you can download the application an run it on your local machine for maximum security. The beta version is running on the testnet, so you can setup a test account and try it out.

Currently Firefox 22+ and Google Chrome 26.0.1403.0 or above is required. Note that this demo may also fail if you are behind stringent firewalls or both you and the remote peer are behind symmetric NATs.

![image](https://image.ibb.co/mRG5Ko/Logo_Makr_5x_K7r_S.png)

# step by step guide


This is how it works. First provide the private key (testnet) to an account with sufficient funds to send a invitation message to the account you like to make a p2p connection with. Then provide the account address of the account you would like to invite. Then press **execute**.

```javascript


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

```


![image](https://imgur.com/md5Grj5.png)

If the transaction is successful the app will start the application, waiting for the peer(s) to join the connection. If you leave the webpage the connection host can be reestablished using the url-address in the addressbar with the unique session seed. 

```javascript

hosturl?host=true&seed=02704f807420a576551663d32790651d0caa79b9d0ee6b24fcca3d8481e9405b#chat

```


![image](https://imgur.com/Bfykc7G.png)

When the invited peer(s) are joining you will be able to chat and share files. All messages are encrypted by the unique seed which is only know to the host or invited peer(s). 

```javascript

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

```


![image](https://imgur.com/d3NcdDc.png)


## Demo website


http://nempeer.bitballoon.com/

`Currently Firefox 22+ and Google Chrome 26.0.1403.0 or above is required. Note that this demo may also fail if you are behind stringent firewalls or both you and the remote peer are behind symmetric NATs.`
