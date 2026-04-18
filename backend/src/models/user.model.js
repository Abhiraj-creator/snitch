import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'
const UserSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select:false
    },
    contact: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["buyer", "seller"],
        default: "buyer"
    }
});

UserSchema.pre('save', async function(){
    if(!this.isModified('password')) return ;
    const hash= await bcrypt.hash(this.password,10);
    this.password=hash;
})

UserSchema.methods.comparePassword=async function(password){
    return bcrypt.compare(password,this.password);
}
const UserModel = new mongoose.model("user", UserSchema);

export default UserModel;