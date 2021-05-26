// Create the script tag, set the appropriate attributes
var script = document.createElement('script');
script.src = 'https://maps.googleapis.com/maps/api/js?v=weekly&key=AIzaSyB3-4xyoNndk0wxmJqZl7ENBvdwG44I1aM&callback=initMap&region=TW&map_ids=5d9ada8f88912b9f&';
script.async = true;

// Append the 'script' element to 'head'
document.head.appendChild(script);
      