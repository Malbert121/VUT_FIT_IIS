IF DB_ID(N'Conventus') IS NULL
BEGIN
    CREATE DATABASE [Conventus];
END;
GO

USE [Conventus];
GO

IF EXISTS (SELECT * FROM sys.tables WHERE name = '__EFMigrationsHistory')
BEGIN
    DROP TABLE __EFMigrationsHistory;
END

IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    DROP TABLE Users;
END

IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Rooms')
BEGIN
    DROP TABLE Rooms;
END

IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Conferences')
BEGIN
    DROP TABLE Conferences;
END

IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Presentations')
BEGIN
    DROP TABLE Presentations;
END

IF EXISTS (SELECT * FROM sys.tables WHERE name = 'Reservations')
BEGIN
    DROP TABLE Reservations;
END

IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

CREATE TABLE [Rooms] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Capacity] int NOT NULL,
    CONSTRAINT [PK_Rooms] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Users] (
    [Id] int NOT NULL IDENTITY,
    [UserName] nvarchar(50) NOT NULL,
    [Email] nvarchar(100) NOT NULL,
    [PasswordHash] nvarchar(max) NOT NULL,
    [Role] int NOT NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
);
GO

CREATE TABLE [Conferences] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [Description] nvarchar(1000) NOT NULL,
    [Genre] nvarchar(50) NOT NULL,
    [Location] nvarchar(200) NOT NULL,
    [StartDate] datetime2 NOT NULL,
    [EndDate] datetime2 NOT NULL,
    [Price] decimal(18,2) NOT NULL,
    [Capacity] int NOT NULL,
    [OrganizerId] int NOT NULL,
    CONSTRAINT [PK_Conferences] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Conferences_Users_OrganizerId] FOREIGN KEY ([OrganizerId]) REFERENCES [Users] ([Id]) ON DELETE NO ACTION
);
GO

CREATE TABLE [Presentations] (
    [Id] int NOT NULL IDENTITY,
    [Title] nvarchar(100) NOT NULL,
    [Description] nvarchar(500) NOT NULL,
    [Tags] nvarchar(250) NOT NULL,
    [PhotoUrl] nvarchar(500) NOT NULL,
    [StartTime] datetime2 NOT NULL,
    [EndTime] datetime2 NOT NULL,
    [RoomId] int NOT NULL,
    [SpeakerId] int NOT NULL,
    [ConferenceId] int NOT NULL,
    CONSTRAINT [PK_Presentations] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Presentations_Conferences_ConferenceId] FOREIGN KEY ([ConferenceId]) REFERENCES [Conferences] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Presentations_Rooms_RoomId] FOREIGN KEY ([RoomId]) REFERENCES [Rooms] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Presentations_Users_SpeakerId] FOREIGN KEY ([SpeakerId]) REFERENCES [Users] ([Id]) ON DELETE NO ACTION
);
GO

CREATE TABLE [Reservations] (
    [Id] int NOT NULL IDENTITY,
    [UserId] int NOT NULL,
    [ConferenceId] int NOT NULL,
    [IsConfirmed] bit NOT NULL,
    [IsPaid] bit NOT NULL,
    [NumberOfTickets] int NOT NULL DEFAULT 1,
    [ReservationDate] datetime2 NOT NULL,
    CONSTRAINT [PK_Reservations] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Reservations_Conferences_ConferenceId] FOREIGN KEY ([ConferenceId]) REFERENCES [Conferences] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Reservations_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([Id]) ON DELETE NO ACTION
);
GO

CREATE INDEX [IX_Conferences_OrganizerId] ON [Conferences] ([OrganizerId]);
GO

CREATE INDEX [IX_Presentations_ConferenceId] ON [Presentations] ([ConferenceId]);
GO

CREATE INDEX [IX_Presentations_RoomId] ON [Presentations] ([RoomId]);
GO

CREATE INDEX [IX_Presentations_SpeakerId] ON [Presentations] ([SpeakerId]);
GO

CREATE INDEX [IX_Reservations_ConferenceId] ON [Reservations] ([ConferenceId]);
GO

CREATE INDEX [IX_Reservations_UserId] ON [Reservations] ([UserId]);
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241005144026_Initial', N'8.0.8');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241024192200_InitialCreate', N'8.0.8');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Presentations] DROP CONSTRAINT [FK_Presentations_Rooms_RoomId];
GO

