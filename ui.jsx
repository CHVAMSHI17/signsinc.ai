import { Link } from 'react-router-dom'
import { Icon } from './icons.jsx'

export function PageHero({ eyebrow, title, lead, children, aside }) {
  return (
    <header className="page-hero">
      <div className="container page-hero__inner">
        <div>
          {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
          <h1>{title}</h1>
          {lead ? <p className="page-hero__lead">{lead}</p> : null}
          {children ? <div className="page-hero__actions">{children}</div> : null}
        </div>
        {aside ? <div className="page-hero__aside">{aside}</div> : null}
      </div>
    </header>
  )
}

export function Panel({ title, subtitle, icon, children, actions, className = '', id }) {
  return (
    <section className={`panel ${className}`} id={id}>
      {(title || actions) && (
        <header className="panel__head">
          <div className="panel__title">
            {icon ? <span className="panel__icon"><Icon name={icon} size={18} /></span> : null}
            <div>
              {title ? <h2>{title}</h2> : null}
              {subtitle ? <p>{subtitle}</p> : null}
            </div>
          </div>
          {actions ? <div className="panel__actions">{actions}</div> : null}
        </header>
      )}
      <div className="panel__body">{children}</div>
    </section>
  )
}

export function Notice({ variant = 'info', icon = 'alert', title, children }) {
  return (
    <div className={`notice notice--${variant}`} role={variant === 'warn' ? 'status' : undefined}>
      <Icon name={icon} size={18} />
      <div>
        {title ? <strong>{title}</strong> : null}
        <div>{children}</div>
      </div>
    </div>
  )
}

export function Chips({ items = [], empty = 'No supported keywords yet', tone = 'default' }) {
  if (!items.length) return <p className="muted small">{empty}</p>
  return (
    <ul className={`chip-row chip-row--${tone}`}>
      {items.map((item) => (
        <li key={item.id || item} className="chip">
          {item.label || item}
        </li>
      ))}
    </ul>
  )
}

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tabs" role="tablist" aria-label="Sections">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          id={`tab-${tab.id}`}
          aria-selected={active === tab.id}
          className={`tab ${active === tab.id ? 'is-active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.icon ? <Icon name={tab.icon} size={16} /> : null}
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export function StepList({ steps = [], activeIndex = -1, statuses = [] }) {
  return (
    <ol className="pipeline">
      {steps.map((stage, index) => {
        const state = index < activeIndex ? 'is-done' : index === activeIndex ? 'is-active' : ''
        return (
          <li key={stage.id} className={`pipeline__stage ${state}`}>
            <span className="pipeline__dot" aria-hidden="true">
              {index < activeIndex ? '✓' : index + 1}
            </span>
            <div className="pipeline__body">
              <strong>
                {stage.label}
                {index === activeIndex && statuses[index] ? <em className="pipeline__status">{statuses[index]}</em> : null}
              </strong>
              <span>{stage.short}</span>
              <p>{stage.detail}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export function ModeCard({ to, icon, title, description, points, tone = 'blue', cta = 'Open mode' }) {
  return (
    <Link to={to} className={`mode-card mode-card--${tone}`}>
      <span className="mode-card__icon">
        <Icon name={icon} size={26} />
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
      <ul className="mode-card__points">
        {points.map((point) => (
          <li key={point}>
            <Icon name="check" size={15} />
            {point}
          </li>
        ))}
      </ul>
      <span className="mode-card__cta">
        {cta}
        <Icon name="arrow" size={16} />
      </span>
    </Link>
  )
}
