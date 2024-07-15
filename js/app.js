
document.addEventListener('DOMContentLoaded', () => {
    let map;
    let markers = [];
    let hospitalMarkers = []; // Array to store hospital markers separately

    // Initialize the map
    function initMap() {
        map = L.map('map').setView([20.5937, 78.9629], 5); // Default center on India

        // Add the OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map);

        // Try to fetch user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const { latitude, longitude } = position.coords;
                map.setView([latitude, longitude], 13);
                clearMarkers();
                fetchAQIAndAddMarker(latitude, longitude);
            }, error => {
                console.error('Error getting user location:', error);
                alert('Error getting your location. Please use the search instead.');
            });
        } else {
            console.error('Geolocation is not supported by this browser.');
            alert('Geolocation is not supported by this browser. Please use the search instead.');
        }
    }

    // Function to fetch AQI and add marker
    function fetchAQIAndAddMarker(lat, lon) {
        const token = '2a80c9e3e2f9706b5c321f7bf4e64f47c1548f43'; // Replace with your AQICN API token
        const url = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${token}`;

        axios.get(url)
            .then(response => {
                if (response.data.status === 'ok') {
                    const data = response.data.data;
                    const aqi = data.aqi;

                    // Create marker icon with color based on AQI
                    const markerColor = getMarkerColor(aqi);
                    const markerIcon = L.icon({
                        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${markerColor}.png`,
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    });

                    // Add marker to the map with AQI as a popup and custom icon
                    const marker = L.marker([lat, lon], { icon: markerIcon }).addTo(map)
                        .bindPopup(`
                            <div>
                                <p>AQI: ${aqi}</p>
                                <p>PM2.5: ${data.iaqi.pm25 ? data.iaqi.pm25.v : 'N/A'} µg/m³</p>
                                <p>PM10: ${data.iaqi.pm10 ? data.iaqi.pm10.v : 'N/A'} µg/m³</p>
                                <p>Ozone (O3): ${data.iaqi.o3 ? data.iaqi.o3.v : 'N/A'} µg/m³</p>
                                <p>Nitrogen Dioxide (NO2): ${data.iaqi.no2 ? data.iaqi.no2.v : 'N/A'} µg/m³</p>
                                <p>Sulfur Dioxide (SO2): ${data.iaqi.so2 ? data.iaqi.so2.v : 'N/A'} µg/m³</p>
                                <p>Carbon Monoxide (CO): ${data.iaqi.co ? data.iaqi.co.v : 'N/A'} µg/m³</p>
                            </div>
                        `).openPopup();

                    markers.push(marker);

                    // Update sidebar and category card with AQI information
                    updateSidebar(data);
                    updateAQICategoryCard(aqi);
                } else {
                    console.error('Error fetching AQI data:', response.data.data);
                    alert('Error fetching AQI data. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error fetching AQI data:', error);
                alert('Error fetching AQI data. Please try again.');
            });
    }

    // Function to clear all markers from the map
    function clearMarkers() {
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];
    }

    // Function to update the sidebar with AQI information
    function updateSidebar(data) {
        document.getElementById('aqi').textContent = data.aqi;
        document.getElementById('pm25').textContent = data.iaqi.pm25 ? data.iaqi.pm25.v : 'N/A';
        document.getElementById('pm10').textContent = data.iaqi.pm10 ? data.iaqi.pm10.v : 'N/A';
        document.getElementById('o3').textContent = data.iaqi.o3 ? data.iaqi.o3.v : 'N/A';
        document.getElementById('no2').textContent = data.iaqi.no2 ? data.iaqi.no2.v : 'N/A';
        document.getElementById('so2').textContent = data.iaqi.so2 ? data.iaqi.so2.v : 'N/A';
        document.getElementById('co').textContent = data.iaqi.co ? data.iaqi.co.v : 'N/A';
    }

    // Function to update the AQI category card
    function updateAQICategoryCard(aqi) {
        const aqiCategory = getAQICategory(aqi);
        document.getElementById('aqi-category').textContent = aqiCategory;
    }

    // Function to get marker color based on AQI
    function getMarkerColor(aqi) {
        if (aqi <= 50) return 'green';
        if (aqi <= 100) return 'yellow';
        if (aqi <= 150) return 'orange';
        if (aqi <= 200) return 'red';
        if (aqi <= 300) return 'purple';
        return 'darkred';
    }

    // Function to get AQI category based on AQI value
    function getAQICategory(aqi) {
        if (aqi <= 50) return 'Good';
        if (aqi <= 100) return 'Moderate';
        if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
        if (aqi <= 200) return 'Unhealthy';
        if (aqi <= 300) return 'Very Unhealthy';
        return 'Hazardous';
    }

    // Show AQI categories when button is clicked
    document.getElementById('show-categories').addEventListener('click', function() {
        var categoriesList = document.getElementById('categories-list');
        if (categoriesList.style.display === 'none') {
            categoriesList.style.display = 'block';
            this.textContent = 'Hide AQI Categories';
        } else {
            categoriesList.style.display = 'none';
            this.textContent = 'Show All AQI Categories';
        }
    });

    // Search form submission event
    document.getElementById('search-form').addEventListener('submit', event => {
        event.preventDefault();
        const location = document.getElementById('location-input').value;
        if (location) {
            axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`)
                .then(response => {
                    if (response.data.length > 0) {
                        const { lat, lon } = response.data[0];
                        map.setView([lat, lon], 13);
                        clearMarkers();
                        fetchAQIAndAddMarker(lat, lon);
                    } else {
                        alert('Location not found. Please try another location.');
                    }
                })
                .catch(error => {
                    console.error('Error fetching location data:', error);
                    alert('Error fetching location data. Please try again.');
                });
        }
    });

    // Function to find nearby hospitals
    function findNearbyHospitals(lat, lon) {
        const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node(around:5000,${lat},${lon})[amenity=hospital];out;`;

        fetch(overpassUrl)
            .then(response => response.json())
            .then(data => {
                data.elements.forEach(hospital => {
                    const marker = L.marker([hospital.lat, hospital.lon]).addTo(map)
                        .bindPopup(`<p>Hospital: ${hospital.tags.name || 'Unknown'}</p>`);
                    hospitalMarkers.push(marker); // Add hospital markers to hospitalMarkers array
                });
            })
            .catch(error => {
                console.error('Error fetching hospitals:', error);
                alert('Error fetching nearby hospitals. Please try again.');
            });
    }

    // Function to clear hospital markers
    function clearHospitalMarkers() {
        hospitalMarkers.forEach(marker => map.removeLayer(marker));
        hospitalMarkers = [];
    }

    // Event listener for the "Find Help" button
    document.getElementById('find-help').addEventListener('click', (event) => {
        const button = event.target;
        if (button.textContent === 'Find Help') {
            const center = map.getCenter();
            findNearbyHospitals(center.lat, center.lng);
            button.textContent = 'Clear';
        } else {
            clearHospitalMarkers();
            button.textContent = 'Find Help';
        }
    });

    // Initialize the map
    initMap();
});
