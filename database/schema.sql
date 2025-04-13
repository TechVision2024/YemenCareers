


CREATE DATABASE [YemenCareers];



-- --------------------------------------------
-- جدول المستخدمين (users)
-- --------------------------------------------
CREATE TABLE [users] (
    [id] INT PRIMARY KEY IDENTITY(1, 1),
    [name] NVARCHAR(255) NOT NULL,
    [description] NVARCHAR(MAX),
    [email] NVARCHAR(255) UNIQUE NOT NULL,
    [company_type] NVARCHAR(255),
    [phone] NVARCHAR(20) CHECK (
        [phone] LIKE '+967 01-[0-9][0-9][0-9]-[0-9][0-9][0-9]' 
        OR 
        [phone] LIKE '+967 01 [0-9][0-9][0-9] [0-9][0-9][0-9]'
    ),
    [address] NVARCHAR(MAX),
    [website] NVARCHAR(255),
    [social_links] NVARCHAR(MAX) CHECK (
        (LEN([social_links]) - LEN(REPLACE([social_links], ',', '')) + 1) <= 4
    ),
    [password] NVARCHAR(MAX) NOT NULL,
    [salt] NVARCHAR(MAX) NOT NULL,
    [background_image] NVARCHAR(255),
    [user_status] NVARCHAR(50) NOT NULL 
        DEFAULT N'غير نشط' 
        CHECK ([user_status] IN (N'نشط', N'غير نشط')),
    [role] NVARCHAR(50) NOT NULL 
        DEFAULT N'مستخدم' 
        CHECK ([role] IN (N'مستخدم', N'مسؤول')),
    [created_at] DATETIME DEFAULT GETDATE(),
    [updated_at] DATETIME DEFAULT GETDATE()
);
GO

-- --------------------------------------------
-- جدول الوظائف (jobs)
-- --------------------------------------------
CREATE TABLE [jobs] (
    [id] INT PRIMARY KEY IDENTITY(1, 1),
    [title] NVARCHAR(255) NOT NULL,
    [description] NVARCHAR(MAX),
    [job_type] NVARCHAR(255),
    [department] NVARCHAR(255),
    [expire_date] DATE NOT NULL,
    [city] NVARCHAR(255),
    [status] NVARCHAR(50) NOT NULL 
        DEFAULT N'مفتوح' 
        CHECK ([status] IN (N'مفتوح', N'مغلق')),
    [reminder_date] DATE,
    [apply_link] NVARCHAR(255),
    [created_at] DATETIME DEFAULT GETDATE(),
    [updated_at] DATETIME DEFAULT GETDATE()
);
GO

-- --------------------------------------------
-- جدول الأرشيف (archived_users)
-- --------------------------------------------
CREATE TABLE [archived_users] (
    [user_id] INT PRIMARY KEY FOREIGN KEY REFERENCES [users]([id]),
    [name] NVARCHAR(255) NOT NULL,
    [description] NVARCHAR(MAX),
    [email] NVARCHAR(255) NOT NULL,
    [company_type] NVARCHAR(255),
    [phone] NVARCHAR(20),
    [address] NVARCHAR(MAX),
    [website] NVARCHAR(255),
    [social_links] NVARCHAR(MAX),
    [password] NVARCHAR(MAX),
    [salt] NVARCHAR(MAX),
    [background_image] NVARCHAR(255),
    [user_status] NVARCHAR(50) NOT NULL,
    [role] NVARCHAR(50) NOT NULL 
        CHECK ([role] IN (N'مستخدم', N'مسؤول')),
    [deleted_at] DATETIME DEFAULT GETDATE(),
    [deletion_reason] NVARCHAR(MAX),
    [company_name] NVARCHAR(255)
);
GO

-- --------------------------------------------
-- المشغلات (Triggers)
-- --------------------------------------------

-- تحديث حالة الوظيفة تلقائيًا
CREATE TRIGGER UpdateJobStatus
ON [jobs]
AFTER INSERT, UPDATE
AS
BEGIN
    UPDATE j
    SET [status] = 
        CASE 
            WHEN j.[expire_date] < GETDATE() THEN N'مغلق'
            ELSE N'مفتوح'
        END
    FROM [jobs] j
    INNER JOIN inserted i ON j.[id] = i.[id];
END;
GO

-- أرشفة المستخدم عند الحذف
CREATE TRIGGER ArchiveUserOnDelete
ON [users]
AFTER DELETE
AS
BEGIN
    INSERT INTO [archived_users] (
        [user_id], [name], [description], [email], [company_type], [phone],
        [address], [website], [social_links], [password], [salt], [background_image],
        [user_status], [role], [company_name]
    )
    SELECT 
        [id], [name], [description], [email], [company_type], [phone],
        [address], [website], [social_links], [password], [salt], [background_image],
        [user_status], [role], [company_type]
    FROM deleted;
END;
GO





ALTER TABLE [jobs] 
ADD [user_id] INT FOREIGN KEY REFERENCES [users]([id]);






  database/ERD.png
