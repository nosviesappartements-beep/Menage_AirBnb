# Mes ménages Airbnb — synchronisation iCal

Petit serveur qui lit vos flux iCal Airbnb (un par logement) et sert
la page de gestion du ménage avec vos vraies réservations.

## 1. Tester en local (facultatif)

```
npm install
ICAL_URL_1="https://www.airbnb.fr/calendar/ical/....ics?t=...." \
ICAL_URL_2="https://www.airbnb.fr/calendar/ical/....ics?t=...." \
npm start
```

Puis ouvrez http://localhost:3000

## 2. Déployer gratuitement sur Render

1. Créez un compte sur https://render.com (gratuit, inscription avec GitHub
   possible).
2. Mettez ce dossier sur GitHub : créez un nouveau dépôt (par exemple
   `menage-airbnb-sync`) et poussez-y tous ces fichiers.
3. Sur Render, cliquez sur **New +** → **Web Service**, puis choisissez
   ce dépôt.
4. Renseignez :
   - **Runtime** : Node
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Instance Type** : Free
5. Dans l'onglet **Environment**, ajoutez deux variables :
   - `ICAL_URL_1` = le lien iCal de votre premier logement
   - `ICAL_URL_2` = le lien iCal de votre second logement
6. Cliquez sur **Create Web Service**. Au bout de quelques minutes,
   Render vous donne une adresse du type
   `https://menage-airbnb-sync.onrender.com` : c'est votre application,
   accessible depuis votre téléphone comme depuis votre ordinateur.

### À savoir sur l'offre gratuite de Render

- Le service se met en veille après 15 minutes sans visite, et met
  quelques dizaines de secondes à se réveiller à la visite suivante.
  Pour un usage personnel, ce n'est généralement pas gênant.
- Les réservations affichées sont mises à jour au maximum toutes les
  15 minutes (voir `TTL_MS` dans `server.js`), et à la demande avec le
  bouton « Rafraîchir » de la page.

## 3. Ajouter le raccourci sur votre téléphone

Ouvrez l'adresse Render dans votre navigateur mobile, puis utilisez
« Ajouter à l'écran d'accueil » (Safari) ou « Ajouter à l'écran
d'accueil » dans le menu (Chrome) pour l'avoir comme une application.

## Pour aller plus loin

- Renommer les logements : modifiez `nom` dans `LOGEMENTS` (fichier
  `server.js`), puis renvoyez le code sur GitHub — Render redéploie
  automatiquement.
- Les cases cochées (ménage fait, stocks, linge lavé) sont enregistrées
  dans le navigateur de l'appareil utilisé, pas sur le serveur : elles
  ne sont donc pas partagées entre votre téléphone et votre ordinateur.
  Dites-le à votre interlocuteur habituel si vous voulez que ce soit
  partagé — cela demande une petite base de données en plus.
