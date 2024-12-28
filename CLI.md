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

## 社團會議(club_meeting)表
`npx sequelize-cli model:generate --name Club_meeting --attributes Cm_id:integer,Cm_name:string,Cm_chair:uuid,Cm_content:string,Cm_location:string,C_id:bigint`
## 社團會議紀錄(club_meeting_record)表
`npx sequelize-cli model:generate --name Club_meeting_record --attributes Cm_id:integer,Cmr_content:TEXT`
## 社團會議參與人(club_meeting_participate_member)表
`npx sequelize-cli model:generate --name Club_meeting_participate_member --attributes Cm_id:integer,M_id:uuid`

## 社團器材(club_equipment)表
`npx sequelize-cli model:generate --name Club_equipment --attributes Ce_id:integer,Ce_name:string,Ce_spec:string,Ce_count:integer,Ce_use:string,Ce_source:enum,Ce_img:string,Ce_admin:uuid,Ce_report:uuid,Ce_purch_at:date,C_id:bigint`

## 社團歷史紀錄(club_history)表
`npx sequelize-cli model:generate --name Club_history --attributes Ch_id:integer,Ch_type:enum,Ch_name:string,Ch_description:string,Ch_update_at:date,C_id:bigint`

## 社團公告(club_announcement)表
`npx sequelize-cli model:generate --name Club_announcement --attributes Can_id:integer,Can_title:enum,Can_content:text,Can_attachment:string,Can_image:string,Can_created_at:date,C_id:bigint`

## 保險紀錄(insurance)表
`npx sequelize-cli model:generate --name Insurance --attributes Ins_id:integer,Ins_isadult:boolean,Ins_idcard:string,Ins_engname:string,Ins_nationality:enum,Ins_idcardimg:string,Ins_birthday:DATEONLY,Ins_liaison:string,Ins_liaison_phone:string`

## 交通紀錄(transportation)表
`npx sequelize-cli model:generate --name Transportation --attributes Ts_id:integer,Ts_method:enum`

## 社課活動報名紀錄(signup_record)表
`npx sequelize-cli model:generate --name Signup_record --attributes su_id:integer,M_id:uuid,Su_type:enum,Ca_id:integer,Cc_id:integer,Ins_id:integer,Ts_id:integer,Ts_method:enum,Su_date:date`