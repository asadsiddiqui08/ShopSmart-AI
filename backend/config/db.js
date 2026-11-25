import mongoose from 'mongoose';

let memoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  try {
    if (uri && uri !== 'mongodb://localhost:27017/shopsmart_ai') {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`✅ MongoDB Connected to Atlas/Custom URI: ${conn.connection.host}`);
      return;
    }

    // Try connecting to local MongoDB first
    try {
      const localUri = uri || 'mongodb://127.0.0.1:27017/shopsmart_ai';
      const conn = await mongoose.connect(localUri, {
        serverSelectionTimeoutMS: 2000,
      });
      console.log(`✅ MongoDB Connected to Local Instance: ${conn.connection.host}`);
      return;
    } catch (localErr) {
      console.warn('⚠️ Local MongoDB not reachable. Initializing In-Memory MongoDB Server for development...');
      
      // Fallback to mongodb-memory-server
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      const memUri = memoryServer.getUri();
      
      const conn = await mongoose.connect(memUri);
      console.log(`✅ MongoDB Connected via In-Memory Server: ${conn.connection.host}`);
      console.log('💡 Tip: Set MONGODB_URI in backend/.env to connect to MongoDB Atlas permanently.');
    }
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (memoryServer) {
      await memoryServer.stop();
    }
  } catch (err) {
    console.error('Error disconnecting DB:', err.message);
  }
};
