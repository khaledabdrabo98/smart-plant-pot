# ArduinoJKT : Project IoT

## Abstract
Utilisation de barres de graphite (Graphite frotté contre morceau de carton?) pour mesurer le niveau d'eau d'un pot (fleur/plante) et inforer l'utilisateur du besoin en eau de la plante.
Besoins affichés sur un écran.
Conenxion à une API décrivant les besoins en eau de chaque plante et donc de la plante sujet après identification (à la main).

## Possibles extensions (après qu'on ait fini le capteur de niveau d'eau)
- Ajout d'un capteur de lumière : Comparaison avec les données de l'API
- Ajout d'un capteur de tension ; Toucher de la plante permet de récupérer les infos de la terre(rempalcerait l'écran, remplacé par haut parleur ?)

## Intelligence
Les noms scientifiques des plantes seront récupérées sur une API, et leurs informations (besoin en humidité, lumière, etc..)  sur une autre. La plante sujet sera identifiée grâce à une photo, et à un algorithme de Machine Learning qui tourne sur la 1ère API. La quantité d'eau nécessaire au bien être de la plante sujet sera utilisé comme seuil pour notre arduino qui informera l'utilisateur que la quantité d'eau dans la terre dépasse, ou non, le seuil.

### API utilisées 
- Identification de la plante en en prenant une photo, envoyée sur l'[API](https://plant.id/) de détection 
- Récupération des détails des besoins de la plante identifiée sur la deuxième [API](https://open.plantbook.io/)


## Capteurs / actionneurs dont on aura besoin
- Niveau d'eau (graphite)
- Luxmètre (potentiellement)
- Ecran
- Haut-parleur (potentiellement)
- 1 résistance (potentiellement) marron noir vert
- Resistance 680 * 2 ( 3 rouge rouge marron)
- Resistance 220 * 2 rouge rouge marron
- 4 cables 
- Capteur : Niveau d'eau (graphite)
- Capteur : Luxmètre (potentiellement)
- Actionneur : Ecran
- Actionneur : ~~Haut-parleur~~ téléphone (potentiellement)

## Matériel
- 2 Résistances (220)
- 4 Résistances (330)
- 1 Résistance (1M)
- 1 ~~Haut parleur~~ téléphone
- 1 Ecran LCD
- 10 cables
- 1 potentiomètre

## Membres : 
- Thibault HERVIER p1807341
- Jean BRIGNONE p1709655 
- Khaled ABDRABO p1713323


Tuto cablage capteur eau
https://create.arduino.cc/projecthub/MansonHau/automatic-watering-system-c40bdf
