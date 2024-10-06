using Conventus.DAL.EfStructures;
using Conventus.DAL.Initialization;
using Conventus.DAL.Repositories;
using Conventus.DAL.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;


namespace Conventus.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            // Read configuration from appsettings.json
            var configuration = builder.Configuration;
            // Add DbContext and Repositories
            var connectionString = configuration.GetConnectionString("Conventus");
            builder.Services.AddDbContextPool<ConventusDbContext>(
                options => options.UseSqlServer(connectionString,
                sqlOptions => sqlOptions.EnableRetryOnFailure()));

            builder.Services.AddScoped<IUserRepo, UserRepo>();
            builder.Services.AddScoped<IConferenceRepo, ConferenceRepo>();
            builder.Services.AddScoped<IRoomRepo, RoomRepo>();
            builder.Services.AddScoped<IReservationRepo, ReservationRepo>();
            builder.Services.AddScoped<IPresentationRepo, PresentationRepo>();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", p => p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            });


            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
        options.JsonSerializerOptions.WriteIndented = true;

    });
            var app = builder.Build();
            if (app.Environment.IsDevelopment())
            {
                if (configuration.GetValue<bool>("RebuildDataBase"))
                {
                    SampleDataInitializer.InitializeData(new ConventusDbContext(
                                               new DbContextOptionsBuilder<ConventusDbContext>()
                                                                          .UseSqlServer(connectionString).Options));
                }
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // Configure the HTTP request pipeline.

            app.UseCors("AllowAll");
            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
