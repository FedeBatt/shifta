public class PetService(IPetRepository pets, IUserRepository users)
{
    public async Task<PetResponse> CreateAsync(CreatePetDto request)
    {
        await EnsureOwnerExistsAsync(request.UserId);

        var pet = new Pet
        {
            Name = request.Name,
            Species = request.Species,
            Breed = request.Breed,
            Color = request.Color,
            Gender = request.Gender,
            Age = request.Age,
            Weight = request.Weight,
            Height = request.Height,
            Notes = request.Notes,
            UserId = request.UserId,
        };

        return await pets.CreateAsync(pet);
    }

    public Task<IReadOnlyList<PetResponse>> FindManyAsync()
    {
        return pets.FindManyAsync();
    }

    public async Task<PetResponse> FindOneAsync(int id)
    {
        return await pets.FindByIdAsync(id)
            ?? throw new NotFoundException($"Mascota con id {id} no encontrada");
    }

    public async Task<PetResponse> UpdateAsync(int id, PetUpdate request)
    {
        await FindOneAsync(id);

        if (request.UserId is not null)
        {
            await EnsureOwnerExistsAsync(request.UserId.Value);
        }

        return await pets.UpdateAsync(id, request)
            ?? throw new NotFoundException($"Mascota con id {id} no encontrada");
    }

    public async Task<int> RemoveAsync(int id)
    {
        await FindOneAsync(id);
        await pets.DeleteAsync(id);
        return id;
    }

    private async Task EnsureOwnerExistsAsync(int userId)
    {
        if (await users.FindByIdAsync(userId) is null)
        {
            throw new NotFoundException($"Usuario con id {userId} no encontrado");
        }
    }
}