import * as functions from 'firebase-functions';

const API_KEY = functions.config().api.key;

// const BASE_URL_DIRECTIONS = `https://maps.googleapis.com/maps/api/directions/json?&avoid=highways&mode=bicycling&&alternatives=false&language=en&key=${API_KEY}`

const mapsClient = require('@google/maps').createClient({
  key: API_KEY
});

export const test = functions.https.onRequest((request, response) => {

	response.setHeader("Content-Type", "application/json");
	response.setHeader("Access-Control-Allow-Origin", "*");
	response.send({ res: "Hello from Firebase!" });
});

export const route = functions.https.onRequest((request: functions.Request, response: functions.Response) => {

	response.setHeader("Content-Type", "application/json");
	response.setHeader("Access-Control-Allow-Origin", "*");

	console.log("request: " + JSON.stringify(request.query));
	const fromLat = request.query.fromLat;
	const fromLng = request.query.fromLng;
	const toLat = request.query.toLat;
	const toLng = request.query.toLng;

	mapsClient.directions({

		origin: { lat: fromLat, lng: fromLng },
		destination: { lat: toLat, lng: toLng },
		language: "en",
		avoid: ["highways"],
		mode: "bicycling",
		alternatives: false
	}, function(err: any, res: any) {
		if (!err) {

			const encodedRoutePoints = res.json.routes[0].overview_polyline.points;
			response.send({ points: encodedRoutePoints });
		} else {

			console.log("error: " + err)
			response.send({ errorMsg: "Error! " + err });
		}
	});

	// res.status = OK
	// res.json.status = OK
	// res.json.routes[0].overview_polyline.points;
	// const distance = res.json.routes[0].legs[0].distance.text;
	// const duration = res.json.routes[0].legs[0].duration.text;
	// const fromAddress = res.json.routes[0].legs[0].start_address;
  // const toAddress = res.json.routes[0].legs[0].end_address;

}); // route