using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lyfe.Database.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddDayDescription : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Days",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Days");
        }
    }
}
