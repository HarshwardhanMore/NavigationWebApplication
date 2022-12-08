
var APIKEY = "K2nCMuWYTOq3C83CpyiEPLSmdOONUG51";
var PUNE = [73.856255, 18.516726];
var map = tt.map({
  key: APIKEY,
  container: "map",
  center: PUNE,
  zoom: 14,
  // style: 'https://api.tomtom.com/style/1/style/20.4.5-*/?map=basic_night&poi=poi_main',
});
map.doubleClickZoom.enable();

var nav = new tt.NavigationControl({});
// map.addControl(nav, "bottom-right");

var markerUnable = true;
var markers = [];

map.on("click", function (event) {
  if (markerUnable) {
    console.log(event);

    let stops = document.createElement("img");
    stops.className = "marker-stops";

    var marker = new tt.Marker({
      element: stops,
      }).setLngLat(event.lngLat).addTo(map)

    markers.push(marker);

    markers.push(marker);
  }
});

var clearMarkers = function () {
  for (marker of markers) {
    marker.remove();
  }
  markers = [];
};

var movemap = function (lnglat) {
  console.log(" --- " + lnglat);
  map.flyTo({
    center: lnglat,
    zoom: 14,
  });
};

// var findMe = function () {
//   navigator.geolocation.getCurrentPosition(showLoc);
//   var lat = position.coords.latitude;
//   var lng = position.coords.longitude;
//   console.log(lng);
//   console.log(lat);
//   movemap([lng, lat]);

//   var marker = new tt.Marker()
//     .setLngLat(result.results[0].position)
//     .addTo(map)
//     .setDraggable([(shouldBeDraggable = true)]);
//   globalSearchMarker = marker;
// };

var globalSearchMarker = "";
var handleResults = function (result) {
  console.log(result);
  if (result.results) {
    movemap(result.results[0].position);
    console.log("::::" + result.results[0].position);
  }

  let destination = document.createElement("img");
  destination.className = "marker-destination";

  var marker = new tt.Marker({
    element: destination,
  })
    .setLngLat(result.results[0].position)
    .addTo(map)
    .setDraggable([(shouldBeDraggable = true)]);

  globalSearchMarker = marker;
};

var addToRoute = function () {
  if (globalSearchMarker != "") {
    markers.push(globalSearchMarker);
    // globalSearchMarker.remove();
  }
};

var Search = function () {
  tt.services
    .fuzzySearch({
      key: APIKEY,
      query: document.getElementById("query").value,
      // idxSet: "Poi",
      // boundingBox: map.getBounds(),
      // boundingBox: map.getBounds(),
    })
    .then(handleResults);
};

var globalRandomID = "";
var displayRoute = function (geoJSON, randomID) {
  routeLayer = map.addLayer({
    id: randomID.toString(),
    type: "line",
    source: {
      type: "geojson",
      data: geoJSON,
    },
    paint: {
      "line-color": "dodgerblue",
      "line-width": 5,
    },
  });
  markerUnable = false;
  globalRandomID = randomID;
  globalSearchMarker.setDraggable([(shouldBeDraggable = false)]);
};

var clearRoute = function () {
  // routeLayer.remove();
  map.removeLayer(globalRandomID);
  clearMarkers();
  markerUnable = true;
};

var createRoute = function () {
  var routeOptions = {
    key: APIKEY,
    locations: [],
    //   travelMode: "pedestrian",
    //   car,truck,taxi,bus,van,motorcycle,bicycle,pedestrian
    travelMode: "car",
    // avoid: "motorcycle",
    //   vehicleLoadType: "USHazmatClass1",
    //   vehicleAdrTunnelRestrictionCode: "B",
  };

  for (marker of markers) {
    routeOptions.locations.push(marker.getLngLat());
    console.log("HELL : " + marker.getLngLat());
  }

  tt.services.calculateRoute(routeOptions).then(function (routeData) {
    document.getElementById("distance").innerHTML =
      routeData.routes[0].summary.lengthInMeters + " Meters Left";
    console.log(routeData);
    var geo = routeData.toGeoJson();
    var randomID = Math.random();
    displayRoute(geo, randomID);
    gasStations();
  });

  //   tt.services
  //     .incidentDetailsV5({
  //       key: APIKEY,
  //       boundingBox:
  //         "4.8854592519716675,52.36934334773164,4.897883244144765,52.37496348620152",
  //     })
  //     .then(function (response) {
  //       console.log(response);
  //     });
};

