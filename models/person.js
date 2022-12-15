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
  name: String,
  number: String,
})
contactsSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})
module.exports = mongoose.model('Contact', contactsSchema)
