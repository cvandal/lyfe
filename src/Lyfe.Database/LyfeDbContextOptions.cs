namespace Lyfe.Database;

public interface ILyfeDbContextOptions
{
    string DbPath { get; set; }
}

public class LyfeDbContextOptions : ILyfeDbContextOptions
{
    public string DbPath { get; set; }
}
