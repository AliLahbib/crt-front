
# JSON Server Local

## Installation et Démarrage

1. **Installer les dépendances** (si pas déjà fait) :
   ```bash
   npm install
   ```

2. **Démarrer le serveur JSON** :
   ```bash
   node start-server.js
   ```

3. **Le serveur sera disponible sur** :
   - URL de base : `http://localhost:3001`
   - API Volunteers : `http://localhost:3001/api/volunteers`
   - API Families : `http://localhost:3001/api/families`

## Endpoints disponibles

### Volunteers
- `GET /api/volunteers` - Récupérer tous les bénévoles
- `GET /api/volunteers/:id` - Récupérer un bénévole par ID
- `POST /api/volunteers` - Créer un nouveau bénévole
- `PUT /api/volunteers/:id` - Mettre à jour un bénévole
- `DELETE /api/volunteers/:id` - Supprimer un bénévole
- `GET /api/volunteers?q=terme` - Rechercher des bénévoles

### Families
- `GET /api/families` - Récupérer toutes les familles
- `GET /api/families/:id` - Récupérer une famille par ID
- `POST /api/families` - Créer une nouvelle famille
- `PUT /api/families/:id` - Mettre à jour une famille
- `DELETE /api/families/:id` - Supprimer une famille
- `GET /api/families?q=terme` - Rechercher des familles

## Configuration

Le serveur utilise le port 3001 par défaut. Vous pouvez le changer en définissant la variable d'environnement `JSON_SERVER_PORT`.

## Base de données

Le fichier `db.json` contient toutes les données. Les modifications sont automatiquement sauvegardées.
