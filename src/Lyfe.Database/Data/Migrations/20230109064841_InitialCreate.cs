using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lyfe.Database.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Weights",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CurrentDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    CurrentWeight = table.Column<double>(type: "REAL", nullable: false),
                    GoalWeight = table.Column<double>(type: "REAL", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Weights", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Weights");
        }
    }
}
