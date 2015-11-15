using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace wordclash.Models
{
    public class GameModel
    {
        public int Id { get; set; }
        public string GameText { get; set; }
        public ICollection<ApplicationUser> Users { get; set; }
        public ICollection<MessageModel> StoryParts { get; set; }
        public int Rounds { get; set; } = 3;
        public int PlayerSize { get; set; } = 2;
        public bool IsFinished { get; set; } = false;
        public string PlayersReady { get; set; } = "";
        public string GameInformations { get; set; } = "";
    }
}