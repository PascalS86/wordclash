using Microsoft.AspNet.SignalR;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using wordclash.Hub;
using wordclash.Models;

namespace wordclash.Controllers
{
    [System.Web.Http.Authorize]
    public class GameController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: api/Game
        public IQueryable<GameModel> GetGameModels()
        {
            return db.GameModels;
        }

        // GET: api/Game/5
        [ResponseType(typeof(GameModel))]
        public async Task<IHttpActionResult> GetGameModel(int id)
        {
            GameModel gameModel = await db.GameModels.FindAsync(id);
            if (gameModel == null)
            {
                return NotFound();
            }

            return Ok(gameModel);
        }

        // PUT: api/Game/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutGameModel(int id, GameModel gameModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != gameModel.Id)
            {
                return BadRequest();
            }

            db.Entry(gameModel).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GameModelExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Game
        [ResponseType(typeof(GameModel))]
        public async Task<IHttpActionResult> PostGameModel(GameModel gameModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.GameModels.Add(gameModel);
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = gameModel.Id }, gameModel);
        }

        // DELETE: api/Game/5
        [ResponseType(typeof(GameModel))]
        public async Task<IHttpActionResult> DeleteGameModel(int id)
        {
            GameModel gameModel = await db.GameModels.FindAsync(id);
            if (gameModel == null)
            {
                return NotFound();
            }

            db.GameModels.Remove(gameModel);
            await db.SaveChangesAsync();

            return Ok(gameModel);
        }

        // Join: api/Game/Join/TestUser
        [Route("api/game/join/{id}")]
        [HttpGet]
        public async Task<IHttpActionResult> JoinGame(string id)
        {
            
            var openGames = db.GameModels.Include("Users").Include("StoryParts").Where(c => !c.IsFinished && c.Users.Count < c.PlayerSize);
            var currentUser = await db.Users.Where(c => c.UserName == id).FirstAsync();      
            if(currentUser == null)
            {
                return StatusCode(HttpStatusCode.NotFound);
            }     
            GameModel currentGame = null;
            if (!openGames.Any())
            { 
                currentGame = new GameModel();
                var storyBegining = await db.StoryBeginingModels.OrderBy(c => Guid.NewGuid()).FirstAsync();
                currentGame.GameText = storyBegining.StoryBegin;
                if (currentGame.Users == null)
                {
                    currentGame.Users = new List<ApplicationUser>() { currentUser };
                    currentGame.StoryParts = new List<MessageModel>();
                }
                db.GameModels.Add(currentGame);
            }
            else
            {
                if (openGames.Any(c => !c.Users.Any(d => d.UserName == id)))
                {
                    currentGame = await openGames.FirstAsync();
                    currentGame.Users.Add(currentUser);
                    if (currentGame.Users.Count == currentGame.PlayerSize)
                    {
                        var lottery = currentGame.Users.OrderBy(c => Guid.NewGuid()).ToList();

                        for (int i = 0; i < currentGame.Rounds * currentGame.PlayerSize; i++)
                        {
                            var lotteryIdx = i % (currentGame.PlayerSize);
                            currentGame.StoryParts.Add(new MessageModel { StoryPosition = i, ApplicationUser = lottery.ElementAt(lotteryIdx), ApplicationUserId = lottery.ElementAt(lotteryIdx).Id });
                        }
                    }
                    db.Entry(currentGame).State = EntityState.Modified;
                }
                else
                {
                    currentGame = await openGames.Where(c => c.Users.Any(d => d.UserName == id)).FirstOrDefaultAsync();
                }
            }
            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            { 
                return StatusCode(HttpStatusCode.InternalServerError);
            }
            if(currentGame.Users.Count == currentGame.PlayerSize)
            {
                var hubContext = GlobalHost.ConnectionManager.GetHubContext<GameHub>();
                var smallGame = new
                {
                    GameId = currentGame.Id,
                    GameText = currentGame.GameText,
                    Rounds = currentGame.Rounds,
                    Players = currentGame.Users.Select(c => new { UserName = c.UserName }),
                    StoryParts = currentGame.StoryParts.Select(c => new { CurrentUser = c.ApplicationUser.UserName, Position = c.StoryPosition })
                };
                hubContext.Clients.All.broadcastMessage("heat", smallGame);
                return Ok();
            }
            return Ok("lobby");

        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool GameModelExists(int id)
        {
            return db.GameModels.Count(e => e.Id == id) > 0;
        }
    }
}