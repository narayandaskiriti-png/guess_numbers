import { useEffect, useState } from 'react'
import { ArrowUp, ArrowDown, Check, RotateCcw, Sparkles, Trophy } from 'lucide-react'

const api = async (path, options = {}) => {
  const response = await fetch(path, { headers: { 'Content-Type': 'application/json' }, ...options })
  if (!response.ok) throw new Error('Something went wrong. Please try again.')
  return response.json()
}

function App() {
  const [game, setGame] = useState(null)
  const [guess, setGuess] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)

  const startGame = async () => {
    setLoading(true)
    try {
      setGame(await api('/api/games', { method: 'POST' }))
      setGuess('')
      setFeedback(null)
    } catch (error) { setFeedback({ result: 'error', message: error.message }) }
    finally { setLoading(false) }
  }

  useEffect(() => { startGame(); api('/api/games/history').then(setHistory).catch(() => {}) }, [])

  const submitGuess = async (event) => {
    event.preventDefault()
    const value = Number(guess)
    if (!game || !Number.isInteger(value) || value < 1 || value > 100) {
      setFeedback({ result: 'error', message: 'Enter a whole number from 1 to 100.' })
      return
    }
    setLoading(true)
    try {
      const result = await api(`/api/games/${game.id}/guesses`, {
        method: 'POST', body: JSON.stringify({ guess: value })
      })
      setFeedback(result)
      setGame({ ...game, attempts: result.attempts, completed: result.completed })
      if (result.completed) setHistory(await api('/api/games/history'))
    } catch (error) { setFeedback({ result: 'error', message: error.message }) }
    finally { setLoading(false) }
  }

  const icon = feedback?.result === 'correct' ? <Check /> : feedback?.result === 'higher' ? <ArrowUp /> : <ArrowDown />

  return <main className="page">
    <nav className="nav"><div className="brand"><span className="brand-mark">?</span> numberly</div><span className="nav-note">A tiny game of intuition</span></nav>
    <section className="hero">
      <div className="eyebrow"><Sparkles size={15} /> DAILY BRAIN BREAK</div>
      <h1>Find the hidden<br /><em>number.</em></h1>
      <p className="intro">I’m thinking of a number between 1 and 100.<br />Can you find it in as few tries as possible?</p>
      <div className="game-card">
        <div className="card-top"><span className="round-label">ROUND IN PROGRESS</span><span className="attempt-count">{game?.attempts || 0} guesses</span></div>
        <div className="range"><span>1</span><div className="range-line"><i></i><b></b><i></i></div><span>100</span></div>
        <form onSubmit={submitGuess} className="guess-form">
          <label htmlFor="guess">Your guess</label>
          <div className="input-row"><input id="guess" type="number" min="1" max="100" value={guess} onChange={e => setGuess(e.target.value)} placeholder="00" disabled={game?.completed || loading} autoFocus /><button disabled={game?.completed || loading}>{loading ? '...' : 'Guess'}</button></div>
        </form>
        {feedback && <div className={`feedback ${feedback.result}`}><span className="feedback-icon">{icon}</span><div><strong>{feedback.message}</strong>{feedback.result !== 'error' && !feedback.completed && <small>Keep going — you’re getting warmer.</small>}{feedback.completed && <small>That was a sharp one. Nice work!</small>}</div></div>}
        {game?.completed && <button className="play-again" onClick={startGame}><RotateCcw size={16} /> Play another round</button>}
      </div>
    </section>
    <section className="stats"><div><strong>1—100</strong><span>Possible numbers</span></div><div><strong>{history.length}</strong><span>Rounds completed</span></div><div><strong>{history[0]?.attempts || '—'}</strong><span>Best recent score</span></div></section>
    <section className="recent"><div className="section-heading"><h2>Recent wins</h2><Trophy size={19} /></div>{history.length ? <div className="history">{history.slice(0, 5).map((item, index) => <div className="history-row" key={item.id}><span className="rank">0{index + 1}</span><span>Round completed</span><strong>{item.attempts} {item.attempts === 1 ? 'guess' : 'guesses'}</strong></div>)}</div> : <p className="empty">Your wins will appear here.</p>}</section>
    <footer>Built for curious minds <span>✦</span></footer>
  </main>
}

export default App
