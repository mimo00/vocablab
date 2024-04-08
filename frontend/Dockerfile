FROM node:20.12.1-alpine3.19

WORKDIR /app

COPY vocablab/package.json ./
COPY vocablab/package-lock.json ./
RUN npm install
RUN #npm install react-scripts@3.4.1 -g --silent

COPY vocablab/ ./

CMD ["npm", "run", "dev"]