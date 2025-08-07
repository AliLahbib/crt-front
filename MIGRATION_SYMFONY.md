# 🚀 Migration Frontend vers API Symfony

## 📋 Vue d'ensemble

Ce document décrit la migration du frontend React/TypeScript de l'utilisation d'un serveur JSON local vers l'API Symfony backend.

## 🔄 Changements effectués

### 1. Configuration API (`src/services/api.ts`)

**Avant :**
```typescript
const API_BASE_URL = 'http://localhost:3001'; // Serveur JSON
```

**Après :**
```typescript
const API_BASE_URL = 'http://localhost:8000/api'; // API Symfony
```

### 2. Services mis à jour

Tous les services ont été adaptés pour utiliser les endpoints Symfony :

#### `volunteerService.ts`
- ✅ Endpoints CRUD de base
- ✅ Recherche et filtrage
- ✅ Gestion des statuts et disponibilité
- ✅ Statistiques côté serveur

#### `familyService.ts`
- ✅ Endpoints CRUD de base
- ✅ Recherche par nom
- ✅ Filtrage par priorité, statut, zone
- ✅ Gestion des enfants
- ✅ Statistiques

#### `stockService.ts`
- ✅ Endpoints CRUD de base
- ✅ Gestion des quantités (ajouter/retirer)
- ✅ Filtrage par catégorie, statut, emplacement
- ✅ Alertes de stock (faible, expiré, expirant bientôt)
- ✅ Vérification de disponibilité
- ✅ Statistiques et valeur par catégorie

#### `interventionService.ts`
- ✅ Endpoints CRUD de base
- ✅ Filtrage par famille, statut, type, date
- ✅ Gestion des statuts et assignation de bénévoles
- ✅ Interventions urgentes et en retard
- ✅ Historique et montants par famille

#### `eventService.ts`
- ✅ Endpoints CRUD de base
- ✅ Filtrage par statut, type, période
- ✅ Gestion des participants
- ✅ Vérification de disponibilité des lieux
- ✅ Calendrier mensuel
- ✅ Événements urgents et par organisateur

#### `needsService.ts`
- ✅ Endpoints CRUD de base
- ✅ Activation/désactivation des besoins
- ✅ Filtrage par catégorie, priorité
- ✅ Besoins récents et les plus demandés
- ✅ Statistiques

#### `dashboardService.ts` (Nouveau)
- ✅ Données consolidées du dashboard
- ✅ Statistiques globales
- ✅ Activités récentes
- ✅ Tâches urgentes et alertes
- ✅ Métriques de performance
- ✅ Tendances mensuelles

## 🏗️ Architecture mise à jour

```
Frontend React → API Symfony → Services → Repositories → Base de données
```

### Avantages de cette architecture :

1. **Séparation des responsabilités** : La logique métier est maintenant côté serveur
2. **Sécurité renforcée** : Validation et autorisation côté serveur
3. **Performance** : Calculs et statistiques optimisés côté serveur
4. **Maintenabilité** : Code centralisé et réutilisable
5. **Évolutivité** : Facile d'ajouter de nouvelles fonctionnalités

## 🔧 Endpoints Symfony utilisés

### Familles (`/api/families`)
- `GET /` - Liste des familles
- `GET /{id}` - Détails d'une famille
- `POST /` - Créer une famille
- `PUT /{id}` - Modifier une famille
- `DELETE /{id}` - Supprimer une famille
- `GET /search?name={name}` - Recherche par nom
- `GET /priority/{priority}` - Filtrer par priorité
- `GET /status/{status}` - Filtrer par statut
- `GET /zone/{zone}` - Filtrer par zone
- `POST /{familyId}/children` - Ajouter un enfant
- `DELETE /{familyId}/children/{childId}` - Supprimer un enfant
- `PUT /{id}/last-help` - Mettre à jour la date de dernière aide
- `GET /stats` - Statistiques des familles

### Bénévoles (`/api/volunteers`)
- `GET /` - Liste des bénévoles
- `GET /{id}` - Détails d'un bénévole
- `POST /` - Créer un bénévole
- `PUT /{id}` - Modifier un bénévole
- `DELETE /{id}` - Supprimer un bénévole
- `GET /search?q={query}` - Recherche
- `GET /status/{status}` - Filtrer par statut
- `GET /availability/{availability}` - Filtrer par disponibilité
- `GET /role/{role}` - Filtrer par rôle
- `PUT /{id}/status` - Changer le statut
- `PUT /{id}/availability` - Changer la disponibilité
- `POST /{id}/skills` - Ajouter des compétences
- `DELETE /{id}/skills` - Supprimer des compétences
- `GET /stats` - Statistiques des bénévoles
- `GET /available` - Bénévoles disponibles

### Stocks (`/api/stocks`)
- `GET /` - Liste des articles
- `GET /{id}` - Détails d'un article
- `POST /` - Créer un article
- `PUT /{id}` - Modifier un article
- `DELETE /{id}` - Supprimer un article
- `PUT /{id}/add` - Ajouter du stock
- `PUT /{id}/remove` - Retirer du stock
- `PUT /{id}/quantity` - Mettre à jour la quantité
- `GET /status/{status}` - Filtrer par statut
- `GET /category/{category}` - Filtrer par catégorie
- `GET /search?name={name}` - Recherche par nom
- `GET /location/{location}` - Filtrer par emplacement
- `GET /low-stock` - Articles en stock faible
- `GET /expired` - Articles expirés
- `GET /expiring-soon?days={days}` - Articles expirant bientôt
- `GET /alerts` - Alertes de stock
- `GET /{id}/check-availability?quantity={qty}` - Vérifier disponibilité
- `GET /stats` - Statistiques des stocks
- `GET /value-by-category` - Valeur par catégorie

