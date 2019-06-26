# PhotoSeeker

PhotoSeeker est une api qui permet de récupérer des photos depuis Unsplash pour ensuite les filtrer en utilisant Vision de Google.
La route disponible est `/collection/seek?theme={theme}&filter={assets}`.
Theme: Thème de la collection d&apos;image dans laquelle les photos vont être récupérées.
Assets: Filtres à partir desquelles les photos vont être triées.
L&apos;api renvoie un objet contenant `filtered_collection_pictures` et `collection_pictures`
- `filtered_collection_pictures`: liste de photo qui correspondent a un filtre
- `filtered_collection_pictures`: liste contenant le reste des photos

L&apos;api ne renvoie que 10 images par requête.

#### Préparation
- Créer une application sur [Unsplash](https://unsplash.com/developers)
- Créer un projet sur [Google Cloud Platform](https://cloud.google.com/vision/) et ajouter la bibliothèque Vision
- Remplacer dans le fichier `config/api_key.ts`:
	- `{YOUR_CLIENT_ID}`: L'id client de l'application Unsplash
	- `{YOUR_API_KEY}`: La clé d'api du projet crée sur Google Cloud Platform

#### Lancement
- Avec Docker
	- `npm run build-docker` crée l'image docker et la lance
	- `npm run run-docker` lance l'image docker
- Autre
	- `npm run prod` build le projet et le lance

#### Tests unitaires
- `npm run test`