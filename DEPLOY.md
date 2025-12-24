# Guide de Déploiement VPS (Debian)

Ce guide vous explique comment déployer l'application **WESK Pycolo 2026** sur un serveur VPS Debian propre.

## Prérequis
- Un VPS sous Debian 11 ou 12.
- Accès SSH root ou sudo.

## 1. Installation de Docker et Docker Compose

Connectez-vous à votre VPS et exécutez les commandes suivantes pour installer Docker :

```bash
# Mettre à jour les paquets
sudo apt update && sudo apt upgrade -y

# Installer les dépendances
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release

# Ajouter la clé GPG officielle de Docker
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Ajouter le dépôt Docker
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Installer Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Vérifier l'installation
sudo docker --version
sudo docker compose version
```

## 2. Déploiement de l'application

### Option A : Copie via Git (Recommandé)
Si votre projet est sur un dépôt Git :
```bash
git clone <votre-repo-url> wesk-app
cd wesk-app
```

### Option B : Copie manuelle (SCP/SFTP)
Copiez tout le dossier du projet sur votre VPS (par exemple dans `/home/user/wesk-app`).

## 3. Lancement

Dans le dossier du projet sur le VPS :

```bash
# Lancer les conteneurs en tâche de fond (detached mode)
sudo docker compose up -d --build
```

L'application sera accessible sur :
- Frontend : `http://<IP_DU_VPS>`
- Backend : `http://<IP_DU_VPS>:3000`

## 4. Gestion

- **Voir les logs** : `sudo docker compose logs -f`
- **Arrêter** : `sudo docker compose down`
- **Redémarrer** : `sudo docker compose restart`

## Notes importantes
- **Base de données** : Le fichier `database.sqlite` est stocké dans le volume monté (`./server/database.sqlite`). Il persistera même si vous redémarrez les conteneurs.
- **Uploads** : Les fichiers uploadés sont dans `./server/uploads`.
- **Sécurité** : Pour la production, pensez à configurer un pare-feu (UFW) et changer le `JWT_SECRET` dans `docker-compose.yml`.
