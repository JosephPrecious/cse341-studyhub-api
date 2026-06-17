const buildUser = (body) => ({
  githubId: body.githubId,
  username: body.username,
  email: body.email,
  profileImage: body.profileImage
});

const validateUser = (user) => {
  if (!user.githubId || !user.username || !user.email || !user.profileImage) {
    return "githubId, username, email, and profileImage are required";
  }

  return null;
};

module.exports = {
  buildUser,
  validateUser
};
