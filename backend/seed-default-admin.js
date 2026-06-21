const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
const DEFAULT_ADMIN_EMAIL = (process.env.DEFAULT_ADMIN_EMAIL || 'admin@thecourtyard.com').toLowerCase().trim();
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@123';
const DEFAULT_ADMIN_NAME = process.env.DEFAULT_ADMIN_NAME || 'Courtyard Admin';

const seedDefaultAdmin = async () => {
  if (!MONGO_URI) {
    throw new Error('MONGODB_URI or MONGO_URI is required');
  }

  if (!DEFAULT_ADMIN_EMAIL || !DEFAULT_ADMIN_PASSWORD) {
    throw new Error('DEFAULT_ADMIN_EMAIL and DEFAULT_ADMIN_PASSWORD are required');
  }

  try {
    await mongoose.connect(MONGO_URI);
  } catch (err) {
    console.error('\n❌ MongoDB Connection Failed:', err.message);
    console.error('==================================================');
    console.error('Troubleshooting Guide:');
    console.error('1. Check if MongoDB is running locally (e.g. net start MongoDB).');
    console.error('2. Verify MONGODB_URI in your .env file is correct.');
    console.error('3. If using MongoDB Atlas, check your internet connection and IP Whitelist settings.');
    console.error('==================================================\n');
    throw err;
  }

  const existingAdmin = await User.findOne({ email: DEFAULT_ADMIN_EMAIL });
  if (existingAdmin) {
    console.log(`Default admin seed skipped; account already exists for ${DEFAULT_ADMIN_EMAIL}`);
    return;
  }

  const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);
  await User.create({
    name: DEFAULT_ADMIN_NAME,
    email: DEFAULT_ADMIN_EMAIL,
    password: hashedPassword,
    role: 'admin',
    membership: 'Elite',
    isVerified: true,
    isGoogleUser: false,
    hasCreatedPassword: true
  });

  console.log(`Default admin account created for ${DEFAULT_ADMIN_EMAIL}`);
};

seedDefaultAdmin()
  .catch((error) => {
    console.error('Default admin seed failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
