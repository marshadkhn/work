const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: ".env.local" });

// Define a simple User schema just for this script
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function main() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("Error: MONGODB_URI is not defined in .env.local");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);
  console.log("Connected to database.");

  const email = "marshadkhn89@gmail.com"; // <-- REPLACE WITH YOUR EMAIL
  const password = "PDumb@1122"; // <-- REPLACE WITH YOUR PASSWORD

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log("User with this email already exists");
    await mongoose.connection.close();
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({ email, password: hashedPassword });

  console.log(`User ${email} created successfully!`);
  await mongoose.connection.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
