FROM grafana/k6:1.0.0 AS k6

FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app

RUN apk add --no-cache curl

COPY --from=k6 /usr/bin/k6 /usr/bin/k6
COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/k6 ./k6

ENV NODE_ENV=production
ENV PORT=3100
ENV HOSTNAME=0.0.0.0

EXPOSE 3100
CMD ["node", "server.js"]
