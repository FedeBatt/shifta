namespace backend.Services;

public class UserService(IUserRepository users, IPetRepository pets)
{
    public async Task<UserResponse> CreateAsync(CreateUserDto request)
    {
        if (await users.FindIdByEmailAsync(request.Email) is not null)
        {
            throw new ConflictException("El email ya está registrado");
        }

        var user = new User
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            Password = HashPassword(request.Password),
        };

        return await users.CreateAsync(user);
    }

    public Task<IReadOnlyList<UserResponse>> FindManyAsync()
    {
        return users.FindManyAsync();
    }

    public async Task<UserResponse> FindOneAsync(int id)
    {
        return await users.FindByIdAsync(id)
            ?? throw new NotFoundException($"Usuario con id {id} no encontrado");
    }

    public async Task<UserResponse> UpdateAsync(int id, UpdateUserDto request)
    {
        await FindOneAsync(id);

        if (request.Email is not null)
        {
            var existingId = await users.FindIdByEmailAsync(request.Email);
            if (existingId is not null && existingId != id)
            {
                throw new ConflictException("El email ya está registrado");
            }
        }

        var data = request with
        {
            Password = request.Password is null ? null : HashPassword(request.Password),
        };

        return await users.UpdateAsync(id, data)
            ?? throw new NotFoundException($"Usuario con id {id} no encontrado");
    }

    public async Task<int> RemoveAsync(int id)
    {
        await FindOneAsync(id);
        await users.DeleteAsync(id);
        return id;
    }

    public async Task<UserOverview> GetOverviewAsync(int id)
    {
        var user = await FindOneAsync(id);

        var petsTask = pets.FindByUserIdAsync(id);
        var totalTask = pets.CountByUserIdAsync(id);
        var groupedTask = pets.GroupBySpeciesAsync(id);
        await Task.WhenAll(petsTask, totalTask, groupedTask);

        return new UserOverview(
            new UserOverviewProfile(user.Id, $"{user.FirstName} {user.LastName}", user.Email, user.CreatedAt),
            new UserOverviewStats(totalTask.Result, groupedTask.Result),
            petsTask.Result);
    }

    private static string HashPassword(string password) =>
        BCrypt.Net.BCrypt.HashPassword(password, workFactor: 10);
}
