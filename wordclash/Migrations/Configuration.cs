namespace wordclash.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<wordclash.Models.ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
            ContextKey = "wordclash.Models.ApplicationDbContext";
        }

        protected override void Seed(wordclash.Models.ApplicationDbContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );
            //
            context.StoryBeginingModels.AddOrUpdate(
                new Models.StoryBeginingModel { Creator = "Basic", Created = DateTime.Now, Category = "Mittel", StoryBegin = "Stan hat es geschafft. Er hat die Welt gerettet. Er wird nun interviewed von Elaine. 'Erzähl Stan, was ist passiert?'..." },
                new Models.StoryBeginingModel { Creator = "Basic", Created = DateTime.Now, Category = "Schwer", StoryBegin = "Mr Tucker wollte gerade mit seiner Frau einen gemütlichen abend verbringen, als eine Drohne mit Kamera durch das Fenster kracht..." },
                new Models.StoryBeginingModel { Creator = "Basic", Created = DateTime.Now, Category = "Schwer", StoryBegin = "Lisa wollte gerade gehen, als ihr ein Brief am Boden der Tür auffällt. Sie liest ihn und stellt fest, dass der Brief von ihr selbst aus der Zukunfst stammt..." },
                new Models.StoryBeginingModel { Creator = "Basic", Created = DateTime.Now, Category = "Einfach", StoryBegin = "Als Nico durch die Luft fliegt, und sein Auto keinen Bodenkontakt mehr hat, hört er plötzlich ein klingeln..." },
                new Models.StoryBeginingModel { Creator = "Basic", Created = DateTime.Now, Category = "Einfach", StoryBegin = "Leopold steht traurig da. Eric klopft ihm auf die Schulter und sagt, 'Da habe ich dir wohl wieder den Arsch gerettet'... " }
            );
            context.HashtagModels.AddOrUpdate(
                new Models.HashtagModel { Creator = "Basic", Created = DateTime.Now, Category = "Mittel", Hashtag = "Handstand" },
                new Models.HashtagModel { Creator = "Basic", Created = DateTime.Now, Category = "Einfach", Hashtag = "Fön" },
                new Models.HashtagModel { Creator = "Basic", Created = DateTime.Now, Category = "Einfach", Hashtag = "Gardrobe" },
                new Models.HashtagModel { Creator = "Basic", Created = DateTime.Now, Category = "Einfach", Hashtag = "Kaffee" },
                new Models.HashtagModel { Creator = "Basic", Created = DateTime.Now, Category = "Mittel", Hashtag = "Einrad" },
                new Models.HashtagModel { Creator = "Basic", Created = DateTime.Now, Category = "Schwer", Hashtag = "Space Pirat" },
                new Models.HashtagModel { Creator = "Basic", Created = DateTime.Now, Category = "Schwer", Hashtag = "Micheal Jordan" },
                new Models.HashtagModel { Creator = "Basic", Created = DateTime.Now, Category = "Mittel", Hashtag = "Schnee" },
                new Models.HashtagModel { Creator = "Basic", Created = DateTime.Now, Category = "Mittel", Hashtag = "Tape" },
                new Models.HashtagModel { Creator = "Basic", Created = DateTime.Now, Category = "Mittel", Hashtag = "Waschmaschine" },
                new Models.HashtagModel { Creator = "Basic", Created = DateTime.Now, Category = "Extrem", Hashtag = "Trockenhaube" },
                new Models.HashtagModel { Creator = "Basic", Created = DateTime.Now, Category = "Extrem", Hashtag = "Passierschein A38" }
            );
        }
    }
}
