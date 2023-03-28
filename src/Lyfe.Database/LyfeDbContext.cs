using Lyfe.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Lyfe.Database;

public class LyfeDbContext : DbContext
{
    private readonly ILyfeDbContextOptions _options;

    public DbSet<Weight> Weights { get; set; }
    public DbSet<Day> Days { get; set; }
    public DbSet<Exercise> Exercises { get; set; }

    public LyfeDbContext(ILyfeDbContextOptions options)
    {
        _options = options;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        var folder = Environment.SpecialFolder.LocalApplicationData;
        var path1 = Environment.GetFolderPath(folder); // ~/.local/share
        var path2 = _options.DbPath;
        var dbPath = Path.Join(path1, path2);

        options.UseSqlite($"Data Source={dbPath}");
    }
}
