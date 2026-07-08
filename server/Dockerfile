# --- build stage ---
FROM node:20-alpine AS build
WORKDIR /app
COPY server/package.json server/package-lock.json* ./
RUN npm install
COPY server/tsconfig.json ./
COPY server/src ./src
RUN npm run build

# --- runtime stage ---
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY server/package.json server/package-lock.json* ./
RUN npm install --omit=dev
COPY --from=build /app/dist ./dist
# Migrations + seed are copied into the image so the API can self-provision the schema.
COPY db ./db
ENV MIGRATIONS_DIR=/app/db/migrations
EXPOSE 3000
CMD ["node", "dist/index.js"]
