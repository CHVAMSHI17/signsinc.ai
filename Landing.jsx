import { Link } from 'react-router-dom'
import SignPlayer from '../components/SignPlayer.jsx'
import { Icon } from '../components/icons.jsx'
import { ModeCard } from '../components/ui.jsx'
import { VOCABULARY } from '../data/vocabulary.js'

const HERO_SEQUENCE = ['HELLO', 'GOOD MORNING', 'LEARN', 'THANK YOU']

const HOW_STEPS = [
  {
    icon: 'mic',
    title: '1 · Capture',
    text: 'Speech is captured with the browser microphone, or the teacher types the sentence when no microphone is available.',
  },
  {
    icon: 'sparkles',
    title: '2 · Understand',
    text: 'Text is processed into keywords, and multi-word phrases are matched against the sample ISL vocabulary.',
  },
  {
    icon: 'hand',
    title: '3 · Sign',
    text: 'The matched words become an ordered sign sequence that the 3D avatar performs with captions alongside.',
  },
]

const FEATURES = [
  {
    id: 'classroom',
    icon: 'cap',
    title: 'Classroom Accessibility',
    text: 'A teacher’s explanation becomes readable text and a visual ISL demonstration, so deaf and hard-of-hearing students can follow a lesson as it happens.',
    to: '/classroom',
  },
  {
    id: 'communication',
    icon: 'chat',
    title: 'Real-Time Communication',
    text: 'A hearing person speaks or types; the deaf person reads captions and watches the avatar sign the supported words back.',
    to: '/communication',
  },
  {
    id: 'ai',
    icon: 'sparkles',
    title: 'AI-Powered Sign Generation',
    text: 'Text is analysed, supported keywords are identified, and a structured sign sequence is generated and played in order.',
    to: '/ai-generation',
  },
  {
    id: 'learn',
    icon: 'book',
    title: 'Learn & Practise ISL',
    text: 'Greetings, classroom vocabulary, numbers and everyday phrases, each with a meaning, a 3D demonstration and a practice quiz.',
    to: '/learn',
  },
]

