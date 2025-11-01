import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";


const Home = () => {
  return (
    <div>
      {/* Navbar */}
      <nav>
        <h1>MoneyMate EDU</h1>
        <div>
          <a href="#features">Features</a>
          <a href="#how">How It Works</a>
          <a href="#disclaimer">Disclaimer</a>
          <Link to="/intake" className="cta-button">Get Started</Link>

        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <h2>Learn. Plan. Grow. Your Financial Journey Starts Here.</h2>
        <p>
          MoneyMate EDU helps students understand budgeting, saving, and
          investing through personalized AI-powered tools designed to build
          lifelong financial confidence.
        </p>
        <a href="#intake">Get Started</a>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <h3>What You’ll Find Inside</h3>
        <div className="feature-grid">
          <div className="feature-card">
            <h4>AI Budgeting Tool</h4>
            <p>
              Get a personalized example budget that fits your student lifestyle
              and financial goals.
            </p>
          </div>

          <div className="feature-card">
            <h4>Financial Literacy Chatbot</h4>
            <p>
              Ask any question—APR, investing, saving—and get simple,
              educational explanations.
            </p>
          </div>

          <div className="feature-card">
            <h4>Financial Help Dashboard</h4>
            <p>
              Track your goals, visualize progress, and access
              student-friendly financial resources.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="how">
        <h3>How It Works</h3>
        <div className="how-steps">
          <div className="step">
            <div className="step-number">1</div>
            <h5>Tell Us About You</h5>
            <p>
              Fill a quick intake form with your income, expenses, and goals.
            </p>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <h5>AI Analysis</h5>
            <p>
              Our model builds an example budget and suggests educational next
              steps.
            </p>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <h5>Learn & Improve</h5>
            <p>
              Chat with the bot, explore lessons, and track your progress.
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section id="disclaimer">
        <p>
          <strong>Educational Use Only:</strong> MoneyMate EDU shares general
          financial education. It does <strong>not</strong> provide financial,
          legal, or tax advice. Always consider consulting a qualified
          professional before making financial decisions.
        </p>
      </section>

      {/* Footer */}
      <footer>
        © {new Date().getFullYear()} MoneyMate EDU • Built with ❤️ using OpenAI technology
      </footer>
    </div>
  );
};

export default Home;
