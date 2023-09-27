# Prérequis à la MEP

1. Etre à jour dans le repo local.
Dans le dossier du projet à déployer, vérifiez que vous êtes dans la bonne branche en vérifiant dans ce document, partie 3.

Ne pas hésiter à double-check le repo local en faisant un git pull, git log pour etre sur que l’on a bien récupérer les dernière modif.
Il se peut qu’une autre personne push un hotfix de dernière minute, que l’on ai changé de répertoire de travail, etc.

 

2. Fichiers d’environnement
Vérifier avec le repo local que la nouvelle version n’utilise pas de nouvelles clés dans les fichiers d’environnement (.env, globals.js). Normalement, le repo devops-creds est là pour s’assurer que ce qu’il y a sur le serveur de prod soit à niveau avec les fichier d’env mais ce n’est pas toujours la cas !

Dans les globals.js, s’assurer que les clés de prod soient bien active.

 

3. Sites statiques
Les sites statiques comme le front du BO est à compiler avant transfert depuis le repo local. Faire un npm run build. Dans le cas d’ajout de package, un npm run install sera requis avant.

 

4. Bases de données
Demander à tous les développeurs s’il n’y a pas eu une nouvelle colonne ou une nouvelle table d’ajouté en DEV dans la release à déployer. 

Normalement, une ou plusieurs requêtes d’ajout/modif de colonne/table doit être renseigné dans les commentaires de la demande concerné. Si ce n’est pas le cas, le lendemain matin le développeur en question devra apporter les chocolatines au bureau (règles #1 du bon developpeur). 

Lancer la ou les requêtes pendant le déploiement, juste après le docker-compose up -d.

 

5. Ajout de nouveau package dans l’app client Front
Lors d’ajout de nouveaux package sur le front il faut s’assurer que la compilation de nextjs fonctionne en prod. Faire un premier test en local.

Sur le répertoire de déploiement du front, se mettre sur la branche master et faire un npm run install pour installer les packages qui normalement sont installé dans le répertoire de dev. Faire ensuite un npm run build et vérifer qu’il n’y ait pas d’erreurs, ou que les erreurs (es-lint plour la plutart) no sont pas bloquant.


6. Compilation de l'image docker avec le script de deploiement