ALTER TABLE [Rooms] ADD [ConferenceId] int NOT NULL DEFAULT 0;
GO

ALTER TABLE [Conferences] ADD [PhotoUrl] nvarchar(500) NOT NULL DEFAULT N'';
GO

CREATE INDEX [IX_Rooms_ConferenceId] ON [Rooms] ([ConferenceId]);
GO

ALTER TABLE [Presentations] ADD CONSTRAINT [FK_Presentations_Rooms_RoomId] FOREIGN KEY ([RoomId]) REFERENCES [Rooms] ([Id]) ON DELETE NO ACTION;
GO

ALTER TABLE [Rooms] ADD CONSTRAINT [FK_Rooms_Conferences_ConferenceId] FOREIGN KEY ([ConferenceId]) REFERENCES [Conferences] ([Id]) ON DELETE CASCADE;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241025172635_AddRoomsAndPhotoToConf', N'8.0.8');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Conferences] ADD [Occupancy] int NOT NULL DEFAULT 0;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241028175048_addConferenceOccupancy', N'8.0.8');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

ALTER TABLE [Reservations] ADD [Ammount] float NOT NULL DEFAULT 0.0E0;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241102135344_addAmmountToReservation', N'8.0.8');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

DECLARE @var0 sysname;
SELECT @var0 = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Rooms]') AND [c].[name] = N'Capacity');
IF @var0 IS NOT NULL EXEC(N'ALTER TABLE [Rooms] DROP CONSTRAINT [' + @var0 + '];');
ALTER TABLE [Rooms] DROP COLUMN [Capacity];
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241120091751_deleteRoomCapacity', N'8.0.8');
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20241122175201_fixCascade', N'8.0.8');
GO

COMMIT;
GO

-- TEST DATA --

BEGIN TRANSACTION

SET IDENTITY_INSERT Users ON;
INSERT INTO Users (Id, UserName, Email, PasswordHash, Role)
VALUES 
(1, 'xmalas04', 'xmalas04@vutb.cz', 'eG1hbGFzMDRAcGFzc3dvcmQ=', 0),
(2, 'science2', 'science1@example.com', 'c2NpZW5jZTFAcGFzc3dvcmQ=', 1),
(3, 'education1', 'education1@example.com', 'ZWR1Y2F0aW9uMUBleGFtcGxlLmNvbQ==', 1),
(4, 'education2', 'education2@example.com', 'ZWR1Y2F0aW9uMkBleGFtcGxlLmNvbQ==', 1),
(5, 'myron', 'myron@gmail.com', 'bXlyb25AZ21haWwuY29t', 1);
SET IDENTITY_INSERT Users OFF;


SET IDENTITY_INSERT Conferences ON;
INSERT INTO Conferences (Id, Name, Description, Genre, Location, StartDate, EndDate, Price, Capacity, Occupancy, PhotoUrl, OrganizerId)
VALUES 
(1, 'Tech Innovations 2025', 'A conference focusing on the latest trends and innovations in technology.', 'Technology', 'Silicon Valley, CA', '2025-05-20', '2025-05-22', 100.00, 200, 12, 'path/to/location', 1),
(2, 'Health & Wellness Summit', 'A summit dedicated to health and wellness professionals.', 'Health', 'New York City, NY', '2025-06-15', '2025-06-17', 50.00, 150, 12, 'path/to/location', 3);
SET IDENTITY_INSERT Conferences OFF;

SET IDENTITY_INSERT Rooms ON;
INSERT INTO Rooms (Id, Name, ConferenceId)
VALUES 
(1, 'Room A', 1),
(2, 'Room B', 1),
(3, 'Room C', 2),
(4, 'Room D', 2);
SET IDENTITY_INSERT Rooms OFF;

