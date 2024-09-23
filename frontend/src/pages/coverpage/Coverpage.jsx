import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import { useNavigate } from 'react-router-dom';
import TestImage from '../../assets/Test.png'; // Ensure the correct path for your image

const Coverpage = () => {
  const [activeSection, setActiveSection] = useState('home');
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      const scrollPos = window.scrollY;

      sections.forEach((section) => {
        if (scrollPos >= section.offsetTop - 100 && scrollPos < section.offsetTop + section.offsetHeight - 100) {
          setActiveSection(section.getAttribute('id'));
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {/* Fixed Navbar */}
      <nav className="fixed w-full z-50 flex justify-between items-center py-6 px-16 bg-base-200">
        <div className="text-2xl font-bold">Campus Connect</div>
        <ul className="flex gap-6">
          {['home', 'features', 'contact', 'faq'].map((section) => (
            <li key={section}>
              <Link
                to={section}
                smooth={true}
                duration={500}
                spy={true}
                className={`btn btn-outline rounded-full px-4 ${
                  activeSection === section ? 'bg-primary text-white' : 'text-base-content'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={() => navigate('/signup')}
              className="btn btn-outline rounded-full text-base-content"
            >
              Signup
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate('/login')}
              className="btn btn-outline rounded-full text-base-content"
            >
              Login
            </button>
          </li>
        </ul>
      </nav>

      {/* Hero Section with Fade-in Animation */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-between px-16 py-32"
      >
        <div className="max-w-lg animated-fade"> {/* Apply fade-in to text */}
          <h1 className="text-6xl font-bold mb-6 animated-fade">The Ultimate Tailor-Made E-Connect Platform</h1>
          <p className="text-2xl mb-4 animated-fade">
            Campus Connect is your go-to platform to connect, collaborate, and communicate with your peers, faculty, and alumni.
          </p>
        </div>
        <div
          className="ml-8 animated-fade transition-transform duration-1000 ease-in-out transform scale-100 hover:scale-105"
        >
          <img
            src={TestImage}
            alt="Students connecting on laptop"
            className="rounded-lg shadow-lg max-w-xl animated-fade" // Apply fade-in to image
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">Features</h2>
          <p className="mt-2">Discover what makes Campus Connect the best choice for students.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature Cards */}
          <div className="p-6 rounded-lg shadow-lg bg-base-200">
            <h3 className="text-2xl font-semibold mb-4">Connect with Peers</h3>
            <p>Find and connect with friends, classmates, and study groups effortlessly.</p>
          </div>
          <div className="p-6 rounded-lg shadow-lg bg-base-200">
            <h3 className="text-2xl font-semibold mb-4">Collaborate on Projects</h3>
            <p>Join forces with fellow students on projects and assignments seamlessly.</p>
          </div>
          <div className="p-6 rounded-lg shadow-lg bg-base-200">
            <h3 className="text-2xl font-semibold mb-4">Access Resources</h3>
            <p>Get access to a wide range of academic resources, e-books, and research papers.</p>
          </div>
          <div className="p-6 rounded-lg shadow-lg bg-base-200">
            <h3 className="text-2xl font-semibold mb-4">Virtual Events</h3>
            <p>Participate in webinars, workshops, and seminars hosted by industry experts.</p>
          </div>
          <div className="p-6 rounded-lg shadow-lg bg-base-200">
            <h3 className="text-2xl font-semibold mb-4">Job Opportunities</h3>
            <p>Explore internships and job opportunities exclusive to our members.</p>
          </div>
          <div className="p-6 rounded-lg shadow-lg bg-base-200">
            <h3 className="text-2xl font-semibold mb-4">Mentorship</h3>
            <p>Connect with mentors and alumni who can guide you in your academic journey.</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 px-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">Frequently Asked Questions</h2>
        </div>
        <div>
          {/* FAQ Cards */}
          <div className="p-6 rounded-lg shadow-lg bg-base-200 mb-4">
            <h3 className="text-2xl font-semibold mb-4">What is Campus Connect?</h3>
            <p>Campus Connect is an online platform that helps students, alumni, and faculty connect, collaborate, and communicate seamlessly.</p>
          </div>
          <div className="p-6 rounded-lg shadow-lg bg-base-200 mb-4">
            <h3 className="text-2xl font-semibold mb-4">How do I register?</h3>
            <p>Simply click on the "Register Now" button and follow the registration process to create an account.</p>
          </div>
          <div className="p-6 rounded-lg shadow-lg bg-base-200 mb-4">
            <h3 className="text-2xl font-semibold mb-4">Is there a membership fee?</h3>
            <p>No, Campus Connect is free to use for all students, alumni, and faculty.</p>
          </div>
          <div className="p-6 rounded-lg shadow-lg bg-base-200 mb-4">
            <h3 className="text-2xl font-semibold mb-4">How do I reset my password?</h3>
            <p>If you've forgotten your password, click on "Login" and then "Forgot Password" to reset it.</p>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-16 px-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">Contact Us</h2>
        </div>
        <div>
          <form className="p-6 rounded-lg shadow-lg bg-base-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="Your Name" className="input input-bordered w-full p-2 rounded" />
              <input type="email" placeholder="Your Email" className="input input-bordered w-full p-2 rounded" />
            </div>
            <textarea
              placeholder="Your Message"
              className="textarea textarea-bordered w-full p-2 rounded mb-4"
              rows="4"
            ></textarea>
            <button type="submit" className="btn btn-primary w-full">
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-10 bg-base-300">
        <div className="text-center">
          <p className="text-sm">&copy; 2024 Campus Connect. All rights reserved.</p>
          <div className="flex justify-center mt-4 gap-4">
            <a href="#features" className="hover:text-primary">
              Features
            </a>
            <a href="#contact" className="hover:text-primary">
              Contact
            </a>
            <a href="#faq" className="hover:text-primary">
              FAQ
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Coverpage;
