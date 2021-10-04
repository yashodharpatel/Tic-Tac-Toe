// Setting display of about box to block when about button is clicked
let aboutBox = document.querySelector('.about-box');
let aboutButton = document.querySelector('.aboutButton');
let closeButton = document.querySelector('.closeButton');
let okButton = document.querySelector('.okButton');

function showAboutbox() {
    aboutBox.style.display = 'block';
}

function closeAboutbox() {
    aboutBox.style.display = 'none';
}

aboutButton.addEventListener('click', showAboutbox);
closeButton.addEventListener('click', closeAboutbox);
okButton.addEventListener('click', closeAboutbox);

// Opening the game in specific gamemode when nextbutton is clicked and showing alert if none of the gamemode is selected
let nextpageButton = document.querySelector('.nextpageButton');

nextpageButton.addEventListener('click', () => {
    let gamemode = document.getElementsByName('gamemode');
    for (i = 0; i < gamemode.length; i++) {
        if (gamemode[i].checked) {
            if (gamemode[i].value == "vsHuman")
                window.location.href = '/views/Human.html';
            else
                window.location.href = '/views/Computer.html';
        }
    }
    if ((!gamemode[0].checked) && (!gamemode[1].checked)) {
        alert('Please select any one of the gamemode.');
    }
});

// Fuction to disable right click and to show snackbar to user
function disableRightclick() {
    document.addEventListener('contextmenu', e => e.preventDefault());

    let snackbar = document.getElementById("snackbar");

    snackbar.className = "show";

    setTimeout(function () {
        snackbar.className = snackbar.className.replace("show", "");
    }, 3000);
}