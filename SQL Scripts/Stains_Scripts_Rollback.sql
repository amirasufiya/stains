-- DELETE DATA data inside respective tables
TRUNCATE TABLE userstechstacks;
TRUNCATE TABLE authorizations;
TRUNCATE TABLE auditlogs;
TRUNCATE TABLE appstechstacks;
TRUNCATE TABLE appsusers;
TRUNCATE TABLE navmenuitems;
TRUNCATE TABLE systempagetracking;
TRUNCATE TABLE userslogin;
TRUNCATE TABLE userroles;
TRUNCATE TABLE projects;
 
-- delete all data inside table users
ALTER TABLE userstechstacks DROP CONSTRAINT fk_user;
ALTER TABLE auditlogs DROP CONSTRAINT fk_userid;
ALTER TABLE appsusers DROP CONSTRAINT fk_usersid;
ALTER TABLE userslogin DROP CONSTRAINT fk_userlogid;
ALTER TABLE userroles DROP CONSTRAINT fk_userurid;
ALTER TABLE lookupauditlogobjecttargets DROP CONSTRAINT fk_tgtuserid;
TRUNCATE TABLE users;
ALTER TABLE userstechstacks ADD CONSTRAINT fk_user FOREIGN KEY (userid) REFERENCES users(id);
ALTER TABLE auditlogs ADD CONSTRAINT fk_userid FOREIGN KEY (userid) REFERENCES users(id);
ALTER TABLE appsusers ADD CONSTRAINT fk_usersid FOREIGN KEY (userid) REFERENCES users(id);
ALTER TABLE userslogin ADD CONSTRAINT fk_userlogid FOREIGN KEY(userid) REFERENCES users(id);
ALTER TABLE userroles ADD CONSTRAINT fk_userurid FOREIGN KEY (userid) REFERENCES users(id);
ALTER TABLE lookupauditlogobjecttargets ADD CONSTRAINT fk_tgtuserid FOREIGN KEY (userid) REFERENCES users(id);
SELECT * FROM users;
 
-- delete all data inside table lookupemploymenttypes
ALTER TABLE users DROP CONSTRAINT fk_employmenttype; 
TRUNCATE TABLE lookupemploymenttypes;
ALTER TABLE users ADD CONSTRAINT fk_employmenttype FOREIGN KEY (employmenttypeid) REFERENCES lookupemploymenttypes(id);
SELECT * FROM lookupemploymenttypes;
 
-- delete all data inside table techstacks
ALTER TABLE userstechstacks DROP CONSTRAINT fk_techstack;
ALTER TABLE appstechstacks DROP CONSTRAINT fk_techstackid;
TRUNCATE TABLE techstacks;
ALTER TABLE userstechstacks ADD CONSTRAINT fk_techstack FOREIGN KEY (techstackid) REFERENCES techstacks(id);
ALTER TABLE appstechstacks ADD CONSTRAINT fk_techstackid FOREIGN KEY (techstackid) REFERENCES techstacks(id);
SELECT * FROM techstacks;
 
-- delete all data inside table userroles
ALTER TABLE authorizations DROP CONSTRAINT fk_lookupuserrole;
ALTER TABLE userroles DROP CONSTRAINT fk_lookupuserroles;
TRUNCATE TABLE lookupuserroles;
ALTER TABLE authorizations ADD CONSTRAINT fk_lookupuserrole FOREIGN KEY(roleid) REFERENCES lookupuserroles(id);
ALTER TABLE userroles ADD CONSTRAINT fk_lookupuserroles FOREIGN KEY(roleid) REFERENCES lookupuserroles(id);
SELECT * FROM userroles;
 
-- delete all data inside table features
ALTER TABLE authorizations DROP CONSTRAINT fk_feature;
TRUNCATE TABLE features;
ALTER TABLE authorizations ADD CONSTRAINT fk_feature FOREIGN KEY(featureid) REFERENCES features(id);
SELECT * FROM features;
 
-- delete all data inside table lookuppermissions
ALTER TABLE authorizations DROP CONSTRAINT fk_permission;
TRUNCATE TABLE lookuppermissions;
ALTER TABLE authorizations ADD CONSTRAINT fk_permission FOREIGN KEY(permissionid) REFERENCES lookuppermissions(id);
SELECT * FROM lookuppermissions;
 
