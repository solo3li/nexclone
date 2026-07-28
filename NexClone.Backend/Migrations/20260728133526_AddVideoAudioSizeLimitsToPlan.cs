using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NexClone.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddVideoAudioSizeLimitsToPlan : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AvatarVideoMaxAudioFileSizeMb",
                table: "Plans",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "LipSyncMaxAudioFileSizeMb",
                table: "Plans",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "LipSyncMaxVideoFileSizeMb",
                table: "Plans",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AvatarVideoMaxAudioFileSizeMb",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "LipSyncMaxAudioFileSizeMb",
                table: "Plans");

            migrationBuilder.DropColumn(
                name: "LipSyncMaxVideoFileSizeMb",
                table: "Plans");
        }
    }
}
