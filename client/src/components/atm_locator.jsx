// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, use } from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import '../styles/atm_locator.css';
import { InfoWindow } from '@vis.gl/react-google-maps';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBillTransfer } from '@fortawesome/free-solid-svg-icons';

const AtmLocator = () => {

	// user position state to store user's geolocation
	const [userPosition, setUserPosition] = useState(null);
	// geolocation error state to handle errors in fetching user's position
	const [geolocationError, setGeolocationError] = useState(null);

	// state to manage the currently selected ATM marker
	const [selectedAtm, setSelectedAtm] = useState(null);

	// set map position to CWU Ellensburg, WA
	const mapPosition = { lat: 47.0073, lng: -120.5363 };
	// initialize atm markers to be displayed on the map
	const atmMarkers = [
		{ id: 1, position: { lat: 47.0030, lng: -120.5378 }, name: 'ATM 1' },
		{ id: 2, position: { lat: 47.0051, lng: -120.5414 }, name: 'ATM 2' },
		{ id: 3, position: { lat: 47.0073, lng: -120.5363 }, name: 'ATM 3' },
		{ id: 4, position: { lat: 47.0012, lng: -120.5402 }, name: 'ATM 4' },
	];

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
	};

	// handle the atm marker close event
	const handleAtmMarkerClose = () => {
		setSelectedAtm(null);
	};

	// find the currently selected ATM marker
	const selectedAtmMarker = atmMarkers.find(marker => marker.id === selectedAtm);

	// adjust the position of the info window to avoid overlap with the marker
	const adjustedPosition = selectedAtmMarker
  ? { ...selectedAtmMarker.position, lat: selectedAtmMarker.position.lat + 0.0003 }
  : null;

	return (
		<div style={{ height: '500px', width: '100%' }}>
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
							<FontAwesomeIcon icon={faMoneyBillTransfer} className="atm-marker-icon" />
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
								<p>Location: {selectedAtmMarker.position.lat.toFixed(4)}, {selectedAtmMarker.position.lng.toFixed(4)}</p>
								<p>Services: </p>
							</div>
						</InfoWindow>
					)}
				</Map>
			</APIProvider>
		</div>
	);
};

export default AtmLocator;