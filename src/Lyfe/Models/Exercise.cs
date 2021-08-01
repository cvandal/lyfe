using System;
using System.ComponentModel.DataAnnotations;

namespace Lyfe.Models
{
    public class Exercise
    {
        [Key]
        public int Id { get; set; }

        public string UserId { get; set; }
        public string Name { get; set; }
        public double Weight { get; set; }
        public int Reps { get; set; }
        public int Sets { get; set; }
        public DayOfWeek DayOfWeek { get; set; }
    }
}
