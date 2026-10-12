using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("pets")]
public class PetsController(PetService pets) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<PetResponse>> Create(CreatePetDto request)
    {
        var pet = await pets.CreateAsync(request);
        return CreatedAtAction(nameof(FindOne), new { id = pet.Id }, pet);
    }

    [HttpGet]
    public async Task<IReadOnlyList<PetResponse>> FindMany()
    {
        return await pets.FindManyAsync();
    }

    [HttpGet("{id:int}")]
    public async Task<PetResponse> FindOne(int id)
    {
        return await pets.FindOneAsync(id);
    }

    [HttpPatch("{id:int}")]
    public async Task<PetResponse> Update(int id, PetUpdate request)
    {
        return await pets.UpdateAsync(id, request);
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Remove(int id)
    {
        await pets.RemoveAsync(id);
        return Ok(new { id });
    }
}