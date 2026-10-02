import mongoose from 'mongoose';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri && uri.trim() !== '') {
    try {
      console.log(`📡 Connecting to MongoDB at ${uri.split('@').pop()}...`);
      const conn = await mongoose.connect(uri);
      console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
      return;
    } catch (err) {
      console.warn(`⚠️ Could not connect to configured MONGODB_URI: ${err.message}`);
      console.log('🔄 Attempting fallback to in-memory MongoDB instance for local testing...');
    }
  }

  // Fallback to in-memory MongoDB instance so the app runs immediately without external configuration
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongoMemoryServer = await MongoMemoryServer.create();
    const memoryUri = mongoMemoryServer.getUri();
    const conn = await mongoose.connect(memoryUri);
    console.log(`✅ In-Memory MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    console.log(`💡 Note: Running with auto-managed local MongoDB. To connect to MongoDB Atlas or local MongoDB, set MONGODB_URI in backend/.env`);
  } catch (memErr) {
    console.error(`❌ Failed to start in-memory MongoDB: ${memErr.message}`);
    throw memErr;
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
    }
    console.log('🔌 MongoDB connection closed');
  } catch (err) {
    console.error('Error during disconnect:', err.message);
  }
};
