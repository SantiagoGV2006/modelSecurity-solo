using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity.Model
{
    public class WorkerLogin
    {
        public int id { get; set; }
        public int LoginId { get; set; }
        public int WorkerId { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public DateTime CreationDate { get; set; }
        public bool Status { get; set; }

        public Worker Worker { get; set; }
    }

}
