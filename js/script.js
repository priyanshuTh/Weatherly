$(document).ready(function () {
  // Navbar brand click handler
  $(".navbar-brand").click(function (e) {
    e.preventDefault();
    window.location.reload();
  });

  // Preloader Handling
  setTimeout(() => {
    $(".preloader").addClass("active");
    setTimeout(() => {
      $(".preloader").fadeOut(500, () => {
        document.body.classList.add("loaded");
      });
    }, 1000);
  }, 500);

  // Cookie Notice Management
  function hasSeenCookieNotice() {
    return document.cookie.includes("noticeSeen=true");
  }

  function showCookieNotice() {
    if (!hasSeenCookieNotice()) {
      setTimeout(function () {
        $(".cookie-consent").addClass("active");
      }, 2000);
    }
  }

  function dismissCookieNotice() {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    document.cookie = `noticeSeen=true; expires=${date.toUTCString()}; path=/`;
    $(".cookie-consent").removeClass("active");
  }

  $("#dismissCookieNotice").click(dismissCookieNotice);
  showCookieNotice();

  // Theme Toggle
  $("#themeToggle").click(function (e) {
    e.preventDefault();
    $("body").toggleClass("dark-mode");

    if ($("body").hasClass("dark-mode")) {
      $("#themeToggle i").removeClass("bi-moon-stars").addClass("bi-sun");
    } else {
      $("#themeToggle i").removeClass("bi-sun").addClass("bi-moon-stars");
    }

    localStorage.setItem(
      "theme",
      $("body").hasClass("dark-mode") ? "dark" : "light"
    );
  });

  // Initialize Theme
  const savedTheme = localStorage.getItem("theme") || "light";
  $("body").toggleClass("dark-mode", savedTheme === "dark");

  if (savedTheme === "dark") {
    $("#themeToggle i").removeClass("bi-moon-stars").addClass("bi-sun");
    $(".preloader").css("background-color", "#1a1a1a");
    $(".preloader .text-muted").css("color", "#adb5bd");
  }

  // Seasonal Background
  function updateSeasonalBackground() {
    const date = new Date();
    const month = date.getMonth();
    let season;
    let backgroundImage;

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
  }
  updateSeasonalBackground();

  // Weather Map Functionality
  let weatherMap;
  $("#mapsModal").on("shown.bs.modal", function () {
    if (!weatherMap) {
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
          `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=95425a4f1ff33420efb87cc0706610af`,
          { maxZoom: 20, opacity: 0.5 }
        ),
        "Wind Speed": L.tileLayer(
          `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=95425a4f1ff33420efb87cc0706610af`,
          { maxZoom: 20, opacity: 0.5 }
        ),
        Precipitation: L.tileLayer(
          `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=95425a4f1ff33420efb87cc0706610af`,
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
    }
  });

  // Weather Search Functionality
  $("#searchForm").submit(async function (e) {
    e.preventDefault();
    const location = $(this).find("input").val().trim();
    if (location) {
      await performSearch(location);
    }
  });

  // OpenWeatherMap API Integration
  async function getWeatherData(location) {
    const API_KEY = "95425a4f1ff33420efb87cc0706610af";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      location
    )}&appid=${API_KEY}&units=metric`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Weather data unavailable");
      return await response.json();
    } catch (error) {
      if (error.message === "Failed to fetch") {
        throw new Error("Network error - please check your connection");
      }
      throw error;
    }
  }

  // Weather Display Function
  function displayWeather(data) {
    $("#weatherResults").removeClass("d-none");

    // Main Information
    $("#locationName").text(`${data.name}, ${data.sys.country}`);
    $("#weatherDescription").text(data.weather[0].description);
    $("#weatherIcon").html(
      `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" 
       alt="${data.weather[0].description}" 
       class="img-fluid shadow-sm rounded"
       width="200" 
       height="200">`
    );

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

    // Update map markers
    weatherMap.eachLayer((layer) => {
      if (layer instanceof L.Marker) weatherMap.removeLayer(layer);
    });

    const marker = L.marker([data.coord.lat, data.coord.lon]).addTo(weatherMap)
      .bindPopup(`
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

  function addRecentSearch(location) {
    const normalizedLocation = location.trim().toLowerCase();
    let searches = JSON.parse(localStorage.getItem("recentSearches") || "[]");

    // Remove duplicates (case-insensitive)
    searches = searches.filter(
      (item) => item.toLowerCase() !== normalizedLocation
    );
    searches.unshift(location); // Add to top

    localStorage.setItem(
      "recentSearches",
      JSON.stringify(searches.slice(0, 5))
    );
    updateRecentSearches();
  }

  function updateRecentSearches() {
    let searches = [];
    try {
      searches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    } catch {
      localStorage.setItem("recentSearches", "[]");
    }

    $(".recent-searches").empty();

    if (searches.length > 0) {
      searches.forEach((location) => {
        const safeLocation = $("<div>").text(location).html();
        $(".recent-searches").append(`
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

  $(".recent-searches").on("click", "[data-location]", function (e) {
    e.preventDefault();
    const location = $(this).data("location");
    $("#searchInput").val(location);
    performSearch(location);
  });

  // Search Function
  async function performSearch(location) {
    try {
      if (!location) {
        showToast("Please enter a location to search");
        return;
      }

      showToast(`Searching for ${location}...`);
      $("#weatherResults").addClass("d-none");
      const weatherData = await getWeatherData(location);
      displayWeather(weatherData);
      addRecentSearch(location);
    } catch (error) {
      showToast(error.message || "Failed to get weather data");
    }
  }

  // Toast Notification
  function showToast(message) {
    const toastId = "toast-" + Date.now();
    const toast = `
      <div id="${toastId}" class="toast" role="alert">
        <div class="toast-header">
          <strong class="me-auto">Weatherly</strong>
          <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">${message}</div>
      </div>`;

    $("#toast-container").append(toast);
    new bootstrap.Toast(document.getElementById(toastId)).show();
    $(`#${toastId}`).on("hidden.bs.toast", () => $(this).remove());
  }

  // Video Controls
  $("video").on({
    mouseenter: function () {
      if (this.paused) {
        $(this).attr("title", "Click to play");
        new bootstrap.Tooltip(this).show();
      }
    },
    mouseleave: function () {
      $(this).removeAttr("title");
      bootstrap.Tooltip.getInstance(this)?.dispose();
    },
    click: function () {
      this.paused ? this.play() : this.pause();
    },
  });

  // Initialize all tooltips
  setTimeout(function () {
    var tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.forEach(function (tooltipTriggerEl) {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }, 2000);

  // Smooth scrolling
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

  // Location Permission Handling
  const locationPermission = localStorage.getItem("locationPermission");
  if (!locationPermission) {
    $("#locationModal").modal("show");
  } else if (locationPermission === "granted") {
    requestLocation(); // Auto-fetch weather if permission granted
  }

  // Event handlers for Allow/Deny buttons (keep only one set)
  $("#allowLocation").click(function () {
    localStorage.setItem("locationPermission", "granted");
    $("#locationModal").modal("hide");
    requestLocation();
  });

  $("#denyLocation").click(function () {
    localStorage.setItem("locationPermission", "denied");
    $("#locationModal").modal("hide");
    showToast("Enable location access or search manually");
  });

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
        }
      );
    } else {
      showToast("Geolocation not supported - search manually");
      $("#locationModal").modal("hide");
    }
  }

  async function getWeatherByCoords(lat, lon) {
    const API_KEY = "95425a4f1ff33420efb87cc0706610af";
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Weather data unavailable");
      const data = await response.json();
      displayWeather(data);
      addRecentSearch(data.name);
    } catch (error) {
      showToast("Couldn't get location weather. Search manually instead.");
    }
  }
});
