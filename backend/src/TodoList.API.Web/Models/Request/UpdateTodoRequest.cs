namespace TodoList.API.Web.Models.Request;

public record UpdateTodoRequest(string Title, string Description, DateTime DueDate);