USE asset_management;
CREATE TABLE user (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  dob DATE,
  joined_date DATE,
  gender VARCHAR(10),-- 0 (female) or 1 (male)
  staff_code CHAR(6), -- SD0001
  username VARCHAR(50), -- Binh Nguyen Van -> binhnv
  location VARCHAR(50),
  status VARCHAR(10),
  type VARCHAR(10),
  password VARCHAR(1000), 
  default_password VARCHAR(1000),
  first_login VARCHAR(5)
)
;
CREATE TABLE authorities (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  user_id INT ,
  authority VARCHAR(5),
  FOREIGN KEY(user_id) REFERENCES user(id)
)
;
CREATE TABLE asset (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  asset_code CHAR(8), 
  asset_name VARCHAR(500),
  specification VARCHAR(1000),
  installed_date DATE,
  state TINYINT(1), -- 0 Available, 1 Not Available, 2 Waiting for recycling, 3 Recycled
  location VARCHAR(100),
  user_id INT,
  category_id INT,
  FOREIGN KEY(user_id) REFERENCES user(id),
  FOREIGN KEY(category_id) REFERENCES category(id)
);

-- CREATE TABLE category (
--   id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
--   name VARCHAR(100) NOT NULL
-- );

CREATE TABLE category (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  prefix VARCHAR(10) NOT NULL,
  name VARCHAR(100) NOT NULL
);

--
insert into asset(id,asset_code,asset_name,specification,installed_date,state,location,user_id,category_id) 
values(id,asset_code,"laptop123","laptop xin lam nha",DATE '1999-01-29',1,"HN",1,1);

-- 
insert into category(id, prefix, name) 
values(id, "LA", "Laptop");
--

insert into user(id,first_name,last_name,dob,joined_date,gender,staff_code,username,location,password,type,status) values(id,"Dao","Thai",DATE '1999-01-29',DATE '1999-01-20',1,"NV1233","thaimedaaaaaaaa","HN","123",1,1);
insert into user(id,first_name,last_name,dob,joined_date,gender,staff_code,username,location,password) values(id,"Dao","Ninh",DATE '1999-01-29',DATE '1999-01-20',1,"NV1233","daoninhthai1","HN","321");

select * from user;
select * from asset;


