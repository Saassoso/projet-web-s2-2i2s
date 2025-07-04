const User = require('../models/user');

exports.addPreference = async (req, res) => {
  const { team } = req.body;
  const user = await User.findById(req.user.id);
  if (!user.preferences.includes(team)) {
    user.preferences.push(team);
    await user.save();
  }
  res.json({ preferences: user.preferences });
};

exports.removePreference = async (req, res) => {
  const { team } = req.body;
  const user = await User.findById(req.user.id);
  user.preferences = user.preferences.filter(t => t !== team);
  await user.save();
  res.json({ preferences: user.preferences });
};
