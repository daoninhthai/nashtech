insert into user(id,first_name,last_name,dob,joined_date,gender,staff_code,username,location,password,status,default_password)
 values
(1,'Nguyen','Nguyen',DATE '1999-01-29',DATE '1999-01-20',1,'NV1111','nguyennguyen','HN','123','enabled','nguyenn@29011999'),
(3,'Dao','Thai',DATE '1999-01-29',DATE '1999-01-20',1,'NV3333','admin','HN','admin@123','enabled','daot@29011999'),
(2,'Duong','Manh Hieu',DATE '1999-01-29',DATE '1111-11-11',1,'NV2222','duongmh','HN','$2a$10$ygb2.eYe9QBg9V3DlU7whOLG177uIdtPAZEwl.Xb/QTLqDKT4eGW6','enabled','duongm@1111111'),
(4,'Long','Long',DATE '1999-01-29',DATE '1999-01-20',1,'NV4444','longlong','HN','123','enabled','longl@29011999'),
(5,'Hoang','Hoang',DATE '1999-01-29',DATE '1999-01-20',1,'NV5555','hoanghoang','HN','123','enabled','hoangh@29011999'),
(6,'Huong','Huong',DATE '1999-01-29',DATE '1999-01-20',1,'NV6666','huonghuong','HN','123','enabled','huongh@29011999'),
(7,'Tuan','Tuan',DATE '1999-01-29',DATE '1999-01-20',1,'NV7777','tuantuan','HN','123','enabled','tuant@29011999');





insert into authorities(id,user_id,authority)
values
(1,3,'ADMIN'),
(2,1,'STAFF'),
(3,2,'STAFF'),
(4,4,'STAFF'),
(5,5,'STAFF'),
(6,6,'STAFF'),
(7,7,'STAFF');

