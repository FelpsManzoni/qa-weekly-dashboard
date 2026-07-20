# --- build stage: compile the SPA ---
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
# Same-origin API: the SPA calls "/api", which nginx proxies to the api service.
ENV VITE_API_URL=/api
RUN npm run build

# --- runtime stage: serve static files with nginx ---
FROM nginx:alpine AS runtime
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
