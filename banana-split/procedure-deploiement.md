# Déploiement sur les serveurs

Les APIs et application front pour le BO, la caisse et la partie paiement sont hébergées sur 1 seul serveur par environnement. 

Le déploiement d'une application consiste à envoyer une image de l'api ou de l'application préalablement compilé vers un repository qui est dans notre cas [Docker Hub](https://hub.docker.com).

## Instructions

### 1- Connexion aux serveurs

> Adresse ip des serveurs:
> 
> dev-app: 141.94.104.113
> 
> prod-app: 141.94.105.158

S’assurer de pourvoir se connecter aux serveurs de TEST et PROD avec sa clé SSH. Il faut d’abord créer une entrée dans le fichier `~/.ssh/config` en mettant un alias, l’IP su serveur et la localisation de sa clé SSH comme ceci:
```
Host [ALIAS] [IP.SERVER]
        HostName [IP.SERVER]
        IdentityFile [PATH/TO/SSH/KEY]
        User centos
```

Enregistrez le fichier de config puis lancez la commande suivante pour vous connecter
```
ssh [alias]
```

Si c’est la première connexion le terminal va vous demander de confirmer la connexion au serveur
```
The authenticity of host '[IP.SERVEUR]' can't be etablished.
ESCDA key fingerprint ...
Are you sure ... ?
```

Tapez `yes` dans le terminal et appuyer sur la touche entrée.

Vous devrez ensuite saisir le mot de passe de votre clé SSH.
```
Enter passphrase for key '/PATH/TO/MY/SSH/KEY':
```

Si tous se passe bien le prompt devrait être comme ceci:
```
[centos@[ALIAS] ~]$ 
```

### 2- Mise à jour du numéro de version
Après s'être connecté en ssh sur le serveur distant, naviguer dans le dossier `/home/centos/apps`. Dans ce dossier on retrouve plusieurs dossiers contenant un fichiers `.env` et le fichier `docker-compose.yml`.

Il faut bump les numéros de version pour dire quelle image utiliser.

Dans chaque fichier `.env`, retrouvez la clé `VERSION` et mettez le bon numéro.
```
// déploiement de la version 2.0.35
VERSION="2.0.35"
```

Faire de même dans le fichier `docker-compose.yml` où chaque noeud sous `SERVICES` correspond à une app. Retrouvez la clé `image` de chaque service ayant l'ancien numéro de version.
```
// déploiement de la version 2.0.35
// image: bananasplitio/bo:2.0.34
// devient ...
image: bananasplitio/bo:2.0.35

```

### 3- Sauvegarde des logs de l'api (en production)
Un dossier de sauvegarde se trouve sur le serveur d’application dans `/home/centos/logs`.

Actuellement on sauvegarde ne sauvegarde que les logs de l'api, qui sont écrasé après chaque déploiement.

Toujours dans le répertoire `/home/centos/apps` on va récupérer les dernières versions des images (mises à jour localement dans le chapitre précédent).
```
docker-compose pull
```

On va maintenent sauvegarder les logs du container docker de l'api à cet instant T dans le dossier `logs` dans un fichier que l'on va nommer `api-[timestamp]-[version].log` et tout de suite après déployer la nouvelle verision.
On fera ceci avec une seule ligne de commande pour lancer les container dès que la sauvegarde  sera terminée.
```
docker logs -t api >> ../logs/api-20230926-2.0.35.log && docker-compose up -d --build
```

> La commande `docker logs -t api` affiche les log aec un timestamp (-t) en option de l'image `api`.
> Ajouter `>> [path/filename/ext]` permet d'exporter ces logs vers le fichier `filename.ext`.
> Ensuite le `docker-compose up -d --build` relance toutes les images du fichier docker-compose


Si tout se déroule sans erreur, on peux vérifier que les applications sont bien déployés
```
docker-compose logs -f api
```
