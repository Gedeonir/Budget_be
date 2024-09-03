const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  budget: { type: mongoose.Schema.Types.ObjectId, ref: 'Budget' },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  comment: { type: String },
},
{
    timestamps: true,
});

module.exports = mongoose.model('Review', ReviewSchema);
