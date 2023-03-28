using Lyfe.Core.Models;
using Lyfe.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace Lyfe.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ExerciseController : ControllerBase
{
    private readonly LyfeDbContext _db;
    private readonly ILogger _logger;

    public ExerciseController(LyfeDbContext db, ILogger logger)
    {
        _db = db;
        _logger = logger;
    }

    // GET: api/exercise
    [HttpGet]
    public async Task<IActionResult> List()
    {
        return Ok(await _db.Exercises.ToListAsync());
    }

    // GET: api/exercise/1
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var exercise = await _db.Exercises.FindAsync(id);

        return exercise == null ? NotFound() : Ok(exercise);
    }

    // POST: api/exercise
    [HttpPost]
    public async Task<IActionResult> Post(Exercise exercise)
    {
        var existingExercise = await _db.Exercises.SingleOrDefaultAsync(e => e.Name == exercise.Name);
        if (existingExercise != null) return BadRequest();

        _logger.Information("Creating exercise: {@exercise}", exercise);
        await _db.AddAsync(exercise);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = exercise.Id }, exercise);
    }

    // PATCH: api/exercise/1
    [HttpPatch("{id}")]
    public async Task<IActionResult> Patch(int id, Exercise exercise)
    {
        var existingExercise = await _db.Exercises.FindAsync(id);
        if (existingExercise == null) return BadRequest();

        _logger.Information("Updating exercise: {@exercise}", exercise);
        existingExercise.Name = exercise.Name;
        existingExercise.Weight = exercise.Weight;
        existingExercise.Reps = exercise.Reps;
        existingExercise.Sets = exercise.Sets;

        await _db.SaveChangesAsync();

        return Ok(existingExercise);
    }

    // DELETE: api/exercise/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var existingExercise = await _db.Exercises.FindAsync(id);
        if (existingExercise == null) return BadRequest();

        _logger.Information("Deleting exercise: {@existingExercise}", existingExercise);
        _db.Exercises.Remove(existingExercise);
        await _db.SaveChangesAsync();

        return Ok();
    }
}
