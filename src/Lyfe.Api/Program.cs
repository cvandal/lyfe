using Lyfe.Database;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((_, config) =>
    config.WriteTo.Console());

builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:5001", "http://167.179.146.115:5001", "https://lyfe.cvd.id.au:5001")
            .AllowAnyHeader()
            .AllowAnyMethod()));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = "https://cvd.au.auth0.com/";
        options.Audience = "https://cvd.au.auth0.com/api/v2/";
    });

builder.Services.AddControllers();

builder.Services.AddSingleton<ILyfeDbContextOptions>(new LyfeDbContextOptions()
{
    DbPath = "lyfe.db"
});
builder.Services.AddScoped<LyfeDbContext>();

var app = builder.Build();

app.UseCors();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();

public partial class Program { }
