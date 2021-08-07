using System.Collections.Generic;
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
    public class UsersController : ControllerBase
    {
        private readonly ILogger<UsersController> _logger;
        private readonly IHoneycombEventManager _honeycombEventManager;
        private readonly DbContext _context;

        public UsersController(ILogger<UsersController> logger, IHoneycombEventManager honeycombEventManager, DbContext context)
        {
            _logger = logger;
            _honeycombEventManager = honeycombEventManager;
            _context = context;
        }

        // GET: api/users/00u1bmtbu1bjDnWOy5d7
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(string id)
        {
            var user = await _context.Users
                .Include(u => u.Weights)
                .Include(u => u.Exercises)
                .SingleOrDefaultAsync(u => u.Id == id);
            if (user == null) return await CreateUser(id);

            _honeycombEventManager.AddData("get_user", user);

            return Ok(user);
        }

        // POST: api/users
        [HttpPost]
        public async Task<ActionResult<User>> CreateUser(string id)
        {
            if (await UserExists(id))
            {
                _logger.LogWarning("A user with the ID {ID} already exists.", id);
                return BadRequest();
            }

            var user = new User
            {
                Id = id,
                Weights = new List<Weight>(),
                Exercises = new List<Exercise>()
            };

            _logger.LogInformation("Creating user...", user);
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            _honeycombEventManager.AddData("create_user", user);

            return CreatedAtAction(nameof(GetUser), new {id}, user);
        }

        private async Task<bool> UserExists(string id)
        {
            return await _context.Users.AnyAsync(u => u.Id == id);
        }
    }
}
