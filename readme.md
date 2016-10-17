README

DESCRIPTION: In the simplest terms it is an encrypted messaging app that does the encryption on the client side as well as the decryption. Socket.io and cryptoJS are used as the underlying technologies. A session is created by a user, then a Session ID, Session Code, and Session Secret are generated in the client side javascript and displayed too the user. Only the session ID and Session Code are transmitted too the server not the session Secret making it impossible for the sever too decrypt messages only authenticate sessions. The session ID and session Code are stored in a mongoDB and only used for authentication of messages. A token is stored in local storage once you join a session enabling the sever too authenticate each user and message every time a message is sent. The server never sees any part of the decrypted data and is not able too decrypt the data making the communications more secure. The server only passes encrypted messages too authenticated users that belong too that specific session. On top of that each message contains a hash within the encrypted body which is generated from the message body before decryption. Upon decryption on the other side a hash is generated from the decrypted body and compared to the one contained in the body if the two match the message is authentic and not tampered with, however if they do not match the message could be tampered with or the key may have been compromised. An alert is given too the user if the message is deemed unauthentic.


ROUTES:

— http://localhost:3000/#/create —- Lets you create a new session that users can join
— http://localhost:3000/#/join — Lets you join an already created session
— http://localhost:3000/#/chat - You will be taken here automatically upon successfully joining a session.
This is where the chats take place.



DEFINITIONS:

- Session Name - The name the user chooses too name the session doesn’t have too be unique
- Valid From - A date that the session credentials are valid from can be in the future
- Valid Too - A date which the session credentials are valid too after which they no longer work and the session is destroyed
- Max User Joins - The maximum amount of users that may join a session, before it no longer accepts the credentials until a user leaves.
- Session ID - a unique random string based on precise time and unique offset that identifies the session too the server and allows user too join.
- Session Code - A unique password like alpa numeric string that protects the session from unauthorized usage.
- Session Secret - The key used too encrypt and decrypt the message body not stored anywhere other than offline with the user. Must be shared with other users for them too join.


FLOW CHART :
https://www.lucidchart.com/documents/edit/9b76daad-d67c-4129-8ef3-59cdb2f9b573#

STARTING THE PROGRAM
1.) Make sure MongoDB is installed on the local system with the executable for your OS
2.) navigate too the server directory and run node server.js
3.) open a browser and go too http://localhost:3000
4.) You can begin creating sessions by navigating too /create or joining by navigating too /join