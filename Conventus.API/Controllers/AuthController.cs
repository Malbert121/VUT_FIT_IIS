﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Conventus.DAL.EfStructures;
using Microsoft.AspNetCore.Identity.Data;
using Conventus.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Conventus.API.Controllers.AuthModel;
using Azure.Core;

namespace Conventus.API.Controllers;
[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly ConventusDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(ConventusDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegistrationModel request)
    {
        if (_context.Users.Any(u => u.Email == request.Email))
            return BadRequest(new { message = "Username is already taken" });

        var user = new User { Email = request.Email, UserName = request.Username, PasswordHash = Convert.ToBase64String(Encoding.UTF8.GetBytes(request.Password)), Role = Models.Enums.Role.User };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var token = GenerateJwtToken(user);
        return Ok(new { token });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == request.Username && u.PasswordHash == Convert.ToBase64String(Encoding.UTF8.GetBytes(request.Password)));
        if (user == null)
            return Unauthorized(new { message = "Invalid username or password" });

        var token = GenerateJwtToken(user);
        return Ok(new { token });
    }

    private string GenerateJwtToken(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(120),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}