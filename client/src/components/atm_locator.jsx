// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIProvider, Map, AdvancedMarker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import '../index.css';
import { InfoWindow } from '@vis.gl/react-google-maps';
import { FaMapLocationDot } from 'react-icons/fa6';

// logo for ATM marker icon
const ATM_LOGO_URL = `logo.svg`;

// helper component to handle directions rendering
const DirectionsComponent = ({ origin, destination, setDirectionsResult }) => {
	const map = useMap(); // get the map instance
	const routesLibrary = useMapsLibrary('routes'); // load the routes library
	const directionsService = useRef(null);
	const directionsRenderer = useRef(null);

	useEffect(() => {
		if (!map || !routesLibrary) return;
		if (!directionsService.current) {
      		directionsService.current = new routesLibrary.DirectionsService();
		}
		if (!directionsRenderer.current) {
			directionsRenderer.current = new routesLibrary.DirectionsRenderer({ map: map });
		}

		if (origin && destination) {
			directionsService.current.route(
				{
					origin: origin,
					destination: destination,
					travelMode: routesLibrary.TravelMode.WALKING,
				},
				(result, status) => {
					if (status === 'OK' && result) {
						directionsRenderer.current.setDirections(result);
            			setDirectionsResult(result);
					} else {
						console.error('Directions request failed:', status);
            			setDirectionsResult(null);
					}
				}
			);
		}

		// cleanup function: remove the directions on the map when component unmounts or input changes
		return () => {
			if (directionsRenderer.current) {
				directionsRenderer.current.setMap(null); // clear the directions from map
			}
		};
	}, [map, routesLibrary, origin, destination, setDirectionsResult]);
	return null;
};

