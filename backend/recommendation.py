
import requests 
import time 
from datetime import datetime, timedelta, timezone
from math import radians, sin, cos, sqrt, atan2
from supabase_client import supabase

def distance_between(lat1, lon1, lat2, lon2):
    R = 6371
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c

def get_demand_last_24h(station_id):
    since = datetime.now(timezone.utc) - timedelta(hours = 24)
    result = (
        supabase.table("borrow_logs")
        .select("umbrella_id, umbrellas!inner(location_id)")
        .eq("umbrellas.location_id", station_id)
        .gte("borrowed_at", since.isoformat())
        .execute()
    )
    return len(result.data)

def get_supply(station):
    return station["current_count"] 

_weather_cache = {}
CACHE_DURATION = 600

def get_weather_risk(lat, lon):
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "hourly": "precipitation_probability",
        "forecast_days": 1,
        "timezone": "auto"
    }

    try:
        response = requests.get(url, params = params, timeout = 5)
        response.raise_for_status()
        data = response.json()

        hourly_times = data["hourly"]["time"]
        hourly_probs = data["hourly"]["precipitation_probability"]

        now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:00")
        idx = hourly_times.index(now) if now in hourly_times else 0

        next_hours = hourly_probs[idx:idx + 3]
        avg_prob = sum(next_hours) / len(next_hours) if next_hours else 0
        return avg_prob / 100

    except requests.RequestException as e:
        print(f"Weather API error: {e}")
        return 0.0
    
def get_weather_risk_cached(lat, lon):
    key = (round(lat, 2), round(lon, 2))
    now = time.time()

    if key in _weather_cache:
        cached_value, cached_time = _weather_cache[key]
        if now - cached_time < CACHE_DURATION:
            return cached_value

    value = get_weather_risk(lat, lon)
    _weather_cache[key] = (value, now)
    return value

def score_station(station, user_lat, user_lon):
    demand = get_demand_last_24h(station["station_id"])
    supply = get_supply(station)
    distance = distance_between(user_lat, user_lon, station["lat"], station["lon"])
    weather_risk = get_weather_risk_cached(station["lat"], station["lon"])

    demand_norm = min(demand / 20, 1)
    supply_norm = min(supply / station["capacity"], 1)
    distance_norm = 1 / (1 + distance)

    score = (0.4 * demand_norm) - (0.3 * supply_norm) + (0.2 * distance_norm) + (0.1 * weather_risk)
    return score

def get_top_recommendations(user_lat, user_lon, limit=3):
    stations = supabase.table("stations").select("*").execute().data
    scored = [
        {**s, "score": score_station(s, user_lat, user_lon)}
        for s in stations
    ]
    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored[:limit]