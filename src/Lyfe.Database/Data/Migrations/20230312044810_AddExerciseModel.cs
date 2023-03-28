using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lyfe.Database.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddExerciseModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Exercises",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    DayId = table.Column<int>(type: "INTEGER", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: true),
                    Weight = table.Column<double>(type: "REAL", nullable: false),
                    Reps = table.Column<int>(type: "INTEGER", nullable: false),
                    Sets = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Exercises", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Exercises");
        }
    }
}
