import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function Search({ filter, handleChange }) {
  return (
    <div>
      find countries <input type="text" value={filter} onChange={(e) => handleChange(e)} />
    </div>
  )
}

function Countries({ countryList, setFilter }) {
  if (countryList.length > 10) {
    return (
      <p>Too many matches, specify another filter</p>
    )
  } else if (countryList.length === 1) {
    return (
      <CountryDetails country={countryList[0]} />
    )
  }
  return (
    <div>
      {countryList.map(country =>
        <div key={country.name.common} style={{display: "flex", alignItems: "center"}}>
          <p>{country.name.common}</p><button onClick={() => setFilter(country.name.common)}>show</button>
        </div>
      )}
    </div>
  )
}

function Weather({ city }) {
  const [location, setLocation] = useState(
    {
      lat: 0,
      lon: 0
    }
  )
  const [weather, setWeather] = useState(
    {
      temperature: 0,
      icons:
      {
        icon: "",
        description: ""
      },
      wind_speed: 0
    }
  )

  useEffect(() => {
    axios
      .get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${process.env.REACT_APP_WEATHER_KEY}`)
      .then(response => {
        setLocation(
          {
            lat: response.data[0].lat,
            lon: response.data[0].lon
          }
        )
      })
      .catch(error => {
        console.log(error)
      })
  }, [city])

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&exclude=minutely,hourly,daily,alerts&appid=${process.env.REACT_APP_WEATHER_KEY}&units=metric`)
      .then(response => {
        setWeather(
          {
            temperature: response.data.main.temp,
            icons: {
              icon: `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`,
              description: response.data.weather[0].description
            },
            wind_speed: response.data.wind.speed
          }
        )
      })
      .catch(error => {
        console.log(error)
      })
  }, [location])


  return (
    <div>
      <h2>Weather in {city}</h2>
      <p>Temperature {weather.temperature} Celsius</p>
      <img src={weather.icons.icon} alt={weather.icons.description} />
      <p>Wind {weather.wind_speed} m/s</p>
    </div>
  )
}

function CountryDetails({ country }) {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital}</p>
      <p>area {country.area}</p>
      <h2>languages:</h2>
      <ul>
        {Object.values(country.languages).map(language =>
          <li key={language}>{language}</li>
        )}
      </ul>
      <img src={country.flags.png} alt="flag" width="150" />
      <Weather city={country.capital} />
    </div>
  )
}

function App() {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  const handleChange = (e) => {
    setFilter(e.target.value)
  }

  const filterResults = () => {
    return countries.filter(country =>
        country.name.common.toLowerCase().includes(filter.toLowerCase())
    )
  }

  return (
    <div>
      <Search filter={filter} handleChange={(e) => handleChange(e)} />
      <Countries countryList={filterResults(countries)} setFilter={setFilter} />
    </div>
  );
}

export default App;
