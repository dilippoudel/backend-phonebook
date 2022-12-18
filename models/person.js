const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

console.log('database is connecting')
mongoose.set('strictQuery', true)

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected to MongoDB')
  })
  .catch((err) => console.log('error is: ', err.message))
const contactsSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    minLength: 8,
    type: String,
    validate: {
      validator: function (number) {
        let splittedNumbers = number.split('-')
        if (splittedNumbers.length > 0) {
          if (
            splittedNumbers[0].length == 2 ||
            splittedNumbers[0].length == 3
          ) {
            return true
          }
        }
        return false
      },
      message: 'Number should be 020-122222 or 09-0220200 format or 040222222',
    },
  },
})
contactsSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})
module.exports = mongoose.model('Contact', contactsSchema)
