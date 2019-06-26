"use strict";

import config from '../../config/api_key';
import express from 'express';
import axios, { AxiosResponse } from 'axios';
import { u_photo, m_photo, request } from './index.types';

const router = express.Router();

// Id application Unsplash et Clef d Api Google Vision
const applicationId = config.unsplash_application_id;
const google_api_key = config.google_vision_api_key;

// Header d authorisation pour les requetes sur l API Unsplash
const headers = {
	"Authorization": "Client-ID " + applicationId
}

// Route GET /collection/seek?theme&filter
// theme: Theme de recherche pour une recuperer une collection sur Unsplash
// filter: Filtre pour trier les photos d Unsplash selon les resultats des labels envoyés par l API Vision
router.get("/collection/seek", async (req, res) => {

	let theme : string = req.query.theme;
	let tempfilter : string | null = req.query.filter;
	let filter : string[] | null = null;
	if (tempfilter) {
		filter = tempfilter.toLowerCase().split(',');
	}

	let collectionId = await getCollection(theme);
	console.log('collectionId', collectionId)

	let photoList: m_photo[] = await getPhotos(collectionId);

	// Effectue la recuperation des labels uniquement si il y a des filtres
	let labelList: AxiosResponse | null = null;
	if (filter) {
		labelList = await getLabel(photoList);
	}

	// Reponse finale envoyé au client
	let responses: {filtered_collection_pictures: m_photo[], collection_pictures: m_photo[] } = {
		filtered_collection_pictures: [],
		collection_pictures: []
	}

	// Prend un tableau et le renvois en y ajoutant un label si son score est superieur ou egale a 80%
	function getLabelWith80Prc(tab: string[], label: {score: number, description: string}) {
		if (label.score >= 0.80) {
			tab.push(label.description);
		}
		return tab
	}

	// Renvois les descriptions de label si cela match avec les filtres envoyé par le client
	function getLabelSameAsFilter(description: string) {
		if (filter && filter.indexOf(description.toLowerCase()) >= 0) {
			return description
		}
	}

	let newPhotoList = photoList.map((element: m_photo, index: number) => {
		if (filter && labelList && labelList.data.responses[index].labelAnnotations) {
			let labels = labelList.data.responses[index].labelAnnotations
			if (process.env.NODE_ENV != 'test') {
				console.log('Vision Labels:', labels)
			}
			element.available_assets = labels.reduce(getLabelWith80Prc, []);
			element.filtered_assets = element.available_assets.filter(getLabelSameAsFilter);
			return element
		} else {
			return element
		}
	})

	newPhotoList.forEach((element: m_photo) => {
		if (element.filtered_assets.length > 0) {
			responses.filtered_collection_pictures.push(element)
		} else {
			responses.collection_pictures.push(element)
		}
	})

	res.send({ value: responses }).status(200);
});

async function getCollection(theme: string) {
	try {
		let res_collection = await axios.get('https://api.unsplash.com/search/collections?page=1&per_page=1&query=' + theme, {headers: headers})
		if (process.env.NODE_ENV != 'test') {
			console.log('Unsplash Collection Return:', res_collection)
		}
		return res_collection.data.results[0].id;
	} catch(error) {
		console.error(error)
		return 1
	}
}

async function getPhotos(collectionId: number) {
	let photoList : m_photo[] = [];

	if (!collectionId || typeof collectionId !== "number") {
		collectionId = 1;
	}
	try {
		let res_photo = await axios.get('https://api.unsplash.com/collections/' + collectionId + '/photos?page=1&per_page=10', {headers: headers})
		if (process.env.NODE_ENV != 'test') {
			console.log('Unsplash Photo Return:', res_photo)
		}
		res_photo.data.forEach((element : u_photo) => {
			let obj = {
				collection_id: collectionId,
				picture_id: element.id,
				width: element.width,
				height: element.height,
				url: element.urls.regular,
				filtered_assets: [],
				available_assets: []
			}
			photoList.push(obj)
		})
		return photoList
	} catch(error) {
		console.error(error)
		return []
	}
}

async function getLabel(photoList: m_photo[]) {
	if (!photoList || photoList.length == 0) {
		return null;
	}
	
	let requesting : { requests: request[] } = {
		requests: []
	}
	
	photoList.forEach((element : m_photo) => {
		let newRequest : request = {
			image: {
				source: {
					imageUri: element.url
				}
			},
			features: [
				{
					type: "LABEL_DETECTION",
					maxResults: 10
				}
			]
		}
		requesting.requests.push(newRequest);
	})

	let res_vision: AxiosResponse | null = null;
	try {
		res_vision = await axios.post('https://vision.googleapis.com/v1/images:annotate?key=' + google_api_key, requesting)
		return res_vision;
	} catch(error) {
		console.error(error)
		return null;
	}
}

export default {
	router: router,
	getCollection: getCollection,
	getPhotos: getPhotos,
	getLabel: getLabel
}