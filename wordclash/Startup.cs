using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Owin;
using Owin;
using Microsoft.AspNet.SignalR;

[assembly: OwinStartup(typeof(wordclash.Startup))]

namespace wordclash
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
            var config = new HubConfiguration();
            config.EnableJSONP = true;
            app.MapSignalR(config);

            //app.MapSignalR();
        }
    }
}
