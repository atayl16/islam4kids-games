import "../styles/aboutpage.css";

export const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1>About Islam4Kids Games</h1>
        
        <section className="beta-notice">
          <h2>Beta Testing</h2>
          <p>
            Welcome to the Islam4Kids Games beta! We're excited to have you try our 
            educational Islamic games for children.
          </p>
          <p>
            <strong>Please Note:</strong> All games are currently in active development. 
            You may encounter bugs or incomplete features as we continue to improve the experience.
          </p>
        </section>
        
        <section className="feedback-section">
          <h2>We Value Your Feedback</h2>
          <p>
            Your input helps us create better educational resources for Muslim children. 
            Please share your thoughts, suggestions, or report any issues by emailing:
          </p>
          <p className="contact-email">
            <a href="mailto:support@islam4kids.org">support@islam4kids.org</a>
          </p>
        </section>
        
        <section className="goals-section">
          <h2>Our Goals</h2>
          <p>
            Islam4Kids Games aims to make learning about Islamic concepts engaging and fun
            for children of all ages through interactive games and activities.
          </p>
          <ul>
            <li>Create engaging educational content about Islam</li>
            <li>Help children learn Islamic terms, concepts, and history</li>
            <li>Provide a safe, ad-free environment for Muslim children</li>
          </ul>
        </section>
        
        <section className="coming-soon">
          <h2>Coming Soon</h2>
          <p>
            We're working on new games and features! Check back regularly for updates.
          </p>
        </section>
      </div>
    </div>
  );
};
