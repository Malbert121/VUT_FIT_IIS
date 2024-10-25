using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Conventus.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddRoomsAndPhotoToConf : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Presentations_Rooms_RoomId",
                table: "Presentations");

            migrationBuilder.AddColumn<int>(
                name: "ConferenceId",
                table: "Rooms",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "PhotoUrl",
                table: "Conferences",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Rooms_ConferenceId",
                table: "Rooms",
                column: "ConferenceId");

            migrationBuilder.AddForeignKey(
                name: "FK_Presentations_Rooms_RoomId",
                table: "Presentations",
                column: "RoomId",
                principalTable: "Rooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Rooms_Conferences_ConferenceId",
                table: "Rooms",
                column: "ConferenceId",
                principalTable: "Conferences",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Presentations_Rooms_RoomId",
                table: "Presentations");

            migrationBuilder.DropForeignKey(
                name: "FK_Rooms_Conferences_ConferenceId",
                table: "Rooms");

            migrationBuilder.DropIndex(
                name: "IX_Rooms_ConferenceId",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "ConferenceId",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "PhotoUrl",
                table: "Conferences");

            migrationBuilder.AddForeignKey(
                name: "FK_Presentations_Rooms_RoomId",
                table: "Presentations",
                column: "RoomId",
                principalTable: "Rooms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
