import hotelLocations from '../mapsData/hotelLocations.json' assert { type: "json"};

function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 6,
    center: {
      lat: 40.343842,
      lng: -3.535011,
    },
  });

  const infoWindow = new google.maps.InfoWindow({
    content: ''
  });

  const icon = {
    url: '../svg/maps/markerIcon.svg'
  }

  const markers = hotelLocations.map((position) => {
    const marker = new google.maps.Marker({
      position: { lat: position.lat, lng: position.lng },
      name: position.name,
      icon: icon
    });

    marker.addListener("click", () => {
      infoWindow.setContent(marker.name);
      infoWindow.open(map, marker);
    });
    return marker;
  });
  const markerCluster = new markerClusterer.MarkerClusterer({ map, markers });

  // Geolocation

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        infoWindow.setPosition(pos);
        infoWindow.setContent("Your location.");
        map.setCenter(pos);

        const geoMarker = new google.maps.Marker({
          position: pos,
          map: map,
          name: 'You'
        });

        // Find nearest location
        const findNearestLocationButton = document.querySelector('#findNearestLocationButton');
        findNearestLocationButton.addEventListener('click', () => configureMatrixService(pos, hotelLocations));
      },
      () => {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    handleLocationError(false, infoWindow, map.getCenter());
  }


}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

function configureMatrixService(origin, destinations) {
  const service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix(
    {
      origins: [origin],
      destinations,
      travelMode: 'DRIVING'
    },
    listNearestLocations
  );

  function listNearestLocations(response, status) {
    if (status === 'OK') {

      const locationsUl = document.querySelector('#nearestLocationsList');
      const nearestLocations = makeList(response);

      nearestLocations.sort((a, b) => a.durationValue - b.durationValue);
      nearestLocations.forEach(location => {
        const li = document.createElement('li');
        li.textContent = `${location.duration} - ${location.distance} - ${location.to}`;
        locationsUl.appendChild(li);
      }
      )
    }
  }

  function makeList(response) {
    const origins = response.originAddresses;
    const destinations = response.destinationAddresses;
    const nearestLocations = [];

    for (let i = 0; i < origins.length; i++) {
      const results = response.rows[i].elements;
      for (let j = 0; j < results.length; j++) {
        const element = results[j];
        const distance = element.distance.text;
        const duration = element.duration.text;
        const durationValue = element.duration.value;
        const from = origins[i];
        const to = destinations[j];

        nearestLocations.push({ distance, duration, durationValue, from, to });
      }
    }

    return nearestLocations;
  }
}


window.initMap = initMap;