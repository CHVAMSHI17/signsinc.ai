import { useCallback, useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Icon, Logo } from './icons.jsx'
import { useApp } from '../context/AppContext.jsx'
import { OUTPUT_LANGUAGES } from '../data/languages.js'

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/classroom', label: 'Classroom' },
  { to: '/communication', label: 'Communication' },
  { to: '/learn', label: 'Learn ISL' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/about', label: 'About' },
]

function AccessibilityPanel({ open, onClose }) {
  const { prefs, setPrefs } = useApp()
  if (!open) return null
  return (
    <div className="a11y-panel" role="dialog" aria-label="Accessibility settings">
      <div className="a11y-panel__head">
        <h2>Accessibility</h2>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Close accessibility settings">
          <Icon name="close" size={18} />
        </button>
      </div>
      <div className="a11y-panel__row">
        <span>
          <strong>High contrast</strong>
          <small>Stronger colours and borders</small>
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={prefs.highContrast}
          className={`switch ${prefs.highContrast ? 'is-on' : ''}`}
          onClick={() => setPrefs({ highContrast: !prefs.highContrast })}
        >
          <span />
        </button>
      </div>
      <div className="a11y-panel__row">
        <span>
          <strong>Larger text</strong>
          <small>Increases base text size</small>
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={prefs.largeText}
          className={`switch ${prefs.largeText ? 'is-on' : ''}`}
          onClick={() => setPrefs({ largeText: !prefs.largeText })}
        >
          <span />
        </button>
      </div>
      <div className="a11y-panel__row">
        <span>
          <strong>Captions</strong>
          <small>Always show text captions with the avatar</small>
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={prefs.captions}
          className={`switch ${prefs.captions ? 'is-on' : ''}`}
          onClick={() => setPrefs({ captions: !prefs.captions })}
        >
          <span />
        </button>
      </div>
      <div className="a11y-panel__row">
        <span>
          <strong>Reduce motion</strong>
          <small>Fewer decorative animations</small>
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={prefs.reducedMotion}
          className={`switch ${prefs.reducedMotion ? 'is-on' : ''}`}
          onClick={() => setPrefs({ reducedMotion: !prefs.reducedMotion })}
        >
          <span />
        </button>
      </div>
      <label className="field field--tight">
        <span>Sign output language</span>
        <select
          value={prefs.outputLanguage || 'en'}
          onChange={(event) => setPrefs({ outputLanguage: event.target.value })}
        >
          {OUTPUT_LANGUAGES.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.label} — {lang.native}
            </option>
          ))}
        </select>
      </label>
      <p className="a11y-panel__note">
        Signed messages are written and spoken in this language. Interface labels stay in English.
      </p>
    </div>
  )
}

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [a11yOpen, setA11yOpen] = useState(false)
  const location = useLocation()
  const { prefs, setPrefs } = useApp()

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    closeMenu()
    setA11yOpen(false)
  }, [location.pathname, closeMenu])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        setA11yOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <header className="site-header">
        <div className="container site-header__inner">
          <Link to="/" className="brand" aria-label="SignSync AI home">
            <Logo />
            <span className="brand__text">
              <strong>SignSync AI</strong>
              <small>Every voice deserves to be understood</small>
            </span>
          </Link>

          <nav className={`nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
            <ul className="nav__links">
              {NAV.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-header__actions">
            <button
              type="button"
              className={`icon-btn ${a11yOpen ? 'is-active' : ''}`}
              onClick={() => setA11yOpen((open) => !open)}
              aria-label="Accessibility settings"
              aria-expanded={a11yOpen}
            >
              <Icon name="settings" size={19} />
            </button>
            <Link to="/profile" className="icon-btn" aria-label="Your profile">
              <Icon name="user" size={19} />
            </Link>
            <Link to="/dashboard" className="btn btn--primary btn--sm site-header__cta">
              Get Started
            </Link>
            <button
              type="button"
              className="icon-btn site-header__burger"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <Icon name={menuOpen ? 'close' : 'menu'} size={20} />
            </button>
          </div>
        </div>

        <AccessibilityPanel open={a11yOpen} onClose={() => setA11yOpen(false)} />
      </header>

      <main id="main-content" tabIndex={-1}>
        {children}
      </main>

      <footer className="site-footer">
        <div className="container footer__grid">
          <div className="footer__brand">
            <Logo size={34} />
            <div>
              <strong>SignSync AI</strong>
              <p>“Every Voice Deserves to Be Understood.”</p>
            </div>
          </div>
          <div className="footer__col">
            <h3>Modes</h3>
            <ul>
              <li><Link to="/classroom">Classroom Mode</Link></li>
              <li><Link to="/communication">Communication Mode</Link></li>
              <li><Link to="/ai-generation">AI Sign Generation</Link></li>
              <li><Link to="/sign-recognition">Sign to Text demo</Link></li>
            </ul>
          </div>
          <div className="footer__col">
            <h3>Explore</h3>
            <ul>
              <li><Link to="/learn">Learn ISL</Link></li>
              <li><Link to="/how-it-works">How It Works</Link></li>
              <li><Link to="/about">About &amp; SDG 4</Link></li>
              <li><Link to="/profile">Your profile</Link></li>
            </ul>
          </div>
          <div className="footer__col footer__col--note">
            <h3>Prototype note</h3>
            <p>
              SignSync AI is a hackathon prototype. The ISL vocabulary and gestures are a limited demonstration dataset,
              not a complete or validated Indian Sign Language translation system.
            </p>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => setPrefs({ highContrast: !prefs.highContrast })}
            >
              <Icon name="contrast" size={16} />
              {prefs.highContrast ? 'Standard colours' : 'High contrast'}
            </button>
          </div>
        </div>
        <div className="container footer__bottom">
          <p>SDG 4 — Quality Education</p>
          <p>Making communication more inclusive, one sign at a time.</p>
        </div>
      </footer>
    </div>
  )
}
