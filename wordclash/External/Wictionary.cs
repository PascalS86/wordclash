using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Helpers;

namespace wordclash.External
{
    public class Wictionary
    {
        private const string requestUri = "http://de.wiktionary.org/w/api.php?action=query&titles={0}&format=json";
        public static Wictionary Factory { get { return new Wictionary(); } }
        public async Task<bool> IsValidWord(string word)
        {
            var request = WebRequest.Create(string.Format(requestUri, word));
           
            var response = await request.GetResponseAsync();
            var stream = response.GetResponseStream();

            var reader = new StreamReader(stream);

            string responseFromServer = reader.ReadToEnd();

            reader.Close();
            response.Close();

            bool isValid = false;
            try
            {
                var value = await Task<object>.Factory.StartNew(() => JsonConvert.DeserializeObject(responseFromServer)) as JObject;
                var pathToPageData = value.SelectToken("query.pages").First.Path;
                var s = value.SelectToken(pathToPageData).ToString();
                var result = Json.Decode(s);
                isValid = result.pageid != null;
            }
            catch
            {
                isValid = false;
            }
            finally
            {
            }
            return isValid;
        }
    }
}