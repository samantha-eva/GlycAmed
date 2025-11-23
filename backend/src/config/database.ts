import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/glycamed';
    
    await mongoose.connect(mongoUri);
    
    console.log('✅ MongoDB connecté avec succès sur le port ', process.env.MONGO_URI);
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB déconnecté',process.env.MONGO_URI);
});

mongoose.connection.on('error', (error) => {
  console.error('❌ Erreur MongoDB:', error);
});