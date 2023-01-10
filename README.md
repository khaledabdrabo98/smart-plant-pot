# ArduinoJKT : Project IoT



---

## Description du projet

Le but de ce projet est d'utiliser un hygromètre pour mesurer le taux d'humidité d'un pot de fleur et informer l'utilisateur du besoin en eau de la plante. On a aussi la possibilité de sauvegarder cette valeur sur un serveur pour un potentiel suivi.

Les informations sont données par un système de LED:

> <span style="color:lime">**O**</span>: la plante est heureuse.
> <span style="color:gold">**O**</span>: la plante commence à avoir soif.
> <span style="color:red">**O**</span>: la plante meurt de soif.
> <span style="color:lime">**O**</span><span style="color:red">**O**</span>: la plante se noie.
>
> <span style="color:lime">**O**</span> > <span style="color:gold">**O**</span> > <span style="color:red">**O **</span>: la taux d'humidité actuel est sauvegardé sur le serveur.

Les besoins en eau de la plante sont récupérés via la connexion à l'API *"OpenPlantBook"* après identification de la plante par photo via l'API *"PlantID"* puis envoyé à l'Arduino.

La communication Arduino-WEB est effectuée par l'intermédiaire d'un script Python (bibliothèque PySerial)



---

## Possibles extensions (après implémentation de l'hygromètre)

- **[<span style="color:lime">FAIT</span>] Ajout d'un capteur capacitif : Transforme la plante en actionneur.**

  > - Toucher la plante allume/éteint l'affichage LED.
  > - Pincer la plante sauvegarde le taux d'humidité actuel sur le serveur.

- **Implémentation d'un shield Arduino Wifi : Suppression de l'interfaçage Arduino-WEB via Python**

  > - Les communications se font directement depuis l'Arduino via des GET/POST
  > - *"Cette méthode n'a pas été initialement choisie du fait de son coût (~30€) mais aussi car le temps de commande du composant et de son implémentation ne collait pas à notre deadline…"*
  
- **Modification du système LED**

  - Ajout d'un écran en lieu et place du système LED.

    > - Toucher la plante allume/éteint l'écran
    > - Les informations sont transmises par texte défilant ou emojis.

  **OU**

  - Ajout d'un haut-parleur en lieu et place du système LED ; la plante s'exprime oralement

    > - Lorsqu'on la touche.
    > - Toutes les heures si elle commence à avoir soif.
    > - Tous les quart d'heure si elle meurt de soif.
    > - Immédiatement lorsqu'elle se noie.

- **Ajout d'un capteur de lumière : Comparaison avec les données de l'API**

  

---

## Intelligence

Les noms scientifiques des plantes sont récupérés sur une API, et leurs informations (besoin en humidité, lumière, etc..)  sur une autre. La plante sujet sera identifiée grâce à une photo, et à un algorithme de Machine Learning qui tourne sur la 1ère API. La quantité d'eau nécessaire au bien être de la plante sujet sera utilisé comme fourchette pour notre Arduino qui informera l'utilisateur que la quantité d'eau dans la terre sort, ou non, de cette fourchette.

### API utilisées

- Identification de la plante en en prenant une photo, envoyée sur l'[API](https://plant.id/) de détection 

- Récupération des détails des besoins de la plante identifiée sur la deuxième [API](https://open.plantbook.io/)

  

---

## Capteurs / actionneurs

- [Capteur] : 1 [Hygromètre](www.shorturl.at/klyNZ)
  *Initialement nous avons essayé d'utiliser le graphite de crayons à papier, mais l'efficacité était moindre, nous avons donc commandé un véritable hygromètre.*
- [Capteur] : 1 Plante
- [Actionneur] : 3 LED *(rouge, jaune, verte)*

> - [Capteur] : 1 Luxmètre *(si extension)*
> - [Actionneur] : 1 Ecran LCD *(si extension)*
> - [Actionneur] : 1 Haut-parleur + shield audio *(si extension)*

## Autre matériel

- 1 Arduino UNO

- 1 Bread-board

- 1 Résistance 1M *(pour le capteur capacitif)*

- 8 Câbles *(dont 1 pour le capteur capacitif, 4 pour le système LED et 3 pour l'hygromètre)*

  

---

## Câblage

.<img src="https://i.ibb.co/JkZD971/schema-cablage.png">

## Code

- [Arduino](https://forge.univ-lyon1.fr/p1713323/iot/-/blob/main/waterTouch.ino)

- [WEB/API](https://forge.univ-lyon1.fr/p1713323/iot/-/tree/main/api)

  

---

## Membres :

- Thibault HERVIER p1807341
- Jean BRIGNONE p1709655 
- Khaled ABDRABO p1713323
