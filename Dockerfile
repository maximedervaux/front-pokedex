# Étape 1 : Build de l'app
FROM node:24-alpine3.21 AS BUILD

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Étape 2 : Serveur Nginx pour les fichiers statiques
FROM nginx:alpine

# Copie le build dans le dossier public de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copie la config custom si besoin (optionnel)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

