export default function CourseCard({ course, onBook }) {
  return (
    <div className="course-card">
      <img src={course.img} alt={course.title} className="course-card-img" loading="lazy" />
      <div className="course-card-body">
        <span className="course-card-tag">{course.tag}</span>
        <h3 className="course-card-title">{course.title}</h3>
        <p className="course-card-desc">{course.desc}</p>
        <div className="course-card-meta">
          <div className="course-meta-item">
            <span>📅</span> {course.duration}
          </div>
          <div className="course-meta-item">
            <span>🎓</span> {course.lessons}
          </div>
        </div>
        <div className="course-card-footer">
          <div>
            <div className="course-price">{course.price}</div>
            <div className="course-price-label">per person</div>
          </div>
          <button className="course-btn" onClick={() => onBook && onBook(course)}>Enroll Now</button>
        </div>
      </div>
    </div>
  );
}
