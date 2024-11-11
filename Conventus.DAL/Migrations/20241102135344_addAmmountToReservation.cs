using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Conventus.DAL.Migrations
{
    /// <inheritdoc />
    public partial class addAmmountToReservation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Ammount",
                table: "Reservations",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Ammount",
                table: "Reservations");
        }
    }
}
