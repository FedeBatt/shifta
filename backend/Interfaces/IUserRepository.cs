public interface IUserRepository
{
    Task<IReadOnlyList<UserResponse>> FindManyAsync();
    Task<UserResponse?> FindByIdAsync(int id);
    Task<int?> FindIdByEmailAsync(string email);
    Task<UserResponse> CreateAsync(User user);
    Task<UserResponse?> UpdateAsync(int id, UpdateUserDto data);
    Task<bool> DeleteAsync(int id);
}
