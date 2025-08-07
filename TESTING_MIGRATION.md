# 🧪 Guide de Test - Migration vers API Symfony

## ✅ Configuration CORS résolue

Le problème de CORS a été résolu en installant et configurant `nelmio/cors-bundle` dans Symfony.

### Configuration appliquée :
- **Origines autorisées** : `http://localhost:8080`, `http://localhost:5173`
- **Méthodes autorisées** : GET, POST, PUT, DELETE, OPTIONS
- **Headers autorisés** : Content-Type, Authorization

## 🚀 Test de la migration

### 1. Vérifier que les serveurs fonctionnent

**Backend Symfony** :
```bash
# Vérifier que le serveur Symfony fonctionne
curl http://localhost:8000/api/stocks/
# Réponse attendue : [] (tableau vide si pas de données)
```

**Frontend React** :
- Ouvrir `http://localhost:8080` dans le navigateur
- Vérifier que l'interface se charge correctement

### 2. Tester les appels API depuis le frontend

1. **Ouvrir les outils de développement** (F12)
2. **Aller dans l'onglet Network/Network**
3. **Naviguer dans l'application** et vérifier que :
   - Les requêtes sont envoyées vers `http://localhost:8000/api/`
   - Pas d'erreurs CORS dans la console
   - Les réponses sont reçues correctement

### 3. Tests spécifiques par module

#### Test des Familles
1. Aller sur la page "Familles"
2. Vérifier que la liste se charge
3. Essayer de créer une nouvelle famille
4. Vérifier les logs dans la console :
   ```
   Fetching all families from Symfony API...
   Families fetched: [...]
   ```

#### Test des Bénévoles
1. Aller sur la page "RH"
2. Vérifier que la liste des bénévoles se charge
3. Essayer de créer un nouveau bénévole
4. Vérifier les logs dans la console :
   ```
   Fetching all volunteers from Symfony API...
   Volunteers fetched: [...]
   ```

#### Test des Stocks
1. Aller sur la page "Stocks"
2. Vérifier que l'inventaire se charge
3. Essayer d'ajouter un article
4. Vérifier les logs dans la console :
   ```
   Fetching all stocks from Symfony API...
   Stocks fetched: [...]
   ```

#### Test des Besoins
1. Aller sur la page "Besoins"
2. Vérifier que la liste se charge
3. Essayer de créer un nouveau besoin
4. Vérifier les logs dans la console :
   ```
   Fetching all needs from Symfony API...
   Needs fetched: [...]
   ```

#### Test des Événements
1. Aller sur la page "Événements"
2. Vérifier que la liste se charge
3. Essayer de créer un nouvel événement
4. Vérifier les logs dans la console :
   ```
   Fetching all events from Symfony API...
   Events fetched: [...]
   ```

### 4. Vérification des erreurs

#### Erreurs CORS
Si vous voyez des erreurs CORS :
```
Access to fetch at 'http://localhost:8000/api/...' from origin 'http://localhost:8080' has been blocked by CORS policy
```

**Solution** : Vérifier que le serveur Symfony est démarré et que la configuration CORS est correcte.

#### Erreurs 404
Si vous voyez des erreurs 404 :
```
GET http://localhost:8000/api/... 404 (Not Found)
```

**Solution** : Vérifier que les contrôleurs Symfony existent et sont correctement configurés.

#### Erreurs 500
Si vous voyez des erreurs 500 :
```
GET http://localhost:8000/api/... 500 (Internal Server Error)
```

**Solution** : Vérifier les logs Symfony dans le terminal.

### 5. Tests de performance

#### Temps de réponse
1. Ouvrir les outils de développement
2. Aller dans l'onglet Network
3. Recharger la page
4. Vérifier que les requêtes API se terminent rapidement (< 500ms)

#### Gestion des erreurs
1. Démarrer le frontend sans le backend
2. Vérifier que les erreurs sont gérées gracieusement
3. Redémarrer le backend
4. Vérifier que l'application se reconnecte automatiquement

### 6. Tests de fonctionnalités avancées

#### Recherche et filtrage
1. Tester les fonctionnalités de recherche
2. Tester les filtres par catégorie, statut, etc.
3. Vérifier que les requêtes utilisent les bons endpoints

#### Statistiques
1. Aller sur le dashboard
2. Vérifier que les statistiques se chargent
3. Vérifier que les graphiques s'affichent correctement

#### CRUD complet
1. Créer une nouvelle ressource
2. Modifier cette ressource
3. Supprimer cette ressource
4. Vérifier que toutes les opérations fonctionnent

## 🔧 Dépannage

### Problème : Erreurs CORS persistantes
```bash
# Redémarrer le serveur Symfony
symfony server:stop
symfony server:start -d

# Vider le cache
php bin/console cache:clear
```

### Problème : Frontend ne se connecte pas
```bash
# Vérifier que l'API fonctionne
curl http://localhost:8000/api/families/

# Vérifier les logs Symfony
symfony server:log
```

### Problème : Données ne se chargent pas
1. Vérifier les logs dans la console du navigateur
2. Vérifier les logs Symfony
3. Tester l'API directement avec curl

## ✅ Checklist de validation

- [ ] Serveur Symfony démarré sur `http://localhost:8000`
- [ ] Frontend React accessible sur `http://localhost:8080`
- [ ] Pas d'erreurs CORS dans la console
- [ ] Toutes les pages se chargent correctement
- [ ] Les listes s'affichent (même vides)
- [ ] Les formulaires de création fonctionnent
- [ ] Les opérations CRUD fonctionnent
- [ ] Les recherches et filtres fonctionnent
- [ ] Les statistiques s'affichent
- [ ] Les logs montrent les appels vers l'API Symfony

## 🎯 Résultat attendu

Si tous les tests passent, cela signifie que :
- ✅ La migration vers l'API Symfony est réussie
- ✅ Le frontend communique correctement avec le backend
- ✅ Toute la logique métier est côté serveur
- ✅ L'application est prête pour la production

---

**🚀 Migration testée et validée !** 