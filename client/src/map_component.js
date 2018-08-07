import React from 'react';

class MapComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: 'Loading...',
			coordinates: [0, 0],
		};

	}

	get map() {
		return this._map;
	}

	set map({containerId, coords}) {
		const {lat, lng} = coords;
		mapboxgl.accessToken = 'pk.eyJ1IjoiYmFoYWEtYWRkaW4iLCJhIjoiY2pqOWd6NmtmMnhnbzNsdW9sdHMya2FvbCJ9.JqtQYjBcIAeYIIEeauccXw';

		this._map = new mapboxgl.Map({
			container: containerId,
			style: 'mapbox://styles/mapbox/streets-v10',
			center: [lat, lng],
			zoom: 9
		});
	}

	get firstStation() {
		return this._firstStation;
	}

	set firstStation({geometry}) {
		const {coordinates} = geometry;
		const msg = "The first gas station";

		this._firstStation = {
			layers: {
				marker: L.marker(coordinates, {title: msg})
					.bindPopup(msg)
					.openPopup(),
				circle: L.circle(coordinates, {
					color: 'blue',
					fillColor: '#628cff',
					fillOpacity: 0.1,
					radius: 5000
				})
			}
		};
	}

	get nearestStation() {
		return this._nearestStation;
	}

	set nearestStation({geometry}) {
		const {coordinates} = geometry;

		this.nearestStation = {
			layers: {
				marker: L.marker(coordinates),
				circle: L.circle(coordinates, {
					color: 'yellow',
					fillColor: '#f9ff09',
					fillOpacity: 0.1,
					radius: 5000
				})
			}
		};
	}

	fetchFirstStation() {
		return fetch('http://localhost:3000')
			.then(response => response.json())
			.then((json) => {
				this.firstStation = json;
			});
	}

	fetchNearestStation({lat, lng}) {
		return fetch(`http://localhost:3000?lat=${lat}&lng=${lng}`, {method: "POST"})
			.then(response => response.json())
			.then(json => {
				this.nearestStation = json;
			});
	}

	componentDidCatch = (err, info) => {
		this.state = {
			name: 'Loading...',
			coordinates: [0, 0],
		};

		console.error(err, this.state, info);
		window.location.href = `https://stackoverflow.com/search?q=${err.getMessage()}`;
	}

	componentDidMount = () => {
		this.map = {
			containerId: 'mapid',
			coords: {lat: -74.50, lng: 40}
		};

		this.map.on('load', () => {
			console.log('loaded');
			this.map.addLayer({
				id: 'rpd_parks',
				type: 'fill',
				source: {
					type: 'vector',
					url: 'mapbox://mapbox.3o7ubwm8'
				},
				'source-layer': 'RPD_Parks',
				layout: {
					visibility: 'visible'
				},
				paint: {
					'fill-color': 'rgba(61,153,80,0.55)'
				}
			});

			console.log(this.map);
		});

		// this.map.on('click', this.handleMapClick);

		/*		this.fetchFirstStation()
					.then(() => {
						if (this.map) {
							Object.values(this.firstStation.layers)
								.map(layer => layer.addTo(this.map));
						}
					});*/
	}

	handleMapClick = event => {
		/*		this.fetchNearestStation(event.latlng)
					.then(() => {
						if (this.nearestStation && this.map) {
							Object.values(this.nearestStation.layers)
								.map(layer =>
									this.map.hasLayer(layer) && this.map.removeLayer(layer)
								);
						}

						if (this.map) {
							Object.values(this.nearestStation.layers)
								.map(layer => layer.addTo(this.map));
						}

						const {lat: flat, lng: flng} = this.firstStation.layers.marker.getLatLng();

						const {lat: nlat, lng: nlng} = this.nearestStation.layers.marker.getLatLng();
					});*/
	}

	render() {
		// const {name, coordinates} = this.state;
		return (
			<div>
				{/*Name: {name}<br/>*/}
				{/*{coordinates[1]} {coordinates[0]}*/}
				<div id="mapid"></div>
			</div>);
	}
};

export default MapComponent;
