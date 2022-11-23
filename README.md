# ArduinoJKT : Project Iot

## Abstract
Utilisation de barres de graphite (Graphite frotté contre morceau de carton?) pour mesurer le niveau d'eau d'un pot (fleur/plante) et inforer l'utilisateur du besoin en eau de la plante.
Besoins affichés sur un écran.
Conenxion à une API décrivant les besoins en eau de chaque plante et donc de la plante sujet après identification (à la main).

## Possibles extensions (après qu'on ait fini le capteur de niveau d'eau)
- Ajout d'un capteur de lumière : Comparaison avec les données de l'API
- Ajout d'un capteur de tension ; Toucher de la plante permet de récupérer les infos de la terre(rempalcerait l'écran, remplacé par haut parleur ?)

##Intelligence
Les informations des plantes seront récupérées sur une API. La plante sujet sera sélectionnée à la main. La quantité d'eau nécessaire au bien être de la plante sujet sera utilisé comme seuil pour notre arduino qui informera l'utilisateur que la quantité d'eau dans la terre dépasse, ou non, le seuil.

## Capteurs / actionneurs dont on aura besoin
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
- Thibault Hervier p1807341
- BRIGNONE JEAN p1709655 
- Khaled ABDRABO p1713323


Tuto cablage capteur eau
https://create.arduino.cc/projecthub/MansonHau/automatic-watering-system-c40bdf
