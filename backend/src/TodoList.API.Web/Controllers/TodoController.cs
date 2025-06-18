using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoList.API.Web.Data.EF;
using TodoList.API.Web.Models;
using TodoList.API.Web.Models.Request;
using TodoList.API.Web.Models.Response;

namespace TodoList.API.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TodoController(AppDbContext context) : ControllerBase
{
    private readonly DbSet<Todo> _context = context.Todos;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var todos = await _context.ToListAsync();
        var response = todos.Select(todo => new TodoResponse(todo.Id, todo.Title, todo.Description));
        
        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetBy(Guid id)
    {
        var selectedTodo = await _context.FirstOrDefaultAsync(t => t.Id == id);
        if (selectedTodo == null)
        {
            return NotFound();
        }
        
        var response = new TodoResponse(selectedTodo.Id, selectedTodo.Title, selectedTodo.Description);
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTodoRequest request)
    {
        var todo = Todo.Create(request.Title, request.Description);
        
        await _context.AddAsync(todo);
        await context.SaveChangesAsync();
        
        return Created();
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateTodoRequest request)
    {
        var selectedTodo = await _context.FirstOrDefaultAsync(t => t.Id == id);
        if (selectedTodo == null)
        {
            return NotFound();
        }
        
        selectedTodo.Update(request.Title, request.Description); 
        
        _context.Update(selectedTodo);
        await context.SaveChangesAsync();
        
        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var selectedTodo = await _context.FirstOrDefaultAsync(t => t.Id == id);
        if (selectedTodo == null)
        {
            return NotFound();
        }
        
        _context.Remove(selectedTodo);
        await context.SaveChangesAsync();
        
        return NoContent();
    }
    
    [Authorize(Policy = "Master")]
    [HttpDelete]
    public async Task<IActionResult> DeleteAsync()
    {
        var todos = await _context.ToListAsync();
        if (todos.Count == 0)
        {
            return NotFound();
        }
        
        context.Todos.RemoveRange(todos);
        await context.SaveChangesAsync();
        
        return NoContent();
    }
}