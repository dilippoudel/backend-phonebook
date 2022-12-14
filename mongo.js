const mongoose = require('mongoose')
if (process.env.length < 4) {
  console.log(
    'please provide the password, name and phonenumber as an argument: node mongo.js <your password> name phonenumber',
  )
  process.exit(1)
}
const password = process.argv[2]

const url = `mongodb+srv://dilip123:${password}@cluster0.kjjfsfr.mongodb.net/fsd5?retryWrites=true&w=majority`
mongoose.set('strictQuery', true) // to avaoid the mongoose warnings
const contactSchema = new mongoose.Schema({
  name: String,
  phone_number: Number,
})
const Contact = mongoose.model('Contact', contactSchema)

mongoose
  .connect(url)
  .then((result) => {
    const newContact = new Contact({
      name: process.argv[3],
      phone_number: process.argv[4],
    })
    newContact.save()
  })
  .then((result) => {
    Contact.find({}).then((res) => {
      res.forEach((item) => console.log(item))
      mongoose.connection.close()
    })
  })

  .catch((err) => console.log(err))
