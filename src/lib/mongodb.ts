import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

global.mongooseCache = cached;

function getMongoDBUri(): string {
  let uri: string | undefined;

  switch (process.env.NODE_ENV) {
    case "development":
      uri = process.env.MONGODB_URI_DEV;
      break;
    case "production":
      uri = process.env.MONGODB_URI_PROD;
      break;
  }

  if (!uri) {
    throw new Error(
      `Missing MongoDB URI for NODE_ENV="${process.env.NODE_ENV ?? ""}". ` +
        "Set MONGODB_URI_DEV for development or MONGODB_URI_PROD for production.",
    );
  }

  return uri;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  const mongodbUri = getMongoDBUri();

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(mongodbUri, opts)
      .then((mongooseInstance) => mongooseInstance);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectToDatabase;
