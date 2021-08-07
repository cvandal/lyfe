using System.Threading.Tasks;
using Honeycomb.AspNetCore;
using Lyfe.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using DbContext = Lyfe.Data.DbContext;

namespace Lyfe.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ExercisesController : ControllerBase
    {
        private readonly ILogger<ExercisesController> _logger;
        private readonly IHoneycombEventManager _honeycombEventManager;
        private readonly DbContext _context;

        public ExercisesController(ILogger<ExercisesController> logger, IHoneycombEventManager honeycombEventManager, DbContext context)
        {
            _logger = logger;
            _honeycombEventManager = honeycombEventManager;
            _context = context;
        }

        // GET: api/exercises/1
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Exercise>> GetExercise(int id)
        {
            var exercise = await _context.Exercises.FindAsync(id);
            if (exercise == null) return NotFound();

            _honeycombEventManager.AddData("get_exercise", exercise);

            return Ok(exercise);
        }

        // POST: api/exercises
        [HttpPost]
        public async Task<ActionResult<Exercise>> CreateExercise(Exercise exercise)
        {
            if (await ExerciseExists(exercise))
            {
                _logger.LogWarning("An exercise with the name {ExerciseName} on {DayOfWeek} already exists.", exercise.Name, exercise.DayOfWeek.ToString());
                return BadRequest();
            }

            _logger.LogInformation("Creating exercise...", exercise);
            await _context.Exercises.AddAsync(exercise);
            await _context.SaveChangesAsync();

            _honeycombEventManager.AddData("create_exercise", exercise);

            return CreatedAtAction(nameof(GetExercise), new {id = exercise.Id}, exercise);
        }

        // PUT: api/exercises/1
        [HttpPut("{id:int}")]
        public async Task<ActionResult<Exercise>> UpdateExercise(int id, Exercise exercise)
        {
            if (id != exercise.Id)
            {
                _logger.LogWarning("The exercise ID in the URL does not match the exercise ID in the request.");
                return BadRequest();
            }

            _logger.LogInformation("Updating exercise...", exercise);
            _context.Entry(exercise).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            _honeycombEventManager.AddData("update_exercise", exercise);

            return Ok(exercise);
        }

        // DELETE: api/exercises/1
        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteExercise(int id)
        {
            var exercise = await _context.Exercises.FindAsync(id);
            if (exercise == null) return NotFound();

            _logger.LogInformation("Deleting exercise...", exercise);
            _context.Exercises.Remove(exercise);
            await _context.SaveChangesAsync();

            _honeycombEventManager.AddData("delete_exercise", exercise);

            return NoContent();
        }

        private async Task<bool> ExerciseExists(Exercise exercise)
        {
            return await _context.Exercises.AnyAsync(e =>
                e.UserId == exercise.UserId &&
                e.Name == exercise.Name &&
                e.DayOfWeek == exercise.DayOfWeek);
        }
    }
}
