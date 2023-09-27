Avoir un fichier `version.txt` avec dedans le numéro de release à déployer

```
#!/bin/bash
# variables
# récupération du numéro de la nouvelle release (modifié manuellement dans le fichier version.txt)
filename='version.txt'
while read line; do
VERSION=$line
done < $filename

ENV_APP=("DEV" "DEMO" "TEST" "LIVE" "PRE-PROD" "PROD" "CUSTOM" "Quit")
ENV_BO=("DEV" "TEST" "PROD" "CUSTOM" "Quit")

selectProject () {
  echo '----------------------------------------------------------------'
  echo 'Choose project to deploy: '
  echo '----------------------------------------------------------------'
  PROJECTS=("API" "FRONT" "BO-API" "BO-FRONT" "CREATE-FORM" "CRON" "Quit")
  select PROJ in "${PROJECTS[@]}"; do
    case $PROJ in
      "API")
        IMG="api" # nom dossier et image docker du projet api client <----------------------------------------------------------------
        TAGS="APP"
        break
        ;;
      "FRONT")
        IMG="front" # nom dossier et image docker du projet front client <----------------------------------------------------------------
        TAGS="APP"
        break
        ;;
      "BO-API")
        IMG="bo-api" # nom dossier et image docker du projet api BO <----------------------------------------------------------------
        TAGS="BO"
        break
        ;;
      "BO-FRONT")
        IMG="bo" # nom dossier et image docker du projet front BO <----------------------------------------------------------------
        TAGS="BO"
        break
        ;;
      "CREATE-FORM")
        IMG="create-form" # nom image docker du projet création formulaire
        TAGS="PROD"
        break
        ;;
      "CRON")
        IMG="node-cron"
        TAGS="BO"
        break
        ;;
      "Quit")
        echo "Exit Deploy"
        exit
        ;;
      *) echo "invalid option $REPLY";;
    esac
  done
  echo "------ [$PROJ]"
}

getCustumTag () {
  read -p "Enter your custom tag here (kebab-case, no space, no special char): " TAG

  if [ -z "$TAG" ] 
  then 
      echo '--> tag should not be empty' 
      getCustumTag
  fi

  if ! [[ "$TAG" =~ ^[a-zA-Z0-9-]+$ ]]
  then 
      echo "--> tag should be a word or kebab-case" 
      getCustumTag
  fi
}

selectEnvironment () {
  echo '----------------------------------------------------------------'
  echo 'Choose environment: '
  echo '----------------------------------------------------------------'
  if [ $TAGS = "APP" ]
  then
    select ENV in "${ENV_APP[@]}"; do
      case $ENV in
        "DEV")
          TAG="dev"
          break
          ;;
        "DEMO")
          TAG="demo"
          break
          ;;
        "TEST")
          TAG="test"
          ENVIRONMENT='test'
          break
          ;;
        "LIVE")
          TAG="live"
          break
          ;;
        "PRE-PROD")
          TAG="preprod"
          break
          ;;
        "PROD")
          TAG="prod"
          break
          ;;
        "CUSTOM")
          getCustumTag
          break
          ;;
        "Quit")
          echo "Exit Tags"
          exit
          ;;
        *) echo "invalid option $REPLY";;
      esac
    done
  else
    if [ $TAGS = "BO" ]
    then
      select ENV in "${ENV_BO[@]}"; do
        case $ENV in
          "DEV")
            TAG="dev"
            break
            ;;
          "TEST")
            TAG="test"
            break
            ;;
          "PROD")
            TAG="prod"
            break
            ;;
          "CUSTOM")
            getCustumTag
            break
            ;;
          "Quit")
            echo "Exit Tags"
            exit
            ;;
          *) echo "invalid option $REPLY";;
        esac
      done
    fi
  fi
  echo "------ [$TAG]"
}

copyFrontBoEnv () {
  cp ./bo/.env.$TAG ./bo/.env
  cp ./bo/.env.$TAG ./bo/.env-dockerfile
}

copyFrontAppEnv () {
  cp ./front/.env.$TAG ./front/.env.production.local
}

selectProject
echo
echo
selectEnvironment
echo
echo


if [ $IMG = 'bo' ] # valorisation du fichier .env-dockerfile du front BO pour build
then
  copyFrontBoEnv
fi

if [ $IMG = 'front' ] # valorisation du fichier .env.production.local du front client pour build
then
  copyFrontAppEnv
fi

if [ $TAG = 'prod' ] # tag avec derniere version en production
then
  TAG=$VERSION
fi

if [ $IMG = "create-form" ]
then
  IMG="form" # nom dossier du projet création formulaire <----------------------------------------------------------------
  TAG="latest" # tags spécifique au formulaire de création
fi

if [ $IMG = "node-cron" ] && [ $TAG = $VERSION ] 
then
  TAG="latest"
fi


REPO='bananasplitio'
echo '================================================================'
echo "    Deploy [$IMG:$TAG]"
echo '----------------------------------------------------------------'


while true; do
read -p "Do you want to continue? (Y/n) " yn
yn='y'
case $yn in 
	[yY] ) echo ok, start building ...;
		break;;
	[nN] ) echo exiting...;
		exit;;
	* ) echo invalid response;;
esac
done

echo "---- execution commande ----> docker build -t $IMG:$TAG ./$IMG"
docker build -t $IMG:$TAG ./$IMG
echo ' set tag ...'
echo "---- execution commande ----> docker tag $IMG:$TAG $REPO/$IMG:$TAG"
docker tag $IMG:$TAG $REPO/$IMG:$TAG
echo ' pushing ...'
echo "---- execution commande ----> docker push $REPO/$IMG:$TAG"
docker push $REPO/$IMG:$TAG
echo '----------------------------------------------------------------'
echo "    Deployed [$IMG:$TAG]"
echo '================================================================'
```
