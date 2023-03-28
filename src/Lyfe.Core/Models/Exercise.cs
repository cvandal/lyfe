namespace Lyfe.Core.Models;

public class Exercise
{
    public int Id { get; set; }
    public int DayId { get; set; }
    public string Name { get; set; }
    public double Weight { get; set; }
    public int Reps { get; set; }
    public int Sets { get; set; }
}
