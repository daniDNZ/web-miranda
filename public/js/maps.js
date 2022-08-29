import hotelLocations from '../mapsData/hotelLocations.json' assert { type: "json"};

function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
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
}

window.initMap = initMap;