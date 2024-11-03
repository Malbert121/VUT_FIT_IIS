using Conventus.DAL.EfStructures;
using Conventus.DAL.Initialization;
using Conventus.DAL.Repositories;
using Conventus.DAL.Repositories.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;


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
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        // Проверяем, есть ли токен в куки с именем "AuthToken"
                        if (context.Request.Cookies.ContainsKey("AuthToken"))
                        {
                            context.Token = context.Request.Cookies["AuthToken"];
                            Console.WriteLine("Token from AuthToken cookie: " + context.Token);
                        }
                        else
                        {
                            Console.WriteLine("No AuthToken cookie found in request.");
                        }
                        return Task.CompletedTask;
                    },
                    OnAuthenticationFailed = context =>
                    {
                        Console.WriteLine("Authentication failed: " + context.Exception.Message);
                        return Task.CompletedTask;
                    },
            
                    OnChallenge = context =>
                    {
                        // Если нет токена или он недействителен, перенаправляем на страницу входа
                        context.HandleResponse();
                        context.Response.Redirect("/Login");
                        return Task.CompletedTask;
                    }
                };
            
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ValidAudience = builder.Configuration["Jwt:Audience"], // Убедитесь, что Audience настроен
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
                };
            
            
            })
            .AddCookie(options =>
            {
                //options.LoginPath = "/Login"; // Укажите путь к странице входа
                //options.AccessDeniedPath = "/Login"; // Опционально для доступа без прав
            });
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

            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();


            app.MapControllers();
            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
