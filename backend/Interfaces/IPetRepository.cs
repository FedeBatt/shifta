public interface IPetRepository
{
    Task<IReadOnlyList<PetResponse>> FindManyAsync();
    Task<PetResponse?> FindByIdAsync(int id);
    Task<IReadOnlyList<PetSummary>> FindByUserIdAsync(int userId);
    Task<int> CountByUserIdAsync(int userId);
    Task<IReadOnlyList<SpeciesCount>> GroupBySpeciesAsync(int userId);
    Task<PetResponse> CreateAsync(Pet pet);
    Task<PetResponse?> UpdateAsync(int id, PetUpdate data);
    Task<bool> DeleteAsync(int id);
}
