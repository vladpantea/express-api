FROM node:slim

ARG FORCE_COLOR=1

WORKDIR /app
COPY . .

# If you have native dependencies, you'll need extra tools
# RUN apk add --no-cache make gcc g++ python

RUN npm install

EXPOSE 5080
CMD ["node", "index.js"]