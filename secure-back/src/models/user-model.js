import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: String,
  pubKey: String,
  nickName: String,
  offline: Boolean,
},
{
  versionKey: false,
  timestamps: true,
});

userSchema.virtual('unreadMessages', {
  ref: 'Message',
  localField: 'id',
  foreignField: 'to',
  justOne: false,
});

export default mongoose.model('User', userSchema);
