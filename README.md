# ASL Learning Hub

A browser-based tool for practicing the ASL alphabet and numbers 1 to 10. It turns your webcam into a practice partner: hold up a sign, and it tells you how close you are.

We built this at a hackathon and cleaned it up afterward. No installs, no accounts. Clone it, serve it, and it runs.

## How it works

MediaPipe reads 21 points on your hand from the webcam feed and draws a skeleton overlay in real time. From those points we work out which fingers are extended versus curled, compare that against the pattern expected for the sign you're on, and turn the match into a score. Hold a decent shape and you'll see the confidence meter respond before you even record.

To attempt a sign: record a few seconds of your hand, hit submit, and get a percentage back. Score 50% or better and it's marked learned.

It's a simple heuristic, not a trained model, so it's upfront about where it struggles. Signs that differ mainly in finger *curvature* (C vs. O) or *motion* (J, Z) rather than which fingers are up can come out looking similar. Good next thing for anyone picking this up to improve.

## Features

- Full ASL alphabet (A to Z) and numbers (1 to 10), each with a reference photo and hand-position hints
- Live hand tracking with a skeleton overlay, powered by MediaPipe Hands
- A confidence meter that grades your hand shape as you move, before you commit to an attempt
- Progress tracking and achievements, saved locally in your browser
- Optional AI-generated encouragement messages on your progress screen (see below)

## Running it locally

You need to serve this over HTTP. Opening `index.html` directly won't work, since browsers block camera access and ES modules on `file://`.

```bash
git clone https://github.com/IsaacTilahun/asl-learning-hub.git
cd asl-learning-hub
python -m http.server 8000
```

(or `npx serve` if you'd rather use Node)

Then open `localhost:8000` and allow camera access when it asks. Chrome tends to give the most reliable hand tracking.

### Optional: AI encouragement messages

The progress screen can show a short AI-written encouragement line instead of a static one. It's off by default and needs no setup to use the app normally. If you want to turn it on, drop an API key for an OpenAI-compatible endpoint into your browser console:

```js
localStorage.setItem('encouragementApiKey', 'your-key-here')
```

The endpoint and model are set in `js/config.js`. Don't put a real key in that file directly. This is a static site, so anything committed there ships to every visitor.

## Project structure

```
index.html              menu, lesson view, and modals
css/                     base styles, layout, components, animations, responsive
js/
  main.js                entry point, wires everything together
  config.js               tracking, scoring, and API settings
  data/                   sign reference data and finger patterns
  tracking/               camera handling, MediaPipe loop, canvas overlay
  recognition/            finger detection and scoring logic
  lesson/                 lesson flow: navigation, recording, submitting
  ui/                     DOM handling, feedback, modals
  storage/                localStorage progress
  services/               optional encouragement API client
images/                  reference photos for A to Z and 1 to 10
```

## Privacy

Everything runs client-side. Your webcam feed never leaves your browser, and progress is stored in `localStorage` on your own machine. Clear your browser data and it's gone. The only thing that ever leaves your device is the count of signs you've learned, and only if you've opted into the AI encouragement feature above.

## Built with

- [MediaPipe Hands](https://google.github.io/mediapipe/solutions/hands) for hand landmark tracking, does the heavy lifting here
- Vanilla JavaScript, HTML, and CSS. No framework, no build step
- Google Fonts (Bricolage Grotesque, Hanken Grotesk)

## Built by

Isaac Tilahun

Chukwuka Okwusiuno

Mohammad Saeed

## License

No license yet. Feel free to open an issue if you'd like one added.
