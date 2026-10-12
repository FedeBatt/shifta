public sealed record CreateUserDto(
    string FirstName,
    string LastName,
    string Email,
    string Password);

public sealed record UpdateUserDto(
    string? FirstName,
    string? LastName,
    string? Email,
    string? Password);

public sealed record UserResponse(
    int Id,
    string FirstName,
    string LastName,
    string Email,
    DateTime CreatedAt,
    DateTime UpdatedAt);

public sealed record UserOverview(
    UserOverviewProfile User,
    UserOverviewStats Stats,
    IReadOnlyList<PetSummary> Pets);

public sealed record UserOverviewProfile(int Id, string FullName, string Email, DateTime MemberSince);

public sealed record UserOverviewStats(int TotalPets, IReadOnlyList<SpeciesCount> BySpecies);
