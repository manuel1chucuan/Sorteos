FROM node:22-alpine AS builder

WORKDIR /app
COPY index.html styles.css app.js package.json ./
COPY scripts/ ./scripts/
COPY assets/ ./assets/
RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/ /usr/share/nginx/html/
