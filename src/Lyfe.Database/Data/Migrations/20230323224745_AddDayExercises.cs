using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lyfe.Database.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddDayExercises : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Exercises_DayId",
                table: "Exercises",
                column: "DayId");

            migrationBuilder.AddForeignKey(
                name: "FK_Exercises_Days_DayId",
                table: "Exercises",
                column: "DayId",
                principalTable: "Days",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Exercises_Days_DayId",
                table: "Exercises");

            migrationBuilder.DropIndex(
                name: "IX_Exercises_DayId",
                table: "Exercises");
        }
    }
}
