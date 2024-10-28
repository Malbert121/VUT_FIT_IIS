using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Conventus.DAL.Migrations
{
    /// <inheritdoc />
    public partial class addConferenceOccupancy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Occupancy",
                table: "Conferences",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Occupancy",
                table: "Conferences");
        }
    }
}
