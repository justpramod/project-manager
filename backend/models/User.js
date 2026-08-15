const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema(
    {
    username: {type: String, required: true, unique: true},
    email : {type:String, required: true, unique: true, lowercase: true},
    password: {type: String, required: true}
    },
    {
        timestamps: true
    }
);
userSchema.pre('save', async function(){
if(this.isModified('password')){
    this.password = await bcrypt.hash(this.password, 10);
}
});
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}
const User = mongoose.model('User', userSchema);

module.exports = User;