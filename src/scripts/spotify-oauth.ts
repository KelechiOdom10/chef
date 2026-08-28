import { createHash, randomBytes } from "node:crypto";
import { createServer } from "node:http";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const PORT = 4321;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/`;
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const SCOPE = "user-read-currently-playing user-read-recently-played";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENV_PATH = join(__dirname, "../../.env");

function readEnv(): Record<string, string> {
  const env: Record<string, string> = {};
  for (const line of readFileSync(ENV_PATH, "utf8").split("\n")) {
    if (!line.includes("=") || line.startsWith("#")) continue;
    const i = line.indexOf("=");
    env[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return env;
}

function updateEnv(key: string, value: string) {
  const lines = readFileSync(ENV_PATH, "utf8").split("\n");
  let found = false;
  const next = lines.map((line) => {
    if (line.startsWith(`${key}=`)) {
      found = true;
      return `${key}=${value}`;
    }
    return line;
  });
  if (!found) next.push(`${key}=${value}`);
  writeFileSync(ENV_PATH, next.join("\n"));
  console.log(`Updated ${key} in .env (new value hidden).`);
}

function base64url(input: string | Buffer): string {
  return Buffer.from(input).toString("base64url");
}

const env = readEnv();
const CLIENT_ID = env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = env.SPOTIFY_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be set in .env.");
  process.exit(1);
}

const codeVerifier = base64url(randomBytes(64)).replace(/=+$/, "").slice(0, 128);
const codeChallenge = base64url(createHash("sha256").update(codeVerifier).digest());

const authUrl = `${AUTHORIZE_ENDPOINT}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
  REDIRECT_URI
)}&code_challenge_method=S256&code_challenge=${codeChallenge}&scope=${encodeURIComponent(SCOPE)}`;

console.log("\nOpen this URL in your browser and authorize the app:\n");
console.log(authUrl);
console.log(`\nWaiting for the redirect back to ${REDIRECT_URI} ...\n`);

const server = createServer((req, res) => {
  const url = new URL(req.url || "/", `http://127.0.0.1:${PORT}`);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  res.end(
    code || error
      ? "<h1>Authorized. You can close this tab.</h1>"
      : "<p>No authorization code received. Close this tab.</p>"
  );

  server.close();

  if (!code) {
    console.error(`Authorization failed: ${error || "no code returned"}`);
    process.exit(1);
  }

  exchangeCode(code)
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Token exchange failed:", err.message);
      process.exit(1);
    });
});

async function exchangeCode(code: string) {
  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      code_verifier: codeVerifier,
    }),
  });

  const data: { refresh_token?: string; access_token?: string; error_description?: string } =
    await res.json();

  if (!res.ok || !data.refresh_token) {
    throw new Error(`${res.status} ${data.error_description || "missing refresh_token"}`);
  }

  updateEnv("SPOTIFY_REFRESH_TOKEN", data.refresh_token);
  console.log("\nDone. Refresh token refreshed successfully.");
  console.log("Re-deploy to Cloudflare and paste the new refresh token into your binding.");
}

server.listen(PORT, "127.0.0.1", () => console.log(`Local server ready on ${REDIRECT_URI}`));
