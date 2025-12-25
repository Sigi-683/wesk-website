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
## 5. Configuration HTTPS (Domaine personnalisé)

Si vous avez un nom de domaine (ex: `mon-site.com`), voici comment sécuriser l'application avec SSL (HTTPS).

**Architecture** :
Nous allons utiliser un serveur Nginx installé **directement sur le VPS** comme "Reverse Proxy" qui gérera le HTTPS et renverra le trafic vers notre application Docker.

### Étape 1 : Préparer Docker
Dans le fichier `docker-compose.yml`, assurez-vous que le service frontend écoute sur le port 8080 localement (pour ne pas entrer en conflit avec le Nginx du VPS qui prendra le port 80).
J'ai déjà configuré le `docker-compose.yml` pour utiliser `127.0.0.1:8080:80`.

Lancez votre application :
```bash
sudo docker compose up -d
```

### Étape 2 : Installer Nginx et Certbot sur le VPS
```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
```

### Étape 3 : Configurer Nginx
Créez un fichier de configuration pour votre site :
```bash
sudo nano /etc/nginx/sites-available/wesk-app
```

Collez-y le contenu suivant (remplacez `votre-domaine.com` par votre vrai domaine) :

```nginx
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Activez le site :
```bash
sudo ln -s /etc/nginx/sites-available/wesk-app /etc/nginx/sites-enabled/
sudo nginx -t # Vérifier la config
sudo systemctl restart nginx
```

### Étape 4 : Activer le HTTPS avec Certbot
Lancez simplement :
```bash
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com
```
Suivez les instructions. Certbot va automatiquement modifier votre configuration Nginx pour activer le SSL et configurer le renouvellement automatique.

Félicitations, votre site est maintenant accessible en HTTPS ! 🔒
