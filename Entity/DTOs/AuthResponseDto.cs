using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Entity.DTOs
{
        public class AuthResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public int RolId { get; set; }
        public string RolName { get; set; }
        public string Token { get; set; }
    }
}