using Lyfe.Models;
using Microsoft.EntityFrameworkCore;

namespace Lyfe.Data
{
    public class LyfeDbContext : DbContext
    {
        public LyfeDbContext(DbContextOptions<LyfeDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Weight> Weights { get; set; }
        public DbSet<Exercise> Exercises { get; set; }
    }
}