-- delete all data inside table lookupauditlogobjects
ALTER TABLE auditlogs DROP CONSTRAINT fk_auditlogobjectid;
TRUNCATE TABLE lookupauditlogobjects;
ALTER TABLE auditlogs ADD CONSTRAINT fk_auditlogobjectid FOREIGN KEY (auditlogobjectid) REFERENCES lookupauditlogobjects(id);
SELECT * FROM lookupauditlogobjects;
 
-- delete all data inside table lookupauditlogactions
ALTER TABLE auditlogs DROP CONSTRAINT fk_auditlogactionid;
TRUNCATE TABLE lookupauditlogactions;
ALTER TABLE auditlogs ADD CONSTRAINT fk_auditlogactionid FOREIGN KEY (auditlogactionid) REFERENCES lookupauditlogactions(id);
SELECT * FROM lookupauditlogactions;
 
-- delete all data inside table applications
ALTER TABLE appstechstacks DROP CONSTRAINT fk_appsid;
ALTER TABLE appsusers DROP CONSTRAINT fk_appid;
ALTER TABLE projects DROP CONSTRAINT fk_applicationsid;
TRUNCATE TABLE applications;
ALTER TABLE appstechstacks ADD CONSTRAINT fk_appsid FOREIGN KEY (appid) REFERENCES applications(id);
ALTER TABLE appsusers ADD CONSTRAINT fk_appid FOREIGN KEY (appid) REFERENCES applications(id);
ALTER TABLE projects ADD CONSTRAINT fk_applicationsid FOREIGN KEY (appid) REFERENCES applications(id);
SELECT * FROM applications;
 
-- delete all data inside table lookupnavmenutypes
ALTER TABLE navmenuitems DROP CONSTRAINT fk_navmenutypesid;
TRUNCATE TABLE lookupnavmenutypes;
ALTER TABLE navmenuitems ADD CONSTRAINT fk_navmenutypesid FOREIGN KEY (navmenutypesid) REFERENCES lookupnavmenutypes(id);
SELECT * FROM lookupnavmenutypes;
 
-- delete all data inside table lookuppages
ALTER TABLE systempagetracking DROP CONSTRAINT fk_pageid;
TRUNCATE TABLE lookuppages;
ALTER TABLE systempagetracking ADD CONSTRAINT fk_pageid FOREIGN KEY(pageid) REFERENCES lookuppages(id);
SELECT * FROM lookuppages;


-- DELETE TABLES : 21 tables

-- delete table for systempagetracking
DROP TABLE IF EXISTS systempagetracking;
 
-- Delete table NavMenuItmes
DROP TABLE IF EXISTS navmenuitems;

-- delete table appstechstacks
DROP TABLE IF EXISTS appstechstacks;

-- delete table appsusers
DROP TABLE IF EXISTS appsusers;

-- delete table application;
DROP TABLE IF EXISTS applications;

-- delete table auditlogs
DROP TABLE IF EXISTS auditlogs;
 
-- delete table authorizations
DROP TABLE IF EXISTS authorizations;
 
-- delete table userstechstacks
DROP TABLE IF EXISTS userstechstacks;

-- delete table for userslogin
DROP TABLE IF EXISTS userslogin;
 
-- delete table userroles
DROP TABLE IF EXISTS userroles;
 
-- delete table users
DROP TABLE IF EXISTS users;
 
-- delete table features
DROP TABLE IF EXISTS features;

-- delete table techstacks
DROP TABLE IF EXISTS techstacks;

-- delete table for  lookuppages
DROP TABLE IF EXISTS lookuppages;
 
-- Delete table LookupNavMenuTypes
DROP TABLE IF EXISTS lookupnavmenutypes;

-- delete table lookupauditlogactions
DROP TABLE IF EXISTS lookupauditlogactions; 

-- delete table lookupauditlogobjects
DROP TABLE IF EXISTS lookupauditlogobjects;

-- Delete table lookupuserroles
DROP TABLE IF EXISTS lookupuserroles;

-- delete table lookupemploymenttypes
DROP TABLE IF EXISTS lookupemploymenttypes;
 
-- delete table lookuppermissions
DROP TABLE IF EXISTS lookuppermissions;

-- delete table lookupauditlogobjecttargets
DROP TABLE IF EXISTS lookupauditlogobjecttargets;

-- delete table projects
DROP TABLE IF EXISTS projects;