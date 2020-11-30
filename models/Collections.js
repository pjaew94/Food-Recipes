const mongoose = require('mongoose');


const ColletionsSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: "users"
    },
    isPrivate: {
        type: Boolean,
        required: true
    },
    collectionName: {
        type: String,
        required: true
    },
    collectionItems: [{
      
    }]
})

module.exports = Collections = mongoose.model('collections' , ColletionsSchema)