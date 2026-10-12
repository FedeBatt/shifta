using Microsoft.EntityFrameworkCore;

public class AppDbContext (DbContextOptions<AppDbContext> options) : DbContext(options) {
    public DbSet<User> Users => Set<User>();
    public DbSet<Pet> Pets => Set<Pet>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(user => user.Email).IsUnique();
            entity.HasMany(user => user.Pets)
                .WithOne(pet => pet.User)
                .HasForeignKey(pet => pet.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }    
}