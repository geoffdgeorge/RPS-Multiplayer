$(document).ready(function() {

    /* Firebase Configuration Code */
    const config = {
        apiKey: "AIzaSyBQ6OP27aK0iYkvr4bo_Ve75dyzPqE1dNw",
        authDomain: "brieftest-300a4.firebaseapp.com",
        databaseURL: "https://brieftest-300a4.firebaseio.com",
        projectId: "brieftest-300a4",
        storageBucket: "brieftest-300a4.appspot.com",
        messagingSenderId: "704522530238"
    };
    firebase.initializeApp(config);

    const database = firebase.database();

    /* Initial Manipulable Variables */
    let user;
    let userKey;
    let player;
    let playerKey;
    let opponent;
    let spotsFilled = 0;
    let gameInProgress = false;

    /* HTML Variables */
    const submitField = $('#player-submit-field');
    const submitBtn = $('#player-submit-button');
    const player1Name = $('#player-one-name');
    const player2Name = $('#player-two-name');
    const p1ImgArea = $('#player-one-throw');
    const p2ImgArea = $('#player-two-throw');
    const rP1Btn = $('#rP1');
    const pP1Btn = $('#pP1');
    const sP1Btn = $('#sP1');
    const rP2Btn = $('#rP2');
    const pP2Btn = $('#pP2');
    const sP2Btn = $('#sP2');
    const resultsMessage = $('#results');
    const p1Wins = $('#p1Wins');
    const p1Losses = $('#p1Losses');
    const p2Wins = $('#p2Wins');
    const p2Losses = $('#p2Losses');
    const ties = $('#ties');
    const chatWindow = $('#chat-window');
    const chatMessage = $('#chat-message');
    const chatSubmit = $('#chat-submit');

    /* Firebase Storage Variables */
    const usersRef = database.ref('/usersRef');
    const chatsRef = database.ref('/chatsRef');
    const connectedRef = database.ref('.info/connected');

    /* Object of functions */
    const rochambeau = {

        firebaseListeners: function() {

            /* When a user connects ... */
            connectedRef.on('value', function(snap) {

                /* If they are connected ... */
                if (snap.val()) {
                    
                    // Push their empty profile to the usersRef database
                    const con = usersRef.push({
                        name: '',
                        wins: 0,
                        losses: 0,
                        selection: '',
                        joinedFirst: false,
                        playing: false,
                        turn: false,
                    });

                    // Remove user from the connection list when they disconnect
                    con.onDisconnect().remove();

                    userKey = con.key;
                    
                }
            });

            usersRef.on('child_changed', function(snap){
                if(spotsFilled === 0) {
                    player = snap.val();
                    player1Name.text(player.name);
                    playerKey = snap.key;
                    spotsFilled++;
                } else if(spotsFilled === 1 && snap.val().joinedFirst === false) {
                    opponent = snap.val();
                    player2Name.text(opponent.name)
                    spotsFilled++;
                    if(spotsFilled > 1) {
                        resultsMessage.text('Player 1, choose your weapon.')
                    }
                } 
            })

            chatsRef.on('child_added', function(snap) {
                const messageText = snap.val();
                const newMessage = $('<p>');
                newMessage.text(messageText);
                newMessage.appendTo(chatWindow);
            })

        },

        userJoin: function() {
            event.preventDefault();
            if(!gameInProgress && spotsFilled === 0) {
                name = submitField.val().trim();
                usersRef.child(userKey).update({
                    name: name,
                    playing: true,
                    joinedFirst: true
                });
            } else if(!gameInProgress && spotsFilled === 1 && userKey !== playerKey) {
                name = submitField.val().trim();
                usersRef.child(userKey).update({
                    name: name,
                    playing: true
                });
            }
        },

        chatAdd: function() {
            event.preventDefault();
            const message = chatMessage.val().trim();
            chatsRef.push(message);
        }
    
    }
    
    submitBtn.click(rochambeau.userJoin);
    chatSubmit.click(rochambeau.chatAdd);
    rochambeau.firebaseListeners();
})

/* 
*** PSUEDOCODE ***
submitBtn click function: addPlayer() {
    * If player 1 isn't established, it assigns someone to be player 1.
    * If player 2 isn't established, it assigns someone to be player 2.
    * If both are established, it fires a function for rock-paper-scissors to begin
}
*/