const play = document.getElementById("play");
const travail = document.getElementById("travail");
const pause = document.getElementById("pause");
const compteur = document.getElementById("compteur");
const background = document.getElementById("background");
const progressCircle = document.getElementById("circle-progress"); // Cercle de progression

const tempTravail = 25*60;
const tempPause = 5*60;
let isTravail = true;
let isRunning = false;
let intervalId = null;

document.addEventListener("DOMContentLoaded", () => {
    compteur.textContent = secondesToMinutes(tempTravail);
    updateProgressCircle(tempTravail, tempTravail);
    play.addEventListener("click", () => {
        if (isRunning) {
            reset();
        } else {
            document.querySelector("#play span").classList.remove("fa-play");
            document.querySelector("#play span").classList.add("fa-stop");

            playChrono();
            isRunning = true;
        }
    });
});

const playChrono = () => {
    travail.style.color = "#facc15";
    let tempsActuel = tempTravail;
    let totalTemps = tempTravail;

    intervalId = setInterval(() => {
        if (tempsActuel === 0) {
            isTravail = !isTravail;
            tempsActuel = isTravail ? tempTravail : tempPause;
            totalTemps = tempsActuel;
            background.style.background = isTravail ? "#b91c1c" : "#0e7490";

            if (isTravail) {
                travail.style.color = "#facc15";
                pause.style.color = "white";
            } else {
                travail.style.color = "white";
                pause.style.color = "#facc15";
            }
        } else {
            tempsActuel--;
        }

        // Mise à jour du cercle de progression
        updateProgressCircle(tempsActuel, totalTemps);

        compteur.textContent = secondesToMinutes(tempsActuel);
    }, 1000);
};

const updateProgressCircle = (tempsActuel, totalTemps) => {
    const circleLength = 2 * Math.PI * 38; // 38 est le rayon du cercle
    const progress = (tempsActuel / totalTemps) * circleLength;
    progressCircle.style.strokeDashoffset = circleLength - progress;
};

const secondesToMinutes = (temps) => {
    let minutes = Math.floor(temps / 60);
    let secondes = temps % 60;

    secondes = secondes < 10 ? `0${secondes}` : secondes;

    return `${minutes}:${secondes}`;
};

const reset = () => {
    clearInterval(intervalId);
    isRunning = false;
    isTravail = true;
    compteur.textContent = secondesToMinutes(isTravail ? tempTravail : tempPause);
    background.style.background = "#b91c1c";
    travail.style.color = "white";
    pause.style.color = "white";

    
    updateProgressCircle(tempTravail, tempTravail);

    document.querySelector("#play span").classList.remove("fa-stop");
    document.querySelector("#play span").classList.add("fa-play");
};
