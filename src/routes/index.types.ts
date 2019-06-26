export interface m_photo {
	collection_id: number,
	picture_id: string,
	width: number,
	height: number,
	url: string,
	filtered_assets: string[],
	available_assets: string[]
}

export interface u_photo {
	id: string,
	width: number,
	height: number,
	urls: {
		regular: string
	}
}

export interface request {
	image: {
		source: {
			imageUri: string
		}
	},
	features: [
		{
			type: string,
			maxResults: number
		}
	]	
}