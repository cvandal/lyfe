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
public class DayController : ControllerBase
{
    private readonly LyfeDbContext _db;
    private readonly ILogger _logger;

    public DayController(LyfeDbContext db, ILogger logger)
    {
        _db = db;
        _logger = logger;
    }

    // GET: api/day
    [HttpGet]
    public async Task<IActionResult> List()
    {
        var days = await _db.Days.Include(d => d.Exercises).ToListAsync();

        return Ok(days);
    }

    // GET: api/day/1
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var day = await _db.Days.FindAsync(id);
        if (day == null) return NotFound();

        var exercises = await _db.Exercises.Where(e => e.DayId == day.Id).ToListAsync();
        day.Exercises = exercises;

        return Ok(day);
    }

    // POST: api/day
    [HttpPost]
    public async Task<IActionResult> Post(Day day)
    {
        var existingDay = await _db.Days.Where(d => d.Name == day.Name).SingleOrDefaultAsync();
        if (existingDay != null) return BadRequest();

        _logger.Information("Creating day: {@day}", day);
        await _db.AddAsync(day);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = day.Id }, day);
    }

    // DELETE: api/day/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var existingDay = await _db.Days.FindAsync(id);
        if (existingDay == null) return BadRequest();

        _logger.Information("Deleting day: {@existingDay}", existingDay);
        _db.Days.Remove(existingDay);
        await _db.SaveChangesAsync();

        return Ok();
    }
}
