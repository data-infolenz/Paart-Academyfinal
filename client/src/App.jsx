import { CourseGrid } from './components/CourseGrid.jsx';
import { EnquiryForm } from './components/EnquiryForm.jsx';
import './styles.css';

export default function App() {
  return (
    <main>
      <header className="hero">
        <nav>
          <img src="/assets/images/brand/paart-logo.png" alt="PAART Academy" />
          <a href="#enquiry">Enquiry</a>
        </nav>

        <div className="heroContent">
          <span>Admissions open</span>
          <h1>PAART Academy</h1>
          <p>Structured TNPSC and competitive exam preparation with a clean enquiry system.</p>
          <a className="primaryLink" href="#courses">View Courses</a>
        </div>
      </header>

      <CourseGrid />
      <EnquiryForm />
    </main>
  );
}
