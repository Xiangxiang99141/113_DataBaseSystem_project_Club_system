# CLI

## 進行遷移
`npx sequelize-cli db:migrate`

## 成員(member)表
`npx sequelize-cli model:generate --name member --attributes M_id:UUID,M_account:string,M_name:string,M_pwd:string,M_phone:string,email:string,M_register_at:DATE`

## 社團(club)表
`npx sequelize-cli model:generate --name club --attributes C_id:integer,C_name:string,C_type:enum,C_intro:string,C_web:string,C_close:boolean,C_create_at:DATE`

## 社團成員(club_member)表
`npx sequelize-cli model:generate --name club_member --attributes C_id:integer,C_name:string,C_type:enum,C_intro:string,C_web:string,C_close:boolean,C_create_at:DATE`