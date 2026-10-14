using Microsoft.EntityFrameworkCore;

public class UserRepository(AppDbContext db) : IUserRepository
{
    public async Task<IReadOnlyList<UserResponse>> FindManyAsync()
    {
        return await db.Users
            .OrderByDescending(user => user.CreatedAt)
            .Select(user => new UserResponse(
                user.Id,
                user.FirstName,
                user.LastName,
                user.Email,
                user.CreatedAt,
                user.UpdatedAt))
            .ToListAsync();
    }

    public Task<UserResponse?> FindByIdAsync(int id)
    {
        return db.Users
            .Where(user => user.Id == id)
            .Select(user => new UserResponse(
                user.Id,
                user.FirstName,
                user.LastName,
                user.Email,
                user.CreatedAt,
                user.UpdatedAt))
            .FirstOrDefaultAsync();
    }

    public Task<int?> FindIdByEmailAsync(string email)
    {
        return db.Users
            .Where(user => user.Email == email)
            .Select(user => (int?)user.Id)
            .FirstOrDefaultAsync();
    }

    public async Task<UserResponse> CreateAsync(User user)
    {
        var now = DateTime.UtcNow;
        user.CreatedAt = now;
        user.UpdatedAt = now;

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return Map(user);
    }

    public async Task<UserResponse?> UpdateAsync(int id, UpdateUserDto data)
    {
        var user = await db.Users.FirstOrDefaultAsync(item => item.Id == id);
        if (user is null)
        {
            return null;
        }

        if (data.FirstName is not null) user.FirstName = data.FirstName;
        if (data.LastName is not null) user.LastName = data.LastName;
        if (data.Email is not null) user.Email = data.Email;
        if (data.Password is not null) user.Password = data.Password;
        user.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();
        return Map(user);
    }

    public async Task<UserResponse?> UpdateAsyncAsNoTracking(int id, UpdateUserDto data)
    {
        // 1. Traemos el usuario SIN tracking (sin copia en memoria)
        var user = await db.Users.AsNoTracking().FirstOrDefaultAsync(item => item.Id == id);
        if (user is null)
        {
            return null;
        }

        // 2. Modificamos el objeto en memoria RAM
        if (data.FirstName is not null) user.FirstName = data.FirstName;
        if (data.LastName is not null) user.LastName = data.LastName;
        if (data.Email is not null) user.Email = data.Email;
        if (data.Password is not null) user.Password = data.Password;
        user.UpdatedAt = DateTime.UtcNow;

        // 3. ¡PASO CRUCIAL! Adjuntamos el objeto al contexto manualmente
        var entry = db.Users.Attach(user);

        // 4. Le avisamos a EF Core qué propiedades específicas fueron modificadas
        if (data.FirstName is not null) entry.Property(x => x.FirstName).IsModified = true;
        if (data.LastName is not null) entry.Property(x => x.LastName).IsModified = true;
        if (data.Email is not null) entry.Property(x => x.Email).IsModified = true;
        if (data.Password is not null) entry.Property(x => x.Password).IsModified = true;
        entry.Property(x => x.UpdatedAt).IsModified = true;

        // 5. Ahora SaveChanges() sí sabe qué enviar a la base de datos
        await db.SaveChangesAsync();
        return Map(user);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var deleted = await db.Users.Where(user => user.Id == id).ExecuteDeleteAsync();
        return deleted > 0;
    }

    private static UserResponse Map(User user) => new(
        user.Id,
        user.FirstName,
        user.LastName,
        user.Email,
        user.CreatedAt,
        user.UpdatedAt);
}