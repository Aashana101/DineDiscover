document.getElementById("find-restuarants").addEventListener('click', ()=>{
    const location=document.getElementById("search-input").value.trim();
    if(location)
    {
        fetchLocationCoordinates(location);
    }
    else if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showRestaurantByPosition, showError);
    }
    else {
        alert('Geolocation is not supported by this browser');
    }

}) 
const fetchLocationCoordinates=(location)=>{
    const nominatimEndpoint=`https://nominatim.openstreetmap.org/search?format=json&q=${location}`;
    fetch(nominatimEndpoint)
    .then(response=>response.json())
    .then(data=>{
        if(data.length>0){
            const{lat, lon}=data[0];
            console.log(`Latitude: ${lat}, Longitude: ${lon}`);
            fetchRestaurants(lat, lon);
        } 
        else{
            alert('Location not found');
        }
    })
    .catch(error=>{
        console.log("Error fetching location data from Nominatim", error);
    })
}
const showRestaurantByPosition=(position)=>{
    const {latitude, longitude}=position.coords;
    fetchRestaurants(latitude, longitude);
}
const fetchRestaurants=(latitude, longitude)=>{
    const overpassEndpoint='https://overpass-api.de/api/interpreter?data=[out:json];node[amenity=restaurant](around:10000,'+latitude+','+longitude+');out;';
    fetch(overpassEndpoint)
    .then(response=>response.json())
    .then(data=>{
        console.log(data);
        const restaurants=data.elements;
        console.log('Latitude:', latitude, 'Longitude:', longitude);
        const restaurantContainer=document.getElementById("restaurants");
        restaurantContainer.innerHTML="";
        if(restaurants.length===0)
        {
            restaurantContainer.innerHTML='<p>No Restaurants found nearby</p>';
            return;
        }
        restaurants.forEach(restaurant=>{
            const card=document.createElement('div');
            card.className='restaurant-card';
            card.innerHTML=`
             <a href="https://www.openstreetmap.org/?mlat=${restaurant.lat}&mlon=${restaurant.lon}" target="_blank" rel="noopener noreferrer">
             <h2>${restaurant.tags.name || 'Unnamed Restaurant'}</h2>
             </a>
             <p>${restaurant.tags.cuisine || 'Cuisine not mentioned'}</p>
            `;
            restaurantContainer.appendChild(card);
        })
    })
    .catch(error =>{
        console.log("Error fetching restaurant data from Overpass API", error);
    })
}
    const showError=(error)=>{
        switch(error.code){
            case error.PERMISSION_DENIED:
                alert("User denied the request for Geolocation!");
                break;
                case error.PERMISSION_UNAVAILABLE:
                    alert("Location information is unavailable!");
                    break;
                    case error.TIMEOUT:
                    alert("The request to get the user location is timed out!");
                    break;
                    case error.UNKNOWN_ERROR:
                    alert("An unknown error occurred!");
                    break;
        }
    }
