const mongoose = require('mongoose');
module.exports = async (()=>{
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('MongoDB connected!');
    })
    .catch((err)=>{
        console.log('Connection Error',err);
        process.exit(1);
    })
});
