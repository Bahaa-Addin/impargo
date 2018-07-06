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
		this._map = new L.Map(containerId);

		const osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
		const attribution = 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';

		const osm = new L.TileLayer(osmUrl, {
			minZoom: 8,
			maxZoom: 12,
			attribution,
		});

		this._map.setView(new L.LatLng(lat, lng), 9);
		this._map.addLayer(osm);
	}

	fetchFirstStation() {
		fetch('http://localhost:3000')
			.then(response => response.json())
			.then((json) => {
				const {properties, geometry} = json;
				this.setState({
					name: properties.name,
					coordinates: geometry.coordinates,
				}, function () {
					const {coordinates} = this.state;
					const coords = [...coordinates].reverse();

					const msg = "The first gas station";

					this.firstStation = {
						layers: {
							marker: L.marker(coords, {title: msg})
										.bindPopup(msg)
										.openPopup(),
							circle: L.circle(coords, {
								color: 'blue',
								fillColor: '#628cff',
								fillOpacity: 0.1,
								radius: 5000
							})
						}
					};

					if (this.map) {
						Object.values(this.firstStation.layers)
							.map(layer => layer.addTo(this.map));
					}
				});
			});
	}

	fetchNearestStation({lat, lng}) {
		fetch(`http://localhost:3000?lat=${lat}&lng=${lng}`, {method: "POST"})
			.then(response => response.json())
			.then(json => {
				const {properties, geometry} = json;
				this.setState({
					name: properties.name,
					coordinates: geometry.coordinates,
				}, function () {
					const {coordinates} = this.state;
					const coords = [...coordinates].reverse();

					if (this.nearestStation && this.map) {
						Object.values(this.nearestStation.layers)
							.map(layer =>
								this.map.hasLayer(layer) && this.map.removeLayer(layer)
							);
					}

					this.nearestStation = {
						layers: {
							marker: L.marker(coords),
							circle: L.circle(coords, {
								color: 'yellow',
								fillColor: '#f9ff09',
								fillOpacity: 0.1,
								radius: 5000
							})
						}
					};

					if (this.map) {
						Object.values(this.nearestStation.layers)
							.map(layer => layer.addTo(this.map));
					}
				});
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
			coords: {lat: 52.51, lng: 13.40}
		};

		this.map.on('click', this.handleMapClick);

		this.fetchFirstStation();
	}

	handleMapClick = event => {
		this.fetchNearestStation(event.latlng);
	}

	render() {
		const {name, coordinates} = this.state;
		return (
			<div>
				Name: {name}<br/>
				{coordinates[1]} {coordinates[0]}
				<div id="mapid"></div>
			</div>);
	}
};

export default MapComponent;
