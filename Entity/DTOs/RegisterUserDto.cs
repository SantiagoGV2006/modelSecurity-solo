// Entity/DTOs/RegisterUserDto.cs
using System;

namespace Entity.DTOs
{
    public class RegisterUserDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Username { get; set; } // For login purposes
        public string Password { get; set; }
        public bool IsAdmin { get; set; } = false; // Default to regular user
        public string CompanyCode { get; set; } // Optional, used for admin validation
    }
}