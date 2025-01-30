const map = L.map('map').setView([18.5204, 73.8567], 13); // Pune, India

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
}).addTo(map);

// Custom car icon
const carIcon = L.icon({
  iconUrl: './car.png', // Relative path to the local car icon file
  iconSize: [40, 40], // Size of the icon
  iconAnchor: [20, 20], // Anchor point of the icon
});

// Initial state variables
const startPoint = [18.5204, 73.8567]; // Fixed starting point
let vehicleMarker = L.marker(startPoint, { icon: carIcon }).addTo(map);
let routeControl;
let rideHistory = [];
let currentRoute = null;
let isMoving = false;
let index = 0;

// Function to generate random coordinates near a point
function generateRandomCoordinates(center, radius = 0.01) {
  const offsetLat = (Math.random() - 0.5) * radius;
  const offsetLng = (Math.random() - 0.5) * radius;
  return [center[0] + offsetLat, center[1] + offsetLng];
}

// Function to start a new ride
function startNewRide() {
  if (isMoving) return; // Prevent starting a new ride while moving

  const endPoint = generateRandomCoordinates(startPoint);
  routeControl = L.Routing.control({
    waypoints: [L.latLng(startPoint), L.latLng(endPoint)],
    routeWhileDragging: false,
    addWaypoints: false,
    draggableWaypoints: false,
    createMarker: () => null, // No additional markers
  }).addTo(map);

  routeControl.on('routesfound', (e) => {
    currentRoute = e.routes[0].coordinates;
    rideHistory.push(currentRoute);
    moveVehicle();
  });
}

// Function to move the car along the route
function moveVehicle() {
  if (!currentRoute) return;

  isMoving = true;
  index = 0;

  function moveStep() {
    if (index < currentRoute.length) {
      vehicleMarker.setLatLng(currentRoute[index]);
      index++;
      setTimeout(moveStep, 1000); // Move every second
    } else {
      isMoving = false;
      routeControl.remove();
      currentRoute = null;
      document.getElementById('lastRideBtn').disabled = false;
    }
  }

  moveStep();
}

// Function to show the last ride route
document.getElementById('lastRideBtn').onclick = () => {
  if (rideHistory.length === 0) return;

  const lastRide = rideHistory[rideHistory.length - 1];
  L.polyline(lastRide, { color: 'blue' }).addTo(map);
};

// Arrow buttons functions
function viewLastRoute() {
  if (rideHistory.length > 0) {
    const lastRide = rideHistory[rideHistory.length - 1];
    L.polyline(lastRide, { color: 'blue', weight: 5 }).addTo(map);
  }
}

function viewNextRoute() {
  // Placeholder for next route functionality if required
  alert("Next ride functionality not yet implemented!");
}

// Start the first ride
startNewRide();
