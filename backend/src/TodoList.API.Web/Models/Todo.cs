namespace TodoList.API.Web.Models;

public class Todo
{
    public Guid Id { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; private set; } = null;
    public DateTime? DeletedAt { get; private set; } = null;

    public static Todo Create(string title, string description)
    {
        return new Todo()
        {
            Id = Guid.NewGuid(),
            Title = title,
            Description = description            
        };
    }

    public void Update(string title, string description)
    {
        Title = title;
        Description = description;
    }
    
    private Todo() {}
}