"use client";

import React, { useState, useEffect } from 'react';
import { Activity, Globe, Radio, Tv, Zap, Shield, Eye, Signal, Rss, AlertCircle } from 'lucide-react';

export default function NewsControlRoomVisual() {
  const [tickerOffset, setTickerOffset] = useState(0);
  const [activeFeeds, setActiveFeeds] = useState([
    { id: 'CAM-01', title: 'STUDIO A - MAIN DISPATCH', status: 'LIVE', category: 'POLITICS & WORLD', signal: '99.4%' },
    { id: 'FEED-02', title: 'TOKYO BUREAU SATELLITE', status: 'LIVE', category: 'MARKETS & TECH', signal: '98.1%' },
    { id: 'FEED-03', title: 'LONDON EDITORIAL DESK', status: 'REC', category: 'WORLD NEWS', signal: '100%' },
    { id: 'CAM-04', title: 'NEW YORK STOCK EXCHANGE', status: 'LIVE', category: 'FINANCIAL', signal: '99.9%' },
    { id: 'FEED-05', title: 'CLIMATE MONITORING RADAR', status: 'LIVE', category: 'ENVIRONMENT', signal: '96.5%' },
    { id: 'FEED-06', title: 'AI & INNOVATION LAB', status: 'STANDBY', category: 'SCIENCE', signal: '97.2%' }
  ]);

  // Animated tickers
  const tickers = [
    "BREAKING: GLOBAL TECH INDEX SURGES 3.4% FOLLOWING SEMICONDUCTOR RALLY",
    "DAILY BRIEF EXCLUSIVE: CLIMATE ACCORD SIGNED IN GENEVA BY 45 NATION DELEGATES",
    "LIVE REPORT: FINANCIAL MARKETS OPEN STRONG AS CENTRAL BANK ANNOUNCES RATE STABILITY",
    "CYBERSECURITY ALERT: ENTERPRISE DATA DEFENSES HARDENED ACROSS GLOBAL GRID",
    "SCIENCE DISPATCH: DEEP SPACE TELECOPE DETECTS WATER VAPOR ON EXOPLANET K2-18B"
  ];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#04070d',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '2rem'
    }}>
      {/* Background Grid Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        pointerEvents: 'none'
      }} />

      {/* Top Header Bar of Master Control Room */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.875rem 1.25rem',
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#ef4444',
            boxShadow: '0 0 10px #ef4444',
            animation: 'pulse 1.5s infinite'
          }} />
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', letterSpacing: '1px' }}>
            NEWS MASTER CONTROL MATRIX
          </span>
          <span style={{ fontSize: '0.7rem', background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', padding: '0.2rem 0.6rem', borderRadius: '4px', border: '1px solid rgba(239, 68, 68, 0.4)', fontWeight: 700 }}>
            ON AIR • 6 FEEDS ACTIVE
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.75rem', color: '#94a3b8' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Signal size={14} color="#10b981" /> UPLINK 100%</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Globe size={14} color="#3b82f6" /> UTC 10:36:16</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Shield size={14} color="#eab308" /> ENCRYPTED</span>
        </div>
      </div>

      {/* Grid of Monitors (6 Broadcast Screens) */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(2, 1fr)',
        gap: '1rem',
        margin: '1.5rem 0',
        flex: 1
      }}>
        {activeFeeds.map((feed, idx) => (
          <div key={feed.id} style={{
            background: 'linear-gradient(145deg, #0b1324 0%, #060b17 100%)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            overflow: 'hidden'
          }}>
            {/* Monitor Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Tv size={14} color="#60a5fa" />
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f8fafc' }}>{feed.id}</span>
              </div>
              <span style={{
                fontSize: '0.65rem',
                fontWeight: 800,
                padding: '0.15rem 0.5rem',
                borderRadius: '4px',
                background: feed.status === 'LIVE' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(234, 179, 8, 0.2)',
                color: feed.status === 'LIVE' ? '#f87171' : '#fde047',
                border: `1px solid ${feed.status === 'LIVE' ? '#ef4444' : '#eab308'}`
              }}>
                {feed.status}
              </span>
            </div>

            {/* Monitor Content Area */}
            <div style={{ margin: '0.875rem 0', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '0.825rem', fontWeight: 800, color: '#e2e8f0', marginBottom: '0.25rem' }}>
                {feed.title}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>
                SCOPE: {feed.category}
              </div>

              {/* Simulated Live Audio Waveform Bars */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '24px', marginTop: '0.75rem' }}>
                {[40, 70, 30, 90, 60, 100, 45, 80, 50, 65, 85, 35, 95, 55, 75, 40].map((h, i) => (
                  <div key={i} style={{
                    flex: 1,
                    height: `${(h * (idx + 1) * 17) % 100}%`,
                    background: idx % 2 === 0 ? 'linear-gradient(0deg, #3b82f6 0%, #60a5fa 100%)' : 'linear-gradient(0deg, #c91818 0%, #f87171 100%)',
                    borderRadius: '2px',
                    transition: 'height 0.3s ease'
                  }} />
                ))}
              </div>
            </div>

            {/* Monitor Footer Data */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.675rem', color: '#64748b', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.4rem' }}>
              <span>SIG: {feed.signal}</span>
              <span>RES: 4K 60FPS</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Ticker & Master Branding Bar */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '0.875rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem'
      }}>
        <div style={{
          background: 'var(--brand-red)',
          color: '#fff',
          padding: '0.3rem 0.75rem',
          borderRadius: '6px',
          fontSize: '0.75rem',
          fontWeight: 900,
          letterSpacing: '1px',
          whiteSpace: 'nowrap'
        }}>
          LIVE NEWS TICKER
        </div>

        <div style={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap' }}>
          <div style={{
            display: 'inline-block',
            fontSize: '0.825rem',
            color: '#f1f5f9',
            fontWeight: 600,
            animation: 'marquee 25s linear infinite'
          }}>
            {tickers.join('   •••   ')}
          </div>
        </div>

        <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
          <div style={{ fontFamily: 'var(--font-brand)', fontSize: '0.95rem', fontWeight: 900, color: '#fff', letterSpacing: '0.5px' }}>
            DAILY BRIEF COMMAND CENTER
          </div>
          <div style={{ fontSize: '0.675rem', color: 'var(--brand-gold)', fontWeight: 700, letterSpacing: '1px' }}>
            ARCHITECTURE OF JOURNALISTIC PRECISION
          </div>
        </div>
      </div>

      {/* CSS Keyframe Animations */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.3; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
