# Utilise une image officielle Node.js
FROM node:20

# Crée un dossier pour ton app dans le container
WORKDIR /app

# Copie uniquement package.json et package-lock.json (plus rapide pour cache npm install)
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie le reste de ton projet
COPY . .

# Expose le port 3000
EXPOSE 3000

# Démarre Next.js en mode dev
CMD ["npm", "run", "dev"]
