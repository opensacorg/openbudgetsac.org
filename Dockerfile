FROM node:24

WORKDIR /home/node/app

COPY _src/package*.json ./
RUN npm install --force

COPY _src .

USER node

EXPOSE 8011

CMD ["npm", "run", "serve"]