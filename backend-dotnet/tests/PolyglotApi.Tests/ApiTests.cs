using PolyglotApi.Controllers;
using PolyglotApi.Models;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace PolyglotApi.Tests;

public class StatusControllerTests
{
    [Fact]
    public void Get_ReturnsOkWithStatus()
    {
        var controller = new StatusController();
        var result = controller.Get() as OkObjectResult;

        Assert.NotNull(result);
        Assert.Equal(200, result.StatusCode);
    }
}

public class TasksControllerTests
{
    [Fact]
    public void GetAll_ReturnsOkResult()
    {
        var controller = new TasksController();
        var result = controller.GetAll() as OkObjectResult;

        Assert.NotNull(result);
        Assert.Equal(200, result.StatusCode);
    }

    [Fact]
    public async Task Create_ReturnsCreatedResult()
    {
        var controller = new TasksController();
        var task = new TaskItem { Title = "Test Task" };

        var result = await controller.Create(task) as CreatedAtActionResult;

        Assert.NotNull(result);
        Assert.Equal(201, result.StatusCode);
    }
}
