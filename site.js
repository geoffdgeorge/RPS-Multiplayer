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

        /* A large function that holds all the change-event listeners for the Firebase database */
        firebaseListeners: function() {

            /* For this listener, when a user connects ... */
            connectedRef.on('value', function(snap) {

                /* If they are connected ... */
                if (snap.val()) {
                    
                    /* Their empty profile gets pushed to the usersRef database. */
                    const con = usersRef.push({
                        name: '',
                        wins: 0,
                        losses: 0,
                        selection: '',
                        turn: false,
                    });

                    /* Removes user from the connection list when they disconnect. */
                    con.onDisconnect().remove();

                    /* The user's unique Firebase key is stored as the local userKey on their screen. */
                    userKey = con.key;
                    
                }
            });

            /* This listener changes the game display with each update of the game-conditions database. */
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
                        resultsMessage.text('Waiting for players')
                        game = gameState;
                    } else if(gameState.playerName && gameState.playerKey && !gameState.opponentName && !gameState.opponentKey) {
                        player1Name.text(gameState.playerName);
                        p1Wins.text('Wins: ' + gameState.playerWins);
                        p1Losses.text('Losses: ' + gameState.playerLosses);
                        player2Name.text('Waiting ...');
                        p2Wins.text('Wins:');
                        p2Losses.text('Losses:');
                        resultsMessage.text('Waiting for player 2')
                        game = gameState;
                    } else if(!gameState.playerName && !gameState.playerKey && gameState.opponentName && gameState.opponentKey){
                        player1Name.text('Waiting ...');
                        p1Wins.text('Wins:');
                        p1Losses.text('Losses:');
                        player2Name.text(gameState.opponentName);
                        p2Wins.text('Wins: ' + gameState.opponentWins);
                        p2Losses.text('Losses: ' + gameState.opponentLosses);
                        resultsMessage.text('Waiting for player 1');
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
                        resultsMessage.text('Player 1, choose your weapon: rock (R), paper (P), or scissors (S).');
                        game = gameState;
                        if(gameState.playerSelection) {
                            resultsMessage.text('Player 2, choose your weapon: rock (R), paper (P), or scissors (S).');
                            game = gameState;
                            if(gameState.playerSelection && gameState.opponentSelection) {
                                if(gameState.playerSelection === 'r' && gameState.opponentSelection === 's') {
                                    p1ImgArea.html(rockImg);
                                    p2ImgArea.html(scissorsImg);
                                    resultsMessage.text(gameState.playerName + ' wins!');
                                    gameState.playerWins++
                                    gameState.opponentLosses++
                                    p1Wins.text('Wins: ' + gameState.playerWins);
                                    p1Losses.text('Losses: ' + gameState.playerLosses);
                                    p2Wins.text('Wins: ' + gameState.opponentWins);
                                    p2Losses.text('Losses: ' + gameState.opponentLosses);
                                    ties.text('Ties: ' + gameState.ties);
                                    game = gameState;
                                    setTimeout(rochambeau.reset, 4000);
                                } else if (gameState.playerSelection === 's' && gameState.opponentSelection === 'p') {
                                    p1ImgArea.html(scissorsImg);
                                    p2ImgArea.html(paperImg);
                                    resultsMessage.text(gameState.playerName + ' wins!');
                                    gameState.playerWins++
                                    gameState.opponentLosses++
                                    p1Wins.text('Wins: ' + gameState.playerWins);
                                    p1Losses.text('Losses: ' + gameState.playerLosses);
                                    p2Wins.text('Wins: ' + gameState.opponentWins);
                                    p2Losses.text('Losses: ' + gameState.opponentLosses);
                                    ties.text('Ties: ' + gameState.ties);
                                    game = gameState;
                                    setTimeout(rochambeau.reset, 4000);
                                } else if(gameState.playerSelection === 'p' && gameState.opponentSelection === 'r') {
                                    p1ImgArea.html(paperImg);
                                    p2ImgArea.html(rockImg);
                                    resultsMessage.text(gameState.playerName + ' wins!');
                                    gameState.playerWins++
                                    gameState.opponentLosses++
                                    p1Wins.text('Wins: ' + gameState.playerWins);
                                    p1Losses.text('Losses: ' + gameState.playerLosses);
                                    p2Wins.text('Wins: ' + gameState.opponentWins);
                                    p2Losses.text('Losses: ' + gameState.opponentLosses);
                                    ties.text('Ties: ' + gameState.ties);
                                    game = gameState;
                                    setTimeout(rochambeau.reset, 4000);
                                } else if(gameState.playerSelection === 's' && gameState.opponentSelection === 'r') {
                                    p1ImgArea.html(scissorsImg);
                                    p2ImgArea.html(rockImg);
                                    resultsMessage.text(gameState.opponentName + ' wins!');
                                    gameState.playerLosses++
                                    gameState.opponentWins++
                                    p1Wins.text('Wins: ' + gameState.playerWins);
                                    p1Losses.text('Losses: ' + gameState.playerLosses);
                                    p2Wins.text('Wins: ' + gameState.opponentWins);
                                    p2Losses.text('Losses: ' + gameState.opponentLosses);
                                    ties.text('Ties: ' + gameState.ties);
                                    game = gameState;
                                    setTimeout(rochambeau.reset, 4000);
                                } else if(gameState.playerSelection === 'r' && gameState.opponentSelection === 'p') {
                                    p1ImgArea.html(rockImg);
                                    p2ImgArea.html(paperImg);
                                    resultsMessage.text(gameState.opponentName + ' wins!');
                                    gameState.playerLosses++
                                    gameState.opponentWins++
                                    p1Wins.text('Wins: ' + gameState.playerWins);
                                    p1Losses.text('Losses: ' + gameState.playerLosses);
                                    p2Wins.text('Wins: ' + gameState.opponentWins);
                                    p2Losses.text('Losses: ' + gameState.opponentLosses);
                                    ties.text('Ties: ' + gameState.ties);
                                    game = gameState;
                                    setTimeout(rochambeau.reset, 4000);
                                } else if(gameState.playerSelection === 'p' && gameState.opponentSelection === 's') {
                                    p1ImgArea.html(paperImg);
                                    p2ImgArea.html(scissorsImg);
                                    resultsMessage.text(gameState.opponentName + ' wins!');
                                    gameState.playerLosses++
                                    gameState.opponentWins++
                                    p1Wins.text('Wins: ' + gameState.playerWins);
                                    p1Losses.text('Losses: ' + gameState.playerLosses);
                                    p2Wins.text('Wins: ' + gameState.opponentWins);
                                    p2Losses.text('Losses: ' + gameState.opponentLosses);
                                    ties.text('Ties: ' + gameState.ties);
                                    game = gameState;
                                    setTimeout(rochambeau.reset, 4000);
                                } else if(gameState.playerSelection === 'p' && gameState.opponentSelection === 'p') {
                                    p1ImgArea.html(paperImg);
                                    p2ImgArea.html(paperImg.clone());
                                    resultsMessage.text('Tie game!');
                                    gameState.ties++
                                    p1Wins.text('Wins: ' + gameState.playerWins);
                                    p1Losses.text('Losses: ' + gameState.playerLosses);
                                    p2Wins.text('Wins: ' + gameState.opponentWins);
                                    p2Losses.text('Losses: ' + gameState.opponentLosses);
                                    ties.text('Ties: ' + gameState.ties);
                                    game = gameState;
                                    setTimeout(rochambeau.reset, 4000);
                                } else if(gameState.playerSelection === 'r' && gameState.opponentSelection === 'r') {
                                    p1ImgArea.html(rockImg);
                                    p2ImgArea.html(rockImg.clone());
                                    resultsMessage.text('Tie game!');
                                    gameState.ties++
                                    p1Wins.text('Wins: ' + gameState.playerWins);
                                    p1Losses.text('Losses: ' + gameState.playerLosses);
                                    p2Wins.text('Wins: ' + gameState.opponentWins);
                                    p2Losses.text('Losses: ' + gameState.opponentLosses);
                                    ties.text('Ties: ' + gameState.ties);
                                    game = gameState;
                                    setTimeout(rochambeau.reset, 4000);
                                } else if(gameState.playerSelection === 's' && gameState.opponentSelection === 's') {
                                    p1ImgArea.html(scissorsImg);
                                    p2ImgArea.html(scissorsImg.clone());
                                    resultsMessage.text('Tie game!');
                                    gameState.ties++
                                    p1Wins.text('Wins: ' + gameState.playerWins);
                                    p1Losses.text('Losses: ' + gameState.playerLosses);
                                    p2Wins.text('Wins: ' + gameState.opponentWins);
                                    p2Losses.text('Losses: ' + gameState.opponentLosses);
                                    ties.text('Ties: ' + gameState.ties);
                                    game = gameState;
                                    setTimeout(rochambeau.reset, 4000);
                                }
                            }
                        }
                    }
                }
            });

            /* This listener resets everything in the game-conditions database when a lone user connects. */
            database.ref().on('child_added', function(snap) {
                if(snap.numChildren() === 1) {
                    gameRef.update({
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
                    });
                };
            })

            /* This listener sends updates to the game-conditions database when someone signs in as either player 1 or player 2. */
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

            /* This listener sends updates to the game-conditions database when a player signs off. */
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

            /* This listener updates the chat window with each new chat that gets uploaded to the chat database. */
            chatsRef.on('value', function(snap) {
                chatWindow.empty();
                snap.forEach(function(childSnap) {
                    const messageText = childSnap.val();
                    const newMessage = $('<p>').addClass('chats');
                    newMessage.text(messageText);
                    newMessage.prependTo(chatWindow);
                })
            });
        },

        /* This function updates the user database with when a user signs in to play. The logic is built the way it is so that anyone who signs in can't sign in a second time. */
        userJoin: function() {
            event.preventDefault();
            const name = submitField.val().trim();
            if(!game.gameInProgress && !game.playerKey && userKey !== game.opponentKey) {
                usersRef.child(userKey).update({
                    name: name,
                });
            } else if(!game.gameInProgress && !game.opponentKey && userKey !== game.playerKey) {
                usersRef.child(userKey).update({
                    name: name,
                });
            }
            submitField.val('');
        },

        /* This function records the choice of player 1 when it's that person's turn. */
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

        /* This function records the choice of player 2 when it's that person's turn. */
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

        /* This function records each submitted chat and uploads it to the chat database. */
        chatAdd: function() {
            event.preventDefault();
            const message = chatMessage.val().trim();
            if(userKey === game.playerKey) {
                chatsRef.push(game.playerName + ': ' + message)
            } else if(userKey === game.opponentKey) {
                chatsRef.push(game.opponentName + ': ' + message)
            } else {
                chatsRef.push('Anon: ' + message);
            }
            chatMessage.val('');
        },

        /* This function dictates the screen display when the spots for player 1 and player 2 are both filled. */
        allPlayersConnected: function() {
            player1Name.text(gameState.playerName);
            p1Wins.text('Wins: ' + gameState.playerWins);
            p1Losses.text('Losses: ' + gameState.playerLosses);
            player2Name.text(gameState.opponentName);
            p2Wins.text('Wins: ' + gameState.opponentWins);
            p2Losses.text('Losses: ' + gameState.opponentLosses);
        },

        /* This function resets the conditions of the game at the end of each round. */
        reset: function() {
            resultsMessage.text('Player 1, choose your weapon.');
            p1ImgArea.html('<h1>?</h1>');
            p2ImgArea.html('<h1>?</h1>');
            gameRef.update({
                playerSelection: '',
                playerWins: game.playerWins,
                playerLosses: game.playerLosses,
                playerTurn: true,
                opponentSelection: '',
                opponentWins: game.opponentWins,
                opponentLosses: game.opponentLosses,
                opponentTurn: false,
                ties: game.ties,
            })
        }
    
    }
    
    /* All the key functions are called. */
    submitBtn.click(rochambeau.userJoin);
    p1Btns.click(rochambeau.player1Choice);
    p2Btns.click(rochambeau.player2Choice);
    chatSubmit.click(rochambeau.chatAdd);
    rochambeau.firebaseListeners();
})