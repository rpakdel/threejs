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
        string GetFullPath(string modelName)
        {
            return Path.Combine(GetModelsPaths(), modelName);
        }

        string GetModelsPaths()
        {
            return Path.Combine(HostingEnvironment.ApplicationPhysicalPath, "Models");
        }

        string[] GetModelFiles()
        {
            return Directory.GetFiles(GetModelsPaths()).Select(f => Path.GetFileName(f)).ToArray();
        }

        // GET api/<controller>
        public IEnumerable<string> Get()
        {
            return GetModelFiles();
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            string[] files = GetModelFiles();

            if (id >= files.Length)
            {
                return null;
            }

            string modelName = files[id];
            string fullPath = GetFullPath(modelName);
            using (StreamReader reader = new StreamReader(fullPath))
            {
                string content = reader.ReadToEnd();
                return content;
            }
        }
    }
}