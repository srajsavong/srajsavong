# Procédure d'utilisation de ngrok

Sur le navigateur web

Allez sur [ngrok](https://ngrok.com/), créer un compte et télecharger l’application sur le mac.

 

Sur le mac

Dézippez l’archive et déplacer le fichier dans `/usr/local/bin/`.

 

Sur le navigateur web

Allez dans `https://dashboard.ngrok.com/get-started/setup` et récupérez le token dans la partie `2-Connect` your account du tuto

 

Sur le terminal

Tapez la commande 
```
ngrok config add-authtoken <MON_TOKEN>
```

Utilisation de ngrok pour créer un tunnel avec le port 5001 en localhost
```
ngrok http 5001
```

Vous obtiendrez quelque chose de semblable à ceci:
```
ngrok                                                                                                 (Ctrl+C to quit)

Hello World! https://ngrok.com/next-generation

Session Status                online
Account                       somphavanh.rajsavong@jdc.fr (Plan: Free)
Version                       3.0.6
Region                        Europe (eu)
Latency                       21ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://5e7d-82-65-59-211.eu.ngrok.io -> http://localhost:5001
```

Ici, ce qui va nous interresser c’est la dernière ligne `Forwarding`, en particulier l’url `https://5e7d-82-65-59-211.eu.ngrok.io`

C’est cette url qu’on utilisera, par exemple dans l’API client dans la pour la clé `API_URL_DIST`. Les callback depuis les modules de paiement se feront sur cette url, donc en local.
