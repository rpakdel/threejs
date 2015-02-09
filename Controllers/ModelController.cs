using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.IO;
using System.Web.Hosting;

namespace WebApplication1.Controllers
{
    public class ModelsController : ApiController
    {
        string[] mModels = new string[] { "terrain.obj", "rock_waterfall.obj" };

        string GetFullPath(string modelName)
        {
            return Path.Combine(HostingEnvironment.ApplicationPhysicalPath, "Models", modelName);
        }

        // GET api/<controller>
        public IEnumerable<string> Get()
        {
            return mModels;
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            string modelName = mModels[id];
            string fullPath = GetFullPath(modelName);
            using (StreamReader reader = new StreamReader(fullPath))
            {
                string content = reader.ReadToEnd();
                return content;
            }
        }
    }
}