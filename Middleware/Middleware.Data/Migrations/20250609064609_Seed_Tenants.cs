using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Middleware.Data.Migrations
{
    /// <inheritdoc />
    public partial class Seed_Tenants : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Tenants",
                columns: new[] { "ID", "CreatedAt", "CreatedBy", "InactiveDate", "ModifiedAt", "ModifiedBy", "Name" },
                values: new object[,]
                {
                    { new Guid("7a205d0c-8d84-431f-918f-6ea66d1d4a50"), new DateTime(2025, 6, 9, 0, 0, 0, 0, DateTimeKind.Utc), "Data-Seed", null, new DateTime(2025, 6, 9, 0, 0, 0, 0, DateTimeKind.Utc), "Data-Seed", "XYZ" },
                    { new Guid("7d444840-9dc0-408c-8994-acc51b013188"), new DateTime(2025, 6, 9, 0, 0, 0, 0, DateTimeKind.Utc), "Data-Seed", null, new DateTime(2025, 6, 9, 0, 0, 0, 0, DateTimeKind.Utc), "Data-Seed", "ABC" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Tenants",
                keyColumn: "ID",
                keyValue: new Guid("7a205d0c-8d84-431f-918f-6ea66d1d4a50"));

            migrationBuilder.DeleteData(
                table: "Tenants",
                keyColumn: "ID",
                keyValue: new Guid("7d444840-9dc0-408c-8994-acc51b013188"));
        }
    }
}
