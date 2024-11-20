using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Conventus.DAL.Migrations
{
    /// <inheritdoc />
    public partial class addConfirmStatusToPresentation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsConfirmed",
                table: "Presentations",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsConfirmed",
                table: "Presentations");
        }
    }
}
