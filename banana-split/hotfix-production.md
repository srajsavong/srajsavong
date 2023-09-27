# Ajout Hotfix en PROD

Lorsqu’un bug majeur est détecté en production et qu’il faut impérativement le corriger sans attendre la prochaine release, il faut réaliser un hotfix sur la branche master et le déployer en prod.

1. Se positionner sur la branche master et se mettre à jour

```
git checkout master
git pull origin master
```

2. Créer un banche nommer `hotfix/[NUM_VERSION]`
```
git checkout -b hotfix/2.0.6 origin/master
```

3. Coder le correctif attendu

4. Tester et re-tester

5. Poussez le correctif
```
git push origin hotfix/2.0.6
```

6. Se remettre sur master et merger le hotfix
```
git checkout master
git merge hotfix/2.0.6
git push origin master
```

7. Ajouter un tag pour le hotfix
```
git tag -a 2.0.6 -m "Hotfix 2.0.6 - DESCRIPTION SOMMAIRE"
```

8. Intégrer le hotfix dans la branche dev
```
git checkout dev
git pull origin dev
git merge hotfix/2.0.6
git push origin dev
```

9. Suppression de la branche du hotfix
```
git branch -d hotfix/2.0.6
git push origin --delete hotfix/2.0.6
```
