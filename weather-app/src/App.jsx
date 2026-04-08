import { useState, useEffect } from "react";
import axios from "./api/axios";

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_WEATHER_KEY;

  const fetchWeather = async (url) => {
    setLoading(true);
    setError(false);
    try {
      const response = await axios.get(url);
      setData(response.data);
    } catch (err) {
      setError(true);
      setData({});
    }
    setLoading(false);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const url = `/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
        fetchWeather(url);
      });
    }
  }, []);

  const searchLocation = (event) => {
    if (event.key === "Enter" && location) {
      const url = `/weather?q=${location}&units=metric&appid=${API_KEY}`;
      fetchWeather(url);
      setLocation("");
    }
  };

  const getTheme = () => {
    if (!data.weather) return "from-slate-900 to-black text-white";
    const status = data.weather[0].main.toLowerCase();
    
    // Logika Warna Dinamis
    if (status.includes("clear")) return "from-orange-400 via-amber-200 to-yellow-500 text-slate-900";
    if (status.includes("cloud")) return "from-blue-400 via-slate-300 to-indigo-500 text-slate-800";
    if (status.includes("rain") || status.includes("drizzle")) return "from-slate-800 via-blue-900 to-black text-white";
    if (status.includes("thunderstorm")) return "from-purple-900 via-slate-900 to-black text-yellow-400";
    
    return "from-slate-900 to-black text-white";
  };

  return (
    <div className={`h-screen w-full bg-gradient-to-br ${getTheme()} transition-all duration-1000 flex flex-col items-center overflow-hidden font-sans p-6 md:p-12`}>
      
      {/* SEARCH BAR - Diturunkan dengan mt-20 */}
      <div className="z-30 w-full max-w-md mt-10">
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={searchLocation}
          placeholder={loading ? "..." : "SEARCH CITY"}
          className="w-full bg-white/10 backdrop-blur-3xl border border-white/20 p-3 rounded-full text-center text-xs tracking-[0.4em] outline-none focus:bg-white/20 transition-all placeholder:text-inherit/30 shadow-xl"
        />
        {error && <p className="text-center mt-2 text-[10px] font-bold tracking-widest opacity-60">NOT FOUND</p>}
      </div>

      {/* MAIN DISPLAY */}
      {data.name && !loading ? (
        <div className="flex-1 w-full max-w-5xl flex flex-col justify-between py-8 animate-in">
          
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-light tracking-[0.6em] uppercase opacity-80 italic">
              {data.name}
            </h2>
            <p className="text-[10px] tracking-[0.3em] font-bold opacity-40 uppercase mt-1">{data.sys?.country}</p>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              <h1 className="text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter drop-shadow-2xl">
                {data.main?.temp.toFixed()}
              </h1>
              <span className="absolute top-6 -right-8 md:-right-12 text-4xl md:text-6xl font-light opacity-50">°</span>
            </div>
            
            <div className="flex items-center gap-4 -mt-4">
              <img 
                src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} 
                alt="icon" 
                className="w-20 h-20 md:w-24 md:h-24 drop-shadow-xl"
              />
              <div className="text-left">
                <p className="text-2xl md:text-4xl font-bold uppercase tracking-tight italic leading-none">{data.weather[0].main}</p>
                <p className="text-[10px] md:text-xs tracking-[0.3em] uppercase opacity-50 mt-1 font-medium">{data.weather[0].description}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 md:gap-4 w-full border-t border-current/10 pt-8">
            <div className="text-center">
              <p className="text-[8px] md:text-[10px] uppercase tracking-widest opacity-40 mb-2 font-bold">Humidity</p>
              <p className="text-lg md:text-2xl font-light">{data.main?.humidity}%</p>
            </div>
            <div className="text-center border-l border-current/10">
              <p className="text-[8px] md:text-[10px] uppercase tracking-widest opacity-40 mb-2 font-bold">Wind</p>
              <p className="text-lg md:text-2xl font-light">{data.wind?.speed.toFixed(1)}<span className="text-[10px] ml-1">m/s</span></p>
            </div>
            <div className="text-center border-l border-current/10">
              <p className="text-[8px] md:text-[10px] uppercase tracking-widest opacity-40 mb-2 font-bold">Feels</p>
              <p className="text-lg md:text-2xl font-light">{data.main?.feels_like.toFixed()}°</p>
            </div>
            <div className="text-center border-l border-current/10">
              <p className="text-[8px] md:text-[10px] uppercase tracking-widest opacity-40 mb-2 font-bold">Pressure</p>
              <p className="text-lg md:text-2xl font-light">{data.main?.pressure}</p>
            </div>
          </div>

        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center items-center opacity-5">
          <h1 className="text-[15vw] font-black italic leading-none">AETHER</h1>
        </div>
      )}

      {/* Floating Meta Info */}
      <div className="w-full flex justify-between items-center opacity-20 text-[8px] tracking-[0.4em] font-bold uppercase mt-auto">
        <span>Live Meteorology</span>
        <span>{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
      </div>
    </div>
  );
}

export default App;