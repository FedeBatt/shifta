using Microsoft.EntityFrameworkCore;

public class PetRepository(AppDbContext db) : IPetRepository
{
    public async Task<IReadOnlyList<PetResponse>> FindManyAsync()
    {
        return await db.Pets
            .OrderByDescending(pet => pet.CreatedAt)
            .Select(MapResponse())
            .ToListAsync();
    }

    public Task<PetResponse?> FindByIdAsync(int id)
    {
        return db.Pets
            .Where(pet => pet.Id == id)
            .Select(MapResponse())
            .FirstOrDefaultAsync();
    }

    public async Task<IReadOnlyList<PetSummary>> FindByUserIdAsync(int userId)
    {
        return await db.Pets
            .Where(pet => pet.UserId == userId)
            .OrderByDescending(pet => pet.CreatedAt)
            .Select(pet => new PetSummary(pet.Id, pet.Name, pet.Species, pet.CreatedAt))
            .ToListAsync();
    }

    public Task<int> CountByUserIdAsync(int userId)
    {
        return db.Pets.CountAsync(pet => pet.UserId == userId);
    }

    public async Task<IReadOnlyList<SpeciesCount>> GroupBySpeciesAsync(int userId)
    {
        return await db.Pets
            .Where(pet => pet.UserId == userId)
            .GroupBy(pet => pet.Species)
            .Select(group => new SpeciesCount(group.Key, group.Count()))
            .ToListAsync();
    }

    public async Task<PetResponse> CreateAsync(Pet pet)
    {
        var now = DateTime.UtcNow;
        pet.CreatedAt = now;
        pet.UpdatedAt = now;

        db.Pets.Add(pet);
        await db.SaveChangesAsync();

        return await FindByIdAsync(pet.Id)
            ?? throw new InvalidOperationException("La mascota no quedó guardada.");
    }

    public async Task<PetResponse?> UpdateAsync(int id, PetUpdate data)
    {
        var pet = await db.Pets.FirstOrDefaultAsync(item => item.Id == id);
        if (pet is null)
        {
            return null;
        }

        if (data.Name is not null) pet.Name = data.Name;
        if (data.Species is not null) pet.Species = data.Species.Value;
        if (data.Breed is not null) pet.Breed = data.Breed;
        if (data.Color is not null) pet.Color = data.Color;
        if (data.Gender is not null) pet.Gender = data.Gender;
        if (data.Age is not null) pet.Age = data.Age;
        if (data.Weight is not null) pet.Weight = data.Weight;
        if (data.Height is not null) pet.Height = data.Height;
        if (data.Notes is not null) pet.Notes = data.Notes;
        if (data.UserId is not null) pet.UserId = data.UserId.Value;
        pet.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();
        return await FindByIdAsync(id);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var deleted = await db.Pets.Where(pet => pet.Id == id).ExecuteDeleteAsync();
        return deleted > 0;
    }

    private static System.Linq.Expressions.Expression<Func<Pet, PetResponse>> MapResponse()
    {
        return pet => new PetResponse(
            pet.Id,
            pet.Name,
            pet.Species,
            pet.Breed,
            pet.Color,
            pet.Gender,
            pet.Age,
            pet.Weight,
            pet.Height,
            pet.Notes,
            pet.UserId,
            pet.CreatedAt,
            pet.UpdatedAt,
            new OwnerSummary(pet.User.Id, pet.User.FirstName, pet.User.LastName));
    }
}