const buildGroup = (body) => ({
  name: body.name,
  topic: body.topic,
  meetingTime: body.meetingTime,
  members: body.members
});

const validateGroup = (group) => {
  if (
    !group.name ||
    !group.topic ||
    !group.meetingTime ||
    !Array.isArray(group.members) ||
    group.members.length === 0
  ) {
    return "name, topic, meetingTime, and at least one member are required";
  }

  return null;
};

module.exports = {
  buildGroup,
  validateGroup
};
