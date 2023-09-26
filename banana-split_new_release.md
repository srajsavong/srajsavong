
Script de mise à jour du numéro de version
> requiert le fichier `version.txt` dans le meme dossier que ce script avec le nouveau numéro de version.
> On peut aussi passer par une variable.

Ce script, dans un fichier à la racine des projets `api`, `front`, `bo-api` et `bo` (cf variable `PROJECTS`) permet d'aller dans chaque dossier et de faire les opérations suivantes:
- aller sur la branche `dev`
- récupérer la dernière version
- mettre à jour le numéro de version dans le `package.json`
- commit et push dans `dev`
- aller sur la branche `master`
- récupérer la dernière version
- merger `dev` dans `master`
- push + ajout du tag qui va bloquer la nouvelle version

```
#!/bin/bash
# variables
confirmRelease () {
  read -p "Bump current to version [${VERSION}]: (Y/n)" yn
  case $yn in
    [yY] ) echo "ok, let's change this version";
      break;;
    [nN] ) echo Cancel...;
      exit;;
    * ) echo "Let's go !!"
  esac
}

# récupération du numéro de la nouvelle release (modifié manuellement dans le fichier version.txt)
filename='version.txt'
while read line; do
  VERSION=$line
done < $filename
# ----

# ---- Prompt de start
confirmRelease

# ---- response
if [ [$yn] = ["n"] ]
then
  echo $yn
fi

# ---- Begin process

OLDPATTERN="\"version\": "
NEWPATTERN="${OLDPATTERN}\"${VERSION}\","

PROJECTS=("api" "front" "bo-api" "bo")
echo 
echo 
echo "Upgrade projects's package.json to version $VERSION"

for p in "${PROJECTS[@]}"
do
  echo "[$p]"

  cd $p
  git checkout dev
  git pull
  # on regarde si la package des déja à la bonne version
  SHOULD_UPDATE=true
  PACKJSONFILE=package.json
  while read l; do
    # echo $l
    if [ "$l" = "$NEWPATTERN" ]
    then
      SHOULD_UPDATE=false
      break;
    fi
  done < $PACKJSONFILE

  if [ $SHOULD_UPDATE = true ]
  then
    read -p "UPDATE ${p} on VERSION ${VERSION}: (Y/n)" yn
    case $yn in
      [yY] ) echo "ok, bump version on package.json";
        break;;
      [nN] ) echo "Cancel update package.json in ${p}";
        exit;;
      * ) echo "ok, bump version on package.json"
    esac
    sed -i '' "s/  $OLDPATTERN.*/  ${NEWPATTERN}/" package.json
    git add .
    git commit -m "Bump version v${VERSION}"
    git push
  fi

  git checkout master
  git pull origin master

  SHOULD_MERGE=true
  PACKJSONFILE=package.json
  while read l; do
    # echo $l
    if [ "$l" = "$NEWPATTERN" ]
    then
      SHOULD_MERGE=false
      break;
    fi
  done < $PACKJSONFILE

  if [ $SHOULD_MERGE = true ]
  then
    read -p "Merge DEV in MASTER ?: (Y/n)" yn
    case $yn in
      [yY] ) echo "ok, let's merge";
        break;;
      [nN] ) echo "Cancel merge DEV in MASTER for ${p}";
        exit;;
      * ) echo "ok, let's merge"
    esac
    git merge dev
    read -p "Is merge OK ?: (Y/n)" yn
    case $yn in
      [yY] ) echo "ok, let's push";
        break;;
      [nN] ) echo "Cancel push master for ${p}";
        exit;;
      * ) echo "ok, let's push"
    esac
    git push origin master
  fi

  read -p "Add TAG v${VERSION} on ${p} ?: (Y/n)" yn
  case $yn in
    [yY] ) echo "ok, let's tag";
      break;;
    [nN] ) echo "Cancel tag ${p}";
      exit;;
    * ) echo "ok, let's tag"
  esac
  git tag -a v$VERSION -m "version ${VERSION}"
  read -p "Is TAG OK ?: (Y/n)" yn
  case $yn in
    [yY] ) echo "ok, let's push";
      break;;
    [nN] ) echo "Cancel push master for ${p}";
      exit;;
    * ) echo "ok, let's push"
  esac
  git push origin v$VERSION

  cd ../
done

```
