// import Schema object, model method, and Types object from mongoose ODM
const { Schema, model, Types } = require('mongoose');
// date format utility makes dates more readable
const dateFormat = require('../utils/dateFormat');

const ReactionSchema = new Schema(
  {
    // set custom id to avoid confusion with parent thought _id
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId()
    },
    reactionBody: {
      type: String,
      required: true,
      trim: true,
    },
    writtenBy: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => dateFormat(createdAtVal)
    }
  },
  { // allows schema to apply getters to data
    toJSON: {
      getters: true
    },
    id: false
  }
);

// Create Thought schema
const ThoughtSchema = new Schema(
  {
    writtenBy: {
      type: String,
      required: true,
      trim: true
    },
    thoughtBody: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => dateFormat(createdAtVal)
    },
    // reactionSchema is used to validate data for a reaction
    reactions: [ReactionSchema]
  },
  { // allows schema to accept virtual fields and apply getters to data
    toJSON: {
      virtuals: true,
      getters: true
    },
    id: false
  }
);

// create virtual field for amount of reactions a thought has
ThoughtSchema.virtual('reactionCount').get(function() {
  return this.reactions.length;
});

// create the Though model using the userSchema
const Thought = model('Thought', ThoughtSchema);

// export the Thought model
module.exports = Thought;