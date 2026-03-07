import { BottomBar, Slide } from '@lopezleandro03/canvas-engine'
import styles from './ButterflyArtSlide.module.css'

export default function ButterflyArtSlide({ index }) {
  return (
    <Slide index={index} className={styles.butterfly}>
      <div className={`orb ${styles.orb1}`} />
      <div className={`orb ${styles.orb2}`} />

      <svg className={styles.svg} viewBox="0 0 600 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Upper-left wing */}
        <path
          d="M300,250 C260,180 180,80 120,60 C60,40 30,100 60,160 C90,220 220,240 300,250Z"
          fill="url(#greenWing)" stroke="rgba(63,185,80,0.7)" strokeWidth="1.5"
        />
        {/* Upper-right wing */}
        <path
          d="M300,250 C340,180 420,80 480,60 C540,40 570,100 540,160 C510,220 380,240 300,250Z"
          fill="url(#cyanWing)" stroke="rgba(86,212,221,0.7)" strokeWidth="1.5"
        />
        {/* Lower-left wing */}
        <path
          d="M300,260 C260,290 180,360 150,400 C120,440 160,460 200,440 C240,420 280,320 300,260Z"
          fill="url(#purpleWing)" stroke="rgba(110,64,201,0.6)" strokeWidth="1.5"
        />
        {/* Lower-right wing */}
        <path
          d="M300,260 C340,290 420,360 450,400 C480,440 440,460 400,440 C360,420 320,320 300,260Z"
          fill="url(#blueWing)" stroke="rgba(88,166,255,0.6)" strokeWidth="1.5"
        />

        {/* Wing vein details */}
        <path d="M300,250 C270,200 200,120 140,80" stroke="rgba(63,185,80,0.25)" strokeWidth="1" fill="none" />
        <path d="M300,250 C275,210 210,150 130,120" stroke="rgba(63,185,80,0.15)" strokeWidth="1" fill="none" />
        <path d="M300,250 C330,200 400,120 460,80" stroke="rgba(86,212,221,0.25)" strokeWidth="1" fill="none" />
        <path d="M300,250 C325,210 390,150 470,120" stroke="rgba(86,212,221,0.15)" strokeWidth="1" fill="none" />

        {/* Body */}
        <ellipse cx="300" cy="255" rx="5" ry="50" fill="url(#bodyGrad)" />

        {/* Antennae */}
        <path d="M300,210 C290,170 250,120 230,100" stroke="url(#antennaL)" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M300,210 C310,170 350,120 370,100" stroke="url(#antennaR)" strokeWidth="2" strokeLinecap="round" fill="none" />
        <circle cx="230" cy="100" r="4" fill="rgba(63,185,80,0.6)" />
        <circle cx="370" cy="100" r="4" fill="rgba(86,212,221,0.6)" />

        {/* Gradients */}
        <defs>
          <radialGradient id="greenWing" cx="40%" cy="50%">
            <stop offset="0%" stopColor="rgba(63,185,80,0.25)" />
            <stop offset="100%" stopColor="rgba(63,185,80,0.03)" />
          </radialGradient>
          <radialGradient id="cyanWing" cx="60%" cy="50%">
            <stop offset="0%" stopColor="rgba(86,212,221,0.25)" />
            <stop offset="100%" stopColor="rgba(86,212,221,0.03)" />
          </radialGradient>
          <radialGradient id="purpleWing" cx="40%" cy="50%">
            <stop offset="0%" stopColor="rgba(110,64,201,0.2)" />
            <stop offset="100%" stopColor="rgba(110,64,201,0.03)" />
          </radialGradient>
          <radialGradient id="blueWing" cx="60%" cy="50%">
            <stop offset="0%" stopColor="rgba(88,166,255,0.2)" />
            <stop offset="100%" stopColor="rgba(88,166,255,0.03)" />
          </radialGradient>
          <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(63,185,80,0.9)" />
            <stop offset="100%" stopColor="rgba(86,212,221,0.9)" />
          </linearGradient>
          <linearGradient id="antennaL" x1="1" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="rgba(63,185,80,0.6)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <linearGradient id="antennaR" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(86,212,221,0.6)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>

      <BottomBar text="DevEx Keynote" />
    </Slide>
  )
}
