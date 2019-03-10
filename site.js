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
        playerTurn: false,
        opponentName: '',
        opponentKey: '',
        opponentWins: 0,
        opponentLosses: 0,
        opponentSelection: '',
        opponentTurn: false,
        ties: 0,
        gameInProgress: false,
    }

    /* HTML Variables */
    const submitField = $('#player-submit-field');
    const submitBtn = $('#player-submit-button');
    const player1Name = $('#player-one-name');
    const player2Name = $('#player-two-name');
    const p1ImgArea = $('#player-one-throw');
    const p2ImgArea = $('#player-two-throw');
    const p1Btns = $('.p1-btn');
    const p2Btns = $('.p2-btn');
    const resultsMessage = $('#results');
    const p1Wins = $('#p1Wins');
    const p1Losses = $('#p1Losses');
    const p2Wins = $('#p2Wins');
    const p2Losses = $('#p2Losses');
    const ties = $('#ties');
    const chatWindow = $('#chat-window');
    const chatMessage = $('#chat-message');
    const chatSubmit = $('#chat-submit');
    const scissorsImg = $('<img>').attr('src', 'assets/scissors.png').addClass('gameImg');
    const rockImg = $('<img>').attr('src', 'assets/rock.png').addClass('gameImg');
    const paperImg = $('<img>').attr('src', 'assets/paper.png').addClass('gameImg');

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
                    if(!gameState.playerName && !gameState.playerKey && !gameState.opponentName && !gameState.opponentKey) {
                        player1Name.text('Waiting ...');
                        p1Wins.text('Wins:');
                        p1Losses.text('Losses:');
                        player2Name.text('Waiting ...');
                        p2Wins.text('Wins:');
                        p2Losses.text('Losses:');
                        resultsMessage.text('')
                        game = gameState;
                    } else if(gameState.playerName && gameState.playerKey && !gameState.opponentName && !gameState.opponentKey) {
                        player1Name.text(gameState.playerName);
                        p1Wins.text('Wins: ' + gameState.playerWins);
                        p1Losses.text('Losses: ' + gameState.playerLosses);
                        player2Name.text('Waiting ...');
                        p2Wins.text('Wins:');
                        p2Losses.text('Losses:');
                        resultsMessage.text('')
                        game = gameState;
                    } else if(!gameState.playerName && !gameState.playerKey && gameState.opponentName && gameState.opponentKey){
                        player1Name.text('Waiting ...');
                        p1Wins.text('Wins:');
                        p1Losses.text('Losses:');
                        player2Name.text(gameState.opponentName);
                        p2Wins.text('Wins: ' + gameState.opponentWins);
                        p2Losses.text('Losses: ' + gameState.opponentLosses);
                        resultsMessage.text('');
                        game = gameState;
                    } else if(gameState.playerName && gameState.playerKey && gameState.opponentName && gameState.opponentKey) {
                        function allPlayersConnected() {
                            player1Name.text(gameState.playerName);
                            p1Wins.text('Wins: ' + gameState.playerWins);
                            p1Losses.text('Losses: ' + gameState.playerLosses);
                            player2Name.text(gameState.opponentName);
                            p2Wins.text('Wins: ' + gameState.opponentWins);
                            p2Losses.text('Losses: ' + gameState.opponentLosses);
                            ties.text('Ties: ' + gameState.ties);
                        };
                        allPlayersConnected();
                        resultsMessage.text('Player 1, choose your weapon.');
                        game = gameState;
                        if(gameState.playerSelection) {
                            resultsMessage.text('Player 2, choose your weapon.');
                            game = gameState;
                            if(gameState.playerSelection && gameState.opponentSelection) {
                                if(gameState.playerSelection === 'r' && gameState.opponentSelection === 's') {
                                    rockImg.appendTo(p1ImgArea);
                                    scissorsImg.appendTo(p2ImgArea);
                                    resultsMessage.text(gameState.playerName + ' wins!');
                                } else if (gameState.playerSelection === 's' && gameState.opponentSelection === 'p') {
                                    scissorsImg.appendTo(p1ImgArea);
                                    paperImg.appendTo(p2ImgArea);
                                    resultsMessage.text(gameState.playerName + ' wins!');
                                } else if(gameState.playerSelection === 'p' && gameState.opponentSelection === 'r') {
                                    paperImg.appendTo(p1ImgArea);
                                    rockImg.appendTo(p2ImgArea);
                                    resultsMessage.text(gameState.playerName + ' wins!');
                                } else if(gameState.playerSelection === 's' && gameState.opponentSelection === 'r') {
                                    scissorsImg.appendTo(p1ImgArea);
                                    rockImg.appendTo(p2ImgArea);
                                    resultsMessage.text(gameState.opponentName + ' wins!');
                                } else if(gameState.playerSelection === 'r' && gameState.opponentSelection === 'p') {
                                    rockImg.appendTo(p1ImgArea);
                                    paperImg.appendTo(p2ImgArea);
                                    resultsMessage.text(gameState.opponentName + ' wins!');
                                } else if(gameState.playerSelection === 'p' && gameState.opponentSelection === 's') {
                                    paperImg.appendTo(p1ImgArea);
                                    scissorsImg.appendTo(p2ImgArea);
                                    resultsMessage.text(gameState.opponentName + ' wins!');
                                } else if(gameState.playerSelection === 'p' && gameState.opponentSelection === 'p') {
                                    paperImg.appendTo(p1ImgArea);
                                    paperImg.appendTo(p2ImgArea);
                                    resultsMessage.text('Tie game!');
                                } else if(gameState.playerSelection === 'r' && gameState.opponentSelection === 'r') {
                                    rockImg.appendTo(p1ImgArea);
                                    rockImg.appendTo(p2ImgArea);
                                    resultsMessage.text('Tie game!');
                                } else if(gameState.playerSelection === 's' && gameState.opponentSelection === 's') {
                                    scissorsImg.appendTo(p1ImgArea);
                                    scissorsImg.appendTo(p2ImgArea);
                                    resultsMessage.text('Tie game!');
                                }
                            }
                        }
                    }
                }
            });

            usersRef.on('child_changed', function(snap){
                if(!game.playerName && !game.opponentName) {
                    const player = snap.val();
                    gameRef.update({
                        playerName: player.name,
                        playerKey: snap.key,
                        playerWins: player.wins,
                        playerLosses: player.losses,
                        playerSelection: '',
                        playerTurn: true,
                        opponentName: '',
                        opponentKey: '',
                        opponentWins: 0,
                        opponentLosses: 0,
                        opponentSelection: '',
                        opponentTurn: false,
                        ties: 0,
                        gameInProgress: false,
                    });
                } else if(!game.playerName && game.opponentName) {
                    const player = snap.val();
                    gameRef.update({
                        playerName: player.name,
                        playerKey: snap.key,
                        playerWins: player.wins,
                        playerLosses: player.losses,
                        playerSelection: '',
                        playerTurn: true,
                        opponentTurn: false,
                        gameInProgress: true,
                    });
                } else if(game.playerName && !game.opponentName) {
                    const opponent = snap.val();
                    gameRef.update({
                        opponentName: opponent.name,
                        opponentKey: snap.key,
                        opponentWins: opponent.wins,
                        opponentLosses: opponent.losses,
                        opponentSelection: opponent.selection,
                        opponentTurn: false,
                        gameInProgress: true,
                    })
                } 
            });

            usersRef.on('child_removed', function(snap) {
                if(game.playerKey || game.opponentKey) {
                    if(snap.key === game.playerKey) {
                        gameRef.update({
                            playerName: '',
                            playerKey: '',
                            playerWins: 0,
                            playerLosses: 0,
                            playerSelection: '',
                            playerTurn: false,
                            ties: 0,
                            gameInProgress: false,
                        });
                    } else if(snap.key === game.opponentKey) {
                        gameRef.update({
                            opponentName: '',
                            opponentKey: '',
                            opponentWins: 0,
                            opponentLosses: 0,
                            opponentSelection: '',
                            opponentTurn: false,
                            ties: 0,
                            gameInProgress: false,
                        });
                    }
                }
            });

            chatsRef.on('child_added', function(snap) {
                const messageText = snap.val();
                const newMessage = $('<p>');
                newMessage.text(messageText);
                newMessage.appendTo(chatWindow);
            })

        },

        userJoin: function() {
            event.preventDefault();
            if(!game.gameInProgress && !game.playerKey && userKey !== game.opponentKey) {
                name = submitField.val().trim();
                usersRef.child(userKey).update({
                    name: name,
                });
            } else if(!game.gameInProgress && !game.opponentKey && userKey !== game.playerKey) {
                name = submitField.val().trim();
                usersRef.child(userKey).update({
                    name: name,
                });
            }
        },

        player1Choice: function() {
            event.preventDefault();
            if(userKey === game.playerKey) {
                if(game.gameInProgress) {
                    if(game.playerTurn) {
                        const choice = $(this).text().toLowerCase();
                        console.log(choice);
                        gameRef.update({
                            playerSelection: choice,
                            playerTurn: false,
                            opponentTurn: true
                        })
                    }
                }
            }
        },

        player2Choice: function() {
            event.preventDefault();
            if(userKey === game.opponentKey) {
                if(game.gameInProgress) {
                    if(game.opponentTurn) {
                        const opponentChoice = $(this).text().toLowerCase();
                        console.log(opponentChoice);
                        gameRef.update({
                            opponentSelection: opponentChoice,
                        })
                    }
                }
            }
        },

        chatAdd: function() {
            event.preventDefault();
            const message = chatMessage.val().trim();
            chatsRef.push(message);
        },

        allPlayersConnected: function() {
            player1Name.text(gameState.playerName);
            p1Wins.text('Wins: ' + gameState.playerWins);
            p1Losses.text('Losses: ' + gameState.playerLosses);
            player2Name.text(gameState.opponentName);
            p2Wins.text('Wins: ' + gameState.opponentWins);
            p2Losses.text('Losses: ' + gameState.opponentLosses);
        },
    
    }
    
    submitBtn.click(rochambeau.userJoin);
    p1Btns.click(rochambeau.player1Choice);
    p2Btns.click(rochambeau.player2Choice);
    chatSubmit.click(rochambeau.chatAdd);
    rochambeau.firebaseListeners();
})