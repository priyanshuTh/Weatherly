$(document).ready(function () {
  // Constants
  const API_KEY = "95425a4f1ff33420efb87cc0706610af";
  const WEATHER_API_BASE = "https://api.openweathermap.org/data/2.5/weather";
  const WEATHER_MAP_TILE_BASE = "https://tile.openweathermap.org/map";

  // Global variables
  let weatherMap;
  let locationClockInterval = null;

  // Navbar brand click handler
  $(".navbar-brand").click(function (e) {
    e.preventDefault();
    window.location.reload();
  });

  // Preloader Handling with performance optimization
  const initPreloader = () => {
    setTimeout(() => {
      $(".preloader").addClass("active");
      setTimeout(() => {
        $(".preloader").fadeOut(500, () => {
          document.body.classList.add("loaded");
        });
      }, 1000);
    }, 500);
  };
  initPreloader();

  // Cookie Notice Management
  const cookieManager = (() => {
    const hasSeenCookieNotice = () =>
      document.cookie.includes("noticeSeen=true");

    const showCookieNotice = () => {
      if (!hasSeenCookieNotice()) {
        setTimeout(() => $(".cookie-consent").addClass("active"), 2000);
      }
    };

    const dismissCookieNotice = () => {
      const date = new Date();
      date.setFullYear(date.getFullYear() + 1);
      document.cookie = `noticeSeen=true; expires=${date.toUTCString()}; path=/`;
      $(".cookie-consent").removeClass("active");
    };

    return { showCookieNotice, dismissCookieNotice };
  })();

  $("#dismissCookieNotice").click(cookieManager.dismissCookieNotice);
  cookieManager.showCookieNotice();

  // Theme Toggle with localStorage caching
  const themeManager = (() => {
    const toggleTheme = () => {
      $("body").toggleClass("dark-mode");
      const isDarkMode = $("body").hasClass("dark-mode");

      $("#themeToggle i")
        .removeClass(isDarkMode ? "bi-moon-stars" : "bi-sun")
        .addClass(isDarkMode ? "bi-sun" : "bi-moon-stars");

      localStorage.setItem("theme", isDarkMode ? "dark" : "light");

      // Update preloader if it's still visible
      if (isDarkMode && !document.body.classList.contains("loaded")) {
        $(".preloader").css("background-color", "#1a1a1a");
        $(".preloader .text-muted").css("color", "#adb5bd");
      }
    };

    const initTheme = () => {
      const savedTheme = localStorage.getItem("theme") || "light";
      if (savedTheme === "dark") {
        $("body").addClass("dark-mode");
        $("#themeToggle i").removeClass("bi-moon-stars").addClass("bi-sun");
        $(".preloader").css("background-color", "#1a1a1a");
        $(".preloader .text-muted").css("color", "#adb5bd");
      }
    };

    return { toggleTheme, initTheme };
  })();

  $("#themeToggle").click(function (e) {
    e.preventDefault();
    themeManager.toggleTheme();
  });

  themeManager.initTheme();

  // Seasonal Background
  const updateSeasonalBackground = () => {
    const date = new Date();
    const month = date.getMonth();
    let season, backgroundImage;

    if (month >= 2 && month <= 4) {
      season = "spring";
      backgroundImage = "assets/images/spring.jpg";
    } else if (month >= 5 && month <= 7) {
      season = "summer";
      backgroundImage = "assets/images/summer.jpg";
    } else if (month >= 8 && month <= 10) {
      season = "autumn";
      backgroundImage = "assets/images/autumn.jpg";
    } else {
      season = "winter";
      backgroundImage = "assets/images/winter.jpg";
    }

    $(".hero-section").css("background-image", `url('${backgroundImage}')`);
    $(".hero-section").attr("data-season", season);
  };
  updateSeasonalBackground();

  // Weather Map Functionality
  const initWeatherMap = () => {
    if (weatherMap) return; // Map already initialized

    weatherMap = L.map("weatherMap").setView([0, 0], 2);

    // Base layers
    const baseLayers = {
      "Street Map": L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?lang=en",
        {
          attribution: "© OpenStreetMap contributors",
        }
      ),
    };

    // Overlay layers
    const overlayMaps = {
      Temperature: L.tileLayer(
        `${WEATHER_MAP_TILE_BASE}/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
        { maxZoom: 20, opacity: 0.5 }
      ),
      "Wind Speed": L.tileLayer(
        `${WEATHER_MAP_TILE_BASE}/wind_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
        { maxZoom: 20, opacity: 0.5 }
      ),
      Precipitation: L.tileLayer(
        `${WEATHER_MAP_TILE_BASE}/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
        { maxZoom: 20, opacity: 0.5 }
      ),
    };

    // Add default layers
    baseLayers["Street Map"].addTo(weatherMap);
    overlayMaps["Temperature"].addTo(weatherMap);

    // Add layer control
    L.control
      .layers(baseLayers, overlayMaps, {
        collapsed: false,
        position: "bottomright",
      })
      .addTo(weatherMap);

    // Fix Leaflet rendering issues in Bootstrap modal
    setTimeout(() => {
      weatherMap.invalidateSize();
    }, 100);
  };

  $("#mapsModal").on("shown.bs.modal", initWeatherMap);

  // Weather Search Functionality
  $("#searchForm").submit(async function (e) {
    e.preventDefault();
    const location = $(this).find("input").val().trim();
    if (location) {
      await performSearch(location);
    } else {
      showToast("Please enter a location to search");
    }
  });

  // OpenWeatherMap API Integration
  async function getWeatherData(location) {
    const url = `${WEATHER_API_BASE}?q=${encodeURIComponent(
      location
    )}&appid=${API_KEY}&units=metric`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Weather data unavailable");
      }
      return await response.json();
    } catch (error) {
      if (error.message === "Failed to fetch") {
        throw new Error("Network error - please check your connection");
      }
      throw error;
    }
  }

  // Function to update the location time based on timezone offset
  function updateLocationTime(timezoneOffset) {
    // Get current UTC time in milliseconds
    const now = new Date();
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;

    // Calculate location time using timezone offset (in seconds)
    const locationTime = new Date(utcTime + timezoneOffset * 1000);

    // Format the time
    const timeString = locationTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    // Format the date
    const dateString = locationTime.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Update the UI
    $("#locationTime").text(timeString);
    $("#locationDate").text(dateString);
  }

  // Function to start the location clock
  function startLocationClock(timezoneOffset) {
    // Clear any existing interval
    if (locationClockInterval) {
      clearInterval(locationClockInterval);
    }

    // Update time immediately
    updateLocationTime(timezoneOffset);

    // Set interval to update time every second
    locationClockInterval = setInterval(() => {
      updateLocationTime(timezoneOffset);
    }, 1000);
  }

  // Storage manager for recent searches
  const storageManager = (() => {
    const STORAGE_KEY = "recentSearches";
    const MAX_SEARCHES = 5;

    const getSearches = () => {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      } catch {
        localStorage.setItem(STORAGE_KEY, "[]");
        return [];
      }
    };

    const addSearch = (location) => {
      const normalizedLocation = location.trim();
      if (!normalizedLocation) return;

      let searches = getSearches();

      // Remove duplicates (case-insensitive)
      searches = searches.filter(
        (item) => item.toLowerCase() !== normalizedLocation.toLowerCase()
      );

      // Add to top
      searches.unshift(normalizedLocation);

      // Limit to max searches
      searches = searches.slice(0, MAX_SEARCHES);

      // Save back to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
    };

    return { getSearches, addSearch };
  })();

  // Weather Display Function
  function displayWeather(data) {
    // Remove d-none class to make container visible
    $("#weatherResults").removeClass("d-none");

    // Reset any previous animation/transition classes
    $("#weatherResults").removeClass("show");
    $(".weather-card").removeClass("show");

    // Main Information
    $("#locationName").text(`${data.name}, ${data.sys.country}`);
    $("#weatherDescription").text(data.weather[0].description);

    // Fix for weather icon
    $("#weatherIcon").html(
      `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" 
       alt="${data.weather[0].description}" 
       class="img-fluid shadow-sm rounded"
       width="120" 
       height="120">`
    );

    // Start the local time interval with timezone
    startLocationClock(data.timezone);

    // Weather Data
    $("#temp").text(`${Math.round(data.main.temp)}°C`);
    $("#tempMinMax").html(
      `${Math.round(data.main.temp_min)}°C / ${Math.round(
        data.main.temp_max
      )}°C`
    );
    $("#feelsLike").html(`${Math.round(data.main.feels_like)}°C`);
    $("#humidity").text(`${data.main.humidity}%`);
    $("#windSpeed").html(
      `${data.wind.speed} m/s <i class="bi bi-arrow-up fs-6 ms-1" 
       style="transform: rotate(${data.wind.deg || 0}deg)"></i>`
    );
    $("#pressure").text(`${data.main.pressure} hPa`);
    $("#cloudCover").text(`${data.clouds.all}%`);

    // Sunrise/Sunset
    const formatTime = (timestamp) =>
      new Date(timestamp * 1000).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

    $("#sunrise").text(formatTime(data.sys.sunrise));
    $("#sunset").text(formatTime(data.sys.sunset));

    // Update map markers if the map exists
    if (weatherMap) {
      // Remove existing markers
      weatherMap.eachLayer((layer) => {
        if (layer instanceof L.Marker) weatherMap.removeLayer(layer);
      });

      // Add new marker
      const marker = L.marker([data.coord.lat, data.coord.lon]).addTo(
        weatherMap
      ).bindPopup(`
          <div class="map-popup">
            <h6 class="mb-1">${data.name}</h6>
            <div class="row small">
              <div class="col-6">
                <i class="bi bi-thermometer"></i> ${Math.round(
                  data.main.temp
                )}°C<br>
                <i class="bi bi-wind"></i> ${data.wind.speed} m/s
              </div>
              <div class="col-6">
                <i class="bi bi-droplet"></i> ${data.main.humidity}%<br>
                <i class="bi bi-clouds"></i> ${data.clouds.all}%
              </div>
            </div>
          </div>
        `);

      weatherMap.setView([data.coord.lat, data.coord.lon], 8);
    }

    // Add animation class after a small delay for smooth transition
    // Apply to both the container and the card itself for proper animation
    setTimeout(() => {
      $("#weatherResults").addClass("show");
      $(".weather-card").addClass("show");
    }, 100);
  }

  // Update recent searches UI
  function updateRecentSearches() {
    const searches = storageManager.getSearches();
    const $container = $(".recent-searches");

    $container.empty();

    if (searches.length > 0) {
      searches.forEach((location) => {
        const safeLocation = $("<div>").text(location).html();
        $container.append(`
          <a href="#" class="list-group-item list-group-item-action bg-transparent border-0 d-flex align-items-center" 
             data-location="${safeLocation}">
            <i class="bi bi-geo-alt me-2"></i>
            ${safeLocation}
          </a>
        `);
      });
      $(".recent-places p").addClass("d-none");
    } else {
      $(".recent-places p").removeClass("d-none");
    }
  }

  // Click handler for recent searches - Fixed to ensure it works properly
  $(document).on("click", ".recent-searches [data-location]", function (e) {
    e.preventDefault();
    const location = $(this).data("location");
    $("#searchInput").val(location);
    performSearch(location);
  });

  // Main search function
  async function performSearch(location) {
    try {
      if (!location) {
        showToast("Please enter a location to search");
        return;
      }

      // Clear existing interval before new search
      if (locationClockInterval) {
        clearInterval(locationClockInterval);
      }

      showToast(`Searching for ${location}...`);

      // Hide weather results with animation
      $("#weatherResults").removeClass("show");
      $(".weather-card").removeClass("show");

      // Use timeout to ensure animation completes before hiding
      setTimeout(async () => {
        $("#weatherResults").addClass("d-none");

        try {
          const weatherData = await getWeatherData(location);
          displayWeather(weatherData);
          storageManager.addSearch(location);
          updateRecentSearches();
        } catch (error) {
          showToast(error.message || "Failed to get weather data");
        }
      }, 300);
    } catch (error) {
      showToast(error.message || "Failed to get weather data");
    }
  }

  // Toast Notification with improved memory management
  function showToast(message) {
    const toastId = "toast-" + Date.now();
    const toast = `
      <div id="${toastId}" class="toast" role="alert">
        <div class="toast-header">
          <i class="bi bi-info-circle text-primary me-2"></i>
          <strong class="me-auto">Weatherly</strong>
          <small>${new Date().toLocaleTimeString()}</small>
          <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">
          ${message}
        </div>
      </div>`;

    $("#toast-container").append(toast);

    // Apply Bootstrap toast with custom options
    const toastElement = document.getElementById(toastId);
    const bsToast = new bootstrap.Toast(toastElement, {
      animation: true,
      autohide: true,
      delay: 3000,
    });

    bsToast.show();

    // Remove toast from DOM after it's hidden to prevent memory leaks
    $(toastElement).on("hidden.bs.toast", function () {
      $(this).remove();
    });
  }

  // Video Controls with optimized event handlers
  $("video").on({
    mouseenter: function () {
      if (this.paused) {
        $(this).attr("title", "Click to play");
        new bootstrap.Tooltip(this).show();
      }
    },
    mouseleave: function () {
      $(this).removeAttr("title");
      const tooltip = bootstrap.Tooltip.getInstance(this);
      if (tooltip) tooltip.dispose();
    },
    click: function () {
      this.paused ? this.play() : this.pause();
    },
  });

  // Initialize all tooltips with delay for better performance
  setTimeout(function () {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    [...tooltipTriggerList].forEach((tooltipTriggerEl) => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }, 2000);

  // Smooth scrolling with optimized animation
  $('a[href^="#"]:not([data-bs-toggle])').on("click", function (e) {
    e.preventDefault();
    const target = $($(this).attr("href"));
    if (target.length) {
      $("html, body").animate(
        {
          scrollTop: target.offset().top - 70,
        },
        800
      );
    }
  });

  // Location Permission Handler
  const locationHandler = (() => {
    const PERMISSION_KEY = "locationPermission";

    const checkPermission = () => {
      const permission = localStorage.getItem(PERMISSION_KEY);

      if (!permission) {
        $("#locationModal").modal("show");
      } else if (permission === "granted") {
        requestLocation();
      }
    };

    const grantPermission = () => {
      localStorage.setItem(PERMISSION_KEY, "granted");
      $("#locationModal").modal("hide");
      requestLocation();
    };

    const denyPermission = () => {
      localStorage.setItem(PERMISSION_KEY, "denied");
      $("#locationModal").modal("hide");
      showToast("Enable location access in settings or search manually");
    };

    return { checkPermission, grantPermission, denyPermission };
  })();

  // Event handlers for Allow/Deny buttons
  $("#allowLocation").click(locationHandler.grantPermission);
  $("#denyLocation").click(locationHandler.denyPermission);

  // Request user location and get weather
  function requestLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getWeatherByCoords(latitude, longitude);
        },
        (error) => {
          showToast("Location access denied. Search for a location manually.");
          $("#locationModal").modal("hide");
        },
        { timeout: 10000 } // Add timeout to prevent hanging
      );
    } else {
      showToast("Geolocation not supported - search manually");
      $("#locationModal").modal("hide");
    }
  }

  // Get weather by coordinates
  async function getWeatherByCoords(lat, lon) {
    const url = `${WEATHER_API_BASE}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Weather data unavailable");
      }

      const data = await response.json();
      displayWeather(data);
      storageManager.addSearch(data.name);
      updateRecentSearches();
    } catch (error) {
      showToast("Couldn't get location weather. Search manually instead.");
    }
  }

  // Initialize recent searches on page load
  updateRecentSearches();

  // Check location permission
  setTimeout(() => {
    locationHandler.checkPermission();
  }, 1500); // Added delay to ensure DOM is ready
});
