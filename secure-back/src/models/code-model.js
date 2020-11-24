import mongoose from 'mongoose';

export default mongoose.model(
  'Code',
  new mongoose.Schema({
    code: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }),
);
