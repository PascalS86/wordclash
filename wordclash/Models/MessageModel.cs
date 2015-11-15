namespace wordclash.Models
{
    public class MessageModel
    {
        public int Id { get; set; }
        public int StoryPosition { get; set; }
        public string Message { get; set; }
        public int Score { get; set; }
        public int GameModelId { get; set; }
        public virtual GameModel GameModel { get; set; }
        public string ApplicationUserId { get; set; }
        public virtual ApplicationUser ApplicationUser { get; set; }
    }
}