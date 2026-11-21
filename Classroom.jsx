import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SignPlayer from '../components/SignPlayer.jsx'
import { Icon } from '../components/icons.jsx'
import { Chips, Notice, PageHero, Panel, Tabs } from '../components/ui.jsx'
import { useApp } from '../context/AppContext.jsx'
import { ANNOUNCEMENTS, CLASSROOM_SIMULATION, LEARNING_TOPICS } from '../data/classroom.js'
import { OUTPUT_LANGUAGES, getOutputLanguage, spokenText, translateSigns } from '../data/languages.js'
import { VOCAB_BY_ID } from '../data/vocabulary.js'
import { SAMPLE_GESTURES } from '../lib/gestures.js'
import { createRecognizer, getSpeechSupport, speakText } from '../lib/speech.js'
import { ISL_DISCLAIMER, UNSUPPORTED_MESSAGE, processText } from '../lib/processor.js'

const TABS = [
  { id: 'teaching', label: 'Teaching', icon: 'cap' },
  { id: 'participation', label: 'Participation', icon: 'users' },
  { id: 'announcements', label: 'Announcements', icon: 'alert' },
  { id: 'learning', label: 'Learning', icon: 'book' },
]

export default function Classroom() {
  const { prefs, setPrefs, addRecent } = useApp()
  const [tab, setTab] = useState('teaching')
  const [text, setText] = useState('Good morning students. Today we are learning about artificial intelligence.')
  const [draft, setDraft] = useState('')
  const [simRunning, setSimRunning] = useState(false)
  const [simIndex, setSimIndex] = useState(0)
  const [listening, setListening] = useState(false)
  const [interim, setInterim] = useState('')
  const [micMessage, setMicMessage] = useState('')
  const [captions, setCaptions] = useState([])
  const [override, setOverride] = useState(null)

  // participation state
  const [question, setQuestion] = useState('Can you explain this concept again?')
  const [questions, setQuestions] = useState([])
  const [teacherReply, setTeacherReply] = useState('Yes, let us understand the idea again. Please ask a question if you need help.')
  const [replies, setReplies] = useState([])
  const [signBuffer, setSignBuffer] = useState([])
  const [signedMessages, setSignedMessages] = useState([])
  const [signNotice, setSignNotice] = useState('')

  // learning state
  const [topicId, setTopicId] = useState(LEARNING_TOPICS[0].id)
  const [announcement, setAnnouncement] = useState(ANNOUNCEMENTS[0])

  const recognizer = useRef(null)
  const replyRecognizer = useRef(null)
  const speechSupport = useMemo(() => getSpeechSupport(), [])

  const processed = useMemo(() => processText(text), [text])
  const announcementProcessed = useMemo(() => processText(announcement.text), [announcement])

  const active = override ?? { sequence: processed.sequence, label: 'Classroom signs' }
  const outputLanguage = getOutputLanguage(prefs.outputLanguage)

  // Append captions as the teacher's sentence changes.
  useEffect(() => {
    if (!text?.trim()) return
    setCaptions((prev) => {
      if (prev[prev.length - 1]?.text === text) return prev
      return [...prev.slice(-8), { id: `${Date.now()}-${prev.length}`, text, at: new Date().toLocaleTimeString() }]
    })
  }, [text])

  // Classroom teaching simulation.
  useEffect(() => {
    if (!simRunning) return undefined
    const line = CLASSROOM_SIMULATION[simIndex]
    if (!line) {
      setSimRunning(false)
      return undefined
    }
    setOverride(null)
    setText(line.text)
    const timer = window.setTimeout(() => {
      setSimIndex((index) => {
        if (index + 1 >= CLASSROOM_SIMULATION.length) {
          setSimRunning(false)
          return index
        }
        return index + 1
      })
    }, 7800)
    return () => window.clearTimeout(timer)
  }, [simRunning, simIndex])

  useEffect(() => {
    if (!simRunning) return
    addRecent({
      kind: 'classroom',
      title: 'Classroom simulation',
      detail: `${CLASSROOM_SIMULATION.length} sample sentences signed by the avatar`,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simRunning])

  const startSimulation = () => {
    stopMic()
    setSimIndex(0)
    setSimRunning(true)
  }

  const stopSimulation = () => {
    setSimRunning(false)
  }

  const submitText = (value) => {
    const next = (value ?? draft).trim()
    if (!next) return
    setSimRunning(false)
    setOverride(null)
    setText(next)
    setDraft('')
    addRecent({ kind: 'classroom', title: 'Sentence signed', detail: next })
  }

  const stopMic = useCallback(() => {
    recognizer.current?.stop()
    setListening(false)
    setInterim('')
  }, [])

  const startMic = () => {
    setSimRunning(false)
    setMicMessage('')
    if (!speechSupport.supported) {
      setMicMessage('Speech recognition is not available in this browser. Type the sentence instead — the demo works the same way.')
      return
    }
    if (!recognizer.current) {
      recognizer.current = createRecognizer({
        lang: 'en-IN',
        onResult: ({ transcript, isFinal, interim: live }) => {
          setInterim(live || '')
          if (isFinal) {
            setText(transcript)
            setInterim('')
          }
        },
        onStatus: ({ listening: isListening }) => setListening(Boolean(isListening)),
        onError: (message) => {
          setMicMessage(message)
          setListening(false)
        },
      })
    }
    recognizer.current.start()
    setListening(true)
  }

  useEffect(
    () => () => {
      recognizer.current?.abort?.()
      replyRecognizer.current?.abort?.()
    },
    [],
  )

  const startTeacherReplyMic = () => {
    if (!speechSupport.supported) {
      setMicMessage('Speech recognition is not available here — type the response instead.')
      return
    }
    replyRecognizer.current?.abort?.()
    const rec = createRecognizer({
      lang: 'en-IN',
      onResult: ({ transcript, isFinal }) => {
        if (isFinal) setTeacherReply((prev) => `${prev} ${transcript}`.trim())
      },
      onError: (message) => setMicMessage(message),
    })
    replyRecognizer.current = rec
    rec.start()
    setMicMessage('Listening for the teacher’s response…')
  }

  const sendQuestion = () => {
    const value = question.trim()
    if (!value) return
    setQuestions((prev) => [{ id: Date.now(), text: value }, ...prev])
    setQuestion('')
    addRecent({ kind: 'question', title: 'Student question', detail: value })
  }

  const sendReply = () => {
    const value = teacherReply.trim()
    if (!value) return
    const result = processText(value)
    setReplies((prev) => [{ id: Date.now(), text: value, sequence: result.sequence }, ...prev])
    setOverride({ sequence: result.sequence, label: 'Teacher response in signs' })
    addRecent({ kind: 'classroom', title: 'Teacher response', detail: value })
  }

  const addSign = (id) => {
    setSignBuffer((prev) => [...prev, id])
    setSignNotice('')
  }

  const removeSign = (index) => {
    setSignBuffer((prev) => prev.filter((_, i) => i !== index))
  }

  const speakSigned = (entries, languageId) => {
    const language = getOutputLanguage(languageId)
    const result = speakText(spokenText(entries), language.speechLang)
    setSignNotice(
      !result.ok
        ? 'Speech output is not available in this browser — the text is still shown.'
        : result.hasVoice || !result.voicesReady
          ? ''
          : `No ${language.label} voice is installed in this browser, so playback may use a different voice. The text is always shown.`,
    )
  }

  const sendSigned = () => {
    if (!signBuffer.length) return
    const entries = translateSigns(signBuffer, outputLanguage.id)
    setSignedMessages((prev) => [
      { id: Date.now(), entries, language: outputLanguage.id, at: new Date().toLocaleTimeString() },
      ...prev,
    ])
    setSignBuffer([])
    setSignNotice('')
    addRecent({
      kind: 'sign',
      title: 'Student signed a message',
      detail: `${entries.map((entry) => entry.english).join(' ')} → ${outputLanguage.label}`,
    })
    if (prefs.speakSigns) speakSigned(entries, outputLanguage.id)
  }

  const topic = LEARNING_TOPICS.find((item) => item.id === topicId) || LEARNING_TOPICS[0]

  return (
    <div className="page">
      <PageHero
        eyebrow="Primary feature"
        title="Classroom Mode"
        lead="Turn a teacher’s spoken explanation into readable text and a visual ISL demonstration, so deaf and hard-of-hearing students can follow the lesson."
      >
        <Link to="/how-it-works" className="btn btn--ghost">
          <Icon name="sparkles" size={17} />
          See the pipeline
        </Link>
        <Link to="/learn" className="btn btn--ghost">
          <Icon name="book" size={17} />
          Vocabulary library
        </Link>
      </PageHero>

      <div className="container classroom">
        <div className="classroom__main">
          <Tabs tabs={TABS} active={tab} onChange={(id) => { setTab(id); setOverride(null) }} />

          {tab === 'teaching' ? (
            <div className="stack" role="tabpanel" id="panel-teaching" aria-labelledby="tab-teaching">
              <Panel title="Teacher input" subtitle="Simulation, microphone, or typed text" icon="mic">
                <div className="control-row">
                  <button
                    type="button"
                    className={`btn ${simRunning ? 'btn--danger' : 'btn--primary'}`}
                    onClick={simRunning ? stopSimulation : startSimulation}
                  >
                    <Icon name={simRunning ? 'stop' : 'play'} size={17} />
                    {simRunning ? 'Stop Simulation' : 'Start Teaching Simulation'}
                  </button>
                  <button
                    type="button"
                    className={`btn ${listening ? 'btn--danger' : 'btn--teal'}`}
                    onClick={listening ? stopMic : startMic}
                    aria-pressed={listening}
                  >
                    <Icon name="mic" size={17} />
                    {listening ? 'Stop listening' : 'Use microphone'}
                  </button>
                  <span className="control-note">
                    {simRunning
                      ? `Simulation line ${simIndex + 1} of ${CLASSROOM_SIMULATION.length}`
                      : speechSupport.supported
                        ? 'Speech recognition available'
                        : 'Speech recognition unavailable — text input works'}
                  </span>
                </div>

                {listening ? (
                  <div className="listening-bar" role="status">
                    <span className="live-dot" aria-hidden="true" />
                    Listening… speak your sentence
                  </div>
                ) : null}

                {micMessage ? <Notice variant="warn">{micMessage}</Notice> : null}

                <div className="input-row">
                  <label className="field field--grow">
                    <span>Sentence to sign</span>
                    <input
                      type="text"
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') submitText()
                      }}
                      placeholder="Type what the teacher said…"
                      aria-describedby="sentence-help"
                    />
                  </label>
                  <button type="button" className="btn btn--primary" onClick={() => submitText()}>
                    <Icon name="hand" size={17} />
                    Sign sentence
                  </button>
                </div>
                <p id="sentence-help" className="muted small">
                  Press Enter or “Sign sentence”. Text input is the fallback whenever the microphone is unavailable.
                </p>

                <div className="chip-row chip-row--suggest">
                  {CLASSROOM_SIMULATION.map((line) => (
                    <button
                      key={line.id}
                      type="button"
                      className="chip chip--button"
                      onClick={() => submitText(line.text)}
                    >
                      {line.note}
                    </button>
                  ))}
                </div>
              </Panel>

              <Panel title="Recognition & processing" subtitle="What SignSync AI heard and how it understood it" icon="keyboard">
                <div className="readout-grid">
                  <div className="readout">
                    <span className="readout__label">Recognized speech</span>
                    <p>{interim || text || '—'}</p>
                    {interim ? <small className="muted">Interim transcript</small> : null}
                  </div>
                  <div className="readout">
                    <span className="readout__label">Processed sentence</span>
                    <p>{processed.tokens.join(' ') || '—'}</p>
                    <small className="muted">
                      {processed.tokens.length} words · {Math.round(processed.coverage * 100)}% covered by demo signs
                    </small>
                  </div>
                </div>

                <div className="analysis-block">
                  <h3>Supported sign vocabulary</h3>
                  <Chips
                    items={processed.keywords.map((k) => ({ id: k.id, label: VOCAB_BY_ID[k.id]?.label || k.id }))}
                    empty="No supported keywords in this sentence."
                    tone="sign"
                  />
                  {processed.isPartial ? (
                    <Notice variant="warn" title="Vocabulary limit">
                      {UNSUPPORTED_MESSAGE}
                      <p className="small">
                        Not matched: {processed.unsupported.map((w) => `“${w}”`).join(', ')}
                      </p>
                    </Notice>
                  ) : null}
                  <p className="muted small">{ISL_DISCLAIMER}</p>
                </div>
              </Panel>

              <Panel title="Lesson captions" subtitle="Every sentence stays readable — the demo never relies on animation alone" icon="chat">
                {captions.length ? (
                  <ul className="caption-list">
                    {captions.map((line) => (
                      <li key={line.id}>
                        <span>{line.at}</span>
                        <p>{line.text}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="muted">Captions will appear here as the lesson continues.</p>
                )}
              </Panel>
            </div>
          ) : null}

          {tab === 'participation' ? (
            <div className="stack" role="tabpanel" id="panel-participation" aria-labelledby="tab-participation">
              <Panel
                title="Student sign input"
                subtitle="Sign with the demo gestures — SignSync converts it to text and can speak it aloud"
                icon="hand"
                actions={<span className="pill pill--soft">{SAMPLE_GESTURES.length} demo signs</span>}
              >
                <div className="sign-board" role="group" aria-label="Demo signs the student can show">
                  {SAMPLE_GESTURES.map((gesture) => (
                    <button
                      key={gesture.id}
                      type="button"
                      className="sign-key"
                      onClick={() => addSign(gesture.id)}
                    >
                      <strong>{gesture.label}</strong>
                      <span>{gesture.shape}</span>
                    </button>
                  ))}
                </div>
                <p className="muted small">
                  Live camera tracking lives in <Link to="/sign-recognition">Sign Recognition</Link>. Here the student
                  can choose the sign they showed, so the classroom demo still works without a camera.
                </p>

                <div className="sign-buffer">
                  <span className="sign-buffer__label">Signed message</span>
                  {signBuffer.length ? (
                    <div className="chip-row chip-row--sign">
                      {signBuffer.map((id, index) => (
                        <button
                          key={`${id}-${index}`}
                          type="button"
                          className="chip chip--button"
                          onClick={() => removeSign(index)}
                          title="Remove this sign"
                        >
                          {id}
                          <span aria-hidden="true"> ×</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="muted small">Choose one or more signs above.</p>
                  )}
                </div>

                <div className="control-row">
                  <label className="field field--tight">
                    <span>Text language</span>
                    <select
                      value={outputLanguage.id}
                      onChange={(event) => setPrefs({ outputLanguage: event.target.value })}
                    >
                      {OUTPUT_LANGUAGES.map((lang) => (
                        <option key={lang.id} value={lang.id}>
                          {lang.label} — {lang.native}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={sendSigned}
                    disabled={!signBuffer.length}
                  >
                    <Icon name="keyboard" size={17} />
                    Convert to text
                  </button>
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => setSignBuffer([])}
                    disabled={!signBuffer.length}
                  >
                    Clear
                  </button>
                </div>

                <div className="switch-row">
                  <span>
                    <strong>Speak the message aloud</strong>
                    <small>Uses the browser’s {outputLanguage.label} voice. Audio plays in addition to the text.</small>
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={prefs.speakSigns}
                    className={`switch ${prefs.speakSigns ? 'is-on' : ''}`}
                    onClick={() => setPrefs({ speakSigns: !prefs.speakSigns })}
                  >
                    <span />
                  </button>
                </div>

                {signedMessages.length ? (
                  <ul className="qa-list">
                    {signedMessages.map((message) => {
                      const language = getOutputLanguage(message.language)
                      return (
                        <li key={message.id} className="qa-item qa-item--student">
                          <span className="qa-item__role">
                            Student sign → text · {language.label} · {message.at}
                          </span>
                          <p>{message.entries.map((entry) => entry.english).join(' ')}</p>
                          {language.id !== 'en' ? (
                            <p className="signed-native" lang={language.id} dir={language.dir || 'ltr'}>
                              {message.entries.map((entry) => entry.text).join(' ')}
                            </p>
                          ) : null}
                          <div className="inline-actions">
                            <button
                              type="button"
                              className="btn btn--ghost btn--sm"
                              onClick={() => speakSigned(message.entries, message.language)}
                            >
                              <Icon name="play" size={15} />
                              Play audio
                            </button>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <p className="muted small">
                    Converted messages appear here as text, in English and the chosen regional language.
                  </p>
                )}

                {signNotice ? <Notice variant="warn">{signNotice}</Notice> : null}

                <Notice variant="warn" title="Translation scope">
                  The demo converts six sample hand shapes into single words. Regional text is a word-level glossary,
                  not a grammatical sentence, and not complete ISL translation.
                </Notice>
              </Panel>

              <Panel title="Student question mode" subtitle="A deaf student can type a question for the teacher" icon="users">
                <div className="input-row">
                  <label className="field field--grow">
                    <span>Your question</span>
                    <input
                      type="text"
                      value={question}
                      onChange={(event) => setQuestion(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') sendQuestion()
                      }}
                      placeholder="Can you explain this concept again?"
                    />
                  </label>
                  <button type="button" className="btn btn--primary" onClick={sendQuestion}>
                    <Icon name="send" size={17} />
                    Send to teacher
                  </button>
                </div>
                {questions.length ? (
                  <ul className="qa-list">
                    {questions.map((item) => (
                      <li key={item.id} className="qa-item qa-item--student">
                        <span className="qa-item__role">Student → Teacher</span>
                        <p>{item.text}</p>
                        <button
                          type="button"
                          className="btn btn--ghost btn--sm"
                          onClick={() =>
                            setOverride({
                              sequence: processText(item.text).sequence,
                              label: 'Student question in signs',
                            })
                          }
                        >
                          <Icon name="hand" size={15} />
                          Also show in signs
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="muted small">Questions you send appear here as text for the teacher.</p>
                )}
              </Panel>

              <Panel title="Teacher response mode" subtitle="Type or speak a reply — supported content is signed" icon="chat">
                <label className="field">
                  <span>Teacher response</span>
                  <textarea
                    rows={3}
                    value={teacherReply}
                    onChange={(event) => setTeacherReply(event.target.value)}
                    placeholder="Type your response…"
                  />
                </label>
                <div className="inline-actions">
                  <button type="button" className="btn btn--primary btn--sm" onClick={sendReply}>
                    <Icon name="hand" size={16} />
                    Show response in signs
                  </button>
                  <button type="button" className="btn btn--ghost btn--sm" onClick={startTeacherReplyMic}>
                    <Icon name="mic" size={16} />
                    Speak response
                  </button>
                </div>
                {replies.length ? (
                  <ul className="qa-list">
                    {replies.map((item) => (
                      <li key={item.id} className="qa-item qa-item--teacher">
                        <span className="qa-item__role">Teacher → Class</span>
                        <p>{item.text}</p>
                        <small className="muted">
                          {item.sequence.length
                            ? `${item.sequence.length} supported sign${item.sequence.length > 1 ? 's' : ''} generated`
                            : 'No supported signs in this reply — shown as text only'}
                        </small>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Panel>

              <Notice variant="info" title="Why participation matters">
                Accessibility is not only about receiving a lesson. Students need a way to ask, answer and be heard.
                SignSync AI keeps a text channel open for the teacher alongside the visual sign channel.
              </Notice>
            </div>
          ) : null}

          {tab === 'announcements' ? (
            <div className="stack" role="tabpanel" id="panel-announcements" aria-labelledby="tab-announcements">
              <Panel title="Classroom announcements" subtitle="Shown as text, captions and a sign demonstration" icon="alert">
                <div className="announcement-list">
                  {ANNOUNCEMENTS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`announcement ${announcement.id === item.id ? 'is-active' : ''}`}
                      onClick={() => {
                        setAnnouncement(item)
                        setOverride({
                          sequence: processText(item.text).sequence,
                          label: 'Announcement in signs',
                        })
                      }}
                    >
                      <span className="pill pill--soft">{item.category}</span>
                      <p>{item.text}</p>
                      <span className="announcement__cta">
                        <Icon name="hand" size={15} />
                        Show announcement in signs
                      </span>
                    </button>
                  ))}
                </div>
                <Notice variant="info" title="Selected announcement">
                  <p>{announcement.text}</p>
                  <p className="small muted">
                    {announcementProcessed.sequence.length} supported sign(s). Any remaining words are outside
                    the demo vocabulary and stay visible as text.
                  </p>
                </Notice>
              </Panel>
            </div>
          ) : null}

          {tab === 'learning' ? (
            <div className="stack" role="tabpanel" id="panel-learning" aria-labelledby="tab-learning">
              <Panel title="Topic learning" subtitle="Pick a classroom topic and see its supported signs" icon="book">
                <div className="topic-row">
                  {LEARNING_TOPICS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`topic-chip ${item.id === topicId ? 'is-active' : ''}`}
                      onClick={() => setTopicId(item.id)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <p className="muted">{topic.blurb}</p>
                <ul className="word-grid">
                  {topic.words.map((id) => {
                    const entry = VOCAB_BY_ID[id]
                    if (!entry) return null
                    return (
                      <li key={id}>
                        <button
                          type="button"
                          className="word-card"
                          onClick={() => setOverride({ sequence: [id], label: `${entry.label} — sign demonstration` })}
                        >
                          <strong>{entry.label}</strong>
                          <span>{entry.meaning}</span>
                          <em>
                            <Icon name="play" size={13} />
                            Show sign
                          </em>
                        </button>
                      </li>
                    )
                  })}
                </ul>
                <p className="muted small">
                  These topic sets are a sample mapping created for the prototype, not an official curriculum.
                </p>
              </Panel>
            </div>
          ) : null}
        </div>

        <aside className="classroom__stage">
          <div className="stage-card">
            <div className="stage-card__head">
              <div>
                <span className="pill pill--teal">
                  <span className="live-dot" aria-hidden="true" />
                  {simRunning ? 'Simulation running' : 'Avatar ready'}
                </span>
                <h2>ISL sign demonstration</h2>
              </div>
              <Link to="/how-it-works" className="icon-btn" aria-label="How the avatar animation works">
                <Icon name="sparkles" size={18} />
              </Link>
            </div>

            <SignPlayer
              sequence={active.sequence}
              speed={prefs.playbackSpeed}
              captionLabel={active.label}
              emptyHint="Start the teaching simulation or type a sentence to generate a sign sequence."
            />

            <div className="speed-control">
              <label htmlFor="classroom-speed">
                <Icon name="slow" size={15} />
                Playback speed
              </label>
              <input
                id="classroom-speed"
                type="range"
                min="0.5"
                max="1.5"
                step="0.25"
                value={prefs.playbackSpeed}
                onChange={(event) => setPrefs({ playbackSpeed: Number(event.target.value) })}
              />
              <span>{prefs.playbackSpeed}×</span>
            </div>

            <p className="stage-card__note">
              Demonstration vocabulary only. Signs are shown in English word order — not grammatically accurate ISL.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
