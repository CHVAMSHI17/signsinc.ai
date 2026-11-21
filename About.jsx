import { Link } from 'react-router-dom'
import { Icon } from '../components/icons.jsx'
import { Notice, PageHero, Panel } from '../components/ui.jsx'

const LIMITS = [
  'Perfect Indian Sign Language translation',
  'Complete ISL vocabulary coverage',
  'Perfect sign recognition',
  'Grammatically accurate translation for every sentence',
  'A fully trained proprietary generative AI model',
  'Production-ready classroom deployment',
]

export default function About() {
  return (
    <div className="page">
      <PageHero
        eyebrow="About SignSync AI"
        title="Every Voice Deserves to Be Understood."
        lead="SignSync AI is an AI-powered classroom accessibility and communication prototype built for a hackathon. It explores how speech and text can become visual Indian Sign Language demonstrations — and how a classroom can include everyone in the conversation."
      >
        <Link to="/dashboard" className="btn btn--primary">
          <Icon name="arrow" size={17} />
          Open the dashboard
        </Link>
      </PageHero>

      <div className="container stack">
        <Panel title="Why this exists" subtitle="The problem we are exploring" icon="lightbulb">
          <div className="prose">
            <p>
              Most classrooms are built around spoken language. A deaf or hard-of-hearing student can miss an
              explanation, a question, or an announcement even when they are fully capable of learning the material.
              The barrier is not ability — it is the format of the classroom.
            </p>
            <p>
              SignSync AI takes a teacher’s speech, turns it into readable text, matches supported vocabulary, and
              performs a sign-language demonstration with a 3D avatar. The same core pipeline powers everyday
              two-way communication, a learning section, and a small sign-recognition demo.
            </p>
            <p>
              This is a working prototype, not a finished product. Its value is in showing an end-to-end experience that
              judges can try, and an architecture that can grow with real ISL datasets and expert validation.
            </p>
          </div>
        </Panel>

        <section className="sdg-banner">
          <div className="sdg-banner__badge">
            <span>SDG</span>
            <strong>4</strong>
          </div>
          <div>
            <span className="eyebrow eyebrow--light">Sustainable Development Goal 4</span>
            <h2>Quality Education</h2>
            <p>
              Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all.
              Accessibility in educational institutions is essential: when teaching is only available in one modality,
              participation becomes conditional. Inclusive classrooms require multiple routes to the same content.
            </p>
            <ul className="sdg-list">
              <li>
                <Icon name="check" size={16} />
                Spoken lessons become visible text and sign demonstrations.
              </li>
              <li>
                <Icon name="check" size={16} />
                Students get a channel to ask questions and be understood.
              </li>
              <li>
                <Icon name="check" size={16} />
                Teachers see which words are outside the demo vocabulary instead of losing meaning silently.
              </li>
              <li>
                <Icon name="check" size={16} />
                Captions, contrast and playback controls support different access needs.
              </li>
            </ul>
          </div>
        </section>

        <div className="grid grid--2">
          <Panel title="What the prototype actually does" subtitle="Honest capabilities" icon="check">
            <ul className="tick-list">
              <li>
                <Icon name="check" size={15} />
                <div>
                  <strong>Speech to text</strong>
                  <p>Browser speech recognition where it is supported, with a typed fallback.</p>
                </div>
              </li>
              <li>
                <Icon name="check" size={15} />
                <div>
                  <strong>Keyword mapping</strong>
                  <p>Transparent, rule-based matching against a small demonstration vocabulary.</p>
                </div>
              </li>
              <li>
                <Icon name="check" size={15} />
                <div>
                  <strong>3D sign demonstration</strong>
                  <p>A jointed avatar plays a sequence of authored poses with captions and playback controls.</p>
                </div>
              </li>
              <li>
                <Icon name="check" size={15} />
                <div>
                  <strong>Limited gesture recognition</strong>
                  <p>Six sample hand shapes, with simulation and manual fallbacks.</p>
                </div>
              </li>
            </ul>
          </Panel>

          <Panel title="What we do not claim" subtitle="Prototype boundaries" icon="alert">
            <ul className="cross-list">
              {LIMITS.map((item) => (
                <li key={item}>
                  <Icon name="close" size={14} />
                  {item}
                </li>
              ))}
            </ul>
            <Notice variant="warn" title="Respecting ISL">
              ISL is a complete natural language with its own grammar, not a word-for-word encoding of English. The
              prototype shows one demonstration sign per supported keyword in English order. Validation with qualified
              ISL educators and deaf users is required before any translation accuracy is claimed.
            </Notice>
          </Panel>
        </div>

        <Panel title="Where this could go next" subtitle="An expandable architecture" icon="sparkles">
          <div className="roadmap">
            <div className="roadmap__item">
              <span>Now</span>
              <h3>Demonstration pipeline</h3>
              <p>Sample vocabulary, deterministic mapping, authored poses, browser speech and limited gesture recognition.</p>
            </div>
            <div className="roadmap__item">
              <span>Next</span>
              <h3>Real ISL data &amp; validation</h3>
              <p>Work with deaf educators to record validated ISL signs, including two-handed signs, movement and grammar.</p>
            </div>
            <div className="roadmap__item">
              <span>Later</span>
              <h3>Contextual generation</h3>
              <p>A generative model that produces ISL-ordered sequences, not English word order, with human review in education.</p>
            </div>
          </div>
        </Panel>

        <div className="closing closing--card">
          <h2>SignSync AI</h2>
          <p className="closing__tagline">“Every Voice Deserves to Be Understood.”</p>
          <p className="closing__line">Making communication more inclusive, one sign at a time.</p>
          <p className="closing__sdg">SDG 4 — Quality Education</p>
          <div className="cta-row cta-row--center">
            <Link to="/classroom" className="btn btn--primary">
              Start Classroom Mode
            </Link>
            <Link to="/how-it-works" className="btn btn--ghost">
              Explore the technology
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
