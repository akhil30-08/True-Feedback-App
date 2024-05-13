import mongoose from 'mongoose';

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

export async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log('DB already connected');
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URL ?? '');

    connection.isConnected = db.connections[0].readyState;

    console.log('Database Connected');
  } catch (error) {
    console.log('database error', error);
    process.exit(1);
  }
}
