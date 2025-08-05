FROM node:18-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./

FROM base AS dependencies
RUN npm install --only=production

FROM base AS build
RUN npm install
COPY . .
RUN npm run build

FROM base AS release
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "dist/server.js"]