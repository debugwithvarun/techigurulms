import Hero          from './Hero';
import Instructors   from './Instructor';
import Blog          from './Blog';
import Learning      from './Learning';
import Features      from './Features';
import CourseSection from './CourseSection';
import CursorGlow from './Cursorglow';


const Home = () => (
  <main style={{ cursor: 'none' }}>
    {/* Single global cursor canvas — covers entire page */}
    <CursorGlow />

    <Hero />
    <Learning />
    <Features />
    <CourseSection />
    <Instructors />
    <Blog />
  </main>
);

export default Home;