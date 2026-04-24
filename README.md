# ✈️ PlaneRadar — Guide d'installation

## C'est quoi ?
PlaneRadar est une application web progressive (PWA) qui détecte les avions
qui passent dans un rayon de 10 km autour de toi et t'envoie une notification
avec la compagnie aérienne, l'altitude, la vitesse et la distance.

---

## 🚀 Installation en 3 étapes (méthode GitHub Pages — GRATUITE)

### Étape 1 — Héberger l'app gratuitement sur GitHub

1. Va sur **https://github.com** → crée un compte (gratuit)
2. Clique sur **"New repository"**
3. Nomme-le `planespotter` → coche **"Public"** → clique **"Create repository"**
4. Clique sur **"uploading an existing file"**
5. Glisse-dépose ces 5 fichiers :
   - `index.html`
   - `manifest.json`
   - `sw.js`
   - `icon-192.png`
   - `icon-512.png`
6. Clique **"Commit changes"**

7. Va dans **Settings → Pages → Source → "Deploy from branch"** → branch **main** → **Save**

Ton app sera disponible à l'adresse :
```
https://TON_PSEUDO.github.io/planespotter/
```

---

### Étape 2 — Ouvrir sur ton téléphone

Ouvre l'URL ci-dessus dans **Safari (iPhone)** ou **Chrome (Android)**.

---

### Étape 3 — Installer l'app sur l'écran d'accueil

**Sur iPhone (Safari) :**
1. Ouvre l'URL dans Safari
2. Appuie sur l'icône **Partager** (carré avec flèche vers le haut)
3. Sélectionne **"Sur l'écran d'accueil"**
4. Appuie **"Ajouter"**

**Sur Android (Chrome) :**
1. Ouvre l'URL dans Chrome
2. Chrome affiche automatiquement une bannière **"Installer PlaneRadar"**
3. Appuie **"Installer"**

---

## 📱 Utilisation

### Démarrage
- L'app demande la **permission GPS** — accepte pour une position précise
- L'app demande la **permission notifications** — accepte pour les alertes
- La carte se centre sur ta position avec un cercle de 10 km

### Interface
- **Carte** : montre ta position (point bleu) et les avions (emoji ✈️)
- **Appuie sur un avion** sur la carte pour voir ses détails
- **Panneau du bas** : liste des avions dans l'ordre de distance
- **⚙ Paramètres** : ajuste le rayon (5–50 km), l'intervalle de mise à jour, etc.

### Notifications
Une notification s'affiche à chaque nouvel avion détecté avec :
- ✅ Indicatif de vol (ex: EZY1234)
- ✅ Compagnie aérienne (ex: easyJet)
- ✅ Distance (ex: 4.2 km)
- ✅ Altitude (ex: 8500 m)

---

## ⚙️ Paramètres disponibles

| Paramètre | Défaut | Description |
|-----------|--------|-------------|
| Rayon | 10 km | Zone de surveillance (5–50 km) |
| Intervalle | 30 s | Fréquence de mise à jour |
| Notifications | ON | Alerte push par avion |
| Son | OFF | Bip à la détection |
| Filtre altitude | OFF | Ignorer avions < 500m |
| Position manuelle | — | Entrer des coordonnées manuellement |

---

## 🔍 Source des données

L'app utilise l'API **OpenSky Network** (https://opensky-network.org) :
- Données en temps réel (délai ~15 secondes)
- Gratuite, pas de clé API nécessaire
- Limite : 100 requêtes/heure sans compte (amplement suffisant)

Pour plus de données (provenance/destination précise), crée un compte gratuit
sur opensky-network.org et modifie l'URL de l'API dans index.html :
```javascript
fetch(`https://TON_USER:TON_MDP@opensky-network.org/api/states/all?${params}`)
```

---

## 🌐 Alternative : hébergement local sur ton PC

Si tu as Python installé :
```bash
cd planespotter
python3 -m http.server 8080
```
Puis ouvre `http://localhost:8080` dans ton navigateur.

Note : les notifications ne fonctionnent pas en `file://`, il faut un serveur.

---

## ❓ FAQ

**L'app ne détecte pas d'avions ?**
→ Vérifie ta connexion internet. OpenSky peut avoir des indisponibilités.
→ Essaie d'augmenter le rayon dans les paramètres.

**Les notifications ne marchent pas ?**
→ Va dans Settings → Notifications → PlaneRadar → Active-les.
→ L'app doit être ouverte en arrière-plan pour certains navigateurs.

**Je veux la destination précise du vol ?**
→ Les données OpenSky gratuites donnent le callsign mais pas toujours
   l'itinéraire complet. Pour ça, utilise l'API AviationStack (100 req/mois gratuit).

**L'app consomme beaucoup de batterie ?**
→ Augmente l'intervalle de mise à jour à 60s ou 120s dans les paramètres.
