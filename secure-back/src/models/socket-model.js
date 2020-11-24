import mongoose from 'mongoose';

export default mongoose.model(
  'Socket',
  new mongoose.Schema({
    channel: String,
    room: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }),
);
