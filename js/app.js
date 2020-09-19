// DOM elements
const locationValue = document.querySelector('#location-value')
const locationBtn = document.querySelector('#location-btn')
const searchInput = document.querySelector('#search-location')
const degreeValue = document.querySelector('#degree-value')
const weatherImage = document.querySelector('#weather-img')
const weatherDesc = document.querySelector('#weather-description')
const date = document.querySelector('#date')
const time = document.querySelector('#time')
const dailyList = document.querySelector('#daily-list')
const dailyDates = document.querySelectorAll('.daily-date')
const dailyImages = document.querySelectorAll('.daily-img')
const dailyDegrees = document.querySelectorAll('.daily-degree')
const dailyDescs = document.querySelectorAll('.daily-desc')

// set date & time 
const today = new Date()
const checkTime = i => {
    if(i < 10) i = "0" + i
    return i
}
(function startTime(){
    const today = new Date()
    const hour = today.getHours()
    let minutes = today.getMinutes()
    let seconds = today.getSeconds()
    
    minutes = checkTime(minutes)
    seconds = checkTime(seconds)
    time.textContent = `${hour}:${minutes}:${seconds}`
    const timer = setTimeout(startTime, 500)
    return timer
}())
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
date.textContent = today.toLocaleDateString(undefined, options)
// API
const baseApi = 'https://api.openweathermap.org/data/2.5/'
const apiKey = 'c7797bac9f0e985a65a828f552dc176d'
let lat = 40.730610, lon = -73.935242, getDegree
// display data from API 
const displayData = location => {
    fetch(`${baseApi}/weather?q=${location}&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            lat = data.coord.lat
            lon = data.coord.lon
        })
        .then(data => {
            return fetch(`${baseApi}onecall?lat=${lat}&lon=${lon}&
                exclude=hourly,daily&appid=${apiKey}`)
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            locationValue.textContent = location
            degreeValue.innerHTML = `${data.current.temp}<sup>o</sup>F`
            getDegree = data.current.temp
            const imageSrc = data.current.weather[0].icon
            weatherImage.src = `http://openweathermap.org/img/wn/${imageSrc}@4x.png`
            weatherDesc.textContent = data.current.weather[0].description
            for(let i=0; i<data.daily.length; i++) {
                dailyDates[i].textContent = today.getDate() + i
                dailyImages[i].src = `http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png`
                dailyDegrees[i].textContent = data.daily[i].temp.day
                dailyDescs[i].textContent = data.daily[i].weather[0].description
            }
        })
}
// add event for user input
locationBtn.addEventListener('click', () => {
    if(searchInput.value !== "") {
        localStorage.setItem('location', JSON.stringify(searchInput.value))
        displayData(searchInput.value)
    }
})
// stor user search into local storage & set default location to 'new_york'
if(localStorage.getItem('location') === null) {
    displayData('new york')
} else {
    displayData(JSON.parse(localStorage.getItem('location')))
}
// convert to celsius || C=(F-32)X5/9
const convertToCelsius = (deg) => deg.innerHTML = `${((getDegree - 32)*5/9).toFixed(2)}<sup>o</sup>C`
degreeValue.addEventListener('click', ()=> convertToCelsius(degreeValue))
