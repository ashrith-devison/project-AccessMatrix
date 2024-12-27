import mongoose,{Schema} from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    employeeId:{
        type: String,
        required: true,
        unique: true
    },
    employeeName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: [true,'email is required'],
        unique: true
    },
    password:{
        type: String,
        required: [true,'password is required'],

    },
    refreshToken:{
        type: String,
    },
    location:{
        type: String,
        required: true,
    },
    role:{
        type: String,
        enum : ['Admin','Security'],
        required : [true,'only Admin and Security roles are allowed'],
    },
},{
    timestamps: true
});

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10)
    next();
})

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {_id : this._id,
        email : this.email,
        employeeId : this.employeeId,
        employeeName : this.employeeName,
        role : this.role,},
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_LIFE
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {_id : this._id,
            email : this.email,
            employeeId : this.employeeId,
            employeeName : this.employeeName,
            role : this.role,
         },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_LIFE
        }
    )
}

export const User = mongoose.model('User',userSchema)