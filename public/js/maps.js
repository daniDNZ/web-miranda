import hotelLocations from '../mapsData/hotelLocations.json' assert { type: "json"};
import comunidadesEspana from '../mapsData/comunidadesEspana.json' assert { type: "json"};

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
      icon: icon,
    });

    marker.addListener("click", () => {
      infoWindow.setContent(marker.name);
      infoWindow.open(map, marker);
    });
    return marker;
  });
  const markerCluster = new markerClusterer.MarkerClusterer({ map, markers });

  // Geolocation
  let geoPos = {};
  const userMarker = new google.maps.Marker({
    position: { lat: 0, lng: 0 },
    map: map,
    name: 'You'
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        geoPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        userMarker.addListener("click", () => {
          infoWindow.setContent("Your location.");
          infoWindow.open(map, userMarker);
        });

        map.setCenter(geoPos);

        userMarker.setPosition(geoPos);

      },
      () => {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    handleLocationError(false, infoWindow, map.getCenter());
  }



  // List nearest locations
  const geocoder = new google.maps.Geocoder();

  const findNearestLocationButton = document.querySelector('#findNearestLocationButton');
  findNearestLocationButton.addEventListener('click', () => {
    const address = document.querySelector('#stringAddress').value;
    let originLocation = {};

    if (address.length > 0) {

      geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == 'OK') {
          originLocation = results[0].geometry.location;
          map.setCenter(originLocation);
          userMarker.setPosition(originLocation);
          configureMatrixService(originLocation, hotelLocations)
        } else {
          console.error('Geocode was not successful for the following reason: ' + status);
        }
      });

    } else if (navigator.geolocation) {
      originLocation = { ...geoPos };
      configureMatrixService(originLocation, hotelLocations)
    }
  });

  // Select by Comunidad Autónoma

  const comunidadesAutonomas = [
    'Andalucía',
    'Aragón',
    'Asturias, Principado de',
    'Balears, Illes',
    'Canarias',
    'Cantabria',
    'Castilla y León',
    'Castilla - La Mancha',
    'Cataluña / Catalunya',
    'Comunitat Valenciana',
    'Extremadura',
    'Galicia',
    'Madrid, Comunidad de',
    'Murcia, Región de',
    'Navarra, Comunidad Foral de',
    'País Vasco / Euskadi',
    'Rioja, La',
    'Ceuta',
    'Melilla',
  ];

  const cASelect = document.querySelector('#comunidadAutonoma');
  comunidadesAutonomas.forEach(ca => {
    const option = document.createElement('option');
    option.textContent = ca;
    option.value = ca;
    cASelect.appendChild(option);
  })

  cASelect.addEventListener('change', (e) => selectCA(e.target.value));

  function selectCA(ca) {
    const cAIndex = comunidadesAutonomas.indexOf(ca);
    const polygonCoords = [];

    if (cAIndex >= 0) {

      comunidadesEspana[cAIndex].forEach(subArr =>
        polygonCoords.push(subArr)
      );

      // Construct the polygon.
      const polygon = new google.maps.Polygon({
        paths: polygonCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
      });

      polygon.setMap(map);

      cASelect.addEventListener('change', () => polygon.setMap(null));

      // Markers 
      markerCluster.clearMarkers();
      const markers = [];
      hotelLocations.forEach((position) => {
        if (position.com === cAIndex) {
          const marker = new google.maps.Marker({
            position: { lat: position.lat, lng: position.lng },
            name: position.name,
            icon: icon,
          });

          marker.addListener("click", () => {
            infoWindow.setContent(marker.name);
            infoWindow.open(map, marker);
          });
          markers.push(marker);
        }
      });
      markerCluster.addMarkers(markers);

    } else {

      markerCluster.clearMarkers();
      const markers = [];
      hotelLocations.forEach((position) => {
        const marker = new google.maps.Marker({
          position: { lat: position.lat, lng: position.lng },
          name: position.name,
          icon: icon,
        });

        marker.addListener("click", () => {
          infoWindow.setContent(marker.name);
          infoWindow.open(map, marker);
        });
        markers.push(marker);
      });
      markerCluster.addMarkers(markers);
    }

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
      locationsUl.innerHTML = '';
      const nearestLocations = makeList(response);

      nearestLocations.sort((a, b) => a.durationValue - b.durationValue);
      nearestLocations.forEach(location => {
        const li = document.createElement('li');
        li.classList.add('map-list__li');
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