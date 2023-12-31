USE [master]
GO
/****** Object:  Database [Gateway_Manager]    Script Date: 06/29/2023 14:29:49 ******/
CREATE DATABASE [Gateway_Manager] ON  PRIMARY 
( NAME = N'GatewayManager', FILENAME = N'C:\Users\ochoa\Desktop\GatewayManager.mdf' , SIZE = 3072KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'GatewayManager_log', FILENAME = N'C:\Users\ochoa\Desktop\GatewayManager_log.ldf' , SIZE = 1024KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [Gateway_Manager] SET COMPATIBILITY_LEVEL = 100
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [Gateway_Manager].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [Gateway_Manager] SET ANSI_NULL_DEFAULT OFF
GO
ALTER DATABASE [Gateway_Manager] SET ANSI_NULLS OFF
GO
ALTER DATABASE [Gateway_Manager] SET ANSI_PADDING OFF
GO
ALTER DATABASE [Gateway_Manager] SET ANSI_WARNINGS OFF
GO
ALTER DATABASE [Gateway_Manager] SET ARITHABORT OFF
GO
ALTER DATABASE [Gateway_Manager] SET AUTO_CLOSE OFF
GO
ALTER DATABASE [Gateway_Manager] SET AUTO_CREATE_STATISTICS ON
GO
ALTER DATABASE [Gateway_Manager] SET AUTO_SHRINK OFF
GO
ALTER DATABASE [Gateway_Manager] SET AUTO_UPDATE_STATISTICS ON
GO
ALTER DATABASE [Gateway_Manager] SET CURSOR_CLOSE_ON_COMMIT OFF
GO
ALTER DATABASE [Gateway_Manager] SET CURSOR_DEFAULT  GLOBAL
GO
ALTER DATABASE [Gateway_Manager] SET CONCAT_NULL_YIELDS_NULL OFF
GO
ALTER DATABASE [Gateway_Manager] SET NUMERIC_ROUNDABORT OFF
GO
ALTER DATABASE [Gateway_Manager] SET QUOTED_IDENTIFIER OFF
GO
ALTER DATABASE [Gateway_Manager] SET RECURSIVE_TRIGGERS OFF
GO
ALTER DATABASE [Gateway_Manager] SET  DISABLE_BROKER
GO
ALTER DATABASE [Gateway_Manager] SET AUTO_UPDATE_STATISTICS_ASYNC OFF
GO
ALTER DATABASE [Gateway_Manager] SET DATE_CORRELATION_OPTIMIZATION OFF
GO
ALTER DATABASE [Gateway_Manager] SET TRUSTWORTHY OFF
GO
ALTER DATABASE [Gateway_Manager] SET ALLOW_SNAPSHOT_ISOLATION OFF
GO
ALTER DATABASE [Gateway_Manager] SET PARAMETERIZATION SIMPLE
GO
ALTER DATABASE [Gateway_Manager] SET READ_COMMITTED_SNAPSHOT OFF
GO
ALTER DATABASE [Gateway_Manager] SET HONOR_BROKER_PRIORITY OFF
GO
ALTER DATABASE [Gateway_Manager] SET  READ_WRITE
GO
ALTER DATABASE [Gateway_Manager] SET RECOVERY FULL
GO
ALTER DATABASE [Gateway_Manager] SET  MULTI_USER
GO
ALTER DATABASE [Gateway_Manager] SET PAGE_VERIFY CHECKSUM
GO
ALTER DATABASE [Gateway_Manager] SET DB_CHAINING OFF
GO
EXEC sys.sp_db_vardecimal_storage_format N'Gateway_Manager', N'ON'
GO
USE [Gateway_Manager]
GO
/****** Object:  Table [dbo].[Peripheral]    Script Date: 06/29/2023 14:29:51 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Peripheral](
	[idP] [int] IDENTITY(1,1) NOT NULL,
	[vendor] [varchar](100) NULL,
	[dateCreated] [datetime] NULL,
	[status] [bit] NULL,
	[idGat] [int] NULL,
 CONSTRAINT [PK_Peripheral] PRIMARY KEY CLUSTERED 
(
	[idP] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
SET IDENTITY_INSERT [dbo].[Peripheral] ON
INSERT [dbo].[Peripheral] ([idP], [vendor], [dateCreated], [status], [idGat]) VALUES (3, N'IBM', CAST(0x0000B02A00000000 AS DateTime), 0, 53)
INSERT [dbo].[Peripheral] ([idP], [vendor], [dateCreated], [status], [idGat]) VALUES (10, N'Apple', CAST(0x0000B02D00C04552 AS DateTime), 1, 46)
INSERT [dbo].[Peripheral] ([idP], [vendor], [dateCreated], [status], [idGat]) VALUES (13, N'Apple', CAST(0x0000B02D00C1BA29 AS DateTime), 0, 46)
INSERT [dbo].[Peripheral] ([idP], [vendor], [dateCreated], [status], [idGat]) VALUES (16, N'Apple', CAST(0x0000B02D00D87F1C AS DateTime), 1, 53)
SET IDENTITY_INSERT [dbo].[Peripheral] OFF
/****** Object:  Table [dbo].[Gateway]    Script Date: 06/29/2023 14:29:51 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
SET ANSI_PADDING ON
GO
CREATE TABLE [dbo].[Gateway](
	[idGat] [int] IDENTITY(1,1) NOT NULL,
	[serialNumber] [varchar](50) NULL,
	[humanName] [varchar](100) NULL,
	[ipAddress] [varchar](15) NULL,
 CONSTRAINT [PK_Gateway] PRIMARY KEY CLUSTERED 
(
	[idGat] ASC
)WITH (PAD_INDEX  = OFF, STATISTICS_NORECOMPUTE  = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS  = ON, ALLOW_PAGE_LOCKS  = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING OFF
GO
SET IDENTITY_INSERT [dbo].[Gateway] ON
INSERT [dbo].[Gateway] ([idGat], [serialNumber], [humanName], [ipAddress]) VALUES (46, N'ABCD1111', N'gateway1.cu', N'10.10.10.11')
INSERT [dbo].[Gateway] ([idGat], [serialNumber], [humanName], [ipAddress]) VALUES (53, N'ABCD1112', N'gateway2.cu', N'10.10.10.12')
SET IDENTITY_INSERT [dbo].[Gateway] OFF
