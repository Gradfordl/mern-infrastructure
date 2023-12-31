const { Schema, model } = require("mongoose");
// Add the bcrypt library
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 6;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      minLength: 3,
      required: true,
    },
  },
  {
    timestamps: true,
    // Even though it's hashed - don't serialize the password
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

//pre-save hook (mongoose middleware) hashes password anytime password changes
userSchema.pre('save', async function(next) {
    // 'this' is the user doc
    //if password is NOT modified, return next
    if (!this.isModified('password')) return next();
    // update the password with the computed hash
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    //The SALT_ROUNDS variable determines how much processing time it will take to perform the hash. (npm i bcrypt)
    return next();
  });

module.exports = model("User", userSchema);
