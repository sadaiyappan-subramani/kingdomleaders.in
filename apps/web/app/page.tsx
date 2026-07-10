'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Modal registration state
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registerStep, setRegisterStep] = useState(1);
  const [registerFormData, setRegisterFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    city: '',
    role: 'pastor',
    churchName: '',
    denomination: '',
    foodPreference: 'veg',
    accommodationRequired: 'no',
    expectations: '',
    agreeToTime: 'yes',
  });
  const [registerSubmitted, setRegisterSubmitted] = useState(false);

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; // height of sticky header
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);

    // Support opening the modal via query parameter: /?register=true
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('register') === 'true') {
      setIsRegisterModalOpen(true);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRegisterFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextRegisterStep = () => {
    if (registerStep === 1) {
      if (!registerFormData.name.trim() || !registerFormData.email.trim() || !registerFormData.phone.trim() || !registerFormData.age || !registerFormData.city.trim()) {
        toast.error('Please fill out all required fields in Step 1.');
        return;
      }
    } else if (registerStep === 2) {
      if (!registerFormData.churchName.trim() || !registerFormData.denomination.trim()) {
        toast.error('Please fill out all required fields in Step 2.');
        return;
      }
    }
    if (registerStep < 3) setRegisterStep((s) => s + 1);
  };

  const prevRegisterStep = () => {
    if (registerStep > 1) setRegisterStep((s) => s - 1);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerFormData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success('Registration completed successfully!');
        setRegisterSubmitted(true);
      } else {
        toast.error(result.error || 'Failed to submit registration. Please try again.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
    // Reset states on close
    setRegisterStep(1);
    setRegisterSubmitted(false);
    setRegisterFormData({
      name: '',
      email: '',
      phone: '',
      age: '',
      city: '',
      role: 'pastor',
      churchName: '',
      denomination: '',
      foodPreference: 'veg',
      accommodationRequired: 'no',
      expectations: '',
      agreeToTime: 'yes',
    });
  };

  return (
    <div style={{ position: 'relative', overflowX: 'hidden', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Background glow effects */}
      <div className="glow-bg">
        <div className="glow-orb-1"></div>
        <div className="glow-orb-2"></div>
        <div className="glow-orb-3"></div>
      </div>

      {/* Navigation Header */}
      <nav
        className="glass"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 'var(--header-height)',
          display: 'flex',
          alignItems: 'center',
          zIndex: 50,
          borderBottom: '1px solid var(--border-color)',
          transition: 'background var(--transition-normal), backdrop-filter var(--transition-normal)',
          background: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.4)',
          backdropFilter: scrolled ? 'blur(16px)' : 'blur(4px)',
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img
              src="/logo.png"
              alt="Kingdom Leaders Logo"
              style={{ height: '80px', width: 'auto', display: 'block' }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }} className="desktop-menu">
            <a href="#about" onClick={(e) => handleNavClick(e, 'about')} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color var(--transition-fast)' }}>About</a>
            <a href="#speakers" onClick={(e) => handleNavClick(e, 'speakers')} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color var(--transition-fast)' }}>Speakers</a>
            <a href="#highlights" onClick={(e) => handleNavClick(e, 'highlights')} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color var(--transition-fast)' }}>Highlights</a>
            <a href="#who" onClick={(e) => handleNavClick(e, 'who')} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color var(--transition-fast)' }}>Who Should Attend</a>
            <a href="#organized-by" onClick={(e) => handleNavClick(e, 'organized-by')} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color var(--transition-fast)' }}>Organized By</a>
            <button onClick={() => setIsRegisterModalOpen(true)} className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '13px' }}>Register Now</button>
          </div>

          {/* Mobile Navigation Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              fontSize: '24px',
            }}
            className="mobile-menu-btn"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-nav-overlay fade-in">
          <a href="#about" onClick={(e) => { setMobileMenuOpen(false); handleNavClick(e, 'about'); }} style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: 600, textDecoration: 'none' }}>About</a>
          <a href="#speakers" onClick={(e) => { setMobileMenuOpen(false); handleNavClick(e, 'speakers'); }} style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: 600, textDecoration: 'none' }}>Speakers</a>
          <a href="#highlights" onClick={(e) => { setMobileMenuOpen(false); handleNavClick(e, 'highlights'); }} style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: 600, textDecoration: 'none' }}>Highlights</a>
          <a href="#who" onClick={(e) => { setMobileMenuOpen(false); handleNavClick(e, 'who'); }} style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: 600, textDecoration: 'none' }}>Who Should Attend</a>
          <a href="#organized-by" onClick={(e) => { setMobileMenuOpen(false); handleNavClick(e, 'organized-by'); }} style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: 600, textDecoration: 'none' }}>Organized By</a>
          <button
            onClick={() => { setMobileMenuOpen(false); setIsRegisterModalOpen(true); }}
            className="btn btn-primary"
            style={{ marginTop: '16px', padding: '12px 32px' }}
          >
            Register Now
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section style={{ paddingTop: '160px', paddingBottom: '80px', position: 'relative', zIndex: 10 }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-block',
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: 'var(--color-secondary)',
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '24px',
              fontFamily: 'var(--font-mono)',
            }}
          >
            ONE-DAY LEADERSHIP CONFERENCE
          </div>

          <h1
            className="gradient-text"
            style={{
              maxWidth: '950px',
              margin: '0 auto 24px auto',
              fontWeight: 900,
              fontSize: 'clamp(2.5rem, 6vw, 4.8rem)',
              lineHeight: 1.1,
            }}
          >
            KINGDOM LEADERS <span className="gradient-text-gold">2026</span>
          </h1>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: 'clamp(16px, 2.2vw, 22px)',
              maxWidth: '800px',
              margin: '0 auto 30px auto',
              lineHeight: 1.6,
              fontWeight: 500,
            }}
          >
            Equipping Leaders. Empowering Churches. Expanding God's Kingdom.
          </p>

          {/* Scripture Block */}
          <div
            style={{
              maxWidth: '600px',
              margin: '0 auto 40px auto',
              background: 'rgba(255, 255, 255, 0.02)',
              borderLeft: '4px solid var(--color-secondary)',
              padding: '16px 24px',
              borderRadius: '0 var(--radius-md) var(--radius-md) 0',
              textAlign: 'left'
            }}
          >
            <p style={{ color: 'var(--text-primary)', fontSize: '15px', fontStyle: 'italic', margin: 0 }}>
              "Whoever wants to become great among you must be your servant."
            </p>
            <p style={{ color: 'var(--color-secondary)', fontSize: '13px', fontWeight: 600, margin: '8px 0 0 0', fontFamily: 'var(--font-mono)' }}>
              – Matthew 20:26
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '80px', flexWrap: 'wrap' }}>
            <button onClick={() => setIsRegisterModalOpen(true)} className="btn btn-gold">
              Register Now
            </button>
            <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="btn btn-secondary">
              Conference Details
            </a>
          </div>

          {/* Quick Info Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
              marginTop: '40px',
            }}
          >
            <div className="glass-card" style={{ textAlign: 'left' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>Date</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Sat, 22 Aug 2026</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Saturday Gathering</p>
            </div>

            <div className="glass-card" style={{ textAlign: 'left' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>Time</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>9:30 AM – 4:00 PM</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Full Day Interactive Session</p>
            </div>

            <div className="glass-card" style={{ textAlign: 'left' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>Capacity</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Limited to 100</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Exclusive Leadership Seats</p>
            </div>

            <div className="glass-card" style={{ textAlign: 'left' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>Hospitality</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Food & Lodging</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Accommodation & Food Provided</p>
            </div>

            <div className="glass-card" style={{ textAlign: 'left' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>Venue</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>Palpanabanouthoor</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>C.S.I. Church</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ padding: '100px 0', borderTop: '1px solid var(--border-color)', position: 'relative', zIndex: 10 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '60px', alignItems: 'center' }}>
            <div>
              <div
                style={{
                  color: 'var(--color-primary)',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-mono)',
                  marginBottom: '16px',
                  letterSpacing: '0.1em',
                }}
              >
                ABOUT THE CONFERENCE
              </div>
              <h2 style={{ fontSize: '32px', marginBottom: '24px', lineHeight: 1.2 }}>
                Inspiring, Equipping, and Connecting Christian Leaders
              </h2>
              <div style={{ width: '60px', height: '4px', background: 'var(--color-secondary)', borderRadius: '2px' }}></div>
            </div>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '20px', lineHeight: 1.7 }}>
                Kingdom Leaders 2026 is a one-day leadership conference dedicated to inspiring, equipping, and connecting Christian leaders for faithful and impactful ministry. This gathering seeks to strengthen pastors, church leaders, youth leaders, Christian Endeavour members, and ministry volunteers through biblical teaching, practical leadership principles, and Christ-centered fellowship.
              </p>
              <p style={{ color: 'var(--text-primary)', fontSize: '16px', fontWeight: 600, lineHeight: 1.7 }}>
                Whether you are serving in your local church, mentoring young people, or leading a ministry team, this conference is designed to encourage you to lead with vision, humility, and Kingdom purpose.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Theme Highlight Banner */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <div className="container">
          <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', letterSpacing: '0.15em' }}>CONFERENCE THEME</span>
          <h2 className="gradient-text-gold" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginTop: '16px', fontWeight: 800 }}>
            Leading with Christ • Serving with Purpose • Impacting the Kingdom
          </h2>
        </div>
      </section>

      {/* Speakers Section */}
      <section id="speakers" style={{ padding: '100px 0', position: 'relative', zIndex: 10 }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div
              style={{
                color: 'var(--color-accent)',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
                marginBottom: '16px',
                letterSpacing: '0.1em',
              }}
            >
              CONFERENCE SPEAKERS
            </div>
            <h2 style={{ fontSize: '36px' }}>Hear From Ministry Mentors</h2>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '40px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {/* Speaker 1 */}
            <div className="glass-card" style={{ flex: '1 1 300px', maxWidth: '450px', textAlign: 'center', padding: '40px 32px' }}>
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                  margin: '0 auto 24px auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '36px',
                  fontWeight: 800,
                  color: 'white',
                  boxShadow: '0 8px 24px rgba(79, 70, 229, 0.2)'
                }}
              >
                CJ
              </div>
              <h3 style={{ fontSize: '24px', color: 'var(--text-primary)', marginBottom: '8px' }}>Dr. Christy Jacob</h3>
              <div style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, marginBottom: '20px' }}>
                LEADERSHIP TRAINER
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
                Leadership Trainer | Ministry Mentor | Inspirational Speaker
              </p>
            </div>

            {/* Speaker 2 */}
            <div className="glass-card" style={{ flex: '1 1 300px', maxWidth: '450px', textAlign: 'center', padding: '40px 32px' }}>
              <div
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent-blue))',
                  margin: '0 auto 24px auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '36px',
                  fontWeight: 800,
                  color: 'white',
                  boxShadow: '0 8px 24px rgba(8, 145, 178, 0.2)'
                }}
              >
                RD
              </div>
              <h3 style={{ fontSize: '24px', color: 'var(--text-primary)', marginBottom: '8px' }}>Dr. Rajesh Duthie</h3>
              <div style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, marginBottom: '20px' }}>
                LEADERSHIP COACH
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
                Bible Teacher | Leadership Coach | Ministry Consultant
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section id="highlights" style={{ padding: '100px 0', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', position: 'relative', zIndex: 10 }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div
              style={{
                color: 'var(--color-primary)',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
                marginBottom: '16px',
                letterSpacing: '0.1em',
              }}
            >
              CONFERENCE HIGHLIGHTS
            </div>
            <h2 style={{ fontSize: '36px' }}>What to Expect</h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
            }}
          >
            {[
              { title: 'Biblical Leadership Principles', desc: 'Grounded strategies based directly on scripture.', image: '/images/biblical_leadership.png' },
              { title: 'Vision Casting for Ministry', desc: 'Learn how to articulate and lead with clear, inspired vision.', image: '/images/vision_casting.png' },
              { title: 'Servant Leadership & Team Building', desc: 'Foster collaborative and humble leadership environments.', image: '/images/servant_leadership.png' },
              { title: 'Mentorship and Discipleship', desc: 'Practical models for training and discipling others.', image: '/images/mentorship.png' },
              { title: 'Youth & Church Ministry Development', desc: 'Strategies for engaging and developing the next generation.', image: '/images/youth_ministry.png' },
              { title: 'Interactive Learning Sessions', desc: 'Participate in hands-on workshops and roundtables.', image: '/images/interactive_sessions.png' },
              { title: 'Networking with Christian Leaders', desc: 'Connect, share ideas, and build strategic partnerships.', image: '/images/networking.png' },
              { title: 'Prayer, Worship & Spiritual Renewal', desc: 'Dedicated times for seeking God and being spiritually refreshed.', image: '/images/prayer_renewal.png' }
            ].map((highlight, index) => (
              <div className="feature-card" key={index}>
                <div className="feature-card-img-container">
                  <img
                    src={highlight.image}
                    alt={highlight.title}
                    className="feature-card-img"
                  />
                </div>
                <div className="feature-card-content">
                  <h3 style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--color-secondary)' }}>✦</span> {highlight.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6 }}>{highlight.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO Should Attend Section */}
      <section id="who" style={{ padding: '100px 0', borderTop: '1px solid var(--border-color)', position: 'relative', zIndex: 10 }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div
              style={{
                color: 'var(--color-secondary)',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
                fontFamily: 'var(--font-mono)',
                marginBottom: '16px',
                letterSpacing: '0.1em',
              }}
            >
              TARGET AUDIENCE
            </div>
            <h2 style={{ fontSize: '36px' }}>Who Should Attend?</h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
            }}
          >
            {[
              { name: 'Pastors & Evangelists', image: '/images/pastors_evangelists.png' },
              { name: 'Church Elders & Coordinators', image: '/images/church_elders.png' },
              { name: 'Christian Endeavour Leaders', image: '/images/ce_leaders.png' },
              { name: 'Youth & Student Leaders', image: '/images/youth_student_leaders.png' },
              { name: 'Sunday School Teachers', image: '/images/sunday_school.png' },
              { name: 'Small Group Facilitators', image: '/images/small_groups.png' },
              { name: 'Ministry Volunteers', image: '/images/ministry_volunteers.png' },
              { name: 'Emerging Christian Leaders', image: '/images/emerging_leaders.png' }
            ].map((role, idx) => (
              <div className="audience-card" key={idx}>
                <div className="audience-card-avatar">
                  <img
                    src={role.image}
                    alt={role.name}
                    className="audience-card-img"
                  />
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>{role.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organized By Section */}
      <section id="organized-by" style={{ padding: '100px 0', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', position: 'relative', zIndex: 10 }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '60px', alignItems: 'center' }}>
            <div>
              <div
                style={{
                  color: 'var(--color-primary)',
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-mono)',
                  marginBottom: '16px',
                  letterSpacing: '0.1em',
                }}
              >
                ORGANIZERS
              </div>
              <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>Christian Endeavour Social Concern Team</h2>
              <h3 style={{ fontSize: '18px', color: 'var(--color-secondary)', marginBottom: '24px' }}>Palpanabanouthoor C.S.I. Church</h3>
              <div style={{ width: '60px', height: '4px', background: 'var(--color-primary)', borderRadius: '2px' }}></div>
            </div>

            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.7, marginBottom: '20px' }}>
                The Christian Endeavour Social Concern Team is committed to equipping believers through leadership development, community engagement, discipleship, and biblical training.
              </p>
              <p style={{ color: 'var(--text-primary)', fontSize: '16px', fontWeight: 600, lineHeight: 1.7 }}>
                Kingdom Leaders 2026 is a strategic initiative to develop servant leaders who will faithfully lead churches, mentor the next generation, and impact society for Christ.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section style={{ padding: '100px 0', borderTop: '1px solid var(--border-color)', position: 'relative', zIndex: 10 }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <div
            style={{
              color: 'var(--color-accent)',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              fontFamily: 'var(--font-mono)',
              marginBottom: '16px',
              letterSpacing: '0.1em',
            }}
          >
            OUR VISION
          </div>
          <h2 style={{ fontSize: '36px', marginBottom: '24px', color: 'var(--text-primary)' }}>To Raise Christ-Centered Leaders</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '18px', lineHeight: 1.8 }}>
            To raise Christ-centered leaders who lead with integrity, serve with humility, disciple the next generation, and advance God's Kingdom in every sphere of society.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: '100px 0',
          background: 'linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
          borderTop: '1px solid var(--border-color)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          zIndex: 10,
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <h2
            className="gradient-text-gold"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              fontWeight: 900,
              marginBottom: '20px',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.1em',
            }}
          >
            100 Leaders
          </h2>
          <h3 style={{ fontSize: '24px', color: 'var(--text-primary)', marginBottom: '32px' }}>Seats Available</h3>

          <div
            className="glass-card"
            style={{
              maxWidth: '720px',
              margin: '0 auto',
              padding: '40px',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              boxShadow: '0 20px 50px -20px rgba(245, 158, 11, 0.1)',
            }}
          >
            <h3 style={{ fontSize: '24px', color: 'var(--text-primary)', marginBottom: '12px' }}>Be Equipped. Be Empowered. Be a Kingdom Leader.</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '24px' }}>
              Seats are limited to only 100 leaders. Early registration is highly recommended to secure your participation in this exclusive leadership gathering. Also, food and accommodation are provided for all registered participants.
            </p>
            <button onClick={() => setIsRegisterModalOpen(true)} className="btn btn-gold" style={{ width: '220px' }}>
              Register Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: '60px 0 30px 0',
          backgroundColor: 'var(--bg-tertiary)',
          borderTop: '1px solid var(--border-color)',
          color: 'var(--text-secondary)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '40px',
              marginBottom: '40px',
            }}
          >
            {/* Branding Column */}
            <div>
              <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', marginBottom: '16px' }}>
                <img
                  src="/logo.png"
                  alt="Kingdom Leaders Logo"
                  style={{ height: '56px', width: 'auto', display: 'block' }}
                />
              </Link>
              <p style={{ fontSize: '13px', lineHeight: 1.6 }}>
                Dedicated to inspiring, equipping, and connecting Christian leaders for faithful and impactful ministry.
              </p>
            </div>

            {/* Event Details Column */}
            <div>
              <h4 style={{ color: 'var(--text-primary)', fontSize: '14px', marginBottom: '16px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Event Details</h4>
              <p style={{ fontSize: '13px', marginBottom: '10px' }}>
                📅 Saturday, 22 August 2026
              </p>
              <p style={{ fontSize: '13px', marginBottom: '10px' }}>
                🕘 9:30 AM – 4:00 PM
              </p>
              <p style={{ fontSize: '13px' }}>
                📍 Palpanabanouthoor C.S.I. Church
              </p>
            </div>

            {/* Organized By Column */}
            <div>
              <h4 style={{ color: 'var(--text-primary)', fontSize: '14px', marginBottom: '16px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Organized By</h4>
              <p style={{ fontSize: '13px', marginBottom: '10px' }}>
                Christian Endeavour Social Concern Team
              </p>
              <p style={{ fontSize: '13px' }}>
                Palpanabanouthoor C.S.I. Church
              </p>
            </div>

            {/* Navigation Column */}
            <div>
              <h4 style={{ color: 'var(--text-primary)', fontSize: '14px', marginBottom: '16px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Links</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><a href="#about" onClick={(e) => handleNavClick(e, 'about')} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>About</a></li>
                <li><a href="#speakers" onClick={(e) => handleNavClick(e, 'speakers')} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Speakers</a></li>
                <li><a href="#highlights" onClick={(e) => handleNavClick(e, 'highlights')} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Highlights</a></li>
                <li>
                  <button
                    onClick={() => setIsRegisterModalOpen(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-secondary)',
                      textDecoration: 'none',
                      padding: 0,
                      font: 'inherit',
                      textAlign: 'left'
                    }}
                  >
                    Register Now
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div
            style={{
              borderTop: '1px solid var(--border-color)',
              paddingTop: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              fontSize: '12px',
            }}
          >
            <p>© 2026 Kingdom Leaders. All Rights Reserved.</p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Link href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Terms & Conditions</Link>
              <span>|</span>
              <Link href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Privacy Policy</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Registration Modal Overlay */}
      {isRegisterModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
          onClick={closeRegisterModal}
          className="fade-in"
        >
          {/* Modal Card */}
          <div
            style={{
              width: '100%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-xl)',
              padding: '32px',
            }}
            onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking card itself
          >
            {/* Close Button */}
            <button
              onClick={closeRegisterModal}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(15, 23, 42, 0.05)',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-primary)',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'background var(--transition-fast)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(15, 23, 42, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(15, 23, 42, 0.05)'}
            >
              ✕
            </button>

            {registerSubmitted ? (
              /* Success Screen */
              <div className="fade-in" style={{ textAlign: 'center', padding: '40px 10px' }}>
                <div style={{ fontSize: '56px', marginBottom: '20px' }}>🛡️</div>
                <h2 className="gradient-text-gold" style={{ fontSize: '28px', marginBottom: '12px' }}>Registration Complete!</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
                  Thank you, <strong>{registerFormData.name}</strong>, for registering for the Kingdom Leaders 2026 Conference. We will send updates to <strong>{registerFormData.email}</strong> or <strong>{registerFormData.phone}</strong> as the event date approaches.
                </p>
                <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: '32px', textAlign: 'left' }}>
                  <h4 style={{ color: 'var(--text-primary)', marginBottom: '8px', fontSize: '14px' }}>Details Summary:</h4>
                  <p style={{ fontSize: '12px', margin: '4px 0' }}><span style={{ color: 'var(--text-muted)' }}>Date:</span> Saturday, 22 August 2026</p>
                  <p style={{ fontSize: '12px', margin: '4px 0' }}><span style={{ color: 'var(--text-muted)' }}>Time:</span> 9:30 AM – 4:00 PM</p>
                  <p style={{ fontSize: '12px', margin: '4px 0' }}><span style={{ color: 'var(--text-muted)' }}>Venue:</span> Palpanabanouthoor C.S.I. Church</p>
                  <p style={{ fontSize: '12px', margin: '4px 0' }}><span style={{ color: 'var(--text-muted)' }}>Lunch:</span> {registerFormData.foodPreference.toUpperCase()}</p>
                  <p style={{ fontSize: '12px', margin: '4px 0' }}><span style={{ color: 'var(--text-muted)' }}>Accommodation:</span> {registerFormData.accommodationRequired === 'yes' ? 'REQUIRED' : 'NOT REQUIRED'}</p>
                </div>
                <button onClick={closeRegisterModal} className="btn btn-primary">
                  Close Window
                </button>
              </div>
            ) : (
              /* Multi-step Form */
              <div className="fade-in">

                {/* Header & Steps Indicator */}
                <div style={{ marginBottom: '32px', paddingRight: '24px' }}>
                  <span style={{ color: 'var(--color-secondary)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
                    REGISTRATION PORTAL
                  </span>
                  <h2 style={{ fontSize: '24px', color: 'var(--text-primary)', marginTop: '6px', marginBottom: '20px' }}>
                    Register for Kingdom Leaders
                  </h2>

                  {/* Progress Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {[1, 2, 3].map((s) => (
                      <React.Fragment key={s}>
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: registerStep >= s ? 'var(--color-secondary)' : 'var(--bg-tertiary)',
                            color: registerStep >= s ? '#0b0f19' : 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: 700,
                            fontFamily: 'var(--font-mono)',
                            border: registerStep === s ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                          }}
                        >
                          {s}
                        </div>
                        {s < 3 && (
                          <div
                            style={{
                              flex: 1,
                              height: '2px',
                              background: registerStep > s ? 'var(--color-secondary)' : 'var(--border-color)',
                            }}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Form Element */}
                <form onSubmit={handleRegisterSubmit}>

                  {/* Step 1: Personal Info */}
                  {registerStep === 1 && (
                    <div className="fade-in">
                      <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                        Step 1: Personal Details
                      </h3>

                      <div className="form-group">
                        <label className="form-label" htmlFor="modal-name">Full Name</label>
                        <input
                          type="text"
                          id="modal-name"
                          name="name"
                          required
                          className="form-input"
                          placeholder="John Doe"
                          value={registerFormData.name}
                          onChange={handleRegisterInputChange}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="modal-email">Email Address</label>
                        <input
                          type="email"
                          id="modal-email"
                          name="email"
                          required
                          className="form-input"
                          placeholder="john@example.com"
                          value={registerFormData.email}
                          onChange={handleRegisterInputChange}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                          <label className="form-label" htmlFor="modal-phone">Phone Number</label>
                          <input
                            type="tel"
                            id="modal-phone"
                            name="phone"
                            required
                            className="form-input"
                            placeholder="+91 XXXXX XXXXX"
                            value={registerFormData.phone}
                            onChange={handleRegisterInputChange}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label" htmlFor="modal-age">Age</label>
                          <input
                            type="number"
                            id="modal-age"
                            name="age"
                            required
                            min="15"
                            max="100"
                            className="form-input"
                            placeholder="30"
                            value={registerFormData.age}
                            onChange={handleRegisterInputChange}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="modal-city">City & State</label>
                        <input
                          type="text"
                          id="modal-city"
                          name="city"
                          required
                          className="form-input"
                          placeholder="Nagercoil, Tamil Nadu"
                          value={registerFormData.city}
                          onChange={handleRegisterInputChange}
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 2: Church/Ministry */}
                  {registerStep === 2 && (
                    <div className="fade-in">
                      <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                        Step 2: Church & Ministry Info
                      </h3>

                      <div className="form-group">
                        <label className="form-label" htmlFor="modal-role">Ministry Role</label>
                        <select
                          id="modal-role"
                          name="role"
                          className="form-input"
                          value={registerFormData.role}
                          onChange={handleRegisterInputChange}
                        >
                          <option value="pastor">Pastor / Evangelist</option>
                          <option value="elder">Church Elder / Coordinator</option>
                          <option value="ce-leader">Christian Endeavour Leader</option>
                          <option value="youth-leader">Youth / Student Leader</option>
                          <option value="sunday-school">Sunday School Teacher</option>
                          <option value="small-group">Small Group Facilitator</option>
                          <option value="volunteer">Ministry Volunteer</option>
                          <option value="emerging-leader">Emerging Christian Leader</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="modal-churchName">Church Name</label>
                        <input
                          type="text"
                          id="modal-churchName"
                          name="churchName"
                          required
                          className="form-input"
                          placeholder="Palpanabanouthoor C.S.I. Church"
                          value={registerFormData.churchName}
                          onChange={handleRegisterInputChange}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="modal-denomination">Denomination / Affiliation</label>
                        <input
                          type="text"
                          id="modal-denomination"
                          name="denomination"
                          required
                          className="form-input"
                          placeholder="e.g. C.S.I. (Church of South India)"
                          value={registerFormData.denomination}
                          onChange={handleRegisterInputChange}
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 3: Preference & Expectations */}
                  {registerStep === 3 && (
                    <div className="fade-in">
                      <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                        Step 3: Preference & Expectations
                      </h3>

                      <div className="form-group">
                        <label className="form-label" htmlFor="modal-foodPreference">Lunch Preference</label>
                        <select
                          id="modal-foodPreference"
                          name="foodPreference"
                          className="form-input"
                          value={registerFormData.foodPreference}
                          onChange={handleRegisterInputChange}
                        >
                          <option value="veg">Vegetarian</option>
                          <option value="non-veg">Non-Vegetarian</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="modal-accommodationRequired">Accommodation Required?</label>
                        <select
                          id="modal-accommodationRequired"
                          name="accommodationRequired"
                          className="form-input"
                          value={registerFormData.accommodationRequired}
                          onChange={handleRegisterInputChange}
                        >
                          <option value="no">No, I do not need accommodation.</option>
                          <option value="yes">Yes, I require accommodation.</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="modal-expectations">What do you hope to learn or experience?</label>
                        <textarea
                          id="modal-expectations"
                          name="expectations"
                          required
                          rows={4}
                          className="form-input"
                          placeholder="Tell us your expectations..."
                          value={registerFormData.expectations}
                          onChange={handleRegisterInputChange}
                          style={{ resize: 'vertical' }}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label" htmlFor="modal-agreeToTime">Can you commit to attending from 9:30 AM to 4:00 PM?</label>
                        <select
                          id="modal-agreeToTime"
                          name="agreeToTime"
                          className="form-input"
                          value={registerFormData.agreeToTime}
                          onChange={handleRegisterInputChange}
                        >
                          <option value="yes">Yes, I will attend the full duration.</option>
                          <option value="no">No, I can only attend part of it.</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                    {registerStep > 1 ? (
                      <button type="button" onClick={prevRegisterStep} className="btn btn-secondary" style={{ padding: '8px 20px', fontSize: '13px' }}>
                        Previous
                      </button>
                    ) : (
                      <div />
                    )}

                    {registerStep < 3 ? (
                      <button type="button" onClick={nextRegisterStep} className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '13px' }}>
                        Next Step
                      </button>
                    ) : (
                      <button type="submit" disabled={isSubmitting} className="btn btn-gold" style={{ padding: '8px 20px', fontSize: '13px', opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                        {isSubmitting ? 'Submitting...' : 'Complete Registration'}
                      </button>
                    )}
                  </div>

                </form>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Inject style tag for simple responsiveness and menu toggling without tailwind */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
