const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  message_text: String,
  user_id: mongoose.Schema.Types.ObjectId,
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