const AtmLocator = () => {

	// user position state to store user's geolocation
	const [userPosition, setUserPosition] = useState(null);
	// geolocation error state to handle errors in fetching user's position
	const [geolocationError, setGeolocationError] = useState(null);

	// state to manage the currently selected ATM marker
	const [selectedAtm, setSelectedAtm] = useState(null);

	// state to store the directions result for textual display
    const [directionsData, setDirectionsData] = useState(null);
    // state to control showing/hiding directions on the map
    const [showMapDirections, setShowMapDirections] = useState(false);

	// set map position to CWU Ellensburg, WA
	const mapPosition = { lat: 47.0073, lng: -120.5363 };
	// initialize atm markers to be displayed on the map
	const atmMarkers = [
		{ 
			id: 1, 
			position: { lat: 47.002677233814836, lng: -120.53891345610913 }, 
			name: 'Student Union & Recreation Center ATM',
			address: '1007 N Chestnut St, Ellensburg, WA 98926',
			hours: '24/7',
			details: 'Located inside the SURC near the back entrance.'
		},
		{ 
			id: 2, 
			position: { lat: 47.00510997515957, lng: -120.54098948579359 }, 
			name: 'James E. Brooks Library ATM',
			address: 'North Wildcat Way, E Dean Nicholson Blvd, Ellensburg, WA 98926',
			hours: '24/7',
			details: 'Located near the main entrance James E. Brooks Library.'
		},
		{ 
			id: 3, 
			position: { lat: 47.00138308001019, lng: -120.54019823447713 }, 
			name: 'Samuelson Hall ATM',
			address: '111, Ellensburg, WA 98926',
			hours: '24/7',
			details: 'Located in front of the main entrance of Samuelson Hall.'
		},
		{
			id: 4,
			position: { lat: 47.00539440098806, lng: -120.5344119536594 },
			name: 'Jerilyn S. McIntyre Music Building ATM',
			address: '906 E Dean Nicholson Blvd, Ellensburg, WA 98926',
			hours: '24/7',
			details: 'Located in front of the back entrance of the Jerilyn S. McIntyre Music Building.'
		},
		{
			id: 5,
			position: { lat: 47.00303909818557, lng: -120.54202813617447 },
			name: 'Science Building ATM',
			address: '1100 N Wildcat Way, Ellensburg, WA 98926',
			hours: '24/7',
			details: 'Located in front of the back entrance of the Science Building.'
		},
		{
			id: 6,
			position: { lat: 47.00109406329281, lng: -120.5379666366666 },
			name: 'Bouillon Hall ATM',
			address: 'Bouillon Hall, N Walnut St, Ellensburg, WA 98926',
			hours: '24/7',
			details: 'Located near the back of Bouillon Hall.'
		},
		{
			id: 7,
			position: { lat: 47.00672077479758, lng: -120.54127696318189 },
			name: 'Panda Express ATM',
			address: '405 E Dean Nicholson Blvd, Ellensburg, WA 98926',
			hours: '24/7',
			details: 'Located next to the front doors of Panda Express.'
		},
		{
			id: 8,
			position: { lat: 47.008126644779956, lng: -120.5333438366846 },
			name: 'Student Village ATM',
			address: '1501 N Alder St, Ellensburg, WA 98926',
			hours: '24/7',
			details: 'Located in the middle of the Student Village Apartments.'
		},
		{
			id: 9,
			position: { lat: 47.00361249636755, lng: -120.53557924016735 },
			name: 'Basetti Dorms ATM',
			address: '807 E 11th Ave, Ellensburg, WA 98926',
			hours: '24/7',
			details: 'Located in the center of the Basetti Dorms.'
		},
		{
			id: 10,
			position: { lat: 47.00188083483619, lng: -120.53481726908447 },
			name: 'Starbucks ATM',
			address: '908 E 10th Ave, Ellensburg, WA 98926',
			hours: '24/7',
			details: 'Located at the entrance of Starbucks.'
		},
		{
			id: 11,
			position: { lat: 47.00571479766147, lng: -120.53825679571558 },
			name: 'Randall Hall ATM',
			address: '44444 E Dean Nicholson Blvd, Ellensburg, WA 98926',
			hours: '24/7',
			details: 'Located under the Randall Hall skybridge.'
		},
		{
			id: 12,
			position: { lat: 47.00479659839781, lng: -120.53883078852003 },
			name: 'International Center ATM',
			address: 'International Center, 1262 N Walnut St, Ellensburg, WA 98926',
			hours: '24/7',
			details: 'Located on the East side of the International Center.'
		},
		{
			id: 13,
			position: { lat: 47.0068890454306, lng: -120.53890052592162 },
			name: 'Nicholson Pavillion ATM',
			address: '1500 N Walnut St, Ellensburg, WA 98926',
			hours: '24/7',
			details: 'Located in between the Nicholson Pavillion and Dorothy Purser Hall.'
		},
		{
			id: 14,
			position: { lat: 47.00850405122618, lng: -120.53924653098005 },
			name: 'Tomlinson Stadium ATM',
			address: '1699, 1601 N Walnut St, Ellensburg, WA 98926',
			hours: '24/7',
			details: 'Located at the front entrance of Tomlinson Stadium.'
		},
		{
			id: 15,
			position: { lat: 47.00014328392123, lng: -120.5423656852819 },
			name: 'Barge Hall ATM',
			address: '400 E University Way, Ellensburg, WA 98926',
			hours: '24/7',
			details: 'Located next to the main doors of Barge Hall.'
		}
	];

	// find the currently selected ATM marker
	const selectedAtmMarker = atmMarkers.find(marker => marker.id === selectedAtm);

	// memoize userPosition and selectedAtmMarker.position for DirectionsComponent
    const memoizedOrigin = React.useMemo(() => userPosition, [userPosition]);
    const memoizedDestination = React.useMemo(() => selectedAtmMarker?.position, [selectedAtmMarker]);

	// useEffect to fetch user's geolocation
	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					setUserPosition({
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					});
				},
				(error) => {
					setGeolocationError(error.message);
				},
				{ enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
			);
		} else {
			setGeolocationError('Geolocation is not supported by this browser.');
		}
	}, []);

	// handle the atm marker click event
	const handleAtmMarkerClick = (atmId) => {
		setSelectedAtm(atmId);
		setDirectionsData(null);
		setShowMapDirections(false);
	};

	// handle the atm marker close event
	const handleAtmMarkerClose = () => {
		setSelectedAtm(null);
		setDirectionsData(null);
		setShowMapDirections(false);
	};

	// adjust the position of the info window to avoid overlap with the marker
	const adjustedPosition = selectedAtmMarker
  ? { ...selectedAtmMarker.position, lat: selectedAtmMarker.position.lat + 0.0003 }
  : null;

	// handle the get directions button click
	const handleGetDirections = (event) => {
		event.stopPropagation(); 
		if (memoizedOrigin && memoizedDestination) {
			setShowMapDirections(true); // show the directions on map
		}
	};

	//navigation function
	const navigate = useNavigate();
	const handleGoBack = () => { navigate('/dashboard');};
	return (
		<div style={{ height: '600px', width: '57%', margin: '100px auto' }}>
			{geolocationError && (
				<div style={{ color: 'red' }}>
					Error fetching geolocation: {geolocationError}
				</div>
			)}
			<APIProvider apiKey={process.env.REACT_APP_Maps_API_KEY}>
				<Map
					defaultCenter={userPosition || mapPosition}
					defaultZoom={15}
					mapId={process.env.REACT_APP_Maps_MAP_ID}
				>
					{userPosition && (
						<AdvancedMarker
							position={userPosition}
							title="Your Current Location"
						>
							<div className="user-location-dot" />
						</AdvancedMarker>
					)}

					{atmMarkers.map(marker => (
						<AdvancedMarker
							key={marker.id}
							position={marker.position}
							title={`${marker.name}`}
							onClick={() => handleAtmMarkerClick(marker.id)}
						>
							<img 
								src={ATM_LOGO_URL}
								alt='WCU ATM Logo'
								className='atm-marker-icon'
							/>
						</AdvancedMarker>
					))}

					{selectedAtmMarker && (
						<InfoWindow
							position={adjustedPosition}
							onCloseClick={handleAtmMarkerClose}
						>
							<div className="atm-info-window">
								<div className='atm-info-header'>
									<h3 className="atm-info-title">{selectedAtmMarker.name}</h3>
								</div>
								<p>Hours: {selectedAtmMarker.hours}</p>
								<p>Details: {selectedAtmMarker.details}</p>
								<p>Address: {selectedAtmMarker.address}</p>
								<button 
									className='get-directions-button' 
									onClick={handleGetDirections}>
										<FaMapLocationDot /> Get Directions
								</button>
							</div>
						</InfoWindow>
					)}

					{showMapDirections && memoizedOrigin && memoizedDestination && (
						<DirectionsComponent 
							origin={memoizedOrigin}
							destination={memoizedDestination}
							setDirectionsResult={setDirectionsData}
						/>
					)}
				</Map>
			</APIProvider>

			{/* Button to go back to the dashboard*/}
			<button onClick={handleGoBack} className='nav-button'>
				Back to Dashboard
			</button>

			{directionsData && selectedAtmMarker && (
				<div>
					<h4>Directions to {selectedAtmMarker?.name}:</h4>
					{directionsData.routes[0]?.legs[0]?.steps.map((step, index) => (
						<p key={index} dangerouslySetInnerHTML={{ __html: step.instructions }} />
					))}
					<p><b>Total Distance: {directionsData.routes[0]?.legs[0]?.distance?.text}</b></p>
					<p><b>Total Duration: {directionsData.routes[0]?.legs[0]?.duration?.text}</b></p>
				</div>
			)}
		</div>
	);
};

export default AtmLocator;