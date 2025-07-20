
# Structure du Projet - Croissant Rouge

## 📁 Organisation des Dossiers

### 🎯 Structure Simple pour Débutants

```
src/
├── components/          # Composants réutilisables
│   ├── families/       # Composants pour les familles
│   ├── volunteers/     # Composants pour les bénévoles
│   ├── layout/         # Composants de mise en page
│   └── ui/            # Composants d'interface (boutons, cartes, etc.)
├── hooks/              # Logique métier réutilisable
├── pages/              # Pages principales de l'application
├── services/           # Communication avec la base de données
└── lib/               # Utilitaires
```

## 🚀 Fonctionnalités Connectées au JSON Server

### ✅ Modules Complets avec Base de Données

1. **👥 Gestion des Bénévoles (RH)**
   - Créer, modifier, supprimer des bénévoles
   - Recherche et filtrage
   - Statistiques en temps réel

2. **👨‍👩‍👧‍👦 Gestion des Familles**
   - Créer, modifier, supprimer des familles
   - Suivi des interventions
   - Priorités et statuts

3. **📦 Gestion des Stocks**
   - Inventaire complet
   - Alertes de stock faible
   - Catégories et statuts

4. **📅 Gestion des Événements**
   - Planification d'événements
   - Gestion des participants
   - Suivi des statuts

5. **🤝 Interventions**
   - Historique des aides
   - Liaison avec les familles
   - Suivi des bénévoles

## 🔄 Démarrage du Serveur

1. **Lancer le JSON Server:**
   ```bash
   node start-server.js
   ```

2. **Lancer l'application:**
   ```bash
   npm run dev
   ```

## 📊 API Endpoints Disponibles

- `GET /volunteers` - Liste des bénévoles
- `POST /volunteers` - Créer un bénévole
- `PUT /volunteers/:id` - Modifier un bénévole
- `DELETE /volunteers/:id` - Supprimer un bénévole

- `GET /families` - Liste des familles
- `POST /families` - Créer une famille
- `PUT /families/:id` - Modifier une famille
- `DELETE /families/:id` - Supprimer une famille

- `GET /interventions` - Liste des interventions
- `POST /interventions` - Créer une intervention
- `PUT /interventions/:id` - Modifier une intervention
- `DELETE /interventions/:id` - Supprimer une intervention

- `GET /stocks` - Liste des stocks
- `POST /stocks` - Créer un stock
- `PUT /stocks/:id` - Modifier un stock
- `DELETE /stocks/:id` - Supprimer un stock

- `GET /events` - Liste des événements
- `POST /events` - Créer un événement
- `PUT /events/:id` - Modifier un événement
- `DELETE /events/:id` - Supprimer un événement

## 🛠️ Comment Ajouter une Nouvelle Fonctionnalité

1. **Créer le service** dans `src/services/`
2. **Créer le hook** dans `src/hooks/`
3. **Créer les composants** dans `src/components/`
4. **Ajouter la page** dans `src/pages/`
5. **Mettre à jour les routes** dans `App.tsx`

## 📝 Exemple Simple

Pour ajouter une nouvelle entité "Donateurs":

1. Créer `src/services/donorService.ts`
2. Créer `src/hooks/useDonors.ts` 
3. Créer `src/components/donors/DonorsList.tsx`
4. Créer `src/pages/Donors.tsx`
5. Ajouter la route dans `App.tsx`
6. Ajouter les données dans `db.json`

## 🎨 Technologies Utilisées

- **React** - Framework principal
- **TypeScript** - Typage fort
- **Tailwind CSS** - Styles
- **React Query** - Gestion des données
- **JSON Server** - Base de données locale
- **Axios** - Requêtes HTTP
