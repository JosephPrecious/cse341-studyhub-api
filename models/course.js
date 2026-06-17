const buildCourse = (body) => ({
  courseName: body.courseName,
  instructor: body.instructor,
  semester: body.semester,
  credits: body.credits,
  description: body.description
});

const validateCourse = (course) => {
  if (
    !course.courseName ||
    !course.instructor ||
    !course.semester ||
    course.credits === undefined ||
    course.credits === null ||
    !course.description
  ) {
    return "courseName, instructor, semester, credits, and description are required";
  }

  if (Number.isNaN(Number(course.credits))) {
    return "credits must be a number";
  }

  return null;
};

module.exports = {
  buildCourse,
  validateCourse
};
