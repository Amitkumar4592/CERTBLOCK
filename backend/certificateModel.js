import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  course: { type: String, required: true },
  issuedDate: { type: String, required: true },
  ipfsHash: { type: String, required: true },
  issuer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverEmail: { type: String, required: true },
  verificationCode: { type: String, required: true, unique: true },
  contractCertId: { type: Number },
  txHash: { type: String },
  revoked: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Certificate', certificateSchema);
