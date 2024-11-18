import React, { useState, useEffect } from "react";
import "./WeatherPages.css";
import weather_icon from "../Assets/ic1.png";
import country_img from "../Assets/countryimg1.jpg";
import search_img from "../Assets/search.png";

const WeatherPages = () => {
  const [isWeekSelected, setIsWeekSelected] = useState(false);
  const [todayColor, setTodayColor] = useState("black");
  const [weekColor, setWeekColor] = useState("gray");

  const [isCelciusSelected, setIsCelciusSelected] = useState(true);
  const [celciusBGColor, setCelciusBGColor] = useState("black");
  const [fahrenheitBGColor, setFahrenheitBGColor] = useState("white");

  const [weatherData, setWeatherData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  // Fetch weather data
  const fetchWeatherData = async (searchTxt) => {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=715e3afe75e242fd9cd65409241508&q=${searchTxt}&days=7&aqi=no&alerts=no`;
    const options = { method: "GET", mode: "cors" };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      if (data.error) {
        setError(data.error.message); // Set error message from API
        setWeatherData(null); // Clear previous weather data
      } else {
        setWeatherData(data);
        setError(""); // Clear error if data is valid
      }
    } catch (error) {
      console.error(`Error fetching weather data: ${error}`);
      alert("Please enter a valid place"); // Set generic error message
    }
  };

  // Fetch initial data
  useEffect(() => {
    fetchWeatherData("pune");
  }, []);

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchWeatherData(searchQuery);
  };

  // Handle input change
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  //time functions
  const getTime = (datetime) => {
    const [date, time] = datetime.split(" ");
    return time;
  };

  const getDayFromTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const options = { weekday: "long" };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  // Toggle functions
  const todayHandleToggle = () => {
    setIsWeekSelected(false);
    setTodayColor("black");
    setWeekColor("gray");
  };

  const weekHandleToggle = () => {
    setIsWeekSelected(true);
    setTodayColor("gray");
    setWeekColor("black");
  };

  const celciusClickHandle = () => {
    setIsCelciusSelected(true);
    setCelciusBGColor("black");
    setFahrenheitBGColor("white");
  };

  const fahrenheitClickHandle = () => {
    setIsCelciusSelected(false);
    setCelciusBGColor("white");
    setFahrenheitBGColor("black");
  };

  return (
    <div className="wrapper">
      <div className="sidebar">
        <div>
          <form className="search" id="search" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              id="query"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleInputChange}
            />
            <button>
              <p>
                <img src={search_img} alt="Sunny" />
              </p>
            </button>
          </form>
          <div className="weatherImg">
            <img
              id="icon"
              src={
                weatherData
                  ? weatherData.current.condition.icon
                  : { weather_icon }
              }
              alt="Sunny"
            />
          </div>

          <div className="temp">
            <p>{weatherData ? weatherData.current.temp_c : "0"}°C</p>
          </div>

          <div className="day">
            <p>
              {getDayFromTimestamp(
                weatherData ? weatherData.current.last_updated_epoch : ""
              )}
              ,
            </p>
          </div>
          <div className="time">
            <p>
              {getTime(weatherData ? weatherData.current.last_updated : "")}
            </p>
          </div>

          <div className="weatherHeader">
            <div className="weatherTypeIcon">
              <img
                src={weatherData ? weatherData.current.condition.icon : "image"}
                alt="Sunny"
              />
            </div>
            <div className="weatherTypeText">
              <p>
                {weatherData ? weatherData.current.condition.text : "Sunny"}
              </p>
            </div>
          </div>
        </div>
        <div className="countryHeader">
          <img src={country_img} alt="countryimg" height="800" width="180" />
          <div className="textinsideimage">
            {weatherData ? weatherData.location.name : "Location"}
          </div>
        </div>
      </div>

      <div className="main">
        <nav>
          <ul className="options">
            <button onClick={todayHandleToggle} style={{ color: todayColor }}>
              Today
            </button>

            <button onClick={weekHandleToggle} style={{ color: weekColor }}>
              Week
            </button>
          </ul>
          <ul className="options units">
            <button
              className="celcius active"
              onClick={celciusClickHandle}
              style={{
                backgroundColor: celciusBGColor,
                color: isCelciusSelected ? "white" : "black",
              }}
            >
              °C
            </button>
            <button
              className="fahrenheit"
              onClick={fahrenheitClickHandle}
              style={{
                backgroundColor: fahrenheitBGColor,
                color: isCelciusSelected ? "black" : "white",
              }}
            >
              °F
            </button>
          </ul>
        </nav>

        <div className="cards" id="weather-cards"></div>
        <div className="day-container">
          {isWeekSelected
            ? weatherData &&
              weatherData.forecast.forecastday.map((weekDay, index) => (
                <div className="card" key={index}>
                  <h2 className="day-name">
                    {getDayFromTimestamp(weekDay.date_epoch)}
                  </h2>
                  <div className="class-icon">
                    <img src={weekDay.day.condition.icon} alt="sunny" />
                  </div>
                  <div className="day-time">
                    <h2 className="temp">
                      {isCelciusSelected
                        ? weekDay.day.maxtemp_c
                        : weekDay.day.maxtemp_f}
                      {isCelciusSelected ? "°C" : "°F"}
                    </h2>
                  </div>
                </div>
              ))
            : weatherData &&
              weatherData.forecast.forecastday[0].hour.map(
                (todayWeather, index) => (
                  <div className="card" key={index}>
                    <h2 className="day-name">{getTime(todayWeather.time)}</h2>
                    <div className="class-icon">
                      <img src={todayWeather.condition.icon} alt="sunny" />
                    </div>
                    <div className="day-time">
                      <h2 className="temp">
                        {isCelciusSelected
                          ? todayWeather.temp_c
                          : todayWeather.temp_f}
                        {isCelciusSelected ? "°C" : "°F"}
                      </h2>
                    </div>
                  </div>
                )
              )}
        </div>

        <div className="highlights">
          <h2 className="heading">today's highlights</h2>
          <div className="cards">
            <div className="card2">
              <h4 className="card-heading">UV Index</h4>
              <div className="content">
                <p className="uv-index">
                  {weatherData ? weatherData.current.uv : "0"}
                </p>
                <p className="uv-text">Low</p>
              </div>
            </div>
            <div className="card2">
              <h4 className="card-heading">Wind Status</h4>
              <div className="content">
                <p>{weatherData ? weatherData.current.wind_kph : "0"}</p>
                <p className="uni">km/h</p>
              </div>
            </div>
            <div className="card2">
              <h4 className="card-heading">Sunrise & Sunset</h4>
              <div className="content">
                <p
                  className="sun-rise"
                  style={{ padding: "-6px", fontSize: "20px" }}
                >
                  {weatherData
                    ? weatherData.forecast.forecastday[0].astro.sunrise
                    : "0"}
                </p>
                <p
                  className="sun-set"
                  style={{
                    fontSize: "20px",
                    textAlign: "center",
                    paddingma: "5px",
                  }}
                >
                  {weatherData
                    ? weatherData.forecast.forecastday[0].astro.sunset
                    : "0"}
                </p>
              </div>
            </div>
            <div className="card2">
              <h4 className="card-heading">Humidity</h4>
              <div className="content">
                <p className="humidity">
                  {weatherData ? weatherData.current.humidity : "0"}
                </p>
                <p className="humidity-status">Normal</p>
              </div>
            </div>
            <div className="card2">
              <h4 className="card-heading">Visibility</h4>
              <div className="content">
                <p className="visibilty">
                  {weatherData ? weatherData.current.vis_km : "0"}
                </p>
                <p className="visibilty-status">Normal</p>
              </div>
            </div>
            <div className="card2">
              <h4 className="card-heading">Air Quality</h4>
              <div className="content">
                <p className="air-quality">
                  {weatherData ? weatherData.current.temp_c : "0"}
                </p>
                <p className="air-quality-status">Normal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherPages;
