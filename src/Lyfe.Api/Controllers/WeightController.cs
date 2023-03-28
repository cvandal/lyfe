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
public class WeightController : ControllerBase
{
    private readonly LyfeDbContext _db;
    private readonly ILogger _logger;

    public WeightController(LyfeDbContext db, ILogger logger)
    {
        _db = db;
        _logger = logger;
    }

    // GET: api/weight
    [HttpGet]
    public async Task<IActionResult> List()
    {
        return Ok(await _db.Weights
            .OrderByDescending(w => w.Id)
            .Take(14)
            .Reverse()
            .ToListAsync());
    }

    // GET: api/weight/1
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var weight = await _db.Weights.FindAsync(id);

        return weight == null ? NotFound() : Ok(weight);
    }

    // POST: api/weight
    [HttpPost]
    public async Task<IActionResult> Post(Weight weight)
    {
        weight.CurrentDate = weight.CurrentDate.ToLocalTime();

        var existingWeight = await _db.Weights.SingleOrDefaultAsync(w => w.CurrentDate == weight.CurrentDate);
        if (existingWeight != null) return BadRequest();

        _logger.Information("Creating weight: {@weight}", weight);
        await _db.AddAsync(weight);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = weight.Id }, weight);
    }

    // PATCH: api/weight/1
    [HttpPatch("{id}")]
    public async Task<IActionResult> Patch(int id, Weight weight)
    {
        var existingWeight = await _db.Weights.FindAsync(id);
        if (existingWeight == null) return BadRequest();

        _logger.Information("Updating weight: {@weight}", weight);
        existingWeight.CurrentWeight = weight.CurrentWeight;
        existingWeight.GoalWeight = weight.GoalWeight;

        await _db.SaveChangesAsync();

        return Ok(existingWeight);
    }

    // DELETE: api/weight/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var existingWeight = await _db.Weights.FindAsync(id);
        if (existingWeight == null) return BadRequest();

        _logger.Information("Deleting weight: {@weight}", existingWeight);
        _db.Weights.Remove(existingWeight);
        await _db.SaveChangesAsync();

        return Ok();
    }
}
