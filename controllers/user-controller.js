const { User } = require('../models');

const userController = {
  // get all Users
  getAllUsers(req, res) {
    User.find({})
      .populate({ // populate with thoughts
        path: 'thoughts',
        select: '-__v'
      }) 
      .select('-__v') // removes __v from query
      .sort({ _id: -1 }) // descending order
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // get one User by id
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate({ // populate with thoughts
        path: 'thought',
        select: '-__v'
      }) 
      .select('-__v') // removes __v from query
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No User found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // creates a user
  createUser({ body }, res) {
    User.create(body)
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.status(400).json(err));
  },

  // update User by id
  updateUser({ params, body }, res) { // returns the updated user data and uses validators in schema
    User.findOneAndUpdate({ _id: params.id }, body, { new: true,  runValidators: true})
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No User found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },

  // delete User by id
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No User found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.status(400).json(err));
  },

  // add a friend to a user's friends list
  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $push: { friends: params.friendId } }, // adds user to friends array of user with userId
      { new: true, runValidators: true }
    )
    .select('-__v')
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No User found with this id!' });
            return;
        }
        res.json({ message: "User added to friends list!", dbUserData });
    })
    .catch(err => res.sendStatus(400).json(err));
  },

  // delete a friend from a user's friends list
  removeFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } }, // removes user from friends array of user with userId
      { new: true, runValidators: true }
    )
    .select('-__v')
    .then(dbUserData => {
        if (!dbUserData) {
            return res.sendStatus(404).json({ message: 'No User found with this id!' });
        }
        res.json({ message: "User unfriended", dbUserData });
    })
    .catch(err => res.sendStatus(400).json(err));
  }
}

module.exports = userController;