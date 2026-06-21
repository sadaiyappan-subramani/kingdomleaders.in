'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          background: scrolled ? 'rgba(11, 15, 25, 0.85)' : 'rgba(11, 15, 25, 0.4)',
          backdropFilter: scrolled ? 'blur(16px)' : 'blur(4px)',
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: '10px' }}>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '22px',
                fontWeight: 800,
                color: 'white',
                letterSpacing: '0.05em',
              }}
            >
              KINGDOM<span style={{ color: 'var(--color-secondary)' }}>LEADERS</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }} className="desktop-menu">
            <Link href="#about" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color var(--transition-fast)' }}>About</Link>
            <Link href="#speakers" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color var(--transition-fast)' }}>Speakers</Link>
            <Link href="#highlights" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color var(--transition-fast)' }}>Highlights</Link>
            <Link href="#who" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color var(--transition-fast)' }}>Who Should Attend</Link>
            <Link href="#organized-by" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color var(--transition-fast)' }}>Organized By</Link>
            <Link href="/register" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '13px' }}>Register Now</Link>
          </div>

          {/* Mobile Navigation Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'white',
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
          <Link href="#about" onClick={() => setMobileMenuOpen(false)} style={{ color: 'white', fontSize: '20px', fontWeight: 600, textDecoration: 'none' }}>About</Link>
          <Link href="#speakers" onClick={() => setMobileMenuOpen(false)} style={{ color: 'white', fontSize: '20px', fontWeight: 600, textDecoration: 'none' }}>Speakers</Link>
          <Link href="#highlights" onClick={() => setMobileMenuOpen(false)} style={{ color: 'white', fontSize: '20px', fontWeight: 600, textDecoration: 'none' }}>Highlights</Link>
          <Link href="#who" onClick={() => setMobileMenuOpen(false)} style={{ color: 'white', fontSize: '20px', fontWeight: 600, textDecoration: 'none' }}>Who Should Attend</Link>
          <Link href="#organized-by" onClick={() => setMobileMenuOpen(false)} style={{ color: 'white', fontSize: '20px', fontWeight: 600, textDecoration: 'none' }}>Organized By</Link>
          <Link
            href="/register"
            onClick={() => setMobileMenuOpen(false)}
            className="btn btn-primary"
            style={{ marginTop: '16px', padding: '12px 32px' }}
          >
            Register Now
          </Link>
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
            <p style={{ color: 'white', fontSize: '15px', fontStyle: 'italic', margin: 0 }}>
              "Whoever wants to become great among you must be your servant."
            </p>
            <p style={{ color: 'var(--color-secondary)', fontSize: '13px', fontWeight: 600, margin: '8px 0 0 0', fontFamily: 'var(--font-mono)' }}>
              – Matthew 20:26
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '80px', flexWrap: 'wrap' }}>
            <Link href="/register" className="btn btn-gold">
              Register Now
            </Link>
            <Link href="#about" className="btn btn-secondary">
              Conference Details
            </Link>
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
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>Wed, 26 Aug 2026</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Wednesday Gathering</p>
            </div>

            <div className="glass-card" style={{ textAlign: 'left' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>Time</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>9:30 AM – 4:00 PM</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Full Day Interactive Session</p>
            </div>

            <div className="glass-card" style={{ textAlign: 'left' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>Capacity</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>Limited to 150</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Exclusive Leadership Seats</p>
            </div>

            <div className="glass-card" style={{ textAlign: 'left' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>Venue</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>Palpanabanouthoor</h3>
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
              <p style={{ color: 'white', fontSize: '16px', fontWeight: 600, lineHeight: 1.7 }}>
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
            <div className="glass-card" style={{ flex: '1 1 350px', maxWidth: '450px', textAlign: 'center', padding: '40px 32px' }}>
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
              <h3 style={{ fontSize: '24px', color: 'white', marginBottom: '8px' }}>Dr. Christy Jacob</h3>
              <div style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, marginBottom: '20px' }}>
                LEADERSHIP TRAINER
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
                Leadership Trainer | Ministry Mentor | Inspirational Speaker
              </p>
            </div>

            {/* Speaker 2 */}
            <div className="glass-card" style={{ flex: '1 1 350px', maxWidth: '450px', textAlign: 'center', padding: '40px 32px' }}>
              <div 
                style={{ 
                  width: '120px', 
                  height: '120px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, var(--color-secondary), var(--color-accent-blue))', 
                  margin: '0 auto 24px auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '36px',
                  fontWeight: 800,
                  color: 'white',
                  boxShadow: '0 8px 24px rgba(245, 158, 11, 0.2)'
                }}
              >
                RD
              </div>
              <h3 style={{ fontSize: '24px', color: 'white', marginBottom: '8px' }}>Dr. Rajesh Duthie</h3>
              <div style={{ color: 'var(--color-accent-blue)', fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, marginBottom: '20px' }}>
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
              { title: 'Biblical Leadership Principles', desc: 'Grounded strategies based directly on scripture.' },
              { title: 'Vision Casting for Ministry', desc: 'Learn how to articulate and lead with clear, inspired vision.' },
              { title: 'Servant Leadership & Team Building', desc: 'Foster collaborative and humble leadership environments.' },
              { title: 'Mentorship and Discipleship', desc: 'Practical models for training and discipling others.' },
              { title: 'Youth & Church Ministry Development', desc: 'Strategies for engaging and developing the next generation.' },
              { title: 'Interactive Learning Sessions', desc: 'Participate in hands-on workshops and roundtables.' },
              { title: 'Networking with Christian Leaders', desc: 'Connect, share ideas, and build strategic partnerships.' },
              { title: 'Prayer, Worship & Spiritual Renewal', desc: 'Dedicated times for seeking God and being spiritually refreshed.' }
            ].map((highlight, index) => (
              <div className="feature-card" key={index}>
                <h3 style={{ fontSize: '18px', marginBottom: '8px', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--color-secondary)' }}>✦</span> {highlight.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6 }}>{highlight.desc}</p>
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
              'Pastors & Evangelists',
              'Church Elders & Coordinators',
              'Christian Endeavour Leaders',
              'Youth & Student Leaders',
              'Sunday School Teachers',
              'Small Group Facilitators',
              'Ministry Volunteers',
              'Emerging Christian Leaders'
            ].map((role, idx) => (
              <div 
                className="glass-card" 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  textAlign: 'center',
                  padding: '24px 16px',
                  border: '1px solid var(--border-color)',
                  height: '100%'
                }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'white' }}>{role}</h3>
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
              <p style={{ color: 'white', fontSize: '16px', fontWeight: 600, lineHeight: 1.7 }}>
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
          <h2 style={{ fontSize: '36px', marginBottom: '24px', color: 'white' }}>To Raise Christ-Centered Leaders</h2>
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
            150 Leaders
          </h2>
          <h3 style={{ fontSize: '24px', color: 'white', marginBottom: '32px' }}>Seats Available</h3>
          
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
            <h3 style={{ fontSize: '24px', color: 'white', marginBottom: '12px' }}>Be Equipped. Be Empowered. Be a Kingdom Leader.</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '24px' }}>
              Seats are limited to only 150 leaders. Early registration is highly recommended to secure your participation in this exclusive leadership gathering.
            </p>
            <Link href="/register" className="btn btn-gold" style={{ width: '220px' }}>
              Register Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: '60px 0 30px 0',
          backgroundColor: '#070a12',
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
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', fontWeight: 800, color: 'white', letterSpacing: '0.05em' }}>
                KINGDOM<span style={{ color: 'var(--color-secondary)' }}>LEADERS</span>
              </span>
              <p style={{ fontSize: '13px', marginTop: '16px', lineHeight: 1.6 }}>
                Dedicated to inspiring, equipping, and connecting Christian leaders for faithful and impactful ministry.
              </p>
            </div>

            {/* Event Details Column */}
            <div>
              <h4 style={{ color: 'white', fontSize: '14px', marginBottom: '16px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Event Details</h4>
              <p style={{ fontSize: '13px', marginBottom: '10px' }}>
                📅 Wednesday, 26 August 2026
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
              <h4 style={{ color: 'white', fontSize: '14px', marginBottom: '16px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Organized By</h4>
              <p style={{ fontSize: '13px', marginBottom: '10px' }}>
                Christian Endeavour Social Concern Team
              </p>
              <p style={{ fontSize: '13px' }}>
                Palpanabanouthoor C.S.I. Church
              </p>
            </div>

            {/* Navigation Column */}
            <div>
              <h4 style={{ color: 'white', fontSize: '14px', marginBottom: '16px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Links</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><Link href="#about" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>About</Link></li>
                <li><Link href="#speakers" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Speakers</Link></li>
                <li><Link href="#highlights" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Highlights</Link></li>
                <li><Link href="/register" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Register Now</Link></li>
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
