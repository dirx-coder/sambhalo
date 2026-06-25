const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config({ path: ".env.local" });

async function inspectDb() {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db();
    
    const users = await db.collection("users").find().toArray();
    const accounts = await db.collection("accounts").find().toArray();
    const sessions = await db.collection("sessions").find().toArray();
    
    console.log("USERS:", JSON.stringify(users, null, 2));
    console.log("ACCOUNTS:", JSON.stringify(accounts, null, 2));
    console.log("SESSIONS:", JSON.stringify(sessions, null, 2));
    
  } catch (error) {
    console.error("DB Error:", error.message);
  } finally {
    await client.close();
  }
}

inspectDb();
