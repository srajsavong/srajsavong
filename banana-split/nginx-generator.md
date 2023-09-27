# Création site sur le serveur

1. site statique

Exemple avec le nom de domaine `home.banana-split.io`.
répertoire local du site `/var/www/html/home-client`, nom dans nginx `home-front`

Commande générique:
```
nginx-generator 
 --name <NAME> 
 --domain <DOMAIN>
 --type <TYPE>
 --var <VAR>
 <PATH>
```

params: 
- NAME: `home-front`
- DOMAIN: `home.banana-split.io`
- TYPE: `static`
- VAR: `dir=/var/www/html/home-client`
- PATH: `/etc/nginx/sites-enabled/home-front`

```
nginx-generator --name home-front --domain home.banana-split.io --type static --var dir=/var/www/html/home-client /etc/nginx/sites-enabled/home-front
```

va créer le fichier **home-front** dans **/etc/nginx/sites-enabled**.

check config
```
sudo nginx -t
```

génération certif
```
sudo certbot --nginx
```

choisir le nom de domaine à ajouter.
va ajouter les certifs pouir le NDD dans `/etc/nginx/sites-enabled/home-front`.

redemare le service
```
sudo service nginx restart
```

2. site dans container docker

Exemple avec le nom de domaine **play-api.banana-split.io**.
nom dans nginx `playground-api`
port `3042`, à check le ficher `/home/centos/apps/docker-compose.yml` le dernier port utilisé +1

Commande générique:
```
nginx-generator 
 --name <NAME> 
 --domain <DOMAIN>
 --type <TYPE>
 --var <VAR>
 --port <PORT>
 <PATH>
```

params: 

- NAME: playground-api
- DOMAIN: play-api.banana-split.io
- TYPE: proxy
- VAR: localhost
- PORT: 3042
- PATH: /etc/nginx/sites-enabled/playground-api

```
nginx-generator --name playground-api --domain play-api.banana-split.io --type proxy --var host=localhost --var port=3042 /etc/nginx/sites-enabled/playground-api
```

Comme site static faire un check config, génération certifs et restart nginx

 

dans /home/centos/apps/docker-compose.yml

ajouter un service comme les modeles précédent. l’image docker se lance sur le port 3000, le mapper dans le fichier de config yml avec le pour choisit dans nginx

 
