import mongoose from "mongoose";
import dns from "dns";

// Fix for "querySrv ECONNREFUSED" - common with Indian ISPs (Jio/Airtel)
// whose default DNS servers don't resolve mongodb+srv SRV records properly.
// Forcing Google's public DNS fixes it at the app level, no system settings needed.
dns.setServers(["8.8.8.8", "8.8.4.4"]);

// Tolerate common copy-paste mistakes in the env value: surrounding spaces/newlines,
// wrapping quotes, or the key name ("MONGODB_URI=") pasted into the value.
const MONGODB_URI = (process.env.MONGODB_URI ?? "")
  .trim()
  .replace(/^MONGODB_URI\s*=\s*/i, "")
  .replace(/^["']+|["']+$/g, "")
  .trim();

if (!MONGODB_URI) {
  console.warn("MONGODB_URI is not set. Set it in .env.local before hitting any DB route.");
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cached;

export async function connectDB() {
  if (cached.conn) return cached.conn;

  // TEMPORARY DEBUG: shows what Vercel actually received (no secrets revealed)
  if (!/^mongodb(\+srv)?:\/\//.test(MONGODB_URI)) {
    throw new Error(
      `MONGODB_URI looks wrong: length=${MONGODB_URI.length}, firstCharCode=${MONGODB_URI.charCodeAt(0)}, mongodbAt=${MONGODB_URI.indexOf("mongodb")}, rawLength=${(process.env.MONGODB_URI ?? "").length}`
    );
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}