// var gasStations = function () {
//   globalRoute = [];
//   for (marker of markers) {
//     globalRoute.push(marker.getLngLat());
//     console.log("OP: " + marker.getLngLat());
//   }
//   tt.services
//     .alongRouteSearch({
//       key: APIKEY,
//       limit: 20,
//       maxDetourTime: 120,
//       query: "gas station",
//       // route: [
//       //   {
//       //     lat: 18.463193304215373,
//       //     lon: 73.86529425365406,
//       //   },
//       //   {
//       //     lat: 18.468482641911464,
//       //     lon: 73.86423229578021,
//       //   },
//       //   [73.86457924572889, 18.465833276419357], // Another valid format
//       // ],
//       route: globalRoute,
//     })
//     .then(function (response) {
//       console.log("SUMMARY:");
//       console.table(response.summary);
//       console.log("RESULTS:");
//       console.table(response.results);
//     });
// };

var myLocation = function () {
  console.log(location);
  const successCallback = (position) => {
    console.log(position.coords.latitude);
    console.log(position.coords.longitude);
    // handleResults(position);

    map.flyTo({
      center: [position.coords.longitude, position.coords.latitude],
      zoom: 20,
    });

    var ll = tt.LngLat.convert([
      position.coords.latitude,
      position.coords.longitude,
    ]);
    console.log("=-=-=-= : " + ll);
    // var marker = new tt.Marker()
    //   .setLngLat([position.coords.longitude, position.coords.latitude])
    //   .addTo(map)
    //   .setDraggable([(shouldBeDraggable = true)])
    //   .color("#ffffff");

    let me = document.createElement("img");
    me.className = "marker-me";

    var marker = new tt.Marker({
      element: me,
    })
      .setLngLat([position.coords.longitude, position.coords.latitude])
      .addTo(map)
      .setDraggable([(shouldBeDraggable = true)]);

    markers.push(marker);
    globalSearchMarker = marker;
  };

  const errorCallback = (error) => {
    console.log(error);
  };
  navigator.geolocation.getCurrentPosition(
    successCallback,
    errorCallback
  );
};

var queries = [
  "gas station",
  "stop sign",
  "traffic light",
  "pedestrian crossing",
  "crossing",
  "school zone",
];
var queryValues = [];

var gasStations = function () {
  globalRoute = [];
  for (marker of markers) {
    globalRoute.push(marker.getLngLat());
    console.log("OP: " + marker.getLngLat());
  }
  const successCallback = (position) => {
    console.log(position);
  };

  const errorCallback = (error) => {
    console.log(error);
  };

  navigator.geolocation.getCurrentPosition(
    successCallback,
    errorCallback
  );
  for (let i = 0; i < queries.length; i++) {
    forEveryQuery(queries[i]);
  }
  document.getElementById("gs").innerHTML = `${queries[0]}`;
  document.getElementById("si").innerHTML = `${queries[1]}`;
  document.getElementById("tl").innerHTML = `${queries[2]}`;
  document.getElementById("pc").innerHTML = `${queries[3]}`;
  document.getElementById("c").innerHTML = `${queries[4]}`;
  document.getElementById("sz").innerHTML = `${queries[5]}`;
};

var forEveryQuery = function (myquery) {
  tt.services
    .alongRouteSearch({
      key: APIKEY,
      maxDetourTime: 120,
      query: myquery,
      // route: [
      //   {
      //     lat: 18.463193304215373,
      //     lon: 73.86529425365406,
      //   },
      //   {
      //     lat: 18.468482641911464,
      //     lon: 73.86423229578021,
      //   },
      //   [73.86457924572889, 18.465833276419357], // Another valid format
      // ],
      route: globalRoute,
    })
    .then(function (response) {
      queryValues.push(response.summary.numResults);
      //console.log(queryValues[i]);
      console.log("SUMMARY:");
      console.table(response.summary);
      console.log("RESULTS:");
      console.table(response.results);
    });
};