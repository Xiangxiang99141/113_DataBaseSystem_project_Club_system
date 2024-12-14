if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

module.exports = {
  "development": {
    "username": process.env.DEV_DBUsername,
    "password": process.env.Dev_DBPassword,
    "database": process.env.DEV_DBName,
    "host": "127.0.0.1",
    "dialect": "mysql",
    "timezone": "+08:00" // 設定時區，這裡是 +08:00（台北）
  },
  // "test": {
  //   "username": "",
  //   "password": null,
  //   "database": "",
  //   "host": "127.0.0.1",
  //   "dialect": "mysql"
  // },
  // "production": {
  //   "username": "",
  //   "password": null,
  //   "database": "",
  //   "host": "127.0.0.1",
  //   "dialect": "mysql"
  // }
}
