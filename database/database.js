const mongoose = require('mongoose')

// External File 
//Functions (Connection)
// Make a unique function name
// Export 

const connectDatabase = () => {
    mongoose.connect(process.env.MONGODB_CLOUD).then(() => {
        console.log('Database Connected!')
    })
}

// Exporting the function
module.exports = connectDatabase