public sealed record OwnerSummary(int Id, string FirstName, string LastName);

public sealed record PetResponse(
    int Id,
    string Name,
    PetSpecies Species,
    string Breed,
    string Color,
    string Gender,
    string Age,
    string Weight,
    string Height,
    string Notes,
    int UserId,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    OwnerSummary Owner);

public sealed record PetSummary(int Id, string Name, PetSpecies Species, DateTime CreatedAt);

public sealed record SpeciesCount(PetSpecies Species, int Count);

public sealed record PetUpdate(
    string? Name,
    PetSpecies? Species,
    string? Breed,
    string? Color,
    string? Gender,
    string? Age,
    string? Weight,
    string? Height,
    string? Notes,
    int? UserId);

public sealed record CreatePetDto(
    string Name,
    PetSpecies Species,
    string Breed,
    string Color,
    string Gender,
    string Age,
    string Weight,
    string Height,
    string Notes,
    int UserId);