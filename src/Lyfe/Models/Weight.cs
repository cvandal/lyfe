using System;
using System.ComponentModel.DataAnnotations;

namespace Lyfe.Models
{
    public class Weight
    {
        [Key]
        public int Id { get; set; }

        public string UserId { get; set; }
        public double GoalWeight { get; set; }
        public double CurrentWeight { get; set; }
        public DateTime DateTime { get; set; }
    }
}
