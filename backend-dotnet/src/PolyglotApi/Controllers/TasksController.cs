using Microsoft.AspNetCore.Mvc;
using PolyglotApi.Models;
using StackExchange.Redis;
using System.Text.Json;

namespace PolyglotApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private static readonly List<TaskItem> _tasks = new();
    private static int _nextId = 1;
    private readonly IConnectionMultiplexer? _redis;

    public TasksController(IConnectionMultiplexer? redis = null)
    {
        _redis = redis;
    }

    [HttpGet]
    public IActionResult GetAll() => Ok(_tasks);

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] TaskItem task)
    {
        task.Id = _nextId++;
        task.CreatedAt = DateTime.UtcNow;
        task.Status = "pending";
        _tasks.Add(task);

        // Push to Redis queue for the Python worker
        if (_redis != null)
        {
            var db = _redis.GetDatabase();
            await db.ListRightPushAsync("task_queue", JsonSerializer.Serialize(task));
        }

        return CreatedAtAction(nameof(GetAll), new { id = task.Id }, task);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var task = _tasks.FirstOrDefault(t => t.Id == id);
        return task is null ? NotFound() : Ok(task);
    }
}
