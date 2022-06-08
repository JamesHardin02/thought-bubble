const { Thought, User } = require('../models');

const ThoughtController = {
  // get all thoughts
  getAllThoughts(req, res) {
    Thought.find({})
      .select('-__v') // removes __v from query
      .sort({ _id: -1 }) // descending order
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => {
        console.log(err);
        return res.sendStatus(400).json(err);
      });
  },

  // get one thought by id
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.id })
      .select('-__v') // removes __v from query
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          return res.sendStatus(404).json({ message: 'No thought found with this id!' });
        }
        res.json(dbThoughtData);
      })
      .catch(err => {
        console.log(err);
        return res.sendStatus(400).json(err);
      });
  },

  // add thought to user
  addThought({ params, body }, res) {
    Thought.create(body) // creates thought
      .then(({ _id }) => { // then updates user who made the thought with the thought
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then(dbUserData => {
        if (!dbUserData) {
          return res.sendStatus(404).json({ message: 'No user found with this id!' });
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },

  // add reaction to thought
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate( // finds thought being reacted to 
      { _id: params.thoughtId },
      { $push: { reactions: body } }, // adds body of reaction to thought which gets validated by reaction schema
      { new: true,  runValidators: true }
    )
      .then(dbThoughtData => {
        if (!dbThoughtData) {
          return res.sendStatus(404).json({ message: 'No thought found with this id!' });
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.json(err));
  },

  // remove reaction
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate( // finds thought of reaction being deleted
      { _id: params.thoughtId }, 
      { $pull: { reactions: { reactionId: params.reactionId } } }, // removes reaction from reaction array within the thought
      { new: true }
    )
    .then(dbThoughtData =>{ return res.json(dbThoughtData) })
    .catch(err =>{ return res.json(err) });
  },

  // remove thought
  removeThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId }) //finds thought being deleted
      .then(deletedThought => {
        if (!deletedThought) {
          return res.sendStatus(404).json({ message: 'No thought with this id!' });
        }
        return User.findOneAndUpdate( // finds user who made the thought
          { _id: params.userId },
          { $pull: { thoughts: params.thoughtId } },// removes the thought from the user
          { new: true }
        );
      })
      .then(dbUserData => {
        if (!dbUserData) {
          return res.sendStatus(404).json({ message: 'No user found with this id!' });
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  }
};

module.exports = ThoughtController;