// Clock 
const clockContainer = document.querySelector(".clock_container") ;
const clock = clockContainer.querySelector("h2");

function getTime() {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    clock.innerHTML = `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`; 
}

getTime();
setInterval(getTime, 1000);


// Greeting
const form = document.querySelector(".clock_container > form");
const nameInput = form.querySelector("input")
const greeting = document.querySelector(".greeting");
const user = document.querySelector(".user");

function sayHello(text) {
    form.classList.remove('show');
    greeting.classList.add('show');
    const hours = new Date().getHours();
    greeting.innerHTML = `${hours > 5 ? "Good Mornig" : hours > 11 ? "Good Afternoon" : "Good Evening"}`;
    user.innerHTML = text;
    localStorage.setItem('userName', text);
}

function nameSubmit(event) {
    event.preventDefault();
    sayHello(nameInput.value);
    localStorage.setItem('userName', nameInput.value);
}

function askName() {
    form.classList.add('show');
    form.addEventListener("submit", nameSubmit);
}

function loadName() {
    const userName = localStorage.getItem('userName');
    if(userName === null) {
        askName();
    } else {
        sayHello(userName);
    }
}

loadName();

// TO DO

const toDo = document.querySelector(".todo_container > form");
const toDoInput = toDo.querySelector("input");
const toDoListUl = document.querySelector(".todo_list");

let toDos = [];

function saveToDos() {
    localStorage.setItem('toDos', JSON.stringify(toDos));
}

function loadToDos() {
    const loadedToDos = localStorage.getItem('toDos');
    if (loadedToDos !== null) {
        const parsedToDos = JSON.parse(loadedToDos);
        parsedToDos.forEach(function(toDo) {
            appendToDo(toDo.text);
        });
    }
}

function appendToDo(text) {
    const li = document.createElement("li");
    const delBtn = document.createElement("button");
    const span = document.createElement("span");
    const newId = toDos.length + 1;
    delBtn.innerHTML = "✔"; 
    delBtn.addEventListener("click", deleteToDo);
    span.innerText = text;
    li.appendChild(span);
    li.appendChild(delBtn);
    li.id = newId;
    toDoListUl.appendChild(li);
    const toDoObj = {
        text: text,
        id: newId,
    };
    toDos.push(toDoObj);
    saveToDos();
}


function toDoSubmit(event) {
    event.preventDefault();
    appendToDo(toDoInput.value);
    toDoInput.value = "";
}

function deleteToDo(event) {
    const btn = event.target;
    const li = btn.parentNode;
    toDoListUl.removeChild(li);
    const cleanToDos = toDos.filter(function(toDo) {
        return toDo.id !== parseInt(li.id);
    });
    toDos = cleanToDos;
    saveToDos();
}

loadToDos();
toDo.addEventListener("submit", toDoSubmit)


// BG
function changeBG(number) {
    const image = new Image();
    image.src =  `images/bg_${number}.jpg`;
    image.classList.add("bg_img")
    document.body.appendChild(image);
}

const randomNumber = Math.ceil(Math.random() * 3);
changeBG(randomNumber);


// weather
const weather = document.querySelector("weather_container");
const description = document.querySelector(".description");
const temperature = document.querySelector(".temperature");
const cityname = document.querySelector(".cityname");

const API_KEY = "a1c18e5630b5c114198f7ebd63b2d24f";
const COORDS = 'coords';

function getWeather(lat, lng) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`;
    fetch(url)
    .then(function(response) {
        return response.json();
    })
    .then(function(json) {
        const temperatureC = json.main.temp;
        const place = json.name;
        const weatherDescription = json.weather[0].description;
        description.innerHTML = `${weatherDescription}`;
        temperature.innerHTML = `${temperatureC} ℃`;
        cityname.innerHTML = `@ ${place}`;
    });
}

function saveCoords(coordsObj) {
    localStorage.setItem('coords', JSON.stringify(coordsObj));
}

function GeoSuccess(position){
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const coordsObj = {
        latitude,
        longitude
    };
    saveCoords(coordsObj);
    getWeather(latitude, longitude);
}

function GeoError() {
    alert("Can't your find location")
}

function askCoords() {
    navigator.geolocation.getCurrentPosition(GeoSuccess, GeoError)
}

function loadCoords() {
    const loadedCoords = localStorage.getItem('coords');
    if(loadedCoords === null) {
        askCoords();
    } else {
        const parsedCoords = JSON.parse(loadedCoords);
        getWeather(parsedCoords.latitude, parsedCoords.longitude);
        hourWeather(parsedCoords.latitude, parsedCoords.longitude);
    }
}

loadCoords();
