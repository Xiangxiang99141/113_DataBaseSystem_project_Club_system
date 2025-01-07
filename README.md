# Node.js + Express + MVC

+ 主題 : 社團系統
+ 架構： MVC 架構
  1. 資料夾結構
    ```
    ├─config
    ├─controllers
      ├─indexController.js
    ├─models
      ├─indexModel
    ├─node_modules
    ├─routes
    ├─util
    ├─views
      ├─index.ejs
    └─app.js
    ```
  2.
+ 使用套件
  1. Express
  2. Mysql2
  3. EJS

+ Docker
  1. `docker build -t 113-club-system .`
 
 docker run --name mariadb --env MARIADB_USER=clubsystem --env MARIADB_PASSWORD=clubsystem --env MARIADB_DATABASE=club_system --env MARIADB_ROOT_PASSWORD=password -p 3306:3306 -d sha256:a3c3ecdba222d33017b1128ae2a5930a3d6b8b21cd6d5e534886e75a523612ee

 $ docker run --detach --name mariadb --env MARIADB_USER=clubsystem --env MARIADB_PASSWORD=clubsystem --env MARIADB_DATABASE=club_system --env MARIADB_ROOT_PASSWORD=password   -p 3306:3306 mariadb:latest

mkdir uploads
mkdir uploads/activity
mkdir uploads/announment
mkdir uploads/equipment
mkdir uploads/histories
mkdir uploads/misc