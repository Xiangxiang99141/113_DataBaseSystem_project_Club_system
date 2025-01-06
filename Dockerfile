# 使用版本
FROM node:alpine

#工作目錄
WORKDIR /usr/src/app

#複製package
COPY package*.json ./

#環境建立
RUN npm install 

#複製當前目錄
COPY . .
EXPOSE 3000

RUN npx sequelize-cli db:migrate
CMD ["npm" ,"start"]
