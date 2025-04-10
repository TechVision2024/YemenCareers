CREATE TABLE [jobs] (
  [id] INT PRIMARY KEY IDENTITY(1, 1),
  [title] VARCHAR(255) NOT NULL,
  [description] TEXT,
  [job_type] VARCHAR(255),
  [department] VARCHAR(255),
  [expire_date] DATE,
  [city] VARCHAR(255),
  [status] VARCHAR(50) NOT NULL DEFAULT 'مفتوح',
  [reminder_date] DATE,
  [apply_link] VARCHAR(255),
  [created_at] DATETIME DEFAULT 'getdate()',
  [updated_at] DATETIME DEFAULT 'getdate()'
)
GO

CREATE TABLE [users] (
  [id] INT PRIMARY KEY IDENTITY(1, 1),
  [name] VARCHAR(255) NOT NULL,
  [description] TEXT,
  [email] VARCHAR(255) UNIQUE NOT NULL,
  [company_type] VARCHAR(255),
  [phone] VARCHAR(20),
  [address] TEXT,
  [website] VARCHAR(255),
  [social] TEXT,
  [password] TEXT,
  [salt] TEXT,
  [background_image] VARCHAR(255),
  [user_status] VARCHAR(50) NOT NULL DEFAULT 'معطل',
  [role] VARCHAR(50) NOT NULL DEFAULT 'مستخدم',
  [created_at] DATETIME DEFAULT 'getdate()',
  [updated_at] DATETIME DEFAULT 'getdate()'
)
GO

CREATE TABLE [archived_users] (
  [id] INT PRIMARY KEY,
  [name] VARCHAR(255) NOT NULL,
  [description] TEXT,
  [email] VARCHAR(255) NOT NULL,
  [company_type] VARCHAR(255),
  [phone] VARCHAR(20),
  [address] TEXT,
  [website] VARCHAR(255),
  [social] TEXT,
  [password] TEXT,
  [salt] TEXT,
  [background_image] VARCHAR(255),
  [user_status] VARCHAR(50) NOT NULL DEFAULT 'معطل',
  [role] VARCHAR(50) NOT NULL DEFAULT 'مستخدم',
  [deleted_at] DATETIME DEFAULT 'getdate()',
  [deletion_reason] TEXT,
  [old_data] TEXT,
  [user_id] INT
)
GO

ALTER TABLE [archived_users] ADD FOREIGN KEY ([user_id]) REFERENCES [users] ([id])
GO
