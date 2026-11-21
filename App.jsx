import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext.jsx'
import Layout from './components/Layout.jsx'
import Landing from './pages/Landing.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Classroom from './pages/Classroom.jsx'
import Communication from './pages/Communication.jsx'
import AiGeneration from './pages/AiGeneration.jsx'
import Learn from './pages/Learn.jsx'
import HowItWorks from './pages/HowItWorks.jsx'
import About from './pages/About.jsx'
import Profile from './pages/Profile.jsx'
import SignRecognition from './pages/SignRecognition.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/classroom" element={<Classroom />} />
            <Route path="/communication" element={<Communication />} />
            <Route path="/ai-generation" element={<AiGeneration />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/sign-recognition" element={<SignRecognition />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AppProvider>
  )
}
