import "server-only";

import { MongoClient, type Db } from "mongodb";

type MongoGlobal = typeof globalThis & {
  __cyberOregonMongo?: Promise<Db>;
};

async function connect(): Promise<Db> {
  const uri =
    process.env.MONGODB_URI ||
    (process.env.NODE_ENV === "development"
      ? "mongodb://127.0.0.1:27017"
      : undefined);

  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  if (!process.env.MONGODB_URI) {
    console.warn(
      "MONGODB_URI is not configured; using local MongoDB at 127.0.0.1:27017 for development."
    );
  }

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || "cyberoregon");

  await Promise.all([
    db
      .collection("cyber_oregon_leads")
      .createIndex({ deleteAfter: 1 }, { expireAfterSeconds: 0 }),
    db.collection("cyber_oregon_leads").createIndex({ createdAt: -1 }),
    db
      .collection("cyber_oregon_newsletter")
      .createIndex({ email: 1 }, { unique: true }),
    db.collection("cyber_oregon_newsletter").createIndex({ createdAt: -1 }),
  ]);

  return db;
}

export function getDb(): Promise<Db> {
  const globalState = globalThis as MongoGlobal;
  if (!globalState.__cyberOregonMongo) {
    globalState.__cyberOregonMongo = connect().catch((error) => {
      globalState.__cyberOregonMongo = undefined;
      throw error;
    });
  }
  return globalState.__cyberOregonMongo;
}
