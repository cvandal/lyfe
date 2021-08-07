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
    public class WeightsController : ControllerBase
    {
        private readonly ILogger<WeightsController> _logger;
        private readonly IHoneycombEventManager _honeycombEventManager;
        private readonly DbContext _context;

        public WeightsController(ILogger<WeightsController> logger, IHoneycombEventManager honeycombEventManager, DbContext context)
        {
            _logger = logger;
            _honeycombEventManager = honeycombEventManager;
            _context = context;
        }

        // GET: api/weights/1
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Weight>> GetWeight(int id)
        {
            var weight = await _context.Weights.FindAsync(id);
            if (weight == null) return NotFound();

            _honeycombEventManager.AddData("get_weight", weight);

            return Ok(weight);
        }

        // POST: api/weights
        [HttpPost]
        public async Task<ActionResult<Weight>> CreateWeight(Weight weight)
        {
            if (await WeightExists(weight))
            {
                _logger.LogWarning("A weight with the date {DateTime} already exists.", weight.DateTime);
                return BadRequest();
            }

            _logger.LogInformation("Creating weight...", weight);
            await _context.Weights.AddAsync(weight);
            await _context.SaveChangesAsync();

            _honeycombEventManager.AddData("create_weight", weight);

            return CreatedAtAction(nameof(GetWeight), new {id = weight.Id}, weight);
        }

        // PUT: api/weights/1
        [HttpPut("{id:int}")]
        public async Task<ActionResult<Weight>> UpdateWeight(int id, Weight weight)
        {
            if (id != weight.Id)
            {
                _logger.LogWarning("The weight ID in the URL does not match the weight ID in the request.");
                return BadRequest();
            }

            _logger.LogInformation("Updating weight...", weight);
            _context.Entry(weight).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            _honeycombEventManager.AddData("update_weight", weight);

            return Ok(weight);
        }

        private async Task<bool> WeightExists(Weight weight)
        {
            return await _context.Weights.AnyAsync(w =>
                w.UserId == weight.UserId &&
                w.DateTime.Date == weight.DateTime.Date);
        }
    }
}
