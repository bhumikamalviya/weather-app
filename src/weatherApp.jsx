import { useState, useEffect } from 'react';
import './weather.css';
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import cloud from "../src/images/Overcast_cloud.png";
import clearsky from "../src/images/clearsky.png";
import rain from "../src/images/rain.png";
import mist from "../src/images/mist.png";
import haze from "../src/images/haze.png";
import errorr from "../src/images/error1.png";
import bgImage from "../src/images/sky1.jpg";

export function WeatherApp() {
    const [search, setSearch] = useState("");
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecastData, setForecastData] = useState([]);
    const [error, setError] = useState("");
    const api_key = "0af573b47b970ff6e97b57bc3bdc744d";

    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const weekday = date.toLocaleString('en-US', { weekday: 'short' });
    const today = `${weekday} ${day} ${month}`;

    function handleInput(event) {
        setSearch(event.target.value);
    }

    const myFun = async (cityName) => {
        const query = cityName || search;

        if (!query) {
            setError("Enter Name");
            return;
        }

        try {
            const resCurrent = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${api_key}&units=metric`);
            const currentData = await resCurrent.json();

            const resForecast = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=${api_key}&units=metric`);
            const forecastJson = await resForecast.json();

            if (currentData.cod === "404" || forecastJson.cod === "404") {
                setError("Please Enter Valid City");
            } else {
                setError("");
                setCurrentWeather(currentData);

                const dailyForecast = forecastJson.list.filter(item =>
                    item.dt_txt.includes("12:00:00")
                ).slice(0, 5);

                setForecastData(dailyForecast);
            }
        } catch (err) {
            setError("Something went wrong");
        }

        setSearch("");
    };

    useEffect(() => {
        setSearch("Indore");
        myFun("Indore");
    }, []);

    const getWeatherImage = (main) => {
        switch (main) {
            case "Clouds": return cloud;
            case "Mist": return mist;
            case "Haze": return haze;
            case "Clear": return clearsky;
            case "Rain": return rain;
            default: return clearsky;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-[#3a5679]">
            <div className='w-full max-w-4xl rounded-2xl shadow-lg text-white font-sans overflow-hidden' style={{ backgroundImage: `linear-gradient(rgba(12, 23, 46, 0.5), rgba(12, 23, 46, 0.5)), url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className='flex flex-col lg:flex-row gap-6 p-4 items-center'>
                    <div className='curr-weather w-full lg:w-1/2 flex flex-col items-center text-center'>
                        <div className='inputs mb-4 flex justify-center'>
                            <input
                                type="text"
                                placeholder="Enter city, country"
                                onChange={handleInput}
                                value={search}
                                className="px-4 h-10 w-48 bg-[#B6B09F] text-white rounded-l-full placeholder-white focus:outline-none"
                            />
                            <button className="bg-[#B6B09F] h-10 px-4 rounded-r-full" onClick={() => myFun()}>
                                <FaSearch />
                            </button>
                        </div>

                        {error && (
                            <div className="popup-overlay">
                                <div className="popup-box">
                                    <img src={errorr} alt="error" className="popup-img" />
                                    <p className="popup-text">{error}</p>
                                    <button className="popup-close" onClick={() => setError("")}>Close</button>
                                </div>
                            </div>
                        )}

                        {currentWeather && (
                            <div className="current-weather flex flex-col items-center">
                                <img className='image mx-auto mb-4' src={getWeatherImage(currentWeather.weather[0].main)} alt="weather" />
                                <p className='city_name flex items-center justify-center gap-2'><FaMapMarkerAlt /> {currentWeather.name}</p>
                                <h2><span className='temp text-4xl font-bold'>{Math.round(currentWeather.main.temp)}</span>°C</h2>
                                <h2 className='discription capitalize'>{currentWeather.weather[0].description}</h2>
                                <p className='date text-sm mt-1'>Today · {today}</p>
                            </div>
                        )}
                    </div>

                    <div className='second-col w-full lg:w-1/2 flex flex-col items-center text-center'>
                        {forecastData.length > 0 && (
                            <div className="forecast-section w-full flex flex-col items-start lg:items-center lg:ml-0 ml-2">
                                <h3 className="text-lg font-semibold mb-2 self-start lg:self-center">Upcoming Weather</h3>
                                <div className="forecast-cards flex gap-4 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-slate-400 pb-2 w-full">
                                    {forecastData.map((item, index) => {
                                        const date = new Date(item.dt_txt);
                                        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
                                        const temp = Math.round(item.main.temp);
                                        const main = item.weather[0].main;
                                        const description = item.weather[0].description;

                                        return (
                                            <div className="forecast-card flex-shrink-0 w-24 bg-white bg-opacity-20 rounded-xl p-2 text-center text-sm overflow-hidden" key={index}>
                                                <p className="forecast-day font-bold mb-1">{day}</p>
                                                <img src={getWeatherImage(main)} alt={main} className="forecast-img mb-2 mx-auto w-10 h-10" />
                                                <p className="text-sm font-semibold">{temp}°C</p>
                                                <p className="forecast-desc text-xs mt-1 text-gray-200 break-words leading-tight whitespace-normal w-full text-center">{description}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {currentWeather && (
                            <div className="highlights-section mt-6">
                                <h3 className="text-lg font-semibold mb-3 text-center">Today's Highlights</h3>
                                <div className="highlight-boxes grid grid-cols-2 gap-4 justify-center">
                                    <div className="highlight-box bg-white bg-opacity-20 p-4 rounded-xl shadow-md">
                                        <p className="highlight-title text-sm font-semibold">Humidity</p>
                                        <p className="highlight-value text-lg">{currentWeather.main.humidity}%</p>
                                    </div>
                                    <div className="highlight-box bg-white bg-opacity-20 p-4 rounded-xl shadow-md">
                                        <p className="highlight-title text-sm font-semibold">Wind Speed</p>
                                        <p className="highlight-value text-lg">{currentWeather.wind.speed} m/s</p>
                                    </div>
                                    <div className="highlight-box bg-white bg-opacity-20 p-4 rounded-xl shadow-md">
                                        <p className="highlight-title text-sm font-semibold">Pressure</p>
                                        <p className="highlight-value text-lg">{currentWeather.main.pressure} hPa</p>
                                    </div>
                                    <div className="highlight-box bg-white bg-opacity-20 p-4 rounded-xl shadow-md">
                                        <p className="highlight-title text-sm font-semibold">Feels Like</p>
                                        <p className="highlight-value text-lg">{Math.round(currentWeather.main.feels_like)}°C</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
