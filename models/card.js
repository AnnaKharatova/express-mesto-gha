const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля - 2'],
    maxlength: [30, 'Максимальная длина поля - 30']
  },
  link: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId ,
    ref: 'user',
    required: [true, 'Поле должно быть заполнено'],
  },
  likes: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  },
  createdAt : {
    type: Date,
    default: Date.now
  }
}, { versionKey: false });

module.exports = mongoose.model('card', cardSchema);