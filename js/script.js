// Sélection des éléments DOM
const play = document.getElementById("play");
const travail = document.getElementById("travail");
const pause = document.getElementById("pause");
const compteur = document.getElementById("compteur");
const background = document.getElementById("background");
const progressCircle = document.getElementById("circle-progress"); // Cercle de progression
const alertSound = document.getElementById("alert-sound");
const newTempTravail = document.getElementById("work-time");
const newTempPause = document.getElementById("pause-time");
const changeTemps = document.getElementById("saveTimeButton");

let tempTravail;
let tempPause;

// Fonction pour vérifier si la valeur est un nombre valide
function isValidNumber(value) {
    return !isNaN(value) && value !== null && value !== '';
}

// Vérifier si 'workTime' existe dans le localStorage et est un nombre valide
let workTimeValue = localStorage.getItem('workTime');
if (isValidNumber(workTimeValue)) {
    tempTravail = parseInt(workTimeValue, 10);
} else {
    tempTravail = 25 * 60; // Valeur par défaut de 25 minutes (en secondes)
}

// Vérifier si 'pauseTime' existe dans le localStorage et est un nombre valide
let pauseTimeValue = localStorage.getItem('pauseTime');
if (isValidNumber(pauseTimeValue)) {
    tempPause = parseInt(pauseTimeValue, 10);
} else {
    tempPause = 5 * 60; // Valeur par défaut de 5 minutes (en secondes)
}

let isTravail = true;
let isRunning = false;
let intervalId = null;

// Sélection des éléments pour le timepicker
const dropdown = document.getElementById("dropdownTimepicker");

// Événements à charger une fois le DOM complètement chargé
document.addEventListener("DOMContentLoaded", () => {
  // Affichage initial du compteur et du cercle de progression
  newTempTravail.value = convertSecondsToTime(tempTravail);
  newTempPause.value = convertSecondsToTime(tempPause);
  compteur.textContent = secondesToMinutes(tempTravail);
  updateProgressCircle(tempTravail, tempTravail);

  // Gestion du clic sur le bouton play
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

  // Gestion du changement de temps de travail et de pause
  changeTemps.addEventListener("click", () => {
    tempPause = textToSecondes(newTempPause.value);
    tempTravail = textToSecondes(newTempTravail.value);
    
    // Sauvegarder les temps dans le localStorage
    localStorage.setItem('workTime', tempTravail);
    localStorage.setItem('pauseTime', tempPause);

    reset();

    dropdown.classList.toggle("hidden");
  });
});

// Fonction pour démarrer le chronomètre
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
      if (tempsActuel === 10) {
        alertSound.play(); // Jouer le son d'alerte
      }
      tempsActuel--;
    }

    // Mise à jour du cercle de progression
    updateProgressCircle(tempsActuel, totalTemps);

    // Mise à jour du compteur
    compteur.textContent = secondesToMinutes(tempsActuel);
  }, 1000);
};

// Fonction pour mettre à jour le cercle de progression
const updateProgressCircle = (tempsActuel, totalTemps) => {
  const circleLength = 2 * Math.PI * 38; // 38 est le rayon du cercle
  const progress = (tempsActuel / totalTemps) * circleLength;
  progressCircle.style.strokeDashoffset = circleLength - progress;
};

// Fonction pour convertir les secondes en minutes
const secondesToMinutes = (temps) => {
  let minutes = Math.floor(temps / 60);
  let secondes = temps % 60;

  secondes = secondes < 10 ? `0${secondes}` : secondes;

  return `${minutes}:${secondes}`;
};

// Fonction pour réinitialiser le chronomètre
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

// Fonction pour convertir le texte en secondes
const textToSecondes = (value) => {
  const tabValue = value.split(":");
  const heures = parseInt(tabValue[0]);
  const minutes = parseInt(tabValue[1]);

  return heures * 3600 + minutes * 60;
};

function convertSecondsToTime(seconds) {
  const hours = Math.floor(seconds / 3600); // Obtenir les heures
  const minutes = Math.floor((seconds % 3600) / 60); // Obtenir les minutes restantes
  const formattedHours = String(hours).padStart(2, '0'); // Format HH
  const formattedMinutes = String(minutes).padStart(2, '0'); // Format MM
  return `${formattedHours}:${formattedMinutes}`;
}
