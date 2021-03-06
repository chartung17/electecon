
/* INIT */
DROP DATABASE IF EXISTS election;
CREATE DATABASE election;
USE election;




/* DDL */
CREATE TABLE Candidate(
    CANDIDATE_ID INT PRIMARY KEY,
    CANDIDATE_NAME VARCHAR(256),
    PARTY VARCHAR(256)
);
CREATE TABLE County(
    FIPS VARCHAR(5) PRIMARY KEY,
    NAME VARCHAR(256),
    STATE VARCHAR(2)
);
CREATE TABLE Election(
    YEAR INT,
    FIPS VARCHAR(5), 
    CANDIDATE_ID INT,
    CANDIDATE_VOTES INT, 
    PRIMARY KEY(YEAR, FIPS, CANDIDATE_ID),
    FOREIGN KEY (FIPS) REFERENCES County(FIPS),
    FOREIGN KEY (CANDIDATE_ID) REFERENCES Candidate(CANDIDATE_ID)
);
CREATE TABLE Industry(
    INDUSTRY_ID INT PRIMARY KEY,
    NAME VARCHAR(256)
);
CREATE TABLE GDP(
    FIPS VARCHAR(5), 
    INDUSTRY_ID INT, 
    YEAR INT,
    GDP INT,
    PRIMARY KEY(FIPS, INDUSTRY_ID, YEAR),
    FOREIGN KEY (FIPS) REFERENCES County(FIPS),
    FOREIGN KEY (INDUSTRY_ID) REFERENCES Industry(INDUSTRY_ID)
);




/* LOAD DATA */
LOAD DATA LOCAL INFILE '~/output/candidate.csv' INTO TABLE Candidate 
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"';

LOAD DATA LOCAL INFILE '~/output/county.csv' INTO TABLE County
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"';

LOAD DATA LOCAL INFILE '~/output/industry.csv' INTO TABLE Industry
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"';

LOAD DATA LOCAL INFILE '~/output/gdp.csv' INTO TABLE GDP
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"';

LOAD DATA LOCAL INFILE '~/output/election.csv' INTO TABLE Election
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"';

/* CREATE TABLES FOR QUERY OPTIMIZATION */
DELIMITER $$
CREATE PROCEDURE AddTopIndustries()
BEGIN
	DECLARE y INT;
	SET y = 2001;
	while_loop: LOOP
		IF (y > 2018) THEN
			LEAVE while_loop;
		END IF;
		INSERT INTO TopIndustry
		WITH IndustryGDP AS (
			SELECT *
			FROM GDP
			WHERE YEAR = y
			AND INDUSTRY_ID IN (2,3,4,5,7,8,9,10,11,12,14,15,17,18,19,21,22,24,25,26,27)
			LIMIT 100000
		)
		SELECT I.YEAR, I.FIPS, I.INDUSTRY_ID AS Z
		FROM IndustryGDP I
		WHERE I.INDUSTRY_ID =
			(SELECT J.INDUSTRY_ID
			FROM IndustryGDP J
			WHERE I.FIPS = J.FIPS
			ORDER BY J.GDP DESC
			LIMIT 1);
		SET y = y + 1;
	END LOOP;
END $$
DELIMITER ;
CALL AddTopIndustries();


/**************************************/
/* INDICES */
/**************************************/

/*
Create secondary BTREE index on County.STATE. Improves queries for finding County tuples of some state.

E.g. Finding the list of counties in Texas.

Query : SELECT * FROM County WHERE STATE IN ('TX');
BEFORE: the query has no possible_keys and has to perform full table scan (3228 rows).
        Avg of 5: 1.368 ms.
AFTER : the query uses county_state_idx as possible_keys and examines only the number of counties in that state
        e.g. 254 counties in Texas.
        Avg of 5: 0.8404 ms (63% improvement).
*/
CREATE INDEX county_state_idx USING BTREE ON County(State);

/* Create index on all fields of GDP table to improve top industry queries */
CREATE INDEX gdp_idx USING BTREE ON GDP(YEAR, INDUSTRY_ID, FIPS, GDP);
