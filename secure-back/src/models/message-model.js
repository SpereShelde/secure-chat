import mongoose from 'mongoose';

export default mongoose.model(
  'Message',
  new mongoose.Schema({
    encryptedMessage: String,
    from: String,
    to: String,
    // deleteAfterSeconds: Number,
  },
  {
    timestamps: true,
    versionKey: false,
  }),
);
