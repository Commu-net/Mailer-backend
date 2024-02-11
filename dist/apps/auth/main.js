const Module = require("module");
const path = require("path");
const fs = require("fs");
const originalResolveFilename = Module._resolveFilename;
const distPath = __dirname;
const manifest = [{ "module": "@auth/ErrorMiddleware", "exactMatch": "libs/ErrorMiddlware/src/index.js", "pattern": "libs/ErrorMiddlware/src/index.ts" }, { "module": "@auth/lib", "exactMatch": "lib/src/index.js", "pattern": "lib/src/index.ts" }, { "module": "@auth/lib2", "exactMatch": "lib2/src/index.js", "pattern": "lib2/src/index.ts" }, { "module": "@auth/mongo", "exactMatch": "libs/mongo/src/index.js", "pattern": "libs/mongo/src/index.ts" }, { "module": "@auth/my-lib", "exactMatch": "libs/my-lib/src/index.js", "pattern": "libs/my-lib/src/index.ts" }, { "module": "@auth/scrapper", "exactMatch": "libs/scrapper/src/index.js", "pattern": "libs/scrapper/src/index.ts" }, { "module": "@auth/utils", "exactMatch": "libs/utils/src/index.js", "pattern": "libs/utils/src/index.ts" }, { "module": "AuthMiddleWare", "exactMatch": "libs/AuthMiddleware/src/index.js", "pattern": "libs/AuthMiddleware/src/index.ts" }];
Module._resolveFilename = function(request, parent) {
  let found;
  for (const entry of manifest) {
    if (request === entry.module && entry.exactMatch) {
      const entry2 = manifest.find((x) => request === x.module || request.startsWith(x.module + "/"));
      const candidate = path.join(distPath, entry2.exactMatch);
      if (isFile(candidate)) {
        found = candidate;
        break;
      }
    } else {
      const re = new RegExp(entry.module.replace(/\*$/, "(?<rest>.*)"));
      const match = request.match(re);
      if (match?.groups) {
        const candidate = path.join(distPath, entry.pattern.replace("*", ""), match.groups.rest + ".js");
        if (isFile(candidate)) {
          found = candidate;
        }
      }
    }
  }
  if (found) {
    const modifiedArguments = [found, ...[].slice.call(arguments, 1)];
    return originalResolveFilename.apply(this, modifiedArguments);
  } else {
    return originalResolveFilename.apply(this, arguments);
  }
};
function isFile(s) {
  try {
    return fs.statSync(s).isFile();
  } catch (_e) {
    return false;
  }
}
require("./apps/auth/src/main.js");
