import { Link } from 'react-router-dom'
import { Icon } from '../components/icons.jsx'
import { ModeCard, Notice, PageHero, Panel } from '../components/ui.jsx'
import { useApp } from '../context/AppContext.jsx'
import { DEMO_SCENARIOS } from '../data/classroom.js'
import { VOCABULARY } from '../data/vocabulary.js'

export default function Dashboard() {
  const { profile, recent } = useApp()

  return (
    <div className="page">
      <PageHero
        eyebrow="Dashboard"
        title={profile.name ? `Welcome, ${profile.name}` : 'Where would you like to start?'}
        lead="Two ways to use SignSync AI: classroom accessibility for teaching, and everyday two-way communication."
      >
        <Link to="/profile" className="btn btn--ghost">
          <Icon name="user" size={17} />
          Edit profile
        </Link>
        <Link to="/how-it-works" className="btn btn--ghost">
          <Icon name="sparkles" size={17} />
          How the AI works
        </Link>
      </PageHero>

      <div className="container stack">
        <div className="mode-grid mode-grid--dashboard">
          <ModeCard
            to="/classroom"
            icon="cap"
            title="Classroom Mode"
            description="Make classroom teaching accessible through AI-powered sign-language assistance."
            points={[
              'Speech recognition with a typed fallback',
              'Sign sequence + captions for every sentence',
              'Student questions, teacher replies and announcements',
            ]}
            tone="navy"
            cta="Start Classroom Mode"
          />
          <ModeCard
            to="/communication"
            icon="chat"
            title="Communication Mode"
            description="Help hearing and deaf individuals understand each other more easily."
            points={[
              'Speech or text to ISL avatar demonstration',
              'Split-screen two-way conversation history',
              'Sign-to-text camera demo with manual fallback',
            ]}
            tone="teal"
            cta="Start Communication Mode"
          />
        </div>

        <Panel
          title="Demo scenarios"
          subtitle="Three prepared demonstrations for a live presentation"
          icon="play"
        >
          <div className="scenario-grid">
            {DEMO_SCENARIOS.map((scenario) => (
              <Link to={scenario.to} className="scenario-card" key={scenario.id}>
                <span className="scenario-card__tag">Demo {scenario.id}</span>
                <h3>{scenario.title.replace(/^Demo [ABC] — /, '')}</h3>
                {scenario.lines.map((line) => (
                  <p className="scenario-card__line" key={line}>
                    {line}
                  </p>
                ))}
                <ul>
                  {scenario.expected.map((item) => (
                    <li key={item}>
                      <Icon name="check" size={14} />
                      {item}
                    </li>
                  ))}
                </ul>
                <span className="feature-card__link">
                  Run demo
                  <Icon name="arrow" size={15} />
                </span>
              </Link>
            ))}
          </div>
        </Panel>

        <div className="grid grid--2">
          <Panel title="Sign generation" subtitle="Type any sentence and watch the pipeline run" icon="sparkles">
            <p className="muted">
              The AI processing section shows every stage: text processing, keyword identification, sequence mapping and
              avatar playback.
            </p>
            <div className="inline-actions">
              <Link to="/ai-generation" className="btn btn--primary btn--sm">
                Open AI sign generation
              </Link>
              <Link to="/learn" className="btn btn--ghost btn--sm">
                Browse {VOCABULARY.length} sample signs
              </Link>
            </div>
            <Notice variant="info" icon="lightbulb" title="Demo tip">
              Try “Welcome to today’s science class.” — it mixes supported signs with words outside the demo vocabulary.
            </Notice>
          </Panel>

          <Panel title="Recent activity" subtitle="Saved locally on this device" icon="time">
            {recent.length ? (
              <ul className="recent-list">
                {recent.map((entry) => (
                  <li key={entry.id}>
                    <span className={`recent-dot recent-dot--${entry.kind || 'info'}`} aria-hidden="true" />
                    <div>
                      <strong>{entry.title}</strong>
                      <small>{entry.detail}</small>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">
                Nothing yet. Run a classroom simulation or a conversation and it will appear here.
              </p>
            )}
            <div className="inline-actions">
              <Link to="/classroom" className="btn btn--ghost btn--sm">
                Classroom Mode
              </Link>
              <Link to="/how-it-works" className="btn btn--ghost btn--sm">
                Processing pipeline
              </Link>
            </div>
          </Panel>
        </div>

        <Notice variant="warn" title="Prototype limits">
          SignSync AI demonstrates a pipeline with a sample ISL vocabulary. It does not provide complete vocabulary
          coverage, grammatically accurate ISL translation, or perfect sign recognition. Real ISL is a full language
          with its own grammar — validation with qualified ISL educators and deaf users is required before any
          translation claim.
        </Notice>
      </div>
    </div>
  )
}