SET IDENTITY_INSERT Presentations ON;
INSERT INTO Presentations (Id, Title, Description, Tags, PhotoUrl, StartTime, EndTime, RoomId, SpeakerId, ConferenceId)
VALUES 
(1, 'Exploring the Cosmos: New Discoveries in Astronomy', 'Exploring the Cosmos: New Discoveries in Astronomy.', 'Cosmos, Astronomy, Future', 'https://example.com/photo1.jpg', '2025-05-20 10:00:00', '2025-05-20 12:00:00', 1, 1, 1),
(2, 'The Ethics of Genetic Engineering: Opportunities and Challenges', 'The Ethics of Genetic Engineering: Opportunities and Challenges.', 'Science, Biology, Genetic, Future', 'https://example.com/photo1.jpg', '2025-05-20 10:00:00', '2025-05-20 12:00:00', 2, 2, 1),
(3, 'Climate Change and the Role of Science in Mitigating Its Effects', 'Climate Change and the Role of Science in Mitigating Its Effects.', 'Climate, Warm, Water, Science, Future', 'https://example.com/photo1.jpg', '2025-05-21 10:00:00', '2025-05-21 12:00:00', 1, 1, 1),
(4, 'Artificial Intelligence: Transforming Science and Society', 'Artificial Intelligence: Transforming Science and Society.', 'IT, AI, Science, Society', 'https://example.com/photo1.jpg', '2025-05-21 10:00:00', '2025-05-21 12:00:00', 2, 2, 1),
(5, 'Quantum Computing: Unlocking the Next Frontier', 'Quantum Computing: Unlocking the Next Frontier.', 'IT, Quantum', 'https://example.com/photo1.jpg', '2025-05-21 17:00:00', '2025-05-21 19:00:00', 1, 1, 1),
(6, 'The Science of Nutrition: Eating for a Better Tomorrow', 'The Science of Nutrition: Eating for a Better Tomorrow', 'Science, Nutrition, Health, Food', 'https://example.com/photo1.jpg', '2025-06-15 10:00:00', '2025-06-15 12:00:00', 3, 3, 2),
(7, 'Mental Health Matters: Reducing the Stigma and Improving Care', 'Mental Health Matters: Reducing the Stigma and Improving Care.', 'Mental, Health', 'https://example.com/photo1.jpg', '2025-06-15 10:00:00', '2025-06-15 12:00:00', 4, 4, 2),
(8, 'Preventive Healthcare: A Pathway to Longevity', 'Preventive Healthcare: A Pathway to Longevity.', 'Health', 'https://example.com/photo1.jpg', '2025-06-16 10:00:00', '2025-06-16 12:00:00', 3, 3, 2),
(9, 'Fitness in the 21st Century: Balancing Technology and Physical Activity', 'Fitness in the 21st Century: Balancing Technology and Physical Activity.', 'Technology, Health, Activity, Fitness', 'https://example.com/photo1.jpg', '2025-06-16 10:00:00', '2025-06-16 12:00:00', 4, 4, 2),
(10, 'The Future of Medicine: Personalized Healthcare Solutions', 'The Future of Medicine: Personalized Healthcare Solutions.', 'Health, Medicine', 'https://example.com/photo1.jpg', '2025-06-16 17:00:00', '2025-06-16 19:00:00', 4, 3, 2);
SET IDENTITY_INSERT Presentations OFF;

SET IDENTITY_INSERT Reservations ON;
INSERT INTO Reservations (Id, UserId, ConferenceId, IsConfirmed, IsPaid, NumberOfTickets, Ammount, ReservationDate)
VALUES
(1, 1, 2, 0, 0, 1, 50.0, GETDATE()),
(2, 1, 2, 0, 1, 1, 50.0, GETDATE()),
(3, 1, 2, 1, 1, 2, 100.0, GETDATE()),
(4, 2, 2, 0, 0, 1, 50.0, GETDATE()),
(5, 2, 2, 0, 1, 1, 50.0, GETDATE()),
(6, 2, 2, 1, 1, 2, 100.0, GETDATE()),
(7, 3, 1, 0, 0, 1, 100.0, GETDATE()),
(8, 3, 1, 0, 1, 1, 100.0, GETDATE()),
(9, 2, 1, 1, 1, 2, 200.0, GETDATE()),
(10, 4, 1, 0, 0, 1, 100.0, GETDATE()),
(11, 4, 1, 0, 1, 1, 100.0, GETDATE()),
(12, 4, 1, 1, 1, 2, 200.0, GETDATE()),
(13, 5, 1, 0, 0, 1, 100.0, GETDATE()),
(14, 5, 1, 0, 1, 1, 100.0, GETDATE()),
(15, 5, 1, 1, 1, 2, 200.0, GETDATE()),
(16, 5, 2, 0, 0, 1, 50.0, GETDATE()),
(17, 5, 2, 0, 1, 1, 50.0, GETDATE()),
(18, 5, 2, 1, 1, 2, 100.0, GETDATE());
SET IDENTITY_INSERT Reservations OFF;

COMMIT;
