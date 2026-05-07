FROM node:24 AS base

WORKDIR /app

COPY _src/package*.json ./

# Avoid downloading Puppeteer's browser in the shared base layer.
# `docker compose up` builds the runtime target only and does not need Chromium.
ENV PUPPETEER_SKIP_DOWNLOAD=true
RUN npm audit fix
RUN npm ci --include=dev

COPY _src .

FROM base AS chromium-deps

# Chromium runtime dependencies for Puppeteer e2e tests.
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxext6 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxkbcommon0 \
    libxrandr2 \
    libxss1 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

RUN PUPPETEER_SKIP_DOWNLOAD=false npx puppeteer browsers install chrome

FROM chromium-deps AS test

# Build TypeScript assets and run the full verification suite inside Docker.
RUN npm run docs:jsdoc && npm run build && npm run test:docker

FROM chromium-deps AS verify-parallel

# Build TypeScript assets once, then run the parallel verification target.
RUN npm run docs:jsdoc && npm run build && npm run verify:all:parallel

FROM base AS runtime

# Build the compiled TypeScript assets that Eleventy serves from the runtime image.
RUN npm run build

EXPOSE 8011

CMD ["npm", "run", "site:serve"]
