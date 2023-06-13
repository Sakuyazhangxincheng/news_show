/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     2023/5/20 9:22:54                            */
/*==============================================================*/


drop table if exists collection;

drop table if exists comment;

drop table if exists news;

drop table if exists user;

/*==============================================================*/
/* Table: collection                                            */
/*==============================================================*/
create table collection
(
   collection_id        int,
   user_id              int,
   news_id              int
);

/*==============================================================*/
/* Table: comment                                               */
/*==============================================================*/
create table comment
(
   comment_id           int,
   user_id              int,
   news_id              int,
   comment              char(255)
);

/*==============================================================*/
/* Table: news                                                  */
/*==============================================================*/
create table news
(
   news_id              int not null comment 'Ψһ��ʶ��',
   type                 int comment '��������',
   title                char(255) comment '���ű���',
   publisher            char(255) comment '���ų�����',
   url                  char(255) comment '���ʵ�ַ',
   img_url              char(255) comment 'ͼƬ��ҳ���ʵ�ַ',
   date                 char(255) comment '����ʱ��',
   primary key (news_id)
);

/*==============================================================*/
/* Table: user                                                  */
/*==============================================================*/
create table user
(
   user_id              int not null comment 'Ψһ��ʶ��',
   username             char(255) comment '�û��˺�',
   password             char(255) comment '�û�����',
   img_url              char(255) comment 'ͼƬ��ַ',
   phone                char(255) comment '�ֻ�����',
   primary key (user_id)
);
