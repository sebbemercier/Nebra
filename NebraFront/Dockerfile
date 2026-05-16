FROM oven/bun:latest as builder

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY . .
RUN bun run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Default vite port is usually 5173 for dev, but for production it's 80.
# However, to keep it consistent with docker-compose.yml:
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
