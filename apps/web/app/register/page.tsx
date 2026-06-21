'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    city: '',
    role: 'pastor',
    churchName: '',
    denomination: '',
    foodPreference: 'veg',
    expectations: '',
    agreeToTime: 'yes',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (step < 3) setStep((s) => s + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ position: 'relative', overflowX: 'hidden', minHeight: '100vh', backgroundColor: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      {/* Background glow effects */}
      <div className="glow-bg">
        <div className="glow-orb-1" style={{ top: '-20%' }}></div>
        <div className="glow-orb-2" style={{ top: '30%' }}></div>
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
          background: 'rgba(11, 15, 25, 0.85)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: '10px' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '22px', fontWeight: 800, color: 'white', letterSpacing: '0.05em' }}>
              KINGDOM<span style={{ color: 'var(--color-secondary)' }}>LEADERS</span>
            </span>
          </Link>
          <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingTop: '140px', paddingBottom: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          
          {submitted ? (
            /* Success Screen */
            <div className="glass-card fade-in" style={{ textAlign: 'center', padding: '60px 40px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
              <div style={{ fontSize: '64px', marginBottom: '24px' }}>🛡️</div>
              <h2 className="gradient-text-gold" style={{ fontSize: '32px', marginBottom: '16px' }}>Registration Complete!</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.6, marginBottom: '32px' }}>
                Thank you, <strong>{formData.name}</strong>, for registering for the Kingdom Leaders 2026 Conference. 
                Your registration has been successfully received. We will send updates to <strong>{formData.email}</strong> or <strong>{formData.phone}</strong> as the event date approaches.
              </p>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '20px', marginBottom: '40px', textAlign: 'left' }}>
                <h4 style={{ color: 'white', marginBottom: '12px', fontSize: '15px' }}>Conference Details:</h4>
                <p style={{ fontSize: '13px', margin: '4px 0' }}><span style={{ color: 'var(--text-muted)' }}>Date:</span> Wednesday, 26 August 2026</p>
                <p style={{ fontSize: '13px', margin: '4px 0' }}><span style={{ color: 'var(--text-muted)' }}>Time:</span> 9:30 AM – 4:00 PM</p>
                <p style={{ fontSize: '13px', margin: '4px 0' }}><span style={{ color: 'var(--text-muted)' }}>Venue:</span> Palpanabanouthoor C.S.I. Church</p>
                <p style={{ fontSize: '13px', margin: '4px 0' }}><span style={{ color: 'var(--text-muted)' }}>Lunch Preference:</span> {formData.foodPreference.toUpperCase()}</p>
              </div>
              <Link href="/" className="btn btn-primary">
                Return Home
              </Link>
            </div>
          ) : (
            /* Multi-step Form */
            <div className="glass-card fade-in" style={{ border: '1px solid var(--border-color)' }}>
              
              {/* Header & Steps Indicator */}
              <div style={{ marginBottom: '40px' }}>
                <span style={{ color: 'var(--color-secondary)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                  REGISTRATION PORTAL
                </span>
                <h2 style={{ fontSize: '28px', color: 'white', marginTop: '8px', marginBottom: '24px' }}>
                  Register for Kingdom Leaders
                </h2>
                
                {/* Progress Bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {[1, 2, 3].map((s) => (
                    <React.Fragment key={s}>
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: step >= s ? 'var(--color-secondary)' : 'rgba(255, 255, 255, 0.05)',
                          color: step >= s ? '#0b0f19' : 'var(--text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 700,
                          fontFamily: 'var(--font-mono)',
                          border: step === s ? '2px solid white' : '1px solid var(--border-color)',
                        }}
                      >
                        {s}
                      </div>
                      {s < 3 && (
                        <div
                          style={{
                            flex: 1,
                            height: '2px',
                            background: step > s ? 'var(--color-secondary)' : 'var(--border-color)',
                          }}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Form Element */}
              <form onSubmit={handleSubmit}>
                
                {/* Step 1: Personal Info */}
                {step === 1 && (
                  <div className="fade-in">
                    <h3 style={{ fontSize: '18px', color: 'white', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                      Step 1: Personal Details
                    </h3>
                    
                    <div className="form-group">
                      <label className="form-label" htmlFor="name">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="form-input"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="email">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="form-input"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="phone">Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          required
                          className="form-input"
                          placeholder="+91 XXXXX XXXXX"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="age">Age</label>
                        <input
                          type="number"
                          id="age"
                          name="age"
                          required
                          min="15"
                          max="100"
                          className="form-input"
                          placeholder="30"
                          value={formData.age}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="city">City & State</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        required
                        className="form-input"
                        placeholder="Nagercoil, Tamil Nadu"
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Church/Ministry */}
                {step === 2 && (
                  <div className="fade-in">
                    <h3 style={{ fontSize: '18px', color: 'white', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                      Step 2: Church & Ministry Info
                    </h3>

                    <div className="form-group">
                      <label className="form-label" htmlFor="role">Ministry Role</label>
                      <select
                        id="role"
                        name="role"
                        className="form-input"
                        value={formData.role}
                        onChange={handleInputChange}
                        style={{ appearance: 'none', background: 'rgba(255, 255, 255, 0.03)' }}
                      >
                        <option value="pastor" style={{ background: '#0b0f19' }}>Pastor / Evangelist</option>
                        <option value="elder" style={{ background: '#0b0f19' }}>Church Elder / Coordinator</option>
                        <option value="ce-leader" style={{ background: '#0b0f19' }}>Christian Endeavour Leader</option>
                        <option value="youth-leader" style={{ background: '#0b0f19' }}>Youth / Student Leader</option>
                        <option value="sunday-school" style={{ background: '#0b0f19' }}>Sunday School Teacher</option>
                        <option value="small-group" style={{ background: '#0b0f19' }}>Small Group Facilitator</option>
                        <option value="volunteer" style={{ background: '#0b0f19' }}>Ministry Volunteer</option>
                        <option value="emerging-leader" style={{ background: '#0b0f19' }}>Emerging Christian Leader</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="churchName">Church Name</label>
                      <input
                        type="text"
                        id="churchName"
                        name="churchName"
                        required
                        className="form-input"
                        placeholder="Palpanabanouthoor C.S.I. Church"
                        value={formData.churchName}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="denomination">Denomination / Affiliation</label>
                      <input
                        type="text"
                        id="denomination"
                        name="denomination"
                        required
                        className="form-input"
                        placeholder="e.g. C.S.I. (Church of South India)"
                        value={formData.denomination}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Attendance, Food & Expectations */}
                {step === 3 && (
                  <div className="fade-in">
                    <h3 style={{ fontSize: '18px', color: 'white', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                      Step 3: Preference & Expectations
                    </h3>

                    <div className="form-group">
                      <label className="form-label" htmlFor="foodPreference">Lunch Preference</label>
                      <select
                        id="foodPreference"
                        name="foodPreference"
                        className="form-input"
                        value={formData.foodPreference}
                        onChange={handleInputChange}
                      >
                        <option value="veg">Vegetarian</option>
                        <option value="non-veg">Non-Vegetarian</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="expectations">What do you hope to learn or experience at this conference?</label>
                      <textarea
                        id="expectations"
                        name="expectations"
                        required
                        rows={4}
                        className="form-input"
                        placeholder="Tell us your expectations..."
                        value={formData.expectations}
                        onChange={handleInputChange}
                        style={{ resize: 'vertical' }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="agreeToTime">Can you commit to attending from 9:30 AM to 4:00 PM?</label>
                      <select
                        id="agreeToTime"
                        name="agreeToTime"
                        className="form-input"
                        value={formData.agreeToTime}
                        onChange={handleInputChange}
                      >
                        <option value="yes">Yes, I will attend the full duration.</option>
                        <option value="no">No, I can only attend part of it.</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
                  {step > 1 ? (
                    <button type="button" onClick={prevStep} className="btn btn-secondary">
                      Previous
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < 3 ? (
                    <button type="button" onClick={nextStep} className="btn btn-primary">
                      Next Step
                    </button>
                  ) : (
                    <button type="submit" className="btn btn-gold">
                      Complete Registration
                    </button>
                  )}
                </div>

              </form>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer style={{ padding: '30px 0', backgroundColor: '#070a12', borderTop: '1px solid var(--border-color)', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', zIndex: 10 }}>
        <div className="container">
          <p>© 2026 Kingdom Leaders. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
