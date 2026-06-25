const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config({ path: ".env.local" });

async function cleanDb() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db();
    
    // Drop the collections so the new adapter can recreate them properly
    await db.collection("users").deleteMany({});
    await db.collection("accounts").deleteMany({});
    await db.collection("sessions").deleteMany({});
    await db.collection("verification_tokens").deleteMany({});
    
    console.log("Database cleaned successfully.");
  } catch (error) {
    console.error("DB Error:", error.message);
  } finally {
    await client.close();
  }
}

cleanDb();