### Interventions (`/api/interventions`)
- `GET /` - Liste des interventions
- `GET /{id}` - Détails d'une intervention
- `POST /` - Créer une intervention
- `PUT /{id}` - Modifier une intervention
- `DELETE /{id}` - Supprimer une intervention
- `GET /family/{familyId}` - Interventions d'une famille
- `GET /status/{status}` - Filtrer par statut
- `GET /type/{type}` - Filtrer par type
- `GET /date/{date}` - Filtrer par date
- `GET /period?start={start}&end={end}` - Filtrer par période
- `PUT /{id}/status` - Changer le statut
- `PUT /{id}/volunteer` - Assigner un bénévole
- `GET /stats` - Statistiques des interventions
- `GET /urgent` - Interventions urgentes
- `GET /overdue` - Interventions en retard
- `GET /family/{familyId}/total` - Montant total pour une famille
- `GET /family/{familyId}/history` - Historique d'une famille

### Événements (`/api/events`)
- `GET /` - Liste des événements
- `GET /{id}` - Détails d'un événement
- `POST /` - Créer un événement
- `PUT /{id}` - Modifier un événement
- `DELETE /{id}` - Supprimer un événement
- `GET /status/{status}` - Filtrer par statut
- `GET /type/{type}` - Filtrer par type
- `GET /upcoming` - Événements à venir
- `GET /today` - Événements d'aujourd'hui
- `GET /period?start={start}&end={end}` - Filtrer par période
- `POST /{id}/participants` - Ajouter un participant
- `DELETE /{id}/participants` - Retirer un participant
- `PUT /{id}/status` - Changer le statut
- `GET /{id}/is-full` - Vérifier si complet
- `GET /urgent` - Événements urgents
- `GET /organizer/{organizer}` - Événements par organisateur
- `GET /search?q={query}` - Recherche d'événements
- `GET /location/{location}` - Événements par lieu
- `GET /check-location?location={loc}&date={date}` - Vérifier disponibilité lieu
- `GET /calendar/{year}/{month}` - Calendrier mensuel
- `GET /stats` - Statistiques des événements

### Besoins (`/api/needs`)
- `GET /` - Liste des besoins
- `GET /{id}` - Détails d'un besoin
- `POST /` - Créer un besoin
- `PUT /{id}` - Modifier un besoin
- `DELETE /{id}` - Supprimer un besoin
- `GET /active` - Besoins actifs
- `GET /inactive` - Besoins inactifs
- `PUT /{id}/activate` - Activer un besoin
- `PUT /{id}/deactivate` - Désactiver un besoin
- `GET /category/{category}` - Filtrer par catégorie
- `GET /search?q={query}` - Recherche de besoins
- `GET /by-priority` - Besoins par priorité
- `GET /recent?days={days}` - Besoins récents
- `GET /most-requested` - Besoins les plus demandés
- `GET /by-period?start={start}&end={end}` - Par période
- `GET /recently-updated?days={days}` - Mis à jour récemment
- `GET /by-category-type` - Par type de catégorie
- `GET /stats` - Statistiques des besoins

### Dashboard (`/api/dashboard`)
- `GET /` - Résumé complet du dashboard
- `GET /stats` - Statistiques globales
- `GET /activities` - Activités récentes
- `GET /urgent-tasks` - Tâches urgentes
- `GET /alerts` - Alertes du système
- `GET /performance` - Métriques de performance
- `GET /trends` - Tendances mensuelles

## 🛡️ Gestion des erreurs

### Codes de statut HTTP
- `200 OK` : Succès
- `201 Created` : Ressource créée
- `204 No Content` : Suppression réussie
- `400 Bad Request` : Données invalides
- `404 Not Found` : Ressource non trouvée
- `422 Unprocessable Entity` : Erreur de validation
- `500 Internal Server Error` : Erreur serveur

### Structure des réponses d'erreur
```json
{
  "error": "Message d'erreur descriptif"
}
```

## 🚀 Démarrage

### Backend Symfony
```bash
cd crt-core
symfony server:start -d
```

### Frontend React
```bash
cd crt-front
npm run dev
```

## 📊 Tests

Pour tester la migration :

1. **Vérifier la connexion API** : Ouvrir les outils de développement du navigateur et vérifier les requêtes vers `http://localhost:8000/api`

2. **Tester les fonctionnalités** :
   - Créer/modifier/supprimer des familles
   - Gérer les bénévoles
   - Consulter les stocks
   - Créer des interventions
   - Organiser des événements
   - Gérer les besoins

3. **Vérifier les logs** : Les services affichent des logs dans la console pour tracer les appels API

## 🔧 Configuration

### Variables d'environnement
Le frontend utilise maintenant l'URL de l'API Symfony configurée dans `src/services/api.ts`.

### CORS
Assurez-vous que le backend Symfony autorise les requêtes CORS depuis le frontend React.

## 📝 Notes importantes

1. **Logique métier déplacée** : Toute la logique métier est maintenant côté serveur
2. **Validation centralisée** : La validation des données se fait côté serveur
3. **Sécurité renforcée** : Les autorisations et authentifications sont gérées côté serveur
4. **Performance optimisée** : Les calculs et statistiques sont optimisés côté serveur

## 🎯 Prochaines étapes

1. **Tests complets** : Tester toutes les fonctionnalités
2. **Optimisation** : Optimiser les requêtes et la performance
3. **Authentification** : Implémenter l'authentification JWT
4. **Monitoring** : Ajouter des métriques et monitoring
5. **Documentation API** : Générer une documentation complète de l'API

---

**Migration terminée avec succès ! 🎉** 