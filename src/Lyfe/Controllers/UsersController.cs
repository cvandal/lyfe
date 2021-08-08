using System.Threading.Tasks;
using Honeycomb.AspNetCore;
using Lyfe.Data;
using Lyfe.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Lyfe.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly ILogger<UsersController> _logger;
        private readonly IHoneycombEventManager _honeycombEventManager;
        private readonly LyfeDbContext _context;

        public UsersController(ILogger<UsersController> logger, IHoneycombEventManager honeycombEventManager, LyfeDbContext context)
        {
            _logger = logger;
            _honeycombEventManager = honeycombEventManager;
            _context = context;
        }

        // GET: api/users/abc123
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(string id)
        {
            var user = await _context.Users
                .Include(u => u.Weights)
                .Include(u => u.Exercises)
                .SingleOrDefaultAsync(u => u.Id == id);
            if (user == null) return NotFound();

            _honeycombEventManager.AddData("get_user", user);

            return Ok(user);
        }

        // POST: api/users
        [HttpPost]
        public async Task<ActionResult<User>> CreateUser(User user)
        {
            if (await UserExists(user.Id))
            {
                _logger.LogWarning("A user with the ID {ID} already exists.", user.Id);
                return BadRequest();
            }

            _logger.LogInformation("Creating user...", user);
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            _honeycombEventManager.AddData("create_user", user);

            return CreatedAtAction(nameof(GetUser), new {user.Id}, user);
        }

        private async Task<bool> UserExists(string id)
        {
            return await _context.Users.AnyAsync(u => u.Id == id);
        }
    }
}