export default function Landing() {
  return (
    <div className="landing">
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__copy">
            <span className="pill pill--teal">
              <Icon name="sparkles" size={14} />
              AI accessibility · SDG 4 hackathon prototype
            </span>
            <h1>
              SignSync <span>AI</span>
            </h1>
            <p className="hero__tagline">“Every Voice Deserves to Be Understood.”</p>
            <p className="hero__lead">
              Breaking communication barriers through AI-powered Indian Sign Language and inclusive classroom
              technology.
            </p>
            <div className="cta-row">
              <Link to="/classroom" className="btn btn--primary btn--lg">
                <Icon name="cap" size={18} />
                Start Classroom Mode
              </Link>
              <Link to="/communication" className="btn btn--teal btn--lg">
                <Icon name="chat" size={18} />
                Start Communication Mode
              </Link>
              <a href="#features" className="btn btn--ghost btn--lg">
                Explore Features
                <Icon name="arrow" size={16} />
              </a>
            </div>
            <ul className="hero__stats">
              <li>
                <strong>{VOCABULARY.length}</strong>
                <span>sample signs</span>
              </li>
              <li>
                <strong>3D</strong>
                <span>signing avatar</span>
              </li>
              <li>
                <strong>0</strong>
                <span>paid APIs needed</span>
              </li>
            </ul>
          </div>

          <div className="hero__visual">
            <div className="hero__avatar-card">
              <div className="hero__avatar-top">
                <span className="pill pill--soft">
                  <span className="live-dot" aria-hidden="true" />
                  Live avatar demo
                </span>
                <span className="hero__avatar-note">Sample sign vocabulary</span>
              </div>
              <SignPlayer
                sequence={HERO_SEQUENCE}
                loop
                autoplay
                speed={0.85}
                compact
                allowReset={false}
                captionLabel="Signing now"
              />
              <p className="hero__avatar-foot">
                A friendly 3D avatar performs a demonstration sign sequence. Hands and fingers are the focus — captions
                stay visible for clarity.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="section__statement">
            Whether in a classroom or everyday conversation, SignSync AI helps make communication more accessible by
            transforming speech and text into visual sign-language experiences.
          </p>
          <div className="mode-grid">
            <ModeCard
              to="/classroom"
              icon="cap"
              title="Classroom Mode"
              description="Make classroom teaching accessible through AI-powered sign-language assistance."
              points={['Live speech + typed input', 'Avatar signs the lesson', 'Student questions and announcements']}
              tone="navy"
            />
            <ModeCard
              to="/communication"
              icon="chat"
              title="Communication Mode"
              description="Help hearing and deaf individuals understand each other more easily."
              points={['Speech or text to sign', 'Two-way conversation history', 'Sign-to-text camera demo']}
              tone="teal"
            />
          </div>
        </div>
      </section>

      <section className="section section--tint" id="features">
        <div className="container">
          <div className="section__head">
            <span className="eyebrow">What SignSync AI does</span>
            <h2>Communication, made visual</h2>
            <p>
              A working end-to-end demonstration: spoken words become readable text, supported keywords become a sign
              sequence, and a 3D avatar performs it.
            </p>
          </div>
          <div className="feature-grid">
            {FEATURES.map((feature) => (
              <Link to={feature.to} className="feature-card" key={feature.id}>
                <span className="feature-card__icon">
                  <Icon name={feature.icon} size={22} />
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
                <span className="feature-card__link">
                  Open
                  <Icon name="arrow" size={15} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container how">
          <div className="how__intro">
            <span className="eyebrow">How it works</span>
            <h2>Speech to signs in three transparent steps</h2>
            <p>
              Every stage is visible in the app. Nothing is hidden behind a black box — you can see the recognised
              sentence, the keywords that matched, and the exact sign sequence that was generated.
            </p>
            <Link to="/how-it-works" className="btn btn--secondary">
              See the full processing pipeline
              <Icon name="arrow" size={16} />
            </Link>
          </div>
          <ol className="how__steps">
            {HOW_STEPS.map((step) => (
              <li key={step.title}>
                <span className="how__icon">
                  <Icon name={step.icon} size={22} />
                </span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--navy">
        <div className="container impact">
          <div>
            <span className="eyebrow eyebrow--light">Our social impact</span>
            <h2>Making Education Accessible to Everyone.</h2>
            <p>
              SignSync AI aims to reduce communication barriers in classrooms by making spoken educational content
              more accessible through Indian Sign Language demonstrations. It supports inclusive learning and encourages
              greater classroom participation for deaf and hard-of-hearing students.
            </p>
            <p>
              Accessibility in educational institutions is not an extra service — it is a condition for equal
              participation. When a student cannot follow the spoken lesson, the barrier is in the environment, not in
              the student.
            </p>
            <div className="cta-row">
              <Link to="/about" className="btn btn--teal">
                Read about SDG 4
                <Icon name="arrow" size={16} />
              </Link>
              <Link to="/learn" className="btn btn--ghost btn--light">
                Explore the vocabulary
              </Link>
            </div>
          </div>
          <div className="sdg-card">
            <div className="sdg-card__badge">
              <span>SDG</span>
              <strong>4</strong>
            </div>
            <h3>Quality Education</h3>
            <p>
              Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all.
            </p>
            <ul>
              <li>
                <Icon name="check" size={15} /> Captions for every spoken sentence
              </li>
              <li>
                <Icon name="check" size={15} /> Visual ISL demonstrations in class
              </li>
              <li>
                <Icon name="check" size={15} /> A way for students to ask questions
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container closing">
          <h2>SignSync AI</h2>
          <p className="closing__tagline">“Every Voice Deserves to Be Understood.”</p>
          <p className="closing__line">Making communication more inclusive, one sign at a time.</p>
          <div className="cta-row cta-row--center">
            <Link to="/dashboard" className="btn btn--primary btn--lg">
              Get Started
              <Icon name="arrow" size={16} />
            </Link>
            <Link to="/sign-recognition" className="btn btn--ghost btn--lg">
              Try sign recognition
            </Link>
          </div>
          <p className="closing__sdg">SDG 4 — Quality Education</p>
        </div>
      </section>
    </div>
  )
}
