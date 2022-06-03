// import mongoose Schema object and model method
const { Schema, model } = require('mongoose');

// Create User schema
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: 'Username is required!',
      trim: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      //essentially any string that include @ and '.' at the positions they are in the regex
      match: /.+\@.+\..+/, 
      trim: true
    },
    thoughts: [
      { // a user's thoughts which are essentially posts
        type: Schema.Types.ObjectId,
        ref: 'Thought'
      }
    ],
    friends: [
      { // a user's friends list
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
  },
  { // allows schema to accept virtual fields
    toJSON: {
      virtuals: true
    },
    id: false
  }
);

// create virtual field for amount of friends
userSchema.virtual('friendCount').get(function() {
  return this.friends.length
});

// create the User model using the userSchema
const User = model('User', userSchema);

// export the User model
module.exports = User;