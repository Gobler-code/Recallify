import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, BarChart3, ArrowRight, Sparkles } from 'lucide-react';
import logo from '../assets/recallify.png'; // Adjust path based on your folder structure
import './Homepage.css';

export function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Sparkles size={32} />,
      title: "Smart Flashcards",
      description: "AI transforms your notes into intelligent flashcards instantly. Study smarter, not harder.",
      colorClass: "feature-purple-pink"
    },
    {
      icon: <Zap size={32} />,
      title: "Quiz Generation",
      description: "Generate custom quizzes from any content in seconds. Test your knowledge effectively.",
      colorClass: "feature-blue-cyan"
    },
    {
      icon: <BarChart3 size={32} />,
      title: "Study Analytics",
      description: "Track your progress with detailed insights. Know exactly where you stand.",
      colorClass: "feature-indigo-purple"
    }
  ];

  return (
    <div className="home-container">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="bg-blob bg-blob-1"></div>
        <div className="bg-blob bg-blob-2"></div>
      </div>

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo-section">
            <img src={logo} alt="Recallify Logo" className="logo-image" />
          </Link>
          <Link to="/workspace" className="btn-get-started">
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
          <div className="hero-badge">
            <Sparkles size={16} className="badge-icon" />
            <span>AI-Powered Learning Platform</span>
          </div>
          
          <h1 className="hero-title">
            <span className="title-line-1">Study Smarter</span>
            <br />
            <span className="title-line-2">Learn Faster</span>
          </h1>
          
          <p className="hero-description">
            Transform your notes into interactive flashcards and quizzes with the power of AI. 
            Accelerate your learning journey today.
          </p>

          <div className="hero-buttons">
            <Link to="/workspace" className="btn-primary">
              Start Learning Free
              <ArrowRight size={20} className="btn-icon" />
            </Link>
            <button className="btn-secondary">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Floating Workspace Preview */}
        <div className="workspace-preview" style={{ transform: `translateY(${scrollY * 0.2}px)` }}>
          <div className="preview-wrapper">
            <div className="preview-glow"></div>
            <div className="preview-card">
              <div className="preview-controls">
                <div className="control-dot control-red"></div>
                <div className="control-dot control-yellow"></div>
                <div className="control-dot control-green"></div>
              </div>
              <div className="preview-content">
                <div className="preview-line preview-line-1"></div>
                <div className="preview-line preview-line-2"></div>
                <div className="preview-line preview-line-3"></div>
                <div className="preview-grid">
                  <div className="preview-grid-item"></div>
                  <div className="preview-grid-item"></div>
                  <div className="preview-grid-item"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-header">
          <h2 className="features-title">Powerful Features</h2>
          <p className="features-subtitle">Everything you need to master your subjects</p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <Link
              key={index}
              to="/workspace"
              className={`feature-card ${activeFeature === index ? 'feature-card-active' : ''}`}
              onMouseEnter={() => setActiveFeature(index)}
            >
              <div className={`feature-gradient ${feature.colorClass}`}></div>
              
              <div className="feature-content">
                <div className={`feature-icon ${feature.colorClass}`}>
                  {feature.icon}
                </div>
                
                <h3 className="feature-title">{feature.title}</h3>
                
                <p className="feature-description">{feature.description}</p>

                <div className="feature-link">
                  <span>Learn more</span>
                  <ArrowRight size={16} className="feature-arrow" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-wrapper">
          <div className="cta-glow"></div>
          <div className="cta-card">
            <h2 className="cta-title">Ready to Transform Your Learning?</h2>
            <p className="cta-description">
              Join thousands of students who are already studying smarter with Recallify
            </p>
            <Link to="/workspace" className="btn-cta">
              Get Started Now
              <ArrowRight size={24} className="btn-icon" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <Link to="/" className="footer-logo">
            <img src={logo} alt="Recallify Logo" className="footer-logo-image" />
          </Link>
          <div className="footer-copyright">
            © 2025 Recallify. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}