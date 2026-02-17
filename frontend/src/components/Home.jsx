import Hero from './Hero';
import Instructors from './Instructor';
import Blog from './Blog';
import Learning from './Learning';
import Features from './Features';
import CourseSection from './CourseSection';
// Ismein aapne jo CourseCard grid banaya tha wo bhi yahan add hoga

const Home = () => {
  return (
    <main>
      <Hero />
      <Learning/>
      <Features/>
      <CourseSection/>
     <Instructors />
      <Blog />
    </main>
  );
};

export default Home;