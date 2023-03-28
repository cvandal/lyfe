namespace Lyfe.Core.Models;

public class Day
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public List<Exercise> Exercises { get; set; }
}
