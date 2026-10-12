public class Pet {
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public PetSpecies Species { get; set; }
    public string Breed { get; set; } = "";
    public string Color { get; set; } = "";
    public string Gender { get; set; } = "";
    public string Age { get; set; } = "";
    public string Weight { get; set; } = "";
    public string Height { get; set; } = "";
    public string Notes { get; set; } = "";
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
}