﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using wordclash.Models;
using System.Data.Entity;
using System.Threading.Tasks;
using wordclash.External;

namespace wordclash.Hub
{
    public class GameHub : Microsoft.AspNet.SignalR.Hub
    {
        private const double gameTotalTime = 2.5 * 60 * 1000;
        private ApplicationDbContext db = new ApplicationDbContext();
        public override Task OnConnected()
        {
            if (!Context.User.Identity.IsAuthenticated)
            {
                Groups.Add(Context.ConnectionId, "anonymous");
            }
            else
            {
                Groups.Add(Context.ConnectionId, Context.User.Identity.Name);
            }
            return base.OnConnected();
        }
        public override Task OnDisconnected(bool stopCalled)
        {
            if (!Context.User.Identity.IsAuthenticated)
            {
                Groups.Remove(Context.ConnectionId, "anonymous");
            }
            else
            {

                Groups.Remove(Context.ConnectionId, Context.User.Identity.Name);
            }
            return base.OnDisconnected(stopCalled);
        }
       

        public async Task SendStoryMessage(string message, int gameId, string userName, int round, int timeLeft, string chosenWord)
        {
            round++;

            var game = await db.GameModels.Include("Users").Where(c => c.Id == gameId).FirstAsync();
            var players = game.Users.Select(c => c.UserName).ToArray();
            var totalRounds = game.Rounds * game.PlayerSize;
            var score = (gameTotalTime / 1000) - timeLeft;
            foreach (var groupname in players)
            {
                Clients.Group(groupname).broadcastStoryMessage(message, gameId, userName, round, score);
            }
            if(round == totalRounds)
            {
                foreach (var groupname in players)
                    Clients.Group(groupname).broadcastWaitForScore(gameId);
                game.IsFinished = true;
                db.Entry(game).State = EntityState.Modified;
            }
            
            MessageModel msg = new MessageModel();
            msg.GameModelId = gameId;
            msg.StoryPosition = round - 1;
            msg.Message = message;
            msg.Score = await GetScore(timeLeft, message, chosenWord); 
            var user = await db.Users.FirstAsync(c => c.UserName == userName);
            if (user != null)
                msg.ApplicationUserId = user.Id;
            db.MessageModels.Add(msg);
            await db.SaveChangesAsync();
            if(round == totalRounds)
            {
                var messages = db.MessageModels.Include("ApplicationUser").Include("GameModel").Where(c => c.GameModel.Id == gameId);
                var result = from c in messages
                             group c by c.ApplicationUser into grp
                             select new { key = grp.Key, items = grp };

                Dictionary<string, double> userScores = new Dictionary<string, double>();
                foreach(var item in result)
                {
                    var userScore = item.items.Sum(c => c.Score);
                    var currentUserName = item.key.UserName;
                    userScores.Add(currentUserName, userScore);
                }
                foreach (var groupname in players)
                    Clients.Group(groupname).broadcastEndMessage(gameId, new { userName = userScores.ElementAt(0).Key, points = userScores.ElementAt(0).Value }, new { userName = userScores.ElementAt(1).Key, points = userScores.ElementAt(1).Value });
            }
        }


        private async Task<int> GetScore(int timeLeft, string message, string chosenWord)
        {
            var hashtag = await db.HashtagModels.Where(c => c.Hashtag == chosenWord).FirstOrDefaultAsync();
            var hashtagFactor = 1d;
            if(hashtag != null)
            {
                switch (hashtag.Category)
                {
                    case "Extrem":
                        hashtagFactor = 2.5d;
                        break;
                    case "Schwer":
                        hashtagFactor = 2.25d;
                        break;
                    case "Mittel":
                        hashtagFactor = 2d;
                        break;
                    case "Einfach":
                        hashtagFactor = 1.5d;
                        break;
                    default:
                        hashtagFactor = 1d;
                        break;
                }
            }
            var timeFactor = ((double)timeLeft / 60d);
            var words = message.Split(' ');
            var score = 0d;
            foreach (var word in words)
            {
                var valid = await Wictionary.Factory.IsValidWord(word);
                if (valid)
                {
                    score += word.Length;
                }
            }
            
            if(score > 0)
            {
                score += message.Length;
            }
            score *= timeFactor;
            score *= hashtagFactor;
            return (int)score;
        }

      

        public async Task SendStart(int gameId, string userName)
        {
            var game = await db.GameModels.Include("Users").Where(c => c.Id == gameId).FirstAsync();
            foreach (var groupname in game.Users.Select(c => c.UserName).ToArray())
                Clients.Group(groupname).broadcastMessage("game", new { gameId = gameId, round=0, userName = userName, timeLeft = gameTotalTime });
        }

        public async Task SendInput(int gameId, string userName)
        {
            var game = await db.GameModels.Include("Users").Where(c => c.Id == gameId).FirstAsync();
            foreach (var groupname in game.Users.Select(c => c.UserName).ToArray())
                Clients.Group(groupname).broadcastInput(gameId, userName);
        }


    }
}