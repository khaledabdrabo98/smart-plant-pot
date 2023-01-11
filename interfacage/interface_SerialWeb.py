####################################################
# M2IA - Projet d'IoTR - WaterTouch
# Par HERVIER, BRIGNONE et ABDRABO
# Code pour l'interface bi-directional Arduino-WEB
####################################################

# Import des bibliothèques
import serial.tools.list_ports
import requests

####################################################

def api_get(var):
    url = "http://localhost:3000/plant/myplant/"  # URL des données sauvegardées de la plante
    r = requests.get(url=url)
    data = r.json()
    return data['message'][var]

def api_post(val):
    url = "http://localhost:3000/plant/update?moisture_level=[0,1,2,3]/"  # URL de l'api
    data = {'moistureState': val}
    r = requests.post(url=url, json=data)
    return r.text

####################################################

# Recherche du port Arduino
print("\n[Searching for ports...]")
ports = serial.tools.list_ports.comports(include_links=False)
if len(ports) != 0:  # s'il y a des ports actifs on les affiche
    print(">> SUCCESS : " + str(len(ports)) + " active ports detected:")
    id = 0
    for port in ports:
        print('   ' + str(id) + '- ' + port.device)
        id += 1
    # S'il y en a plusieurs on demande à l'utilisateur de sélectionner le bon
    selected = 0
    if len(ports) > 1:
        selected = int(input('Enter the desired line id: '))

# Connexion à l'Arduino
    print('\n[Connecting to ' + ports[selected].device + "...]")
    try:
        arduino = serial.Serial(ports[selected].device, 9600, timeout=1)
    except serial.SerialTimeoutException:
        print('>> FAILURE : Connection timeout')
    print('>> SUCCESS : Connected to the Arduino on port ' + arduino.name)

# On récupère les données envoyées par l'Arduino
    count = 0
    while True:
        dataReceived = arduino.readline()[:-2].decode()
        if dataReceived != "":  # s'il y a des choses à lire
            if count < 4: count += 1
            if count == 1 : print('\n[Testing initiated...]')
            if count == 3 : print('>> SUCCESS - Testing has ended \n\n[Communication established]')

            # API to Arduino
            if dataReceived == "min":  # si on recoit "min", c'est que l'arduino veut la min_soil_moist
                print('>> min_soil_moist requested')
                dataSent = str(api_get('min_soil_moist')) + "$"  # on récupère les données avec un GET à l'API (le $ sert de stoppeur)
                print('>> sending ' + dataSent[:-1] + ' to Arduino')
                arduino.write(dataSent.encode())  # on envoie
            elif dataReceived == "max":  # si on recoit "max, c'est que l'arduino veut la max_soil_moist
                print('>> max_soil_moist requested')
                dataSent = str(api_get('max_soil_moist')) + "$"
                print('>> sending ' + dataSent[:-1] + ' to Arduino')
                arduino.write(dataSent.encode())

            # Arduino to Server
            else:  # sinon il s'agit de la valeur de moistureState actuelle (l'état de la plante)
                for moistureState in range(4):  # 0:contente - 1:assoiffée - 2:déséchée - 3:noyée
                    if str(moistureState) == dataReceived:
                        print('>> moistureState received')
                        print(">> sending ", moistureState, " to API")
                        api_post(moistureState)  # on envoie la donnée au serveur

else:  # s'il n'y a pas de port actif
    print(">> FAILURE : No active port detected")
