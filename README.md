# SignSync AI

**Every Voice Deserves to Be Understood.**

A hackathon prototype for AI-assisted classroom accessibility and two-way communication with Indian
Sign Language (ISL) demonstrations. A teacher's speech or typed text becomes readable captions and a
sign sequence performed by a 3D avatar. The same pipeline powers everyday conversation and a small
sign-to-text demo.

This is a demonstration, not a translation product. See [Simulated vs real](#simulated-vs-real).

---

## Install and run

Requirements: Node.js 18+ and npm. No API keys, accounts or backend are needed.

```bash
npm ci          # install from the lockfile
npm run dev     # dev server on http://0.0.0.0:3001
```

Open <http://localhost:3001>. The server binds `0.0.0.0:3001` with `strictPort` and will fail if that
port is already taken.

Production build:

```bash
npm run build
npm run preview   # serves dist/ on 0.0.0.0:3001
```

### Preview hostname environment variable

When the app is opened through a tunnel or cloud preview hostname (for example a
`*.style.dev` preview URL), Vite rejects the request with
**“Blocked request. This host … is not allowed.”** until that exact hostname is allowlisted.

Pass it to the dev or preview server, comma-separated, with no protocol or path:

```bash
VITE_ADDITIONAL_ALLOWED_HOSTS="my-preview-host.example.dev" npm run dev
```

`vite.config.js` reads `VITE_ADDITIONAL_ALLOWED_HOSTS` and hands it to Vite's `allowedHosts`. The
hostname is deliberately not committed to the config, because preview hostnames are temporary. After
a preview is recreated, re-run the server with the new hostname.

The app does **not** reach the preview through `localhost`: open the preview URL the host provides,
not `localhost:3001` from your own machine.

---

## Demo script for judges (~6 minutes)

Start at `/` (Home) so the hero avatar is already signing. Narrate the limitation up front: *sample
vocabulary, illustrative signs, not validated ISL.*

**1. Classroom Mode — `/classroom` (~2 min)**
- Press **Start Teaching Simulation**. The lines advance automatically; each is captioned and signed.
- Point out the recognition panel: the sentence as text, the supported keywords, and the coverage
  percentage. Words outside the demo vocabulary are listed, not hidden.
- Press **Replay**, then **Slow**, to show the sign sequence is controllable, not a video.
- Open the **Participation** tab: type a student question, then a teacher reply, and show the reply
  signed back. Open **Announcements** and pick one to sign it.

**2. Communication Mode — `/communication` (~1.5 min)**
- Type or use a quick phrase such as *“Hello, how are you?”* as Person A.
- The Person B panel shows the same sentence as captions, matched signs and a confidence-free sign
  sequence on the avatar.
- Clear history to show nothing is stored on a server (only this browser).

**3. Sign recognition — `/sign-recognition` (~1 min)**
- With a camera: **Start camera**, show one of the six sample hand shapes.
- Without a camera or permission: press **Simulate a gesture** — it is explicitly labelled as
  simulated — or use the manual fallback dropdown.
- The recognised word appears with a confidence score and is signed back by the avatar.

**4. AI sign generation — `/ai-generation` (~1 min)**
- Press **Generate sign sequence**. The seven pipeline stages run live from idle; the readout shows
  the original sentence, recognised keywords and the generated sequence.
- Try *“Welcome to today's science class.”* to show the “Some words are outside the current
  demonstration vocabulary” notice.

**5. Close (~30 s)**
- `/learn` — pick a sign, replay it, answer one practice quiz question.
- `/how-it-works` — run the pipeline once, then show the architecture and accessibility notes.
- `/about` — SDG 4 and the explicit limitations list.

Backup for a bad network or no camera: every camera and microphone path has a text, simulation or
manual fallback, so the full script works offline from a local build.

---

## Simulated vs real

| Area | Status | Detail |
| --- | --- | --- |
| Text → keywords → sign sequence | **Real, rule-based** | Deterministic longest-phrase-first matching with light stemming and stopwords against a 60-entry demo vocabulary. No ML model, no LLM. |
| 3D avatar | **Real** | Procedurally built `three` / React Three Fiber rig, joint-angle poses, damped blending, finger articulation, playback controls. Poses are hand-authored illustrations. |
| Captions and history | **Real** | Captions are rendered from the same sequence. Profile, preferences and conversation history persist in `localStorage`. |
| Speech recognition | **Real when available** | Browser Web Speech API with `en-IN`. Works in Chromium browsers (Chrome/Edge); requires mic permission and network. Other browsers fall back to text input. |
| Camera hand tracking | **Real when available** | MediaPipe Hand Landmarker loaded from a CDN on demand; landmarks are classified by a small hand-shape rule set. Requires camera permission and network for the model. |
| Classroom “teaching simulation” | **Simulated** | Four canned sentences advance on a timer; labelled as a simulation in the UI. |
| “Simulate a gesture” | **Simulated** | Cycles six canned gestures with synthetic confidence, labelled as simulated. |
| ISL vocabulary and poses | **Illustrative** | 60 sample signs signed in English word order. Not grammatically accurate ISL and not validated by ISL educators or deaf users. |
| Sign recognition accuracy | **Demo only** | Six hand shapes classified from a single hand. No movement, two-handed signs, facial expression or grammar. |
| Accounts, backend, cloud | **None** | No server, no uploads, no analytics. Camera frames and audio stay in the browser. |

---

## Project map

```
src/
  pages/        Landing, Dashboard, Classroom, Communication, AiGeneration,
                Learn, HowItWorks, About, Profile, SignRecognition, NotFound
  components/   Layout, SignPlayer, Avatar3D, ui, icons
  data/         vocabulary (60 signs), poses (rig data), classroom content
  lib/          processor (text→sequence), speech, gestures, storage
  context/      AppContext — profile, preferences, conversation, recent activity
  styles.css    Design system, high-contrast and large-text variants, responsive rules
```

All content is sample data created for this prototype. See `/about` in the running app for the full
limitations list.
