using backend.Services;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("users")]
public class UsersController(UserService users) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<UserResponse>> Create(CreateUserDto request)
    {
        var user = await users.CreateAsync(request);
        return CreatedAtAction(nameof(FindOne), new { id = user.Id }, user);
    }

    [HttpGet]
    public async Task<IReadOnlyList<UserResponse>> FindMany()
    {
        return await users.FindManyAsync();
    }

    [HttpGet("{id:int}/overview")]
    public async Task<UserOverview> Overview(int id)
    {
        return await users.GetOverviewAsync(id);
    }

    [HttpGet("{id:int}")]
    public async Task<UserResponse> FindOne(int id)
    {
        return await users.FindOneAsync(id);
    }

    [HttpPatch("{id:int}")]
    public async Task<UserResponse> Update(int id, UpdateUserDto request)
    {
        return await users.UpdateAsync(id, request);
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Remove(int id)
    {
        await users.RemoveAsync(id);
        return Ok(new { id });
    }
}