using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Net;
using System.Threading.Tasks;
using System.IO;
using Newtonsoft.Json;

namespace wordclash.Tests.API
{
    [TestClass]
    public class WiktionaryTest
    {
        [TestMethod]
        public void TestGetRequest()
        {
            var request = WebRequest.Create("http://en.wiktionary.org/w/api.php?action=query&titles=test&format=json ");
            var task = request.GetResponseAsync();
            task.Wait(10000);
            var response = task.Result;
            Assert.IsNotNull(response);
            var stream = response.GetResponseStream();

            var reader = new StreamReader(stream);

            string responseFromServer = reader.ReadToEnd();

            reader.Close();
            response.Close();
            var deserializeTask = Task<object>.Factory.StartNew(()=>JsonConvert.DeserializeObject(responseFromServer));
            deserializeTask.Wait(100000);
            var value = deserializeTask.Result as Newtonsoft.Json.Linq.JObject;
            Assert.IsNotNull(value);
            var pathToPageData = value.SelectToken("query.pages").First.Path;
            var s = value.SelectToken(pathToPageData).ToString();
            var result = System.Web.Helpers.Json.Decode(s);
            Assert.IsNotNull(result);
            try {
                Assert.IsTrue(result.pageid != null);
            }
            catch(Exception ex)
            {
                Assert.Fail(ex.Message);
            }     
        }
        [TestMethod]
        public void TestGetRequestNotExistingWord()
        {
            var request = WebRequest.Create("http://en.wiktionary.org/w/api.php?action=query&titles=testx&format=json ");
            var task = request.GetResponseAsync();
            task.Wait(10000);
            var response = task.Result;
            Assert.IsNotNull(response);
            var stream = response.GetResponseStream();

            var reader = new StreamReader(stream);

            string responseFromServer = reader.ReadToEnd();

            reader.Close();
            response.Close();
            var deserializeTask = Task<object>.Factory.StartNew(() => JsonConvert.DeserializeObject(responseFromServer));
            deserializeTask.Wait(100000);
            var value = deserializeTask.Result as Newtonsoft.Json.Linq.JObject;
            Assert.IsNotNull(value);
            var pathToPageData = value.SelectToken("query.pages").First.Path;
            var s = value.SelectToken(pathToPageData).ToString();
            var result = System.Web.Helpers.Json.Decode(s);
            Assert.IsNotNull(result);
            try
            {
                Assert.IsTrue(result.pageid == null);
            }
            catch (Exception ex)
            {
                Assert.Fail(ex.Message);
            }
        }

    }
}
