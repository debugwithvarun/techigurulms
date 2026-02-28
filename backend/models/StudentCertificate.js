const mongoose = require('mongoose');

// Tracks student-uploaded certificates for external certificate programs
const studentCertificateSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    certificateProgram: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Certificate',
        required: true
    },
    uploadUrl: {
        type: String,
        required: [true, 'Please provide the uploaded certificate file URL']
    },
    fileName: {
        type: String,
        default: ''
    },
    fileType: {
        type: String,
        enum: ['image', 'pdf'],
        default: 'image'
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    pointsAwarded: {
        type: Number,
        default: 0
    },
    adminNote: {
        type: String,
        default: ''
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedAt: Date,
}, {
    timestamps: true
});

// One upload per student per certificate program
studentCertificateSchema.index({ student: 1, certificateProgram: 1 }, { unique: true });

module.exports = mongoose.model('StudentCertificate', studentCertificateSchema);
