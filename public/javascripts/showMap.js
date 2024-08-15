




  // mapboxgl.accessToken = 'pk.eyJ1IjoicHBvaXV5dHJld3EiLCJhIjoiY2x4eDljb3FiMHdyZTJrc2cyaTU2azhrcyJ9.A0j6hS_epSW1YPrfxv8VCg';
 mapboxgl.accessToken = mapboxtoken; 
  const map = new mapboxgl.Map({
    container : 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: cmp.geometry.coordinates , // starting position [lng, lat]
    zoom: 7, // starting zoom
  });

  new mapboxgl.Marker()
  .setLngLat( cmp.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({offset:25})
    .setHTML(
        `<h3>${cmp.title}</h3>`
    )
  )
  .addTo(map)
