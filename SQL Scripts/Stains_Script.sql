DROP DATABASE IF EXISTS stains;
CREATE DATABASE IF NOT EXISTS stains;
USE stains;

CREATE TABLE IF NOT EXISTS lookupemploymenttypes (
    id int NOT NULL AUTO_INCREMENT,
    typename varchar(255),
    PRIMARY KEY(id)
);
 
CREATE TABLE IF NOT EXISTS lookuppermissions (
    id int NOT NULL AUTO_INCREMENT,
    permissionname varchar(255),
    datecreated date,
    PRIMARY KEY(id)
);
 
CREATE TABLE IF NOT EXISTS lookupuserroles (
    id int NOT NULL AUTO_INCREMENT,
    rolename varchar(255),
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS techstacks (
    id int NOT NULL AUTO_INCREMENT,
    techname varchar(255),
    datecreated date, 
    PRIMARY KEY(id)
);
 
CREATE TABLE IF NOT EXISTS features (
    id int NOT NULL AUTO_INCREMENT,
    featurename varchar(255),
    PRIMARY KEY(id)
);
 
CREATE TABLE IF NOT EXISTS users (
    id int NOT NULL AUTO_INCREMENT,
    firstname varchar(255),
    lastname varchar(255),
    email varchar(255) NOT NULL UNIQUE,
    employmenttypeid int, 
    phonenumber varchar(15), 
    datecreated date, 
    contractstartdate date,
    contractenddate date,
    dailyrate float,
    hasaccount boolean DEFAULT FALSE, 
    PRIMARY KEY(id),
    CONSTRAINT fk_employmenttype FOREIGN KEY (employmenttypeid) REFERENCES lookupemploymenttypes(id)
);

CREATE TABLE IF NOT EXISTS userroles (
    id int NOT NULL AUTO_INCREMENT,
    userid int,
    roleid int,
    PRIMARY KEY(id),
    CONSTRAINT fk_lookupuserroles FOREIGN KEY (roleid) REFERENCES lookupuserroles(id),
    CONSTRAINT fk_userurid FOREIGN KEY (userid) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS userslogin (
    id int NOT NULL AUTO_INCREMENT,
    userid int,
    email varchar(255),
    datelogin datetime,
    PRIMARY KEY (id),
    CONSTRAINT fk_userlogid FOREIGN KEY (userid) REFERENCES users(id)
);
 
CREATE TABLE IF NOT EXISTS userstechstacks ( 
    id int NOT NULL AUTO_INCREMENT,
    userid int,
    techstackid int,
    skilllevel int, 
    PRIMARY KEY(id),
    CONSTRAINT fk_user FOREIGN KEY (userid) REFERENCES users(id),
    CONSTRAINT fk_techstack FOREIGN KEY (techstackid) REFERENCES techstacks(id)
);
 
CREATE TABLE IF NOT EXISTS authorizations (
    id int NOT NULL AUTO_INCREMENT,
    roleid int,
    featureid int,
    permissionid int, 
    PRIMARY KEY(id),
    CONSTRAINT fk_lookupuserrole FOREIGN KEY (roleid) REFERENCES lookupuserroles(id),
    CONSTRAINT fk_feature FOREIGN KEY (featureid) REFERENCES features(id),
    CONSTRAINT fk_permission FOREIGN KEY (permissionid) REFERENCES lookuppermissions(id)
);
 
CREATE TABLE IF NOT EXISTS lookupauditlogobjects ( 
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255),
    datecreated date,
    PRIMARY KEY (id)
);
 
CREATE TABLE IF NOT EXISTS lookupauditlogactions (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255),
    datecreated date,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS lookupauditlogobjecttargets (
  id int NOT NULL AUTO_INCREMENT,
  userid int,
  CONSTRAINT fk_tgtuserid FOREIGN KEY (userid) REFERENCES users(id),
  PRIMARY KEY (id)
);
 
CREATE TABLE IF NOT EXISTS auditlogs ( 
    id int NOT NULL AUTO_INCREMENT,
    userid int, 
    datecreated date, 
    auditlogobjectid int,
    auditlogactionid int, 
    valueorigin varchar(255), 
    valuenew varchar(255), 
    PRIMARY KEY (id),
    CONSTRAINT fk_userid FOREIGN KEY (userid) REFERENCES users(id),
    CONSTRAINT fk_auditlogobjectid FOREIGN KEY (auditlogobjectid) REFERENCES lookupauditlogobjects(id),
    CONSTRAINT fk_auditlogactionid FOREIGN KEY (auditlogactionid) REFERENCES lookupauditlogactions(id)
);
 
CREATE TABLE IF NOT EXISTS applications (
    id int NOT NULL AUTO_INCREMENT, 
    appname varchar(255), 
    appurl varchar(255), 
    devopslink varchar(255),
    datecreated date, 
    datemodified date,
    comments varchar(255),
    PRIMARY KEY (id)
);
 
CREATE TABLE IF NOT EXISTS appsusers (
    id int NOT NULL AUTO_INCREMENT,
    appid int,
    userid int,  
    datestarted date,
    dateended date,
    fitscore float,
    PRIMARY KEY (id),
    CONSTRAINT fk_appid FOREIGN KEY (appid) REFERENCES applications(id),
    CONSTRAINT fk_usersid FOREIGN KEY (userid) REFERENCES users(id)
);
 
CREATE TABLE IF NOT EXISTS appstechstacks (
    id int NOT NULL AUTO_INCREMENT,
    appid int,
    techstackid int,
    PRIMARY KEY (id),
    CONSTRAINT fk_appsid FOREIGN KEY (appid) REFERENCES applications(id),
    CONSTRAINT fk_techstackid FOREIGN KEY (techstackid) REFERENCES techstacks(id)
);
 
CREATE TABLE IF NOT EXISTS lookupnavmenutypes (
    id int NOT NULL AUTO_INCREMENT,
    navmenutypename varchar(255),
    PRIMARY KEY(id)
);
 
CREATE TABLE IF NOT EXISTS navmenuitems (
    id int NOT NULL AUTO_INCREMENT,
    navmenutypesid int,
    menuitemname varchar(255),
    menuitemsid int,
    sortsequences int,
    iconurl varchar(1000),
    datecreated date,
    PRIMARY KEY(id),
    CONSTRAINT fk_navmenutypesid FOREIGN KEY (navmenutypesid) REFERENCES lookupnavmenutypes(id)
);
 
CREATE TABLE IF NOT EXISTS lookuppages (
    id int NOT NULL AUTO_INCREMENT,
    pagename varchar(255),
    url varchar(255),
    datecreated date,
    PRIMARY KEY (id)
);
 
CREATE TABLE IF NOT EXISTS systempagetracking (
    id int NOT NULL AUTO_INCREMENT,
    pageid int,
    datecreated datetime,
    PRIMARY KEY (id),
    CONSTRAINT fk_pageid FOREIGN KEY (pageid) REFERENCES lookuppages(id)
);

CREATE TABLE IF NOT EXISTS lookupauditlogobjecttargets (
  id int NOT NULL AUTO_INCREMENT,
  userid int,
  CONSTRAINT fk_tgtuserid FOREIGN KEY (userid) REFERENCES users(id),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS appsprojects (
	id int NOT NULL AUTO_INCREMENT, 
	appid int, 
	projectcode varchar(10),
	projectname varchar(255),
	projectdescriptions varchar(2000),
	datecreated date,
	datestarted date, 
	dateended date,
	datemodified date,
	PRIMARY KEY (id),
	CONSTRAINT fk_applicationsid FOREIGN KEY (appid) REFERENCES applications(id)
);


-- ************************************************* --
--                 Stored Procedure                  --
-- ************************************************* --
    
DROP PROCEDURE IF EXISTS `sp_applications_sel`;
DELIMITER $$
CREATE PROCEDURE `sp_applications_sel`()
BEGIN
	SELECT apps.id, IFNULL(apps.appname,'') AS appname, IFNULL(apps.appurl,'') AS appurl, IFNULL(apps.devopslink, '') AS devopslink, IFNULL(group_concat(ts.techname), '') as techstack,  IFNULL(apps.expectedappmembercount, '') AS expectedappmembercount,  IFNULL(apps.datecreated, '') AS datecreated,  IFNULL(apps.datemodified, '') AS datemodified,  IFNULL(apps.comments, '') AS comments,
    IFNULL ((SELECT GROUP_CONCAT(u.firstname, " ", u.lastname) 
        FROM appsusers AS au
        INNER JOIN users AS u
        ON au.userid = u.id
        WHERE au.appid = apps.id),'') AS userlist,
		IFNULL ((SELECT GROUP_CONCAT(u.contractstartdate)
        FROM appsusers AS au
        INNER JOIN users AS u
        ON au.userid = u.id
        WHERE au.appid = apps.id),'') AS contractstartdate,
        IFNULL ((SELECT GROUP_CONCAT(u.contractenddate)
        FROM appsusers AS au
        INNER JOIN users AS u
        ON au.userid = u.id
        WHERE au.appid = apps.id),'') AS contractenddate
	FROM applications AS apps
	LEFT JOIN appstechstacks AS appts
	  ON apps.id = appts.appid
	LEFT JOIN techstacks AS ts
	  ON ts.id = appts.techstackid
	  group by apps.id;
END $$
DELIMITER ;

DROP PROCEDURE IF EXISTS `sp_applications_ins`;
DELIMITER $$
CREATE PROCEDURE `sp_applications_ins`(
IN appname varchar(255),
  appurl varchar(255),
  devopslink varchar(255),
  datecreated date, 
  datemodified date,
  comments varchar(255),
  expectedappmembercount int
  )
BEGIN
  INSERT INTO applications (appname, appurl, devopslink, datecreated, datemodified, comments, expectedappmembercount)
  VALUES (appname, appurl, devopslink, NOW(), NOW(), comments, expectedappmembercount);
END $$
DELIMITER ;


DROP PROCEDURE IF EXISTS `sp_appsusers_sel`;
DELIMITER $$
CREATE PROCEDURE `sp_appsusers_sel`()
BEGIN
    SELECT u.id, 
        u.firstname, 
        u.lastname, 
        app.appname,
        au.id,
        au.appid,
        au.userid,
        au.datestarted, 
        au.dateended,
        au.datecreated
    FROM appsusers AS au
    INNER JOIN applications AS app ON app.id = au.appid
    INNER JOIN users AS u ON u.id = au.userid;
END $$
DELIMITER ;


DROP PROCEDURE IF EXISTS `sp_appsusers_ins`;
DELIMITER $$
CREATE PROCEDURE `sp_appsusers_ins`(
    IN userid INT, appid INT, startdate DATE, enddate DATE
)
BEGIN
    INSERT INTO appsusers (userid, appid, datestarted, dateended,datecreated)
  VALUES (userid, appid, startdate, enddate,NOW());
END $$
DELIMITER ;


DROP PROCEDURE IF EXISTS `sp_appsuserlist_sel`;
DELIMITER $$
CREATE PROCEDURE `sp_appsuserlist_sel`()
BEGIN
SELECT u.id, IFNULL(u.firstname,'') as firstname, IFNULL(u.lastname,'') as lastname, IFNULL(CONCAT(firstname, " ", lastname),'')  AS fullname, IFNULL(u.position,'') AS position, au.appid, u.contractstartdate, u.contractenddate,
	(SELECT GROUP_CONCAT(ts.id) 
         FROM userstechstacks AS uts 
         INNER JOIN techstacks AS ts 
         ON uts.techstackid = ts.id 
         WHERE uts.userid = u.id AND uts.skilllevel = 1) AS primaryskillid,
	IFNULL((SELECT GROUP_CONCAT(ts.techname) 
         FROM userstechstacks AS uts 
         INNER JOIN techstacks AS ts 
         ON uts.techstackid = ts.id 
         WHERE uts.userid = u.id AND uts.skilllevel = 1), '') AS primaryskillname,
	(SELECT GROUP_CONCAT(ts.id) FROM 
        userstechstacks AS uts 
        INNER JOIN techstacks AS ts 
        ON uts.techstackid = ts.id 
        WHERE uts.userid = u.id AND uts.skilllevel = 2) AS secondaryskillid,
	IFNULL((SELECT GROUP_CONCAT(ts.techname) FROM 
        userstechstacks AS uts 
        INNER JOIN techstacks AS ts 
        ON uts.techstackid = ts.id 
        WHERE uts.userid = u.id AND uts.skilllevel = 2), '') AS secondaryskillname,
    (SELECT GROUP_CONCAT(a.id)
		FROM appsusers AS au2
        INNER JOIN applications AS a ON au2.appid = a.id
        WHERE au2.userid = au.userid) AS appids,
	IFNULL((SELECT GROUP_CONCAT(a.appname)
		FROM appsusers AS au2
        INNER JOIN applications AS a ON au2.appid = a.id
        WHERE au2.userid = au.userid), '') AS appnames
	FROM users AS u
	LEFT JOIN appsusers AS au ON u.id = au.userid
	ORDER BY
	u.id ASC;
END $$
DELIMITER ;


DROP procedure IF EXISTS `sp_auditlogs_sel`;
DELIMITER $$
CREATE PROCEDURE `sp_auditlogs_sel`()
BEGIN
    SELECT 
    al.id AS auditid,
		al.userid AS modifierid, 
    (CONCAT(u.firstname, ' ', u.lastname) 
	  ) AS modifiername,
    al.auditlogobjecttargetid AS targetuserid,
    (SELECT CONCAT(u.firstname, ' ', u.lastname) 
      FROM users AS u
      WHERE u.id = al.auditlogobjecttargetid
    ) AS targetusername,
    al.auditlogobjectid AS objectid,
    (SELECT lobject.name 
			FROM lookupauditlogobjects AS lobject 
      WHERE lobject.id = al.auditlogobjectid
    ) AS objectname,
    (SELECT lobject.datecreated
			FROM lookupauditlogobjects AS lobject 
      WHERE lobject.id = al.auditlogobjectid
    ) AS datecreatedobject,
    al.auditlogactionid AS actionid,
    (SELECT laction.name 
			FROM lookupauditlogactions AS laction
      WHERE laction.id = al.auditlogactionid
    ) AS actionname,
    IFNULL(al.valueorigin, '') AS valueorigin,
    IFNULL(al.valuenew, '') AS valuenew,
    al.datecreated AS datecreated
	  FROM auditlogs AS al
    LEFT JOIN users AS u
		ON u.id = al.userid;
END $$
DELIMITER ;

DROP PROCEDURE IF EXISTS `sp_auditlogs_ins`;
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_auditlogs_ins`(
	  IN modifieruseremail VARCHAR(255), targetuseremail VARCHAR(255), objectid INT, actionid INT, valueorigin VARCHAR(255), valuenew VARCHAR(255), datecreated date
)
BEGIN
	DECLARE targetuserid INT DEFAULT (SELECT u.id FROM users AS u WHERE u.email = targetuseremail);
  DECLARE modifieruserid INT DEFAULT (SELECT u.id FROM users AS u WHERE u.email = modifieruseremail);
    
	INSERT INTO auditlogs (userid, auditlogobjecttargetid, auditlogobjectid, auditlogactionid, valueorigin, valuenew, datecreated)
  VALUES (modifieruserid, targetuserid, objectid, actionid, valueorigin, valuenew, datecreated);
    
  INSERT IGNORE INTO lookupauditlogobjecttargets SET userid = targetuserid; 
END $$
DELIMITER ;

DROP procedure IF EXISTS `sp_lookupauditlogactions_sel`;
DELIMITER $$
CREATE PROCEDURE `sp_lookupauditlogactions_sel`()
BEGIN
  SELECT id, name, datecreated , datemodified FROM lookupauditlogactions;
END $$
DELIMITER ;



DROP procedure IF EXISTS `sp_lookupauditlogobjects_sel`;
DELIMITER $$
CREATE PROCEDURE `sp_lookupauditlogobjects_sel`()
BEGIN
  SELECT id, name, datecreated, datemodified FROM lookupauditlogobjects;
END $$
DELIMITER ;



DROP procedure IF EXISTS `sp_lookupemploymenttypes_sel`;
DELIMITER $$
CREATE PROCEDURE `sp_lookupemploymenttypes_sel`()
BEGIN
    SELECT id, IFNULL(typename,'') as typename, IFNULL(datecreated,'') as datecreated, IFNULL(datemodified,'') as datemodified 
    from lookupemploymenttypes;
END $$
DELIMITER ;

DROP procedure IF EXISTS `sp_lookupemploymenttypes_ins`;
DELIMITER $$
CREATE PROCEDURE `sp_lookupemploymenttypes_ins`(
  IN typename varchar(255), datecreated datetime , datemodified datetime
)
BEGIN
  INSERT INTO lookupemploymenttypes (typename, datecreated,datemodified)
  VALUES (typename,datecreated,datemodified);
END$$
DELIMITER ;


DROP procedure IF EXISTS `sp_lookuppages_ins`;
DELIMITER $$
CREATE PROCEDURE `sp_lookuppages_ins`(
  IN pageName varchar(255), url varchar(255), dateCreated date, datemodified date
)
BEGIN
  INSERT INTO lookuppages (pagename,url, datecreated, datemodified)
  VALUES (pageName,url,dateCreated, datemodified);
END $$
DELIMITER ;


DROP PROCEDURE IF EXISTS `sp_userroles_ins`;
DELIMITER $$
CREATE PROCEDURE `sp_userroles_ins`(
    IN userid INT, roleid INT
)
BEGIN
    INSERT INTO userroles (roleid,userid,datecreated,datemodified)
    VALUES (roleid,userid,now(),now());
END $$
DELIMITER ;


DROP PROCEDURE IF EXISTS `sp_userroles_del`;
DELIMITER $$
CREATE PROCEDURE `sp_userroles_del`(
    IN userid INT, roleid INT
)
BEGIN
    DELETE FROM userroles AS ur
    WHERE ur.userid = userid AND ur.roleid = roleid;
END $$
DELIMITER ;


DROP procedure IF EXISTS `sp_lookuppages_sel`;
DELIMITER $$
CREATE PROCEDURE `sp_lookuppages_sel`()
BEGIN
  SELECT lp.pagename, lp.url,
  lp.datemodified, 
  COUNT(spt.pageid) AS views
  FROM lookuppages AS lp
  INNER JOIN systempagetracking AS spt
  ON lp.id = spt.pageid
  WHERE spt.datecreated BETWEEN NOW() - INTERVAL 30 DAY AND NOW()
  GROUP BY pageid;
END $$
DELIMITER ;




DROP procedure IF EXISTS `sp_lookuppermissions_sel`;
DELIMITER $$
CREATE PROCEDURE `sp_lookuppermissions_sel`()
BEGIN
    SELECT id, permissionname, datecreated, datemodified from lookuppermissions;
END $$
DELIMITER ;




DROP procedure IF EXISTS `sp_lookupuserroles_ins`;
DELIMITER $$
CREATE PROCEDURE `sp_lookupuserroles_ins`( IN rolename varchar(255), datecreated datetime , datemodified datetime)
BEGIN
    INSERT INTO lookupuserroles (id, rolename, datecreated, datemodified)
    VALUES (id, rolename, datecreated, datemodified);
END $$
DELIMITER ;



DROP procedure IF EXISTS `sp_userroles_sel`;
DELIMITER $$
CREATE PROCEDURE `sp_userroles_sel`()
BEGIN
    SELECT id, rolename,datecreated,datemodified FROM userroles;
END $$
DELIMITER ;



DROP PROCEDURE IF EXISTS `sp_navmenuitems_sel`;
DELIMITER $$
CREATE PROCEDURE `sp_navmenuitems_sel`(
    IN navmenu int
)
BEGIN
    SELECT id, navmenutypesid, menuitemname, menuitemlink, sortsequences, iconurl
    FROM navmenuitems
    WHERE navmenutypesid= navmenu
    ORDER BY sortsequences ASC;
END $$
DELIMITER ;

DROP PROCEDURE IF EXISTS `sp_navmenudropdown_sel`;
DELIMITER $$
CREATE PROCEDURE `sp_navmenudropdown_sel`()
BEGIN
    SELECT id, navmenutypesid,menuitemsid, menuitemname, menuitemlink, sortsequences, iconurl
    FROM navmenuitems
    WHERE     
    menuitemsid = 4 
    ORDER BY sortsequences ASC;
END $$
DELIMITER ;

DROP PROCEDURE IF EXISTS `sp_nmhorizontal_sel`;
DELIMITER $$
CREATE PROCEDURE `sp_nmhorizontal_sel`()
BEGIN
    SELECT id, navmenutypesid, menuitemname, menuitemlink, sortsequences, iconurl
    FROM navmenuitems
    WHERE id in (2,3)
    ORDER BY sortsequences ASC;
END $$
DELIMITER ;

DROP PROCEDURE IF EXISTS `sp_navmenubegin_sel`;
DELIMITER $$
CREATE PROCEDURE `sp_navmenubegin_sel`()
BEGIN
    SELECT id, navmenutypesid,menuitemsid, menuitemname, menuitemlink, sortsequences, iconurl
    FROM navmenuitems
    WHERE 
    id IN (3,4)   
    ORDER BY sortsequences ASC;
END $$
DELIMITER ;

DROP PROCEDURE IF EXISTS `sp_profile_sel`;
DELIMITER $$
CREATE PROCEDURE `sp_profile_sel`(
  IN email varchar(255)
)
BEGIN
  SELECT u.email, u.firstname, u.lastname, u.phonenumber, u.datecreated, 
    u.contractstartdate, u.contractenddate, u.position, u.dailyrate, u.employmenttypeid
  FROM users AS u
  WHERE u.email = email;
END $$
DELIMITER ;




DROP PROCEDURE IF EXISTS `sp_systempagetracking_ins`;
DELIMITER $$
CREATE PROCEDURE `sp_systempagetracking_ins`(
    IN currentURL varchar(255), datecreated datetime
)
BEGIN
    IF currentURL NOT IN (SELECT url FROM lookuppages WHERE url LIKE currentURL) 
		THEN INSERT INTO systempagetracking (pageid,datecreated) 
        VALUES (1, datecreated);
    ELSE
      INSERT INTO systempagetracking (pageid,datecreated)
          SELECT id, datecreated
          FROM lookuppages
          WHERE url LIKE currentURL;
    END IF;
END $$
DELIMITER ;


DROP PROCEDURE IF EXISTS `sp_loginhistory_sel`;
DELIMITER $$
CREATE PROCEDURE `sp_loginhistory_sel`(IN email varchar(255))
BEGIN
  SELECT ul.datelogin FROM userslogin as ul
  WHERE ul.email = email;
END $$
DELIMITER ;

DROP PROCEDURE IF EXISTS `sp_techstacks_ins`;
DELIMITER $$
CREATE PROCEDURE `sp_techstacks_ins`(
    IN techname varchar(255), datecreated date , datemodified date
)
BEGIN
	INSERT INTO techstacks (id, techname, datecreated, datemodified)
    VALUES (id, techname, datecreated, datemodified);
END $$
DELIMITER ;




DROP PROCEDURE IF EXISTS `sp_techstacks_sel`;
DELIMITER $$
CREATE PROCEDURE `sp_techstacks_sel`()
BEGIN
  SELECT id, IFNULL(techname,'') as techname, IFNULL(datecreated,'') AS datecreated, IFNULL(datemodified, '') AS datemodified 
  FROM techstacks;
END $$
DELIMITER ;



DROP PROCEDURE IF EXISTS `sp_users_ins`;
DELIMITER $$
CREATE PROCEDURE `sp_users_ins`(
  IN useremail varchar(255), dateCreated date
)
BEGIN
  INSERT IGNORE INTO users (email, datecreated)
  VALUES (useremail, dateCreated);
END $$
DELIMITER ;



DROP PROCEDURE IF EXISTS `sp_users_sel`;
DELIMITER $$
CREATE DEFINER = `root` @`localhost` PROCEDURE `sp_users_sel`() 
BEGIN
    SELECT u.id, IF(u.hasaccount, "TRUE", "FALSE") AS hasaccount, IFNULL(u.firstname,'') as firstname, IFNULL(u.lastname,'') as lastname, IFNULL(CONCAT(firstname, " ", lastname),'')  AS fullname, IFNULL(u.position,'') as position, u.email, IFNULL(u.phonenumber,'') as phonenumber, IFNULL(let.typename,'') AS employmenttype, IFNULL(u.datecreated,'') as datecreated, IFNULL(u.contractstartdate,'') as contractstartdate, IFNULL(u.contractenddate,'') as contractenddate, IFNULL(u.dailyrate,'') as dailyrate, IFNULL(u.datemodified,'') as datemodified,
		(SELECT GROUP_CONCAT(ts.id) 
        FROM userstechstacks AS uts 
        INNER JOIN techstacks AS ts 
        ON uts.techstackid = ts.id 
        WHERE uts.userid = u.id AND uts.skilllevel = 1) AS primaryskillid,
        IFNULL ((SELECT GROUP_CONCAT(ts.techname) 
        FROM userstechstacks AS uts 
        INNER JOIN techstacks AS ts 
        ON uts.techstackid = ts.id 
        WHERE uts.userid = u.id AND uts.skilllevel = 1),'') AS primaryskillname,
        (SELECT GROUP_CONCAT(ts.id) FROM 
        userstechstacks AS uts 
        INNER JOIN techstacks AS ts 
        ON uts.techstackid = ts.id 
        WHERE uts.userid = u.id AND uts.skilllevel = 2) AS secondaryskillid,
        IFNULL ((SELECT GROUP_CONCAT(ts.techname) FROM 
        userstechstacks AS uts 
        INNER JOIN techstacks AS ts 
        ON uts.techstackid = ts.id 
        WHERE uts.userid = u.id AND uts.skilllevel = 2),'') AS secondaryskillname,
        (SELECT GROUP_CONCAT(a.id) 
        FROM appsusers AS au
        INNER JOIN applications AS a 
        ON au.appid = a.id
        WHERE au.userid = u.id) AS appsid,
        IFNULL ((SELECT GROUP_CONCAT(a.appname) 
        FROM appsusers AS au
        INNER JOIN applications AS a 
        ON au.appid = a.id
        WHERE au.userid = u.id),'') AS appsname,
        (SELECT GROUP_CONCAT(ur.roleid) 
        FROM userroles AS ur
        INNER JOIN lookupuserroles AS lur 
        ON ur.roleid = lur.id
        WHERE ur.userid = u.id) AS roleid,
        IFNULL ((SELECT GROUP_CONCAT(lur.rolename) 
        FROM userroles AS ur
        INNER JOIN lookupuserroles AS lur 
        ON ur.roleid = lur.id
        WHERE ur.userid = u.id),'') AS rolename
    FROM users AS u
    LEFT JOIN lookupemploymenttypes AS let ON u.employmenttypeid = let.id
    ORDER BY u.id ASC;

END $$
DELIMITER ;


DROP PROCEDURE IF EXISTS `sp_usersapp_sel`;
DELIMITER $$
CREATE DEFINER = `root` @`localhost` PROCEDURE `sp_usersapp_sel`() 
BEGIN
    SELECT a.id, a.appname, a.appurl, a.devopslink, a.datecreated, a.expectedappmembercount AS expectedmembers, au.datestarted, au.dateended, au.userid AS userid,
        (SELECT GROUP_CONCAT(ts.techname) 
             FROM appstechstacks AS ats 
             INNER JOIN techstacks AS ts 
             ON ats.techstackid = ts.id 
             WHERE ats.appid = a.id) AS techstacks
    FROM applications AS a
    LEFT JOIN appsusers AS au ON a.id = au.appid
    ORDER BY a.id ASC;
END $$
DELIMITER ;



DROP PROCEDURE IF EXISTS `sp_users_upd`;
DELIMITER $$
CREATE PROCEDURE `sp_users_upd`(
  IN firstname varchar(255), lastname varchar(255), phonenumber varchar(255), 
    email varchar(255), employmenttypeid int, position VARCHAR(255), contractstartdate date, 
    contractenddate date, dailyrate VARCHAR(255), datemodified date
)
BEGIN
  UPDATE users AS u
  SET u.firstname = firstname, u.lastname = lastname, u.phonenumber = phonenumber, 
    u.employmenttypeid = employmenttypeid, u.position = position, u.contractstartdate = contractstartdate, 
        u.contractenddate = contractenddate, u.dailyrate = dailyrate, u.datemodified = datemodified
  WHERE u.email = email;
END $$
DELIMITER ;



DROP PROCEDURE IF EXISTS `sp_userslogin_ins`;
DELIMITER $$
CREATE PROCEDURE `sp_userslogin_ins`(
    IN  email varchar(255), datelogin datetime
)
BEGIN
    DECLARE userid INT DEFAULT (SELECT u.id FROM users AS u WHERE u.email = email);
    
    INSERT IGNORE INTO userslogin (userid, email, datelogin)
    VALUES (userid, email, datelogin);

    UPDATE users SET hasaccount = true WHERE id = userid;

END $$
DELIMITER ;




DROP PROCEDURE IF EXISTS `sp_usersnotloggedin_sel`;
DELIMITER $$
CREATE PROCEDURE `sp_usersnotloggedin_sel`()
BEGIN
SELECT u.id, u.email, MAX(ul.datelogin) as latestlogin,
(CONCAT(u.firstname, ' ', u.lastname) ) AS username
 FROM users AS u
LEFT JOIN userslogin AS ul
  ON u.id = ul.userid
  WHERE ul.datelogin NOT BETWEEN (NOW() - INTERVAL 90 DAY) AND NOW() 
  GROUP BY id
  ORDER BY datelogin ASC;
END $$
DELIMITER ;



DROP PROCEDURE IF EXISTS `sp_userstechstacks_del`;
DELIMITER $$
CREATE PROCEDURE `sp_userstechstacks_del`(
  IN email varchar(255)
)
BEGIN
  DECLARE userid INT DEFAULT (SELECT u.id FROM users AS u WHERE u.email = email);
    
  DELETE FROM userstechstacks AS uts 
    WHERE uts.userid = userid;
END $$
DELIMITER ;



DROP PROCEDURE IF EXISTS `sp_userstechstacks_ins`;
DELIMITER $$
CREATE PROCEDURE `sp_userstechstacks_ins`(
  IN email varchar(255), techstackid int, skilllevel int, datecreated datetime
)
BEGIN
  DECLARE userid INT DEFAULT (SELECT u.id FROM users AS u WHERE u.email = email);
    
  INSERT INTO userstechstacks (userid, techstackid, skilllevel, datecreated) 
  VALUES (userid, techstackid, skilllevel, datecreated);
END $$
DELIMITER ;



DROP PROCEDURE IF EXISTS `sp_userstechstacks_sel`;
DELIMITER $$
CREATE PROCEDURE `sp_userstechstacks_sel`(
  IN email varchar(255)
)
BEGIN
  DECLARE userid INT DEFAULT (SELECT u.id FROM users AS u WHERE u.email = email);
    
  SELECT u.id, u.firstname, u.lastname, ts.techname, uts.techstackid, uts.skilllevel, uts.datecreated
    FROM userstechstacks AS uts
    INNER JOIN techstacks AS ts ON uts.techstackid = ts.id 
    INNER JOIN users AS u ON uts.userid = u.id
    WHERE uts.userid = userid;
END $$
DELIMITER ;


DROP PROCEDURE IF EXISTS `sp_appstechstacks_ins`;
DELIMITER $$
CREATE PROCEDURE `sp_appstechstacks_ins`(
  IN appname varchar(255), techstackid int, datecreated datetime
)
BEGIN
  DECLARE appid INT DEFAULT (SELECT app.id FROM applications AS app WHERE app.appname = appname);
    
  INSERT INTO appstechstacks (appid, techstackid, datecreated) 
  VALUES (appid, techstackid, NOW());
END $$
DELIMITER ;


DROP PROCEDURE IF EXISTS `sp_appsdetails_sel`;
DELIMITER $$
CREATE PROCEDURE `sp_appsdetails_sel`(
    IN appid int, userid int
)
BEGIN
    SELECT apps.id, apps.appname, apps.appurl, apps.devopslink, group_concat(ts.techname) as techstacks, apps.expectedappmembercount, au.datestarted, au.dateended
    FROM applications AS apps
    LEFT JOIN appstechstacks AS appts
      ON apps.id = appts.appid
    LEFT JOIN appsusers AS au
      ON au.appid = apps.id
    LEFT JOIN techstacks AS ts
      ON ts.id = appts.techstackid
  WHERE au.appid = appid AND au.userid = userid
      GROUP BY apps.id;
END $$
DELIMITER ;

DROP PROCEDURE IF EXISTS `sp_appsusers_del`;
DELIMITER $$
CREATE PROCEDURE `sp_appsusers_del`(
  IN appid int, userid int 
)
BEGIN
  DELETE FROM appsusers AS au 
    WHERE au.appid = appid AND au.userid = userid;
END $$
DELIMITER ;

DROP PROCEDURE IF EXISTS `sp_appsusers_upd`;
DELIMITER $$
CREATE PROCEDURE `sp_appsusers_upd`(
    IN appid int, userid int, datestarted date, dateended date
)
BEGIN
    UPDATE appsusers AS au
    SET au.datestarted = datestarted, au.dateended = dateended
    WHERE au.appid = appid AND au.userid = userid;
END $$
DELIMITER ;


DROP PROCEDURE IF EXISTS `sp_lookupuserroles_sel`;
DELIMITER $$
CREATE PROCEDURE `sp_lookupuserroles_sel`()
BEGIN
    SELECT id, IFNULL(rolename,'') as rolename, IFNULL(datecreated,'') as datecreated, IFNULL(datemodified,'') as datemodified FROM lookupuserroles;
END $$
DELIMITER ;


DROP PROCEDURE IF EXISTS `sp_userdetails_sel`;
DELIMITER $$
CREATE PROCEDURE `sp_userdetails_sel`(
    IN appid int, userid int
)
BEGIN
    SELECT u.id, u.firstname, u.lastname, u.email, u.contractstartdate, u.contractenddate,
    au.datestarted, au.dateended,
       (SELECT GROUP_CONCAT(ts.techname) 
         FROM userstechstacks AS uts 
         INNER JOIN techstacks AS ts 
         ON uts.techstackid = ts.id 
         WHERE uts.userid = u.id ) AS skillset,
     (SELECT count( * ) 
        FROM appsusers AS au
        INNER JOIN applications AS a 
        ON au.appid = a.id
        WHERE au.userid = u.id) AS totalApps,
        (SELECT GROUP_CONCAT(a.appname) 
        FROM appsusers AS au
        INNER JOIN applications AS a 
        ON au.appid = a.id
        WHERE au.userid = u.id) AS appname
    FROM users AS u
    LEFT JOIN userstechstacks AS uts
      ON uts.id = u.id
    LEFT JOIN appsusers AS au
      ON au.userid = u.id
    LEFT JOIN techstacks AS ts
      ON ts.id = uts.id
    LEFT JOIN applications AS apps
      ON apps.id = au.id
  WHERE au.appid = appid AND au.userid = userid
      GROUP BY apps.id;
END $$
DELIMITER ;


-- ALTER TABLE ADD COLUMN
DROP PROCEDURE IF EXISTS `sp_addcolumn`;
DELIMITER $$
CREATE PROCEDURE `sp_addcolumn`(
    IN table_name_IN VARCHAR(100), IN column_name_IN VARCHAR(100), IN column_desc_IN VARCHAR(100)
)
BEGIN
    SET @q1 =CONCAT('ALTER TABLE ',table_name_IN, ' ADD COLUMN ', column_name_IN , ' ', column_desc_IN);
    
    SELECT count(*)  into @colCount FROM information_schema.columns 
    WHERE table_name = `table_name_IN` AND column_name = `column_name_IN` AND table_schema = 'stains';
        
    IF @colCount = 0 THEN
        PREPARE statement FROM @q1;
        EXECUTE statement;
        DEALLOCATE PREPARE statement;
    END IF; 
END $$
DELIMITER ;


DROP PROCEDURE IF EXISTS `sp_usersmultipleapps_sel`;
DELIMITER $$
CREATE PROCEDURE `sp_usersmultipleapps_sel`()
BEGIN
	SELECT t1.userid, t1.contractstartdate, t1.contractenddate, SUM(t1.activeapp) AS totalapps
	FROM (
			SELECT u.id AS userid, u.contractstartdate, u.contractenddate, au.appid,
			(CASE
				WHEN curdate() BETWEEN COALESCE(au.datestarted, '2999/01/01') AND COALESCE(au.dateended, '2999/01/01') THEN 1 
				ELSE 0
			END) AS activeapp
			FROM users u
		LEFT JOIN appsusers au ON u.id = au.userid) t1
	GROUP BY t1.userid
	ORDER BY userid;
END $$
DELIMITER ;


DROP PROCEDURE IF EXISTS `sp_occupiedapps_sel`;
DELIMITER $$
CREATE PROCEDURE `sp_occupiedapps_sel`()
BEGIN
	SELECT t1.appid, sum(t1.activeapp) as totalusers, app.expectedappmembercount
	FROM (
			SELECT u.id as userid, u.contractstartdate, u.contractenddate, au.appid,
			(CASE 
				WHEN CURDATE() BETWEEN COALESCE(au.datestarted, '2999/01/01') AND COALESCE(au.dateended, '2999/01/01') THEN 1 
			ELSE 0
				END) AS activeapp
			FROM users u
			LEFT JOIN appsusers AS au ON u.id = au.userid) t1
		LEFT JOIN applications AS app ON t1.appid = app.id
	GROUP BY t1.appid
	ORDER BY appid;
END $$
DELIMITER ;

-- ********************************** -- 
--       add columns to table         --
-- ********************************** --

-- Format: sp_addcolumn(table name, column name, column datatype);

CALL sp_addcolumn("users", "position", "varchar(255)");
CALL sp_addcolumn("users", "datemodified", "datetime");
CALL sp_addcolumn("applications", "expectedappmembercount", "INT");
CALL sp_addcolumn("lookupemploymenttypes", "datecreated", "datetime");
CALL sp_addcolumn("lookupemploymenttypes", "datemodified", "datetime");
CALL sp_addcolumn("lookupnavmenutypes", "datecreated", "date");
CALL sp_addcolumn("lookupnavmenutypes", "datemodified", "date");
CALL sp_addcolumn("features", "datecreated", "datetime");
CALL sp_addcolumn("features", "datemodified", "datetime");
CALL sp_addcolumn("appstechstacks", "datecreated", "date");
CALL sp_addcolumn("appsusers", "datecreated", "datetime");
CALL sp_addcolumn("authorizations", "datecreated", "datetime");
CALL sp_addcolumn("lookupauditlogactions", "datemodified", "datetime");
CALL sp_addcolumn("userstechstacks", "datecreated", "datetime");
CALL sp_addcolumn("userroles", "datecreated", "datetime");
CALL sp_addcolumn("userroles", "datemodified", "datetime");
CALL sp_addcolumn("lookuppermissions", "datemodified", "datetime");
CALL sp_addcolumn("lookuppages", "datemodified", "datetime");
CALL sp_addcolumn("techstacks", "datemodified", "date");
CALL sp_addcolumn("lookupauditlogobjects", "datemodified", "date");
CALL sp_addcolumn("lookupuserroles", "datecreated", "datetime");
CALL sp_addcolumn("lookupuserroles", "datemodified", "datetime");
CALL sp_addcolumn("navmenuitems", "menuitemlink", "varchar(255)");
CALL sp_addcolumn("auditlogs", "auditlogobjecttargetid", "INT");


--- ************************** --- 
---   DATA INSERTION SCRIPTS   ---
--- ************************** --- 

-- Datasets for lookupmenutypes
INSERT INTO lookupnavmenutypes (navmenutypename, datecreated)
  SELECT "Horizontal", CURRENT_DATE() FROM DUAL
WHERE NOT EXISTS
  (SELECT navmenutypename FROM lookupnavmenutypes WHERE navmenutypename="Horizontal");
  
INSERT INTO lookupnavmenutypes (navmenutypename, datecreated)
  SELECT "Vertical", CURRENT_DATE() FROM DUAL
WHERE NOT EXISTS
  (SELECT navmenutypename FROM lookupnavmenutypes WHERE navmenutypename="Vertical");
  
-- Datasets for horizontal navigation menus
    INSERT INTO navmenuitems (navmenutypesid, menuitemname, menuitemlink, sortsequences, iconurl, datecreated)
    SELECT "1","Search", "/search","1", "FaSearch", "2021-05-10" FROM DUAL
WHERE NOT EXISTS
  (SELECT menuitemname FROM navmenuitems WHERE menuitemname="Search");
  
    INSERT INTO navmenuitems (navmenutypesid, menuitemname, menuitemlink, sortsequences, iconurl, datecreated)
    VALUES ("1","Home","/home", "2", "fa fa-home fa-xlarge", "2021-07-12");
    
        INSERT INTO navmenuitems (navmenutypesid, menuitemname, menuitemlink, sortsequences, iconurl, datecreated)
    SELECT "1", "FAQ", "/faq", "3", "RiQuestionnaireLine", "2021-05-10" FROM DUAL
WHERE NOT EXISTS
  (SELECT menuitemname FROM navmenuitems WHERE menuitemname="FAQ");
  
    INSERT INTO navmenuitems (navmenutypesid, menuitemname, menuitemlink, sortsequences, datecreated)
    SELECT "1", "Sign In/Up", "login",  "4", "2021-05-10" FROM DUAL
WHERE NOT EXISTS
  (SELECT menuitemname FROM navmenuitems WHERE menuitemname="Sign In/Up");
  
    INSERT INTO navmenuitems (navmenutypesid, menuitemname, menuitemsid, menuitemlink, sortsequences, datecreated)
    SELECT "1", "Profile", "4", "/profile","5", "2021-05-10" FROM DUAL
WHERE NOT EXISTS
  (SELECT menuitemname FROM navmenuitems WHERE menuitemname="Profile");

    INSERT INTO navmenuitems (navmenutypesid, menuitemname, menuitemsid, menuitemlink, sortsequences, datecreated)
    SELECT "1", "Login History", "4", "/loginhistory", "6", "2021-06-08" FROM DUAL
WHERE NOT EXISTS
  (SELECT menuitemname FROM navmenuitems WHERE menuitemname="Login History");
  
    INSERT INTO navmenuitems (navmenutypesid, menuitemname, menuitemsid, menuitemlink, sortsequences, datecreated)
    SELECT "1", "Log Out", "4", "logout", "7", "2021-05-10" FROM DUAL
WHERE NOT EXISTS
  (SELECT menuitemname FROM navmenuitems WHERE menuitemname="Log Out");
  

 -- Dataset for vertical navigation
 
 INSERT INTO navmenuitems (navmenutypesid, menuitemname, menuitemlink, sortsequences, iconurl, datecreated)
    VALUES ("2","Home","/home", "1", "fa fa-home fa-xlarge", "2021-07-09");
  
    INSERT INTO navmenuitems (navmenutypesid, menuitemname, menuitemlink, sortsequences, iconurl, datecreated)
    SELECT "2", "Users", "/users", "2", "fas fa-users fa-xlarge", "2021-05-11" FROM DUAL
WHERE NOT EXISTS
  (SELECT menuitemname FROM navmenuitems WHERE menuitemname="Users");
  
    INSERT INTO navmenuitems (navmenutypesid, menuitemname, menuitemlink, sortsequences, iconurl, datecreated)
    SELECT "2", "Applications", "/applications", "3", "far fa-clipboard fa-xlarge", "2021-05-11" FROM DUAL
WHERE NOT EXISTS
  (SELECT menuitemname FROM navmenuitems WHERE menuitemname="Applications");
  
    INSERT INTO navmenuitems (navmenutypesid, menuitemname, menuitemlink, sortsequences, iconurl, datecreated)
    SELECT "2", "Audit Log", "/auditlog", "4", "fas fa-archive fa-xlarge", "2021-05-11" FROM DUAL
WHERE NOT EXISTS
  (SELECT menuitemname FROM navmenuitems WHERE menuitemname="Audit Log");
  
    INSERT INTO navmenuitems (navmenutypesid, menuitemname, menuitemlink, sortsequences, iconurl, datecreated)
    SELECT "2", "Permission", "/permission", "5", "fas fa-low-vision fa-xlarge", "2021-05-11" FROM DUAL
WHERE NOT EXISTS
  (SELECT menuitemname FROM navmenuitems WHERE menuitemname="Permission");
  
    INSERT INTO navmenuitems (navmenutypesid, menuitemname, menuitemlink, sortsequences, iconurl, datecreated)
    SELECT "2", "Tech Stacks", "/techstacks", "6", "fas fa-code fa-xlarge", "2021-05-11" FROM DUAL
WHERE NOT EXISTS
  (SELECT menuitemname FROM navmenuitems WHERE menuitemname="Tech Stacks");

  INSERT INTO navmenuitems (navmenutypesid, menuitemname, menuitemlink, sortsequences, iconurl, datecreated)
    SELECT "2", "Employment Types", "/admin/employmenttypes", "7", "fas fa-briefcase fa-xlarge", "2021-05-11" FROM DUAL
WHERE NOT EXISTS
  (SELECT menuitemname FROM navmenuitems WHERE menuitemname="Employment Types");

  INSERT INTO navmenuitems (navmenutypesid, menuitemname, menuitemlink, sortsequences, iconurl, datecreated)
    SELECT "2", "User Roles", "/admin/userroles", "8", "far fa-address-card fa-xlarge", "2021-05-11" FROM DUAL
WHERE NOT EXISTS
  (SELECT menuitemname FROM navmenuitems WHERE menuitemname="User Roles");

-- Datasets for lookupauditlogobjects
INSERT INTO lookupauditlogobjects (name, datecreated, datemodified) 
  SELECT 'User Role', '2021-05-10', CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS 
  (SELECT name FROM lookupauditlogobjects WHERE name='User Role');
  
INSERT INTO lookupauditlogobjects (name, datecreated, datemodified) 
  SELECT 'Permission', '2021-05-10', CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS 
  (SELECT name FROM lookupauditlogobjects WHERE name='Permission');

INSERT INTO lookupauditlogobjects (name, datecreated, datemodified) 
  SELECT 'User First Name', '2021-06-21', CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS 
  (SELECT name FROM lookupauditlogobjects WHERE name='User First Name');

INSERT INTO lookupauditlogobjects (name, datecreated, datemodified) 
  SELECT 'User Last Name', '2021-06-21', CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS 
  (SELECT name FROM lookupauditlogobjects WHERE name='User Last Name');

INSERT INTO lookupauditlogobjects (name, datecreated, datemodified) 
  SELECT 'User Position', '2021-06-21', CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS 
  (SELECT name FROM lookupauditlogobjects WHERE name='User Position');

INSERT INTO lookupauditlogobjects (name, datecreated, datemodified) 
  SELECT 'User Employment Type', '2021-06-21', CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS 
  (SELECT name FROM lookupauditlogobjects WHERE name='User Employment Type');

INSERT INTO lookupauditlogobjects (name, datecreated, datemodified) 
  SELECT 'User Phone Number', '2021-06-21', CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS 
  (SELECT name FROM lookupauditlogobjects WHERE name='User Phone Number');

INSERT INTO lookupauditlogobjects (name, datecreated, datemodified) 
  SELECT 'User Contract Start Date', '2021-06-21', CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS 
  (SELECT name FROM lookupauditlogobjects WHERE name='User Contract Start Date');

INSERT INTO lookupauditlogobjects (name, datecreated, datemodified) 
  SELECT 'User Contract End Date', '2021-06-21', CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS 
  (SELECT name FROM lookupauditlogobjects WHERE name='User Contract End Date');

INSERT INTO lookupauditlogobjects (name, datecreated, datemodified) 
  SELECT 'User Daily Rate', '2021-06-21', CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS 
  (SELECT name FROM lookupauditlogobjects WHERE name='User Daily Date');

-- Datasets for lookupauditlogactions
INSERT INTO lookupauditlogactions (name, datecreated,datemodified) 
  SELECT 'Added', '2021-05-10', CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS 
  (SELECT name FROM lookupauditlogactions WHERE name='Added');

INSERT INTO lookupauditlogactions (name, datecreated,datemodified) 
  SELECT 'Changed', '2021-05-10' , CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS 
  (SELECT name FROM lookupauditlogactions WHERE name='Changed');
  
INSERT INTO lookupauditlogactions (name, datecreated,datemodified) 
  SELECT 'Removed', '2021-05-10', CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS 
  (SELECT name FROM lookupauditlogactions WHERE name='Removed');
  

-- Datasets for lookuppages
INSERT INTO lookuppages (pagename, url, datecreated, datemodified) 
  SELECT 'Non-authorized user homepage', '/', '2021-05-10', CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS 
  (SELECT url FROM lookuppages WHERE url='/');

INSERT INTO lookuppages (pagename, url, datecreated, datemodified) 
  SELECT 'Sign In/Up', '/signin', '2021-05-10', CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS 
  (SELECT url FROM lookuppages WHERE url='/signin');
  
INSERT INTO lookuppages (pagename, url, datecreated, datemodified) 
  SELECT "Profile", "/profile", '2021-05-10', CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS 
  (SELECT url FROM lookuppages WHERE url='/signin');

INSERT INTO lookuppages (pagename, url, datecreated, datemodified) 
  SELECT "Logout", "/logout", '2021-05-10', CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS 
  (SELECT url FROM lookuppages WHERE url='/logout');

INSERT INTO lookuppages (pagename, url, datecreated, datemodified) 
  SELECT "Dashboard", "/home", '2021-05-10', CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS 
  (SELECT url FROM lookuppages WHERE url='/home');
  
INSERT INTO lookuppages (pagename, url, datecreated, datemodified) 
  SELECT "Admin", "/admin", '2021-05-10', CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS 
  (SELECT url FROM lookuppages WHERE url='/admin');

INSERT INTO lookuppages (pagename, url, datecreated, datemodified) 
  SELECT "Users", "/users", '2021-05-10', CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS 
  (SELECT url FROM lookuppages WHERE url='/users');

INSERT INTO lookuppages (pagename, url, datecreated, datemodified) 
  SELECT "Applications", "/applications", '2021-05-10', CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS 
  (SELECT url FROM lookuppages WHERE url='/applications');

INSERT INTO lookuppages (pagename, url, datecreated, datemodified) 
  SELECT "Admin Auditlog", "/admin/auditlog", '2021-05-10', CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS 
  (SELECT url FROM lookuppages WHERE url='/admin/auditlog');

INSERT INTO lookuppages (pagename, url, datecreated, datemodified) 
  SELECT "Profile", "/profile", '2021-05-10', CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS 
  (SELECT url FROM lookuppages WHERE url='/profile');

INSERT INTO lookuppages (pagename, url, datecreated, datemodified) 
  SELECT "Employment Type", "/employmenttype", '2021-05-10', CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS 
  (SELECT url FROM lookuppages WHERE url='/employmenttype');


-- Datasets for lookupemploymenttypes
INSERT INTO lookupemploymenttypes (typename , datecreated, datemodified) 
  SELECT "Permanent","2021-05-10","2021-05-10" FROM DUAL
WHERE NOT EXISTS 
  (SELECT typename FROM lookupemploymenttypes WHERE typename="Permanent");
  
INSERT INTO lookupemploymenttypes (typename , datecreated, datemodified) 
  SELECT "Contract Direct Hire (CDH)","2021-05-10","2021-05-10" FROM DUAL
WHERE NOT EXISTS 
  (SELECT typename FROM lookupemploymenttypes WHERE typename="Contract Direct Hire (CDH)");
  
INSERT INTO lookupemploymenttypes (typename , datecreated, datemodified) 
  SELECT "Master Service Agreement (MSA)","2021-05-10","2021-05-10" FROM DUAL
WHERE NOT EXISTS 
  (SELECT typename FROM lookupemploymenttypes WHERE typename="Master Service Agreement (MSA)");
  
INSERT INTO lookupemploymenttypes (typename , datecreated, datemodified) 
  SELECT "Professional Service Agreement (PSA)","2021-05-10","2021-05-10" FROM DUAL
WHERE NOT EXISTS 
  (SELECT typename FROM lookupemploymenttypes WHERE typename="Professional Service Agreement (PSA)");


-- Datasets for lookuppermissions
INSERT INTO lookuppermissions (permissionname, datecreated, datemodified) 
  SELECT "Read", "2021-05-10", CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS 
  (SELECT permissionname FROM lookuppermissions WHERE permissionname="Read");
  
INSERT INTO lookuppermissions (permissionname, datecreated, datemodified) 
  SELECT "Create", "2021-05-10", CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS 
  (SELECT permissionname FROM lookuppermissions WHERE permissionname="Create");
  
INSERT INTO lookuppermissions (permissionname, datecreated, datemodified) 
  SELECT "Update", "2021-05-10", CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS 
  (SELECT permissionname FROM lookuppermissions WHERE permissionname="Update");
  
INSERT INTO lookuppermissions (permissionname, datecreated, datemodified) 
  SELECT "Delete", "2021-05-10", CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS 
  (SELECT permissionname FROM lookuppermissions WHERE permissionname="Delete");
  

  -- Datasets for techstacks
INSERT INTO techstacks (techname,datecreated)
  SELECT "C#", CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS
 (SELECT techname FROM techstacks WHERE techname="c#");

INSERT INTO techstacks (techname,datecreated)
  SELECT "ASP .Net Core", CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS
 (SELECT techname FROM techstacks WHERE techname="ASP .Net Core");

INSERT INTO techstacks (techname,datecreated)
  SELECT "React.js", CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS
 (SELECT techname FROM techstacks WHERE techname="React.js");

INSERT INTO techstacks (techname,datecreated)
  SELECT "Node.js", CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS
 (SELECT techname FROM techstacks WHERE techname="Node.js");

INSERT INTO techstacks (techname,datecreated)
  SELECT "Angular.js", CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS
 (SELECT techname FROM techstacks WHERE techname="Angular.js");

INSERT INTO techstacks (techname,datecreated)
  SELECT "MSSQL", CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS
 (SELECT techname FROM techstacks WHERE techname="MSSQL");

INSERT INTO techstacks (techname,datecreated)
  SELECT "Angular", CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS
 (SELECT techname FROM techstacks WHERE techname="Angular.js");

INSERT INTO techstacks (techname,datecreated)
  SELECT "MySQL", CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS
 (SELECT techname FROM techstacks WHERE techname="MySQL");

INSERT INTO techstacks (techname,datecreated)
  SELECT "Postgresql", CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS
 (SELECT techname FROM techstacks WHERE techname="Postgresql");

INSERT INTO techstacks (techname,datecreated)
 SELECT "HTML", CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS
 (SELECT techname FROM techstacks WHERE techname="HTML");

INSERT INTO techstacks (techname,datecreated)
  SELECT "CSS", CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS
 (SELECT techname FROM techstacks WHERE techname="CSS");

INSERT INTO techstacks (techname,datecreated)
  SELECT "JavaScript", CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS
 (SELECT techname FROM techstacks WHERE techname="JavaScript");

INSERT INTO techstacks (techname,datecreated)
  SELECT "Java", CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS
 (SELECT techname FROM techstacks WHERE techname="Java");

INSERT INTO techstacks (techname,datecreated)
  SELECT "C++", CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS
 (SELECT techname FROM techstacks WHERE techname="C++");

INSERT INTO techstacks (techname,datecreated)
  SELECT "C", CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS
 (SELECT techname FROM techstacks WHERE techname="C");

INSERT INTO techstacks (techname,datecreated)
  SELECT "Python", CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS
 (SELECT techname FROM techstacks WHERE techname="Python");
 
INSERT INTO techstacks (techname,datecreated)
  SELECT "Shell", CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS
 (SELECT techname FROM techstacks WHERE techname="Shell");
 
INSERT INTO techstacks (techname,datecreated)
  SELECT "Product Management", CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS
 (SELECT techname FROM techstacks WHERE techname="Product Management");
 
INSERT INTO techstacks (techname,datecreated)
  SELECT "Waterfall", CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS
 (SELECT techname FROM techstacks WHERE techname="Waterfall");

INSERT INTO techstacks (techname,datecreated)
  SELECT "Agile", CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS
 (SELECT techname FROM techstacks WHERE techname="Agile");

INSERT INTO techstacks (techname,datecreated)
  SELECT "SAFE", CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS
 (SELECT techname FROM techstacks WHERE techname="SAFE");

 INSERT INTO techstacks (techname,datecreated)
  SELECT "System Administration", CURRENT_TIMESTAMP() FROM DUAL
WHERE NOT EXISTS
 (SELECT techname FROM techstacks WHERE techname="System Administration");



  -- Datasets for lookupuserroles
INSERT INTO lookupuserroles (rolename,datecreated,datemodified) 
  SELECT  "Admin", "2021-06-08","2021-06-08" FROM DUAL
WHERE NOT EXISTS 
  (SELECT rolename FROM lookupuserroles WHERE rolename= "Admin");
  
INSERT INTO lookupuserroles (rolename,datecreated,datemodified) 
  SELECT  "Software Engineer", "2021-06-08" , "2021-06-08"FROM DUAL
WHERE NOT EXISTS 
  (SELECT rolename FROM lookupuserroles WHERE rolename= "Software Engineer");

INSERT INTO lookupuserroles (rolename,datecreated,datemodified) 
  SELECT  "Product Manager" , "2021-06-08", "2021-06-08" FROM DUAL
WHERE NOT EXISTS 
  (SELECT rolename FROM lookupuserroles WHERE rolename= "Product Manager");


-- Datasets for adminuser --
-- insert Admin profile
INSERT INTO users (firstname,lastname,email) 
  SELECT "System","Admin","admin@stains.petronas.com" FROM DUAL
WHERE NOT EXISTS 
  (SELECT email FROM users WHERE email= "admin@stains.petronas.com");
-- assign System Administration skill to Admin
INSERT INTO userstechstacks (userid, techstackid, skilllevel, datecreated)
  SELECT 1, 21, 1, "2021-06-08" FROM DUAL
WHERE NOT EXISTS 
  (SELECT userid FROM userstechstacks WHERE userid = 1);
-- assign Admin role to Admin
INSERT INTO userroles (roleid, userid)
  SELECT 1,1 FROM DUAL 
WHERE NOT EXISTS 
  (SELECT userid from userroles WHERE userid = 1);
  

-- dummy data
-- dataset users
INSERT INTO users (firstname, lastname, email, employmenttypeid, phonenumber, datecreated, contractstartdate, contractenddate, dailyrate) 
  SELECT "Nurul", "Aqilah", "aqilah@gmail.com", 3, "0133341313", "2018-01-21", "2018-01-22", "2022-01-22", 300.50
  FROM DUAL WHERE NOT EXISTS
    (SELECT email FROM users WHERE email = "aqilah@gmail.com");

INSERT INTO users (firstname, lastname, email, employmenttypeid, phonenumber, datecreated, contractstartdate, contractenddate, dailyrate) 
  SELECT "Afiq", "Zakir", "afiq@gmail.com", 2, "0132340202", "2018-04-08", "2018-04-09", "2022-04-09", 330.00
  FROM DUAL WHERE NOT EXISTS
    (SELECT email FROM users WHERE email = "afiq@gmail.com");
    
INSERT INTO users (firstname, lastname, email, employmenttypeid, phonenumber, datecreated, contractstartdate, contractenddate, dailyrate) 
  SELECT "Irfan", "Mohd", "irfan@gmail.com", 3, "0135009577", "2020-03-03", "2020-03-03", "2020-06-03", 150
  FROM DUAL WHERE NOT EXISTS
    (SELECT email FROM users WHERE email = "irfan@gmail.com");
    
INSERT INTO users (firstname, lastname, email, employmenttypeid, phonenumber, datecreated, contractstartdate, contractenddate, dailyrate) 
  SELECT "Noor", "Zapata", "zapata@gmail.com", 1 , "0123302224", "2021-03-01", "2021-03-21", "2030-05-11", 150
  FROM DUAL WHERE NOT EXISTS
    (SELECT email FROM users WHERE email = "zapata@gmail.com");
    
INSERT INTO users (firstname, lastname, email, employmenttypeid, phonenumber, datecreated, contractstartdate, contractenddate, dailyrate) 
  SELECT "Sabrenna", "Sauma", "sab@gmail.com", 4, "01236772224", "2021-03-01", "2021-03-21", "2030-05-11", 250
  FROM DUAL WHERE NOT EXISTS
    (SELECT email FROM users WHERE email = "sab@gmail.com");

INSERT INTO users (firstname, lastname, email, employmenttypeid, phonenumber, datecreated, contractstartdate, contractenddate, dailyrate) 
  SELECT "Nisa", "Farah", "farahnisasyahindah@gmail.com", 4, "0172533036", "2021-01-01", "2021-01-01", "2022-01-01", 100
  FROM DUAL WHERE NOT EXISTS
    (SELECT email FROM users WHERE email = "farahnisasyahindah@gmail.com");




-- dataset userstechstacks
INSERT INTO userstechstacks (userid, techstackid, skilllevel, datecreated)
    SELECT 2, 2, 1, "2021-06-08" FROM DUAL
    WHERE NOT EXISTS 
        (SELECT userid, techstackid FROM userstechstacks WHERE userid = 2 AND techstackid = 2);

INSERT INTO userstechstacks (userid, techstackid, skilllevel, datecreated)
    SELECT 2, 3, 2, "2021-06-08" FROM DUAL
    WHERE NOT EXISTS 
        (SELECT userid, techstackid FROM userstechstacks WHERE userid = 2 AND techstackid = 3);

INSERT INTO userstechstacks (userid, techstackid, skilllevel, datecreated)
    SELECT 3, 1, 1, "2021-06-08" FROM DUAL
    WHERE NOT EXISTS 
        (SELECT userid, techstackid FROM userstechstacks WHERE userid = 3 AND techstackid = 1);
  
INSERT INTO userstechstacks (userid, techstackid, skilllevel, datecreated)
    SELECT 3, 19, 2, "2021-06-08" FROM DUAL
    WHERE NOT EXISTS 
        (SELECT userid, techstackid FROM userstechstacks WHERE userid = 3 AND techstackid = 19);

INSERT INTO userstechstacks (userid, techstackid, skilllevel, datecreated)
    SELECT 4, 2, 1, "2021-06-08" FROM DUAL
    WHERE NOT EXISTS 
        (SELECT userid, techstackid FROM userstechstacks WHERE userid = 4 AND techstackid = 2);
  
INSERT INTO userstechstacks (userid, techstackid, skilllevel, datecreated)
    SELECT 4, 8, 2, "2021-06-08" FROM DUAL
    WHERE NOT EXISTS 
        (SELECT userid, techstackid FROM userstechstacks WHERE userid = 4 AND techstackid = 8);
  
INSERT INTO userstechstacks (userid, techstackid, skilllevel, datecreated)
    SELECT 4, 13, 2, "2021-06-08" FROM DUAL
    WHERE NOT EXISTS 
        (SELECT userid, techstackid FROM userstechstacks WHERE userid = 4 AND techstackid = 13);
  
INSERT INTO userstechstacks (userid, techstackid, skilllevel, datecreated)
    SELECT 5, 3, 1, "2021-06-08" FROM DUAL
    WHERE NOT EXISTS 
        (SELECT userid, techstackid FROM userstechstacks WHERE userid = 5 AND techstackid = 3);
  
INSERT INTO userstechstacks (userid, techstackid, skilllevel, datecreated)
    SELECT 5, 7, 2, "2021-06-08" FROM DUAL
    WHERE NOT EXISTS 
        (SELECT userid, techstackid FROM userstechstacks WHERE userid = 5 AND techstackid = 7);

INSERT INTO userstechstacks (userid, techstackid, skilllevel, datecreated)
    SELECT 6, 4, 1, "2021-06-08" FROM DUAL
    WHERE NOT EXISTS 
        (SELECT userid, techstackid FROM userstechstacks WHERE userid = 6 AND techstackid = 4);
  
INSERT INTO userstechstacks (userid, techstackid, skilllevel, datecreated)
    SELECT 6, 5, 2, "2021-06-08" FROM DUAL
    WHERE NOT EXISTS 
        (SELECT userid, techstackid FROM userstechstacks WHERE userid = 6 AND techstackid = 5);
  
INSERT INTO userstechstacks (userid, techstackid, skilllevel, datecreated)
    SELECT 6, 3, 1, "2021-06-08" FROM DUAL
    WHERE NOT EXISTS 
        (SELECT userid, techstackid FROM userstechstacks WHERE userid = 6 AND techstackid = 3);
  
  
-- dataset applications
INSERT INTO applications (appname, appurl, devopslink, datecreated, datemodified, comments) 
    SELECT "Alpha Oil","alphaoil.petronas.com","petronasvsts.visualstudio.com/Alpha%20Oil","2020-04-01","2020-04-02","" FROM DUAL
    WHERE NOT EXISTS 
        (SELECT appurl FROM applications WHERE appurl = "alphaoil.petronas.com");
  
INSERT INTO applications (appname, appurl, devopslink, datecreated, datemodified, comments) 
    SELECT "Petronas UP","up.petronas.com","petronasvsts.visualstudio.com/Petronas%20UP","2020-04-01","2020-04-02","" FROM DUAL
    WHERE NOT EXISTS 
        (SELECT appurl FROM applications WHERE appurl = "up.petronas.com");
  
INSERT INTO applications (appname, appurl, devopslink, datecreated, datemodified, comments) 
    SELECT "CIMS","cims.petronas.com","petronasvsts.visualstudio.com/CIMS","2020-04-01","2020-04-02","" FROM DUAL
    WHERE NOT EXISTS 
        (SELECT appurl FROM applications WHERE appurl = "cims.petronas.com");
  
INSERT INTO applications (appname, appurl, devopslink, datecreated, datemodified, comments) 
    SELECT "PAMS","pams.petronas.com","petronasvsts.visualstudio.com/PAMS","2020-04-01","2020-04-02","" FROM DUAL
    WHERE NOT EXISTS 
        (SELECT appurl FROM applications WHERE appurl = "pams.petronas.com");
  
INSERT INTO applications (appname, appurl, devopslink, datecreated, datemodified, comments) 
    SELECT "Droid","droid.petronas.com","petronasvsts.visualstudio.com/DROID","2020-04-01","2020-04-02","" FROM DUAL
    WHERE NOT EXISTS 
        (SELECT appurl FROM applications WHERE appurl = "droid.petronas.com");
  
INSERT INTO applications (appname, appurl, devopslink, datecreated, datemodified, comments) 
    SELECT "Vinci","vinci.petronas.com","petronasvsts.visualstudio.com/VINCI","2021-02-18","2021-04-02","" FROM DUAL
    WHERE NOT EXISTS 
        (SELECT appurl FROM applications WHERE appurl = "vinci.petronas.com");
  
INSERT INTO applications (appname, appurl, devopslink, datecreated, datemodified, comments) 
    SELECT "App7","www.app7.com","www.devapp5.com","2020-04-01", NULL,"Good Job!!" FROM DUAL
    WHERE NOT EXISTS 
        (SELECT appurl FROM applications WHERE appurl = "www.app7.com");


-- dataset appsusers
INSERT INTO appsusers (appid, userid, datestarted, dateended)
    SELECT 2, 2, "2021-02-01", "2021-04-01" FROM DUAL
    WHERE NOT EXISTS 
        (SELECT appid, userid FROM appsusers WHERE appid = 2 AND userid = 2);

INSERT INTO appsusers (appid, userid, datestarted, dateended)
    SELECT 5, 2, "2020-04-04", "2020-04-08" FROM DUAL
    WHERE NOT EXISTS 
        (SELECT appid, userid FROM appsusers WHERE appid = 5 AND userid = 2);
        
INSERT INTO appsusers (appid, userid, datestarted, dateended)
    SELECT 6, 2, '2021-02-01', null FROM DUAL
    WHERE NOT EXISTS 
        (SELECT appid, userid FROM appsusers WHERE appid = 6 AND userid = 2);

INSERT INTO appsusers (appid, userid, datestarted, dateended)
    SELECT 3, 3, "2020-04-04", "2020-04-08" FROM DUAL
    WHERE NOT EXISTS 
        (SELECT appid, userid FROM appsusers WHERE appid = 3 AND userid = 3);
        
INSERT INTO appsusers (appid, userid, datestarted, dateended)
    SELECT 7, 3, "2020-04-04", null FROM DUAL
    WHERE NOT EXISTS 
        (SELECT appid, userid FROM appsusers WHERE appid = 7 AND userid = 3);
     
INSERT INTO appsusers (appid, userid, datestarted, dateended)
    SELECT 4, 4, "2020-04-04", "2020-04-08" FROM DUAL
    WHERE NOT EXISTS 
        (SELECT appid, userid FROM appsusers WHERE appid = 4 AND userid = 4);
        
INSERT INTO appsusers (appid, userid, datestarted, dateended)
    SELECT 6, 4, "2020-04-04", "2020-04-08" FROM DUAL
    WHERE NOT EXISTS 
        (SELECT appid, userid FROM appsusers WHERE appid = 6 AND userid = 4);
        
INSERT INTO appsusers (appid, userid, datestarted, dateended)
    SELECT 5, 5, "2020-04-04", "2020-04-08" FROM DUAL
    WHERE NOT EXISTS 
        (SELECT appid, userid FROM appsusers WHERE appid = 5 AND userid = 5);
        
INSERT INTO appsusers (appid, userid, datestarted, dateended)
    SELECT 7, 5, "2020-04-04", "2020-04-08" FROM DUAL
    WHERE NOT EXISTS 
        (SELECT appid, userid FROM appsusers WHERE appid = 7 AND userid = 5);
        
INSERT INTO appsusers (appid, userid, datestarted, dateended)
    SELECT 1, 6, "2021-02-01", null FROM DUAL
    WHERE NOT EXISTS 
        (SELECT appid, userid FROM appsusers WHERE appid = 1 AND userid = 6);
        
INSERT INTO appsusers (appid, userid, datestarted, dateended)
    SELECT 4, 6, "2020-04-04", "2020-04-08" FROM DUAL
    WHERE NOT EXISTS 
        (SELECT appid, userid FROM appsusers WHERE appid = 4 AND userid = 6);
        

-- dataset auditlogs
INSERT INTO auditlogs (userid, datecreated, auditlogobjectid, auditlogactionid, auditlogobjecttargetid, valueorigin, valuenew) 
    SELECT 1, "2021-06-11", 1, 1, 3, null, "Product Manager" FROM DUAL
    WHERE NOT EXISTS 
        (SELECT userid, datecreated FROM auditlogs WHERE userid = 1 AND datecreated = "2021-06-11");

INSERT INTO auditlogs (userid, datecreated, auditlogobjectid, auditlogactionid, auditlogobjecttargetid, valueorigin, valuenew) 
    SELECT 2, "2021-06-15", 2, 2, 2, "Viewer", "Editor" FROM DUAL
    WHERE NOT EXISTS 
        (SELECT userid, datecreated FROM auditlogs WHERE userid = 2 AND datecreated = "2021-06-15");
        
INSERT INTO auditlogs (userid, datecreated, auditlogobjectid, auditlogactionid, auditlogobjecttargetid, valueorigin, valuenew) 
    SELECT 3, "2021-06-20", 2, 3, 1, "Editor", null FROM DUAL
    WHERE NOT EXISTS 
        (SELECT userid, datecreated FROM auditlogs WHERE userid = 3 AND datecreated = "2021-06-20");
 
    
-- dataset userroles
INSERT INTO userroles (userid, roleid)
    SELECT 2, 2 FROM DUAL
    WHERE NOT EXISTS 
        (SELECT userid, roleid FROM userroles WHERE userid = 2 AND roleid = 2);

INSERT INTO userroles (userid, roleid)
    SELECT 2, 3 FROM DUAL
    WHERE NOT EXISTS 
        (SELECT userid, roleid FROM userroles WHERE userid = 2 AND roleid = 3);
        
INSERT INTO userroles (userid, roleid)
    SELECT 3, 3 FROM DUAL
    WHERE NOT EXISTS 
        (SELECT userid, roleid FROM userroles WHERE userid = 3 AND roleid = 3);
        
INSERT INTO userroles (userid, roleid)
    SELECT 4, 2 FROM DUAL
    WHERE NOT EXISTS 
        (SELECT userid, roleid FROM userroles WHERE userid = 4 AND roleid = 2);
        
INSERT INTO userroles (userid, roleid)
    SELECT 5, 2 FROM DUAL
    WHERE NOT EXISTS 
        (SELECT userid, roleid FROM userroles WHERE userid = 5 AND roleid = 2);
        
INSERT INTO userroles (userid, roleid)
    SELECT 6, 2 FROM DUAL
    WHERE NOT EXISTS 
        (SELECT userid, roleid FROM userroles WHERE userid = 6 AND roleid = 2);
        

-- data for appstechstacks
INSERT INTO appstechstacks (appid, techstackid, datecreated)
    SELECT 1, 1, CURRENT_TIMESTAMP() FROM DUAL
    WHERE NOT EXISTS 
        (SELECT appid, techstackid FROM appstechstacks WHERE appid = 1 AND techstackid = 1);
        
INSERT INTO appstechstacks (appid, techstackid, datecreated)
    SELECT 1, 2, CURRENT_TIMESTAMP() FROM DUAL
    WHERE NOT EXISTS 
        (SELECT appid, techstackid FROM appstechstacks WHERE appid = 1 AND techstackid = 2);
        
INSERT INTO appstechstacks (appid, techstackid, datecreated)
    SELECT 1, 3, CURRENT_TIMESTAMP() FROM DUAL
    WHERE NOT EXISTS 
        (SELECT appid, techstackid FROM appstechstacks WHERE appid = 1 AND techstackid = 3);
        
INSERT INTO appstechstacks (appid, techstackid, datecreated)
    SELECT 1, 6, CURRENT_TIMESTAMP() FROM DUAL
    WHERE NOT EXISTS 
        (SELECT appid, techstackid FROM appstechstacks WHERE appid = 1 AND techstackid = 6);

INSERT INTO appstechstacks (appid, techstackid, datecreated)
    SELECT 2, 5, CURRENT_TIMESTAMP() FROM DUAL
    WHERE NOT EXISTS 
        (SELECT appid, techstackid FROM appstechstacks WHERE appid = 2 AND techstackid = 5);
        
INSERT INTO appstechstacks (appid, techstackid, datecreated)
    SELECT 2, 8, CURRENT_TIMESTAMP() FROM DUAL
    WHERE NOT EXISTS 
        (SELECT appid, techstackid FROM appstechstacks WHERE appid = 2 AND techstackid = 8);
        
INSERT INTO appstechstacks (appid, techstackid, datecreated)
    SELECT 2, 12, CURRENT_TIMESTAMP() FROM DUAL
    WHERE NOT EXISTS 
        (SELECT appid, techstackid FROM appstechstacks WHERE appid = 2 AND techstackid = 12);
        
INSERT INTO appstechstacks (appid, techstackid, datecreated)
    SELECT 2, 13, CURRENT_TIMESTAMP() FROM DUAL
    WHERE NOT EXISTS 
        (SELECT appid, techstackid FROM appstechstacks WHERE appid = 2 AND techstackid = 13);
        
INSERT INTO appstechstacks (appid, techstackid, datecreated)
    SELECT 3, 16, CURRENT_TIMESTAMP() FROM DUAL
    WHERE NOT EXISTS 
        (SELECT appid, techstackid FROM appstechstacks WHERE appid = 3 AND techstackid = 16);
        
INSERT INTO appstechstacks (appid, techstackid, datecreated)
    SELECT 4, 14, CURRENT_TIMESTAMP() FROM DUAL
    WHERE NOT EXISTS 
        (SELECT appid, techstackid FROM appstechstacks WHERE appid = 4 AND techstackid = 14);
        
INSERT INTO appstechstacks (appid, techstackid, datecreated)
    SELECT 5, 15, CURRENT_TIMESTAMP() FROM DUAL
    WHERE NOT EXISTS 
        (SELECT appid, techstackid FROM appstechstacks WHERE appid = 5 AND techstackid = 15);
        
INSERT INTO appstechstacks (appid, techstackid, datecreated)
    SELECT 6, 18, CURRENT_TIMESTAMP() FROM DUAL
    WHERE NOT EXISTS 
        (SELECT appid, techstackid FROM appstechstacks WHERE appid = 6 AND techstackid = 18);
        
INSERT INTO appstechstacks (appid, techstackid, datecreated)
    SELECT 7, 2, CURRENT_TIMESTAMP() FROM DUAL
    WHERE NOT EXISTS 
        (SELECT appid, techstackid FROM appstechstacks WHERE appid = 7 AND techstackid = 2);

-- data for lookupauditlogobjecttargets        
INSERT INTO lookupauditlogobjecttargets (userid) 
  SELECT  "5" FROM DUAL
WHERE NOT EXISTS 
  (SELECT userid FROM lookupauditlogobjecttargets WHERE userid= "5");
  
  INSERT INTO lookupauditlogobjecttargets (userid) 
  SELECT  "4" FROM DUAL
WHERE NOT EXISTS 
  (SELECT userid FROM lookupauditlogobjecttargets WHERE userid= "4");
  
  INSERT INTO lookupauditlogobjecttargets (userid) 
  SELECT  "2" FROM DUAL
WHERE NOT EXISTS 
  (SELECT userid FROM lookupauditlogobjecttargets WHERE userid= "2");

-- dummy data for users not logged in last 90 days
INSERT INTO userslogin (userid, datelogin) VALUES (2, "2021-01-09 14:41:13");
INSERT INTO userslogin (userid, datelogin) VALUES (3, "2020-01-09 14:41:13");
INSERT INTO userslogin (userid, datelogin) VALUES (4, "2020-11-29 14:41:13");
INSERT INTO userslogin (userid, datelogin) VALUES (5, "2021-01-22 14:41:13");


-- update data   
UPDATE users SET position = "Software Engineer" WHERE email = "aqilah@gmail.com";
UPDATE users SET position = "Solution Architect" WHERE email = "afiq@gmail.com";
UPDATE users SET position = "Senior Software Engineer" WHERE email = "irfan@gmail.com";
UPDATE users SET position = "Solution Architect" WHERE email = "zapata@gmail.com";
UPDATE users SET position = "Tech Lead" WHERE email = "sab@gmail.com";
UPDATE users SET datecreated = "2018-01-01" WHERE email = "admin@stains.petronas.com";

UPDATE applications SET expectedappmembercount = 10 WHERE id = 1;
UPDATE applications SET expectedappmembercount = 13 WHERE id = 2;
UPDATE applications SET expectedappmembercount = 9 WHERE id = 3;
UPDATE applications SET expectedappmembercount = 7 WHERE id = 4;
UPDATE applications SET expectedappmembercount = 5 WHERE id = 5;
UPDATE applications SET expectedappmembercount = 8 WHERE id = 6;
UPDATE applications SET expectedappmembercount = 6 WHERE id = 7;