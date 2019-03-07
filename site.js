$(document).ready(function() {

    /* Initial Variables */
    let player1 = null;
    let player2 = null;

    console.log(player1);

    /* HTML Variables */
    const submitField = $('#player-submit-field')
    const submitBtn =$('#player-submit-button')
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

    const rochambeau = {

        checkForPlayers: function() {
            event.preventDefault();
            const newPlayer = 
            if()
        }

    }

    submitBtn.click(rochambeau.checkForPlayers);
})