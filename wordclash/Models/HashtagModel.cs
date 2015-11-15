using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace wordclash.Models
{
    public class HashtagModel
    {
        public int Id { get; set; }
        public string Category { get; set; }
        public string Creator { get; set; }
        public DateTime Created { get; set; }
        public string Hashtag { get; set; }
    }
}