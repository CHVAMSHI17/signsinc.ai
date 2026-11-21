// Simple inline SVG icon set so the prototype needs no icon dependency.

const paths = {
  mic: (
    <>
      <path d="M12 3.5a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0v-5a3 3 0 0 1 3-3Z" />
      <path d="M6 11a6 6 0 0 0 12 0" />
      <path d="M12 17v3.5" />
    </>
  ),
  keyboard: (
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="2.5" />
      <path d="M6 10h.01M9.5 10h.01M13 10h.01M16.5 10h.01M18 10h.01M7.5 13.5h9" />
    </>
  ),
  play: <path d="M8 5.5v13l11-6.5-11-6.5Z" />,
  pause: (
    <>
      <path d="M9 5v14" />
      <path d="M15 5v14" />
    </>
  ),
  replay: (
    <>
      <path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1" />
      <path d="M3.5 4.5V10H9" />
    </>
  ),
  reset: (
    <>
      <path d="M4 4v6h6" />
      <path d="M4.6 15a8 8 0 1 0 1.9-8.6L4 10" />
    </>
  ),
  slow: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  camera: (
    <>
      <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.8l1.2-2h7l1.2 2h1.8A2.5 2.5 0 0 1 21 8.5v8A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-8Z" />
      <circle cx="12" cy="12.5" r="3.5" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 3.5l1.8 4.7 4.7 1.8-4.7 1.8L12 16.5l-1.8-4.7L5.5 10l4.7-1.8L12 3.5Z" />
      <path d="M18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2Z" />
    </>
  ),
  cap: (
    <>
      <path d="M2.5 9.5 12 4.5l9.5 5L12 14.5 2.5 9.5Z" />
      <path d="M6 11.5v4.2c0 1.6 2.7 2.8 6 2.8s6-1.2 6-2.8v-4.2" />
      <path d="M21.5 9.5v5" />
    </>
  ),
  chat: (
    <>
      <path d="M20.5 12c0 4.1-3.8 7.5-8.5 7.5-1.2 0-2.4-.2-3.4-.6L4 20.5l1.3-3.7A7 7 0 0 1 3.5 12C3.5 7.9 7.3 4.5 12 4.5s8.5 3.4 8.5 7.5Z" />
      <path d="M8.5 11.5h7M8.5 14.5h4" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A2 2 0 0 1 6 3.5h5.5v17H6a2 2 0 0 1-2-2v-13Z" />
      <path d="M20 5.5a2 2 0 0 0-2-2h-5.5v17H18a2 2 0 0 0 2-2v-13Z" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <path d="M16 5.2a3.2 3.2 0 0 1 0 6.1" />
      <path d="M17.5 14.6A5.5 5.5 0 0 1 20.5 20" />
    </>
  ),
  check: <path d="M4.5 12.5l5 5 10-11" />,
  alert: (
    <>
      <path d="M12 4 2.8 20h18.4L12 4Z" />
      <path d="M12 9.5v5M12 17.2h.01" />
    </>
  ),
  home: (
    <>
      <path d="M3.5 10.5 12 3.5l8.5 7" />
      <path d="M5.5 9.5v10h13v-10" />
      <path d="M10 19.5v-5h4v5" />
    </>
  ),
  arrow: <path d="M4.5 12h14M13 6.5l5.5 5.5-5.5 5.5" />,
  contrast: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 3.5v17a8.5 8.5 0 0 0 0-17Z" fill="currentColor" stroke="none" />
    </>
  ),
  type: (
    <>
      <path d="M5 6.5V5h14v1.5" />
      <path d="M12 5v14M8.5 19h7" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.8" />
      <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.2 5.2l2.1 2.1M16.7 16.7l2.1 2.1M18.8 5.2l-2.1 2.1M7.3 16.7l-2.1 2.1" />
    </>
  ),
  send: <path d="M3.5 12 20.5 4.5 16 20.5l-4-6.5-8.5-2Z" />,
  lightbulb: (
    <>
      <path d="M8.5 15.5a5.5 5.5 0 1 1 7 0v2h-7v-2Z" />
      <path d="M9.5 20.5h5" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.5 2.4 3.8 5.4 3.8 8.5s-1.3 6.1-3.8 8.5c-2.5-2.4-3.8-5.4-3.8-8.5S9.5 5.9 12 3.5Z" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  stop: <rect x="6" y="6" width="12" height="12" rx="2" />,
  download: (
    <>
      <path d="M12 3.5v11" />
      <path d="M7.5 10.5 12 15l4.5-4.5" />
      <path d="M4.5 19.5h15" />
    </>
  ),
  trash: (
    <>
      <path d="M4.5 6.5h15" />
      <path d="M9 4h6l.8 2.5H8.2L9 4Z" />
      <path d="M6.5 6.5 7.5 20a1.5 1.5 0 0 0 1.5 1.4h6a1.5 1.5 0 0 0 1.5-1.4l1-13.5" />
    </>
  ),
  hand: (
    <>
      <path d="M8.5 11V5.8a1.8 1.8 0 0 1 3.6 0V11" />
      <path d="M12.1 10.5V4.8a1.8 1.8 0 0 1 3.6 0v6" />
      <path d="M15.7 11.5V7.2a1.8 1.8 0 0 1 3.6 0v6.4c0 4-2.8 7-6.8 7h-1.2a6 6 0 0 1-5.1-2.9L3.9 14a1.9 1.9 0 0 1 3.1-2.2l1.5 1.7" />
    </>
  ),
}

export function Icon({ name, size = 20, className = '', strokeWidth = 1.7, ...rest }) {
  const content = paths[name]
  if (!content) return null
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`icon ${className}`}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {content}
    </svg>
  )
}

export function Logo({ size = 38 }) {
  return (
    <span className="logo" aria-hidden="true">
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <rect width="48" height="48" rx="14" fill="url(#ssg)" />
        <g stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 32V16a2.6 2.6 0 0 1 5.2 0v8" />
          <path d="M25.2 21.5v-5a2.6 2.6 0 0 1 5.2 0v7" />
          <path d="M30.4 24v-2.4a2.6 2.6 0 0 1 5.2 0V31c0 4.4-3 7.5-7.6 7.5h-1.4c-2.4 0-4.5-1.2-5.7-3.2l-3.7-6.3" />
          <path d="M14.5 25.5a2.4 2.4 0 0 1 4.3-2.1l2 3.2" />
        </g>
        <circle cx="36.5" cy="12.5" r="3.2" fill="#67e8f9" />
        <defs>
          <linearGradient id="ssg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0f4c81" />
            <stop offset="1" stopColor="#0fa3a3" />
          </linearGradient>
        </defs>
      </svg>
    </span>
  )
}
