# CLI

## 進行遷移
`npx sequelize-cli db:migrate`

## 成員(member)表
`npx sequelize-cli model:generate --name member --attributes M_id:UUID,M_account:string,M_name:string,M_pwd:string,M_phone:string,email:string,M_register_at:DATE`

## 社團(club)表
`npx sequelize-cli model:generate --name Club --attributes C_name:string,C_type:enum,C_intro:string,C_web:string,C_close:boolean,C_quato:integer`

## 社團成員(club_member)表
`npx sequelize-cli model:generate --name Club_member --attributes C_id:bigint,M_id:UUID,Cme_job:enum,Cme_member_join_at:DATE`

## 社團報名紀錄(club_sign_record)表
`npx sequelize-cli model:generate --name Club_sign_record --attributes M_id:UUID,signup_at:DATE,singup_cause:string,is_verify:boolean,not_verify_cause:string,C_id:bigint`

## 社團課程(club_course)表
`npx sequelize-cli model:generate --name Club_course --attributes Cc_id:integer,Cc_name:string,Cc_content:string,Cc_location:string,Cc_date:Date,Cc_quota:integer,Cc_open_at:Date,Cc_close_at:DATE,insurance:boolean,transportation:boolean,C_id:bigint`

## 社團活動(club_activity)表
`npx sequelize-cli model:generate --name Club_activity --attributes Ca_id:integer,Ca_name:string,Ca_content:string,Ca_location:string,Ca_date:Date,Ca_quota:integer,Ca_open_at:Date,Ca_close_at:DATE,insurance:boolean,transportation:boolean,Ca_plan:string,C_id:bigint`


## 社團參與紀錄(club_record)表
`npx sequelize-cli model:generate --name Club_record --attributes Cr_id:integer,M_id:uuid,Cr_type:enum,Ca_id:integer,Cc_id:integer,Cr_comment:string,Cr_vote:enum`