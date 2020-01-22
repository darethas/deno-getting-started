import { serve } from "https://deno.land/std/http/server.ts";

const env = Deno.env();
const port = env.PORT || 3000;
const s = serve({ port: port });

console.log(`now serving at localhost:${port}`);

for await (const req of s) {
  req.respond({ body: "Hello world!\n" });
}
