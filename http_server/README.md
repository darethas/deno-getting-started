# http_server

Let's get started with the fun stuff: an http server.

Deno takes on the role of both runtime and package manager. The way you import dependicies in deno is by specifying a URL to the package in the import statement. Reminder that deno is not node! It does _not_ use `npm`, there is no `package.json`, and it does not support `require()`, instead using "ES Modules"

Example import:
`import * as log from 'https://deno.land/std/log/mod.ts';`

## importing your first dependency

1. create a file called `server.js` with these contents:

```javascript
import * as Server from "https://deno.land/std/http/server.ts";
console.log(Server);
```

2. run `deno server.js` and you should see deno begin to download your dependencies. Now try running it again and notice it does not re-download. It caches remote imports in a special directory specified by the `$DENO_DIR` env variable.

### additional info

- it will not reload or upgrade the module unless you are explicit about it. (If your program hasn't changed it won't even recompile!)
- You can use `--lock` as a deno argument to ensure that you're running the code you think you are
- you can specify versions in the url.
- you can use a central `deps.ts` (which serves as the same purpose as Node's `package.json`) to import and re-import the same libraries instead of scattering import URLS everywhere in your code and ensure everyone is importing the same version each time.

## lets serve some html!

1. update `server.js` to:

```javascript
import { serve } from "https://deno.land/std/http/server.ts";

const port = 3000;
const s = serve({ port: port });

console.log(`now serving at localhost:${port}`);

for await (const req of s) {
  req.respond({ body: "Hello world!\n" });
}
```

2. run `deno server.js`

You should see an error to the tune of

> error: Uncaught PermissionDenied: run again with the --allow-net flag

and that is because deno is a _secure runtime for JavaScript and TypeScript_ and doesn't explicity allow access to the network (or other things like the environment as we will soon see).

Follow the error message, and run with the `--allow-net` flag like so

`deno --allow-net server.js` and navigate to localhost:3000, you should see a nice hello world message.

## modifying the port to read from an environment variable

Lets modify the code slightly to either pick up on a `PORT` env variable or default to port 3000.

1. update `server.js` as follows:

```javascript
import { serve } from "https://deno.land/std/http/server.ts";

const env = Deno.env();
const port = env.PORT || 3000;
const s = serve({ port: port });

console.log(`now serving at localhost:${port}`);

for await (const req of s) {
  req.respond({ body: "Hello world!\n" });
}
```

2. now try setting a `PORT` environment variable and seeing what happens when you run `PORT=8000 deno --allow-net server.js`

You should see a new permission error, this time saying you don't have permission to the environment! Again, deno take security seriously, and operates in a completely sandboxed fashion, you must be explicit with any and all permissions. Let's try setting a port and running again:

`PORT=8000 deno --allow-net --allow-env server.js`

You should see this error message

> error: Uncaught InvalidData: invalid type: string "3001", expected u16

What happened? Deno also understands TypeScript! If we look at the documentation for `env()` (https://deno.land/typedoc/index.html#env) we see that it returns a string, and server's function signature accepts either a full address, or a `ServerConfig` interface, which defines port as a `number`. We got to see the type error. Handy!

We can fix one of two ways:

1. Cast the string to a number
2. use the full addr

I will leave that as an exercise to the reader!
