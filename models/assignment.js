const buildAssignment = (body) => ({
  title: body.title,
  dueDate: body.dueDate,
  courseId: body.courseId,
  status: body.status,
  priority: body.priority,
  submissionLink: body.submissionLink,
  notes: body.notes
});

const validateAssignment = (assignment) => {
  if (
    !assignment.title ||
    !assignment.dueDate ||
    !assignment.courseId ||
    !assignment.status ||
    !assignment.priority ||
    !assignment.submissionLink ||
    !assignment.notes
  ) {
    return "title, dueDate, courseId, status, priority, submissionLink, and notes are required";
  }

  return null;
};

module.exports = {
  buildAssignment,
  validateAssignment
};
