import Highlight from "../components/core/HomePage/Highlight";
import aboutus1 from "../assets/Images/aboutus1.webp";
import aboutus2 from "../assets/Images/aboutus2.webp";
import aboutus3 from "../assets/Images/aboutus3.webp";
import Quote from "../components/core/About/Quote";
import FoundingStory from "../assets/Images/FoundingStory.png";
import Stats from "../components/core/About/Stats"
import LearningGrid from "../components/core/About/LearningGrid";
import ContactForms from "../components/core/About/ContactForms";


const AboutPage = () => {
  return (
    <div className="text-white">
      {/* Section 1  */}
      <section>
        <div>
          <header className="text-white ">
            Driving Innovation in Online Education for a
            <Highlight text="Brighter Future"></Highlight>
            <p>
              Studynotion is at the forefront of driving innovation in online
              education. We're passionate about creating a brighter future by
              offering cutting-edge courses, leveraging emerging technologies,
              and nurturing a vibrant learning community.
            </p>
          </header>
          <div className="flex gap-x-4 justify-center w-auto">
            <img src={aboutus1} alt="aboutus1" />
            <img src={aboutus2} alt="aboutus2" />
            <img src={aboutus3} alt="aboutus3" />
          </div>
        </div>
      </section>

      {/* section 2 */}
      <section>
        <Quote></Quote>
      </section>

      {/* section 3 */}
      <section className="text-white flex-col">
        {/* div for founding story */}
        <div className="flex flex-row">
          {/* left part theory */}
          <div>
            <h1>Our Founding Story </h1>
            <p>
              Our e-learning platform was born out of a shared vision and
              passion for transforming education. It all began with a group of
              educators, technologists, and lifelong learners who recognized the
              need for accessible, flexible, and high-quality learning
              opportunities in a rapidly evolving digital world.
            </p>
            <p>
              As experienced educators ourselves, we witnessed firsthand the
              limitations and challenges of traditional education systems. We
              believed that education should not be confined to the walls of a
              classroom or restricted by geographical boundaries. We envisioned
              a platform that could bridge these gaps and empower individuals
              from all walks of life to unlock their full potential.
            </p>
          </div>

          {/* right part img */}
          <div>
            <img src={FoundingStory} alt="FoundingStory" />
          </div>
        </div>

        {/* div for our vision & mission */}
        <div className="flex flex-row">
          {/* left part our vision */}
          <div>
            <h1>Our Vision</h1>
            <p>
              With this vision in mind, we set out on a journey to create an
              e-learning platform that would revolutionize the way people learn.
              Our team of dedicated experts worked tirelessly to develop a
              robust and intuitive platform that combines cutting-edge
              technology with engaging content, fostering a dynamic and
              interactive learning experience.
            </p>
          </div>

          {/* right part our mission */}
          <div>
            <h1>Our Mission</h1>
            <p>
              our mission goes beyond just delivering courses online. We wanted
              to create a vibrant community of learners, where individuals can
              connect, collaborate, and learn from one another. We believe that
              knowledge thrives in an environment of sharing and dialogue, and
              we foster this spirit of collaboration through forums, live
              sessions, and networking opportunities.
            </p>
          </div>
        </div>
      </section>
 
       {/* section 4  */}
       <section >
         <Stats></Stats>
       </section>

       {/* section 5 */}
       <section>
        <LearningGrid className="mx-auto flex flex-col items-center justify-between gap-5" ></LearningGrid>
        <ContactForms></ContactForms>
       </section>

    </div>
  );
};

export default AboutPage;
