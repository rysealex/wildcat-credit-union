import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';

const AtmLocator = () => {
	// set position to CWU Ellensburg, WA
	const position = { lat: 47.0073, lng: -120.5363 };
	// initialize atm markers to be displayed on the map
	const atmMarkers = [
		{ id: 1, position: { lat: 47.0030, lng: -120.5378 } },
		{ id: 2, position: { lat: 47.0051, lng: -120.5414 } },
		{ id: 3, position: { lat: 47.0073, lng: -120.5363 } },
	];

	return (
		<div style={{ height: '500px', width: '100%' }}>
			<APIProvider apiKey="AIzaSyCMT1qgGGU593rZLwtJtPDEMYOoYmib82Q">
				<Map 
					defaultCenter={position}
					defaultZoom={15}
					mapId='fd06dc25e21bc77e58abb98f'
				>
					{atmMarkers.map(marker => (
						<AdvancedMarker
							key={marker.id}
							position={marker.position}
							title={`ATM ${marker.id}`}
						/>
					))}
				</Map>
			</APIProvider>
		</div>
	);
};

export default AtmLocator;