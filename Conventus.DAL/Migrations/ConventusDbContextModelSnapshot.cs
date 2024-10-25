﻿// <auto-generated />
using System;
using Conventus.DAL.EfStructures;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Conventus.DAL.Migrations
{
    [DbContext(typeof(ConventusDbContext))]
    partial class ConventusDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.8")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Conventus.Models.Entities.Conference", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("Capacity")
                        .HasColumnType("int");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(1000)
                        .HasColumnType("nvarchar(1000)");

                    b.Property<DateTime>("EndDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Genre")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("Location")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("nvarchar(200)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<int>("OrganizerId")
                        .HasColumnType("int");

                    b.Property<string>("PhotoUrl")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");

                    b.Property<decimal>("Price")
                        .HasColumnType("decimal(18,2)");

                    b.Property<DateTime>("StartDate")
                        .HasColumnType("datetime2");

                    b.HasKey("Id");

                    b.HasIndex("OrganizerId");

                    b.ToTable("Conferences", (string)null);
                });

            modelBuilder.Entity("Conventus.Models.Entities.Presentation", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("ConferenceId")
                        .HasColumnType("int");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");

                    b.Property<DateTime>("EndTime")
                        .HasColumnType("datetime2");

                    b.Property<string>("PhotoUrl")
                        .IsRequired()
                        .HasMaxLength(500)
                        .HasColumnType("nvarchar(500)");

                    b.Property<int>("RoomId")
                        .HasColumnType("int");

                    b.Property<int>("SpeakerId")
                        .HasColumnType("int");

                    b.Property<DateTime>("StartTime")
                        .HasColumnType("datetime2");

                    b.Property<string>("Tags")
                        .IsRequired()
                        .HasMaxLength(250)
                        .HasColumnType("nvarchar(250)");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.HasKey("Id");

                    b.HasIndex("ConferenceId");

                    b.HasIndex("RoomId");

                    b.HasIndex("SpeakerId");

                    b.ToTable("Presentations");
                });

            modelBuilder.Entity("Conventus.Models.Entities.Reservation", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("ConferenceId")
                        .HasColumnType("int");

                    b.Property<bool>("IsConfirmed")
                        .HasColumnType("bit");

                    b.Property<bool>("IsPaid")
                        .HasColumnType("bit");

                    b.Property<int>("NumberOfTickets")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int")
                        .HasDefaultValue(1);

                    b.Property<DateTime>("ReservationDate")
                        .HasColumnType("datetime2");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("ConferenceId");

                    b.HasIndex("UserId");

                    b.ToTable("Reservations");
                });

            modelBuilder.Entity("Conventus.Models.Entities.Room", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("Capacity")
                        .HasColumnType("int");

                    b.Property<int>("ConferenceId")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.HasKey("Id");

                    b.HasIndex("ConferenceId");

                    b.ToTable("Rooms");
                });

            modelBuilder.Entity("Conventus.Models.Entities.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Role")
                        .HasColumnType("int");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.HasKey("Id");

                    b.ToTable("Users", (string)null);
                });

            modelBuilder.Entity("Conventus.Models.Entities.Conference", b =>
                {
                    b.HasOne("Conventus.Models.Entities.User", "Organizer")
                        .WithMany("OrganizedConferences")
                        .HasForeignKey("OrganizerId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Organizer");
                });

            modelBuilder.Entity("Conventus.Models.Entities.Presentation", b =>
                {
                    b.HasOne("Conventus.Models.Entities.Conference", "Conference")
                        .WithMany("Presentations")
                        .HasForeignKey("ConferenceId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Conventus.Models.Entities.Room", "Room")
                        .WithMany("Presentations")
                        .HasForeignKey("RoomId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("Conventus.Models.Entities.User", "Speaker")
                        .WithMany("Presentations")
                        .HasForeignKey("SpeakerId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Conference");

                    b.Navigation("Room");

                    b.Navigation("Speaker");
                });

            modelBuilder.Entity("Conventus.Models.Entities.Reservation", b =>
                {
                    b.HasOne("Conventus.Models.Entities.Conference", "Conference")
                        .WithMany("Reservations")
                        .HasForeignKey("ConferenceId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Conventus.Models.Entities.User", "User")
                        .WithMany("Reservations")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Conference");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Conventus.Models.Entities.Room", b =>
                {
                    b.HasOne("Conventus.Models.Entities.Conference", "Conference")
                        .WithMany("Rooms")
                        .HasForeignKey("ConferenceId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Conference");
                });

            modelBuilder.Entity("Conventus.Models.Entities.Conference", b =>
                {
                    b.Navigation("Presentations");

                    b.Navigation("Reservations");

                    b.Navigation("Rooms");
                });

            modelBuilder.Entity("Conventus.Models.Entities.Room", b =>
                {
                    b.Navigation("Presentations");
                });

            modelBuilder.Entity("Conventus.Models.Entities.User", b =>
                {
                    b.Navigation("OrganizedConferences");

                    b.Navigation("Presentations");

                    b.Navigation("Reservations");
                });
#pragma warning restore 612, 618
        }
    }
}
