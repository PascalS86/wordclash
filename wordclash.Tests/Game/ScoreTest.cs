using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Threading.Tasks;
using System.Collections.Generic;
using wordclash.External;

namespace wordclash.Tests.Game
{
    [TestClass]
    public class ScoreTest
    {
        [TestMethod]
        public void TestScore()
        {
            try {
                var words = "Dies ist ein kleiner Test".Split(' ');
                var tasks = new List<Task>();
                Parallel.ForEach(words, word =>
                {
                    var task = Wictionary.Factory.IsValidWord(word);
                    tasks.Add(task);
                });
                Task.WaitAll(tasks.ToArray());
                
            }
            catch(Exception ex)
            {
                Assert.Fail(ex.Message);
            }
        }
    }
}
