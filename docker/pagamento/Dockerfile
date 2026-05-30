

FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY . .

FROM node:18-alpine AS runner
WORKDIR /usr/app
ENV NODE_ENV=production
ENV PORT=8082
COPY --chown=node:node --from=builder /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/src ./src
COPY --chown=node:node --from=builder /usr/src/app/package*.json ./

USER node
EXPOSE 8082

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8082/healthz', (res) => { if (res.statusCode === 200) process.exit(0); else process.exit(1); })" || exit 1

CMD ["node", "src/index.js"]
