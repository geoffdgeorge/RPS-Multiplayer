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
    let userKey
    let player;
    let opponent;
    let gameInProgress = false;

    /* HTML Variables */
    const submitField = $('#player-submit-field');
    const submitBtn = $('#player-submit-button');
    const player1Name = $('#player-one-name');
    const player2Name = $('#player-two-name');
    const p1ImgArea = $('#player-one-throw');
    const p2ImgArea = $('#player-two-throw')
    const rP1Btn = $('#rP1');
    const pP1Btn = $('#pP1');
    const sP1Btn = $('#sP1');
    const rP2Btn = $('#rP2');
    const pP2Btn = $('#pP2');
    const sP2Btn = $('#sP2');
    const resultsArea = $('#results');
    const p1Wins = $('#p1Wins');
    const p1Losses = $('#p1Losses');
    const p2Wins = $('#p2Wins');
    const p2Losses = $('#p2Losses');
    const ties = $('#ties');
    const messageArea = $('#messages');

    /* Firebase Storage Variables */
    const usersRef = database.ref('/usersRef');
    const playersRef = database.ref('/playersRef');
    const connectedRef = database.ref('.info/connected');

    /* Object of functions */
    const rochambeau = {

        firebaseListeners: function() {

            /* When a user connects ... */
            connectedRef.on("value", function(snap) {

                /* If they are connected ... */
                if (snap.val()) {
                    
                    // Push their empty profile to the usersRef database
                    const con = usersRef.push({
                        name: '',
                        wins: 0,
                        losses: 0,
                        playing: false,
                        turn: false
                    });

                    // Remove user from the connection list when they disconnect
                    con.onDisconnect().remove();

                }
            });
            
            playersRef.on("value", function(snap) {
                if(snap.numChildren < 3) {

                }
            })

        },

        userJoin: function() {
            event.preventDefault();
            if(!gameInProgress) {
                name = submitField.val().trim();
                const newPlayer = {
                    name: name,
                    wins: 0,
                    losses: 0,
                    playing: false,
                    turn: false
                }
                playersRef.push(newPlayer);

            }
        },

    }
    
    submitBtn.click(rochambeau.userJoin);
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