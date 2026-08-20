import { courses } from '../data/courses.js';

export function CourseGrid() {
  return (
    <section className="section" id="courses">
      <div className="sectionHeader">
        <span>Courses</span>
        <h2>Choose your exam</h2>
      </div>

      <div className="courseGrid">
        {courses.map((course) => (
          <article className="courseCard" key={course.title}>
            <img src={course.image} alt={course.title} />
            <div>
              <small>{course.category}</small>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
