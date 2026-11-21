import { Link } from 'react-router-dom'
import { Icon } from '../components/icons.jsx'

export default function NotFound() {
  return (
    <div className="page">
      <div className="container notfound">
        <span className="eyebrow">404</span>
        <h1>This page is not part of the demo</h1>
        <p className="muted">Use the navigation above, or head back to the dashboard.</p>
        <Link to="/dashboard" className="btn btn--primary">
          <Icon name="arrow" size={17} />
          Go to dashboard
        </Link>
      </div>
    </div>
  )
}
