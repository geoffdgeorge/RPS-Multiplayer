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
    
    let userKey;

    let game = {
        playerName: '',
        playerKey: '',
        playerWins: 0,
        playerLosses: 0,
        playerSelection: '',
        playerStatus: '',
        playerTurn: false,
        opponentName: '',
        opponentKey: '',
        opponentWins: 0,
        opponentLosses: 0,
        opponentSelection: '',
        opponentStatus: '',
        opponentTurn: false,
        spotsFilled: 0,
        gameInProgress: false,
    }

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
    const gameRef = database.ref('/gameRef');
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
                        status: '',
                        playing: false,
                        turn: false,
                    });

                    // Remove user from the connection list when they disconnect
                    con.onDisconnect().remove();

                    userKey = con.key;
                    
                }
            });

            gameRef.on('value', function(snap) {
                const gameState = snap.val();
                if(gameState) {
                    player1Name.text(gameState.playerName);
                    game = gameState
                    console.log(game.spotsFilled);
                }
            });

            usersRef.on('child_changed', function(snap){
                if(game.spotsFilled === 0) {
                    const player = snap.val();
                    gameRef.update({
                        playerName: player.name,
                        playerKey: snap.key,
                        playerWins: player.wins,
                        playerLosses: player.losses,
                        playerSelection: '',
                        playerStatus: player.status,
                        playerTurn: true,
                        opponentName: '',
                        opponentKey: '',
                        opponentWins: 0,
                        opponentLosses: 0,
                        opponentSelection: '',
                        opponentStatus: '',
                        opponentTurn: false,
                        spotsFilled: 1,
                        gameInProgress: false,
                    });
                } else if(game.spotsFilled === 1) {
                    const opponent = snap.val();
                    gameRef.update({
                        opponentName: opponent.name,
                        opponentKey: snap.key,
                        opponentWins: opponent.wins,
                        opponentLosses: opponentLosses,
                    })
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
            if(!game.gameInProgress && game.spotsFilled === 0) {
                name = submitField.val().trim();
                usersRef.child(userKey).update({
                    name: name,
                    status: 'player',
                    playing: true,
                });
            } else if(!game.gameInProgress && game.spotsFilled === 1 && userKey !== game.playerKey) {
                console.log('yes');
                name = submitField.val().trim();
                usersRef.child(userKey).update({
                    name: name,
                    status: 'opponent',
                    playing: true
                });
            } else {

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