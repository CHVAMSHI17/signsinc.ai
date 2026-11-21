import { useMemo, useState } from 'react'
import SignPlayer from '../components/SignPlayer.jsx'
import { Icon } from '../components/icons.jsx'
import { Notice, PageHero, Panel } from '../components/ui.jsx'
import { CATEGORIES, PRACTICE_POOL, VOCAB_BY_ID, VOCABULARY } from '../data/vocabulary.js'

function shuffleOptions(answerId) {
  const answer = VOCAB_BY_ID[answerId]
  const pool = VOCABULARY.filter((item) => item.id !== answerId)
  const options = [answer.meaning]
  while (options.length < 4 && pool.length) {
    const candidate = pool.splice(Math.floor(Math.random() * pool.length), 1)[0]
    if (!options.includes(candidate.meaning)) options.push(candidate.meaning)
  }
  return options.sort(() => Math.random() - 0.5)
}

export default function Learn() {
  const [category, setCategory] = useState('all')
  const [selectedId, setSelectedId] = useState('HELLO')
  const [nonce, setNonce] = useState(0)
  const [quizAnswer, setQuizAnswer] = useState(() => PRACTICE_POOL[0])
  const [quizOptions, setQuizOptions] = useState(() => shuffleOptions(PRACTICE_POOL[0]))
  const [choice, setChoice] = useState(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [round, setRound] = useState(0)

  const entries = useMemo(
    () => (category === 'all' ? VOCABULARY : VOCABULARY.filter((item) => item.category === category)),
    [category],
  )
  const selected = VOCAB_BY_ID[selectedId] || VOCABULARY[0]
  const answer = VOCAB_BY_ID[quizAnswer]

  const showSign = (id) => {
    setSelectedId(id)
    setNonce((value) => value + 1)
  }

  const nextQuestion = () => {
    let next = PRACTICE_POOL[Math.floor(Math.random() * PRACTICE_POOL.length)]
    if (next === quizAnswer) next = PRACTICE_POOL[(PRACTICE_POOL.indexOf(next) + 1) % PRACTICE_POOL.length]
    setQuizAnswer(next)
    setQuizOptions(shuffleOptions(next))
    setChoice(null)
    setRound((value) => value + 1)
  }

  const checkAnswer = (option) => {
    if (choice) return
    setChoice(option)
    setScore((prev) => ({
      correct: prev.correct + (option === answer.meaning ? 1 : 0),
      total: prev.total + 1,
    }))
  }

  return (
    <div className="page">
      <PageHero
        eyebrow="Learn Indian Sign Language"
        title="A small ISL vocabulary you can explore"
        lead="Greetings, classroom vocabulary, numbers, questions and everyday communication — each with a meaning, a 3D sign demonstration and a replay button."
      >
        <a href="#practice" className="btn btn--primary">
          <Icon name="target" size={17} />
          Try the practice quiz
        </a>
      </PageHero>

      <div className="container stack">
        <Notice variant="info" title="About this dataset">
          This is a sample demonstration vocabulary of {VOCABULARY.length} signs, created to show the technology. It is
          not an official or complete ISL dictionary, and the poses are illustrations rather than linguistically
          validated signs.
        </Notice>

        <div className="learn-layout">
          <div className="learn-layout__stage">
            <div className="stage-card">
              <div className="stage-card__head">
                <div>
                  <span className="pill pill--teal">Now showing</span>
                  <h2>{selected.label}</h2>
                </div>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => showSign(selected.id)}
                  aria-label="Replay this sign"
                >
                  <Icon name="replay" size={18} />
                </button>
              </div>
              <p className="muted">{selected.meaning}</p>
              <SignPlayer
                key={`${selected.id}-${nonce}`}
                sequence={[selected.id]}
                captionLabel="3D sign demonstration"
                allowReset={false}
              />
            </div>
          </div>

          <div className="learn-layout__list">
            <div className="category-row" role="group" aria-label="Vocabulary categories">
              <button
                type="button"
                className={`topic-chip ${category === 'all' ? 'is-active' : ''}`}
                onClick={() => setCategory('all')}
              >
                All ({VOCABULARY.length})
              </button>
              {CATEGORIES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`topic-chip ${category === item.id ? 'is-active' : ''}`}
                  onClick={() => setCategory(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <ul className="vocab-grid">
              {entries.map((entry) => (
                <li key={entry.id}>
                  <article className={`vocab-card ${entry.id === selectedId ? 'is-selected' : ''}`}>
                    <div className="vocab-card__head">
                      <h3>{entry.label}</h3>
                      <span className="pill pill--soft">
                        {CATEGORIES.find((cat) => cat.id === entry.category)?.label || entry.category}
                      </span>
                    </div>
                    <p>{entry.meaning}</p>
                    <div className="vocab-card__actions">
                      <button type="button" className="btn btn--ghost btn--sm" onClick={() => showSign(entry.id)}>
                        <Icon name="hand" size={15} />
                        Show sign
                      </button>
                      <button
                        type="button"
                        className="btn btn--ghost btn--sm"
                        onClick={() => showSign(entry.id)}
                        aria-label={`Replay ${entry.label} sign`}
                      >
                        <Icon name="replay" size={15} />
                        Replay
                      </button>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Panel
          id="practice"
          title="Practice: which meaning matches this sign?"
          subtitle="Watch the avatar, then choose the correct meaning"
          icon="target"
          actions={
            <span className="score-pill">
              Score {score.correct}/{score.total}
            </span>
          }
        >
          <div className="practice">
            <SignPlayer
              key={`quiz-${round}-${quizAnswer}`}
              sequence={[quizAnswer]}
              captionLabel="Practice sign — captions are hidden in the real exercise"
              compact
              allowSlow={false}
              allowReset={false}
            />
            <div className="practice__quiz">
              <p className="muted small">
                Practice round {round + 1} · the caption above is intentionally shown for accessibility; try covering it
                if you want a harder exercise.
              </p>
              <ul className="quiz-options">
                {quizOptions.map((option) => {
                  const isCorrect = option === answer.meaning
                  const isChosen = option === choice
                  return (
                    <li key={option}>
                      <button
                        type="button"
                        className={`quiz-option ${isChosen ? (isCorrect ? 'is-correct' : 'is-wrong') : ''} ${
                          choice && isCorrect ? 'is-answer' : ''
                        }`}
                        onClick={() => checkAnswer(option)}
                        aria-pressed={isChosen}
                      >
                        {option}
                        {choice && isCorrect ? <Icon name="check" size={16} /> : null}
                      </button>
                    </li>
                  )
                })}
              </ul>
              {choice ? (
                <div className={`practice__feedback ${choice === answer.meaning ? 'is-correct' : 'is-wrong'}`} role="status">
                  <strong>{choice === answer.meaning ? 'Correct.' : 'Not quite.'}</strong>
                  <p>
                    {answer.label} means “{answer.meaning}”
                  </p>
                  <button type="button" className="btn btn--primary btn--sm" onClick={nextQuestion}>
                    Next question
                    <Icon name="arrow" size={15} />
                  </button>
                </div>
              ) : (
                <p className="muted small">Choose one answer to see feedback.</p>
              )}
            </div>
          </div>

          <p className="muted small">
            The practice quiz uses the same sample vocabulary. Signs are demonstrations, not validated ISL — see the
            limitations on the About page.
          </p>
        </Panel>
      </div>
    </div>
  )
}
