using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Lyfe.Models
{
    public class User
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public string Id { get; set; }

        public string GivenName { get; set; }
        public string FamilyName { get; set; }

        public ICollection<Exercise> Exercises { get; set; }
        public ICollection<Weight> Weights { get; set; }
    }
}
