import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Footer from '../components/Footer';
import './Home.css';

import { Container, Row, Col, Button, Card, Form } from 'react-bootstrap';

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleApplyClick = () => {
    navigate(user ? '/loans' : '/login');
  };

  return (
    <div className="home-wrapper">
      {/* Hero Section */}
      <section className="hero-section d-flex align-items-center justify-content-center text-center text-white">
        <Container>
          <h1 className="hero-title mb-3">Credit Bureau Management System</h1>
          <p className="hero-subtitle mb-4">Access. Apply. Analyze. All in one platform.</p>
          <div className="hero-btn-group">
           
            <Button variant="success" size="lg" className="hero-apply-btn" onClick={handleApplyClick}>
              Get Started
            </Button>
          </div>
        </Container>
      </section>

      {/* Features */}
      <section className="features-section py-5">
        <Container>
          <h2 className="section-title text-center mb-5">Why Choose Us</h2>
          <Row className="g-4">
            {[
              {
                title: 'Secure & Encrypted',
                desc: 'We use industry-leading encryption to protect your data and privacy.',
                icon: '🔒',
              },
              {
                title: '24/7 Credit Reports',
                desc: 'Access your credit reports and loan history anytime you want.',
                icon: '📄',
              },
              {
                title: 'Real-Time Updates',
                desc: 'Get instant notifications on loan status and credit changes.',
                icon: '⚡',
              },
            ].map((item, idx) => (
              <Col key={idx} md={4} sm={6}>
                <Card className="feature-card h-100 shadow-sm p-4 text-center">
                  <div className="feature-icon mb-3">{item.icon}</div>
                  <Card.Title className="feature-title mb-3">{item.title}</Card.Title>
                  <Card.Text className="feature-desc">{item.desc}</Card.Text>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* How It Works */}
      <section className="how-section">
        <h2 className="section-title">How It Works</h2>
        <div className="step-grid">
          {[
            ['1', 'Register', 'Create your account using official credentials.'],
            ['2', 'Verify', 'Upload required documents for approval.'],
            ['3', 'Monitor', 'Track credit score, payments, and status in real-time.'],
          ].map(([step, title, desc]) => (
            <div key={step} className="step-card">
              <div className="step-number">{step}</div>
              <div className="step-title">{title}</div>
              <div className="step-desc">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About Us */}
      <section className="about-section py-5 bg-light">
        <Container>
          <h2 className="section-title text-center mb-4">About Us</h2>
          <p className="text-center px-4">
            Our Credit Bureau Management System was designed to bring transparency and efficiency to the loan and credit reporting process. 
            We empower borrowers with real-time access to credit information and give financial institutions accurate tools for assessing creditworthiness.
          </p>
        </Container>
      </section>

      {/* Contact / Query Section */}
      <section className="query-section py-5">
        <Container>
          <h2 className="section-title text-center mb-4">Have Questions?</h2>
          <Row className="justify-content-center">
            <Col md={8}>
              <Form className="query-form p-4 shadow-sm bg-white rounded">
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" placeholder="Your Name" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Your Email" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Message</Form.Label>
                  <Form.Control as="textarea" rows={4} placeholder="Your Message" />
                </Form.Group>
                <Button variant="primary" type="submit">Submit Query</Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA */}
      <section className="cta-section text-center text-white py-5">
        <Container>
          <h2 className="cta-title mb-3">Start Building Your Financial Future Today</h2>
          <p className="cta-desc mb-4">Join thousands of users who trust us for transparency and financial empowerment.</p>
          <Button variant="light" size="lg" onClick={handleApplyClick} className="cta-btn">
            {user ? 'Go to Dashboard' : 'Login to Get Started'}
          </Button>
        </Container>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
