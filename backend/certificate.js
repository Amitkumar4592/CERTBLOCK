import express from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';

import dotenv from 'dotenv';
import Certificate from './certificateModel.js';
import User from './userModel.js';
dotenv.config();

const router = express.Router();

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Auth middleware
const auth = (roles = []) => (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided.' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    if (roles.length && !roles.includes(decoded.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

// Pinata upload helper
async function uploadToPinata(fileBuffer, fileName, mimeType) {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const formData = new FormData();
  formData.append('file', fileBuffer, {
    filename: fileName,
    contentType: mimeType
  });
  const res = await axios.post(url, formData, {
    maxContentLength: Infinity,
    headers: {
      ...formData.getHeaders(),
      pinata_api_key: process.env.PINATA_API_KEY,
      pinata_secret_api_key: process.env.PINATA_API_SECRET,
    },
  });
  return res.data.IpfsHash;
}



// Generate random verification code
function generateCode(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Institution issues certificate
router.post('/issue', auth(['institution']), upload.single('file'), async (req, res) => {
  try {
    const { studentName, course, issuedDate, receiverEmail } = req.body;
    if (!studentName || !course || !issuedDate || !receiverEmail || !req.file) {
      return res.status(400).json({ message: 'All fields and file are required.' });
    }
    // Upload file to Pinata
    const ipfsHash = await uploadToPinata(req.file.buffer, req.file.originalname, req.file.mimetype);
    // Find receiver user by email
    const receiver = await User.findOne({ email: receiverEmail, role: 'receiver' });
    if (!receiver) return res.status(404).json({ message: 'Receiver not found.' });
    // Generate unique verification code
    let verificationCode;
    while (true) {
      verificationCode = generateCode();
      const exists = await Certificate.findOne({ verificationCode });
      if (!exists) break;
    }
    // Save to DB (no blockchain)
    const cert = new Certificate({
      studentName,
      course,
      issuedDate,
      ipfsHash,
      issuer: req.user.userId,
      receiverEmail,
      verificationCode
    });
    await cert.save();
    res.status(201).json({ message: 'Certificate issued.', cert });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// 1. Receiver: View/Download all certificates by email (JWT protected)
router.get('/receiver', auth(['receiver']), async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    const certs = await Certificate.find({ receiverEmail: user.email });
    res.status(200).json({ certificates: certs });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// 2. Verifier: Verify certificate by unique code (public)
router.get('/verify/:code', async (req, res) => {
  try {
    const cert = await Certificate.findOne({ verificationCode: req.params.code });
    if (!cert) return res.status(404).json({ message: 'Certificate not found.' });
    res.status(200).json({ certificate: cert });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// Get all certificates issued by the logged-in institution
router.get('/issued', auth(['institution']), async (req, res) => {
  try {
    const certs = await Certificate.find({ issuer: req.user.userId });
    res.status(200).json({ certificates: certs });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// 1. Revoke a certificate (institution or admin)
router.patch('/:id/revoke', auth(['institution', 'admin']), async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) return res.status(404).json({ message: 'Certificate not found.' });
    // Only issuer institution or admin can revoke
    if (req.user.role !== 'admin' && cert.issuer.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to revoke this certificate.' });
    }
    cert.revoked = true;
    await cert.save();
    res.status(200).json({ message: 'Certificate revoked.', certificate: cert });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// 2. Get all certificates (admin only)
router.get('/all', auth(['admin']), async (req, res) => {
  try {
    const certs = await Certificate.find();
    res.status(200).json({ certificates: certs });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// 3. Get all users (admin only)
router.get('/users', auth(['admin']), async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// 4. Change user role (admin only)
router.patch('/users/:id/role', auth(['admin']), async (req, res) => {
  try {
    const { role } = req.body;
    if (!role || !['institution', 'receiver', 'verifier', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role.' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.status(200).json({ message: 'Role updated.', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// 5. Delete user (admin only)
router.delete('/users/:id', auth(['admin']), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.status(200).json({ message: 'User deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

export default router;
