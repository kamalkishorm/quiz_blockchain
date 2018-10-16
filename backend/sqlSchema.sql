IF EXISTS (SELECT * FROM sys.tables
WHERE name = N'users' AND type = 'U')
BEGIN
  DROP TABLE [dbo].[users];
END

CREATE TABLE [dbo].[users] (
	id INT IDENTITY(1,1), 
	uname NVARCHAR(100) NOT NULL UNIQUE, 
	email NVARCHAR(100), 
	pass NVARCHAR(16) NOT NULL,
	created DATETIME NOT NULL,
	PRIMARY KEY (id)
);

SET IDENTITY_INSERT [dbo].[users] OFF

INSERT INTO [dbo].[users] VALUES('test1','test1@gmail.com','test1',GETDATE());
select * from [dbo].[users];

IF EXISTS (SELECT * FROM sys.tables
WHERE name = N'QandA' AND type = 'U')
BEGIN
  DROP TABLE [dbo].[QandA];
END

CREATE TABLE [dbo].[QandA] (
	id INT IDENTITY(1,1), 
	question NVARCHAR(1000) NOT NULL UNIQUE, 
	choice1 NVARCHAR(100) NOT NULL,
	choice2 NVARCHAR(100) NOT NULL,
	choice3 NVARCHAR(100),
	choice4 NVARCHAR(100),
	is_active BIT,
	answer int NOT NULL, 
	PRIMARY KEY (id)
);

SET IDENTITY_INSERT [dbo].[QandA] OFF

INSERT INTO [dbo].[QandA] (question,choice1,choice2,choice3,choice4,answer,is_active) VALUES ('56% of Y is 182. What is Y?','350','364','325','330',3,1)
INSERT INTO [dbo].[QandA] (question,choice1,choice2,choice3,choice4,answer,is_active) VALUES ('Y has to score 40% marks to pass. He gets 20 marks and fails by 40 marks. The maximum marks of the exam are?','100','200','150','250',3,1)
INSERT INTO [dbo].[QandA] (question,choice1,choice2,choice3,choice4,answer,is_active) VALUES ('Which of the following two ratios is greater 17:18 and 10:11?','17/18','10/11','Both are same','Cannot determine',1,1)
INSERT INTO [dbo].[QandA] (question,choice1,choice2,choice3,choice4,answer,is_active) VALUES ('285 is summation of 3 numbers. Ratio between 2nd and 3rd numbers is 6:5. Ratio between 1st and 2nd numbers is 3:7. The 3rd number is?','135','150','124','105',4,1)
INSERT INTO [dbo].[QandA] (question,choice1,choice2,choice3,choice4,answer,is_active) VALUES ('A man got Rs. 130 less, as simple interest, when he invested Rs. 2000 for 4 years as compared to investing Rs. 2250 for same duration. What is the rate of interest?','12%','13%','12.5%','10.5%',2,1)
INSERT INTO [dbo].[QandA] (question,choice1,choice2,choice3,choice4,answer,is_active) VALUES ('Ram is three times as old as his Sam. 2 years ago he was five times as old as Sam. What is the present age of Ram?','12 years','14 years','18 years','24 years',1,1)
INSERT INTO [dbo].[QandA] (question,choice1,choice2,choice3,choice4,answer,is_active) VALUES ('If 12 men or 16 women can do a work in 172 days, how long will 21 men and 15 women to do the same work?','64 days','60 days','86 days','75 days',1,1)
INSERT INTO [dbo].[QandA] (question,choice1,choice2,choice3,choice4,answer,is_active) VALUES ('Find average of natural numbers from 1 to 65?','33','32.5','130','65',1,1)
INSERT INTO [dbo].[QandA] (question,choice1,choice2,choice3,choice4,answer,is_active) VALUES ('In a race, average speed of total 75 bikes is 35km/hr. The average speed of red bikes is 55 km/hr. If average speed of green bikes is 30km/hr, then how many green bikes are there?','70','60','45','50',2,1)
INSERT INTO [dbo].[QandA] (question,choice1,choice2,choice3,choice4,answer,is_active) VALUES ('Suresh keeps all his socks in a single drawer. He has 24 pairs of white socks and 18 pairs of grey socks. Suresh picks 3 socks randomly. Find the possibility of Suresh choosing a matching pair.','1/36','1/108','7/36','1',4,1)
SELECT * from [dbo].[QandA];
