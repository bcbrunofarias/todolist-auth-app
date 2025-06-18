namespace TodoList.API.Web.Models.Request;

public record CreateTodoRequest(string Title, string Description, DateTime DueDate);