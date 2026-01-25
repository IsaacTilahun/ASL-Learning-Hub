<div align="center">

# 🤟 ASL Learning Hub

**Learn American Sign Language with AI-powered hand tracking**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![MediaPipe](https://img.shields.io/badge/MediaPipe-0097A7?style=flat-square&logo=google&logoColor=white)](https://mediapipe.dev/)

[Features](#features) · [Setup](#setup) · [Usage](#usage) · [Tech Stack](#tech-stack)

</div>

---

## Features

🔤 **Learn ASL Alphabet & Numbers** — Complete A-Z and 1-10 courses with visual guides

🤖 **Real-time Hand Tracking** — MediaPipe-powered gesture recognition with instant feedback

📊 **Progress Tracking** — Track accuracy, unlock achievements, auto-saved locally

🎨 **Modern Dark UI** — Sleek space-themed design with smooth animations

---

## Setup

### Requirements
- Modern browser (Chrome recommended)
- Webcam
- Good lighting

### Quick Start

```bash
# Clone the repo
git clone https://github.com/isaact06/asl-learning-hub.git
cd asl-learning-hub

# Open directly
start index.html        # Windows
open index.html         # macOS
```

Or use a local server:
```bash
# Python
python -m http.server 8000

# Node.js
npx serve
```

---

## Usage

1. **Choose a mode** — Alphabet (A-Z) or Numbers (1-10)
2. **Start camera** — Allow webcam access when prompted
3. **Practice signs** — Follow the visual guide and hints
4. **Record & submit** — Get instant accuracy feedback
5. **Track progress** — View stats and unlock achievements

### Feedback Guide
| Score | Meaning |
|-------|---------|
| 🟢 80%+ | Excellent |
| 🟡 50-79% | Good, minor adjustments needed |
| 🔴 <50% | Try again |

---

## Tech Stack

| Tech | Purpose |
|------|---------|
| **HTML5** | Structure & video/canvas elements |
| **CSS3** | Styling, animations, dark theme |
| **JavaScript** | Application logic (vanilla, no frameworks) |
| **MediaPipe Hands** | Real-time hand tracking AI |
| **LocalStorage** | Progress persistence |

---

## Project Structure

```
├── index.html      # Main app
├── styles.css      # Styling
├── app.js          # Core logic
└── images/         # ASL reference images (A-Z, 1-10)
```

---

## Contributing

1. Fork it
2. Create your branch (`git checkout -b feature/cool-feature`)
3. Commit changes (`git commit -m 'Add cool feature'`)
4. Push (`git push origin feature/cool-feature`)
5. Open a PR

---

<div align="center">

</div>

### Technologies Used
- **MediaPipe Hands**: Google's ML solution for hand tracking
- **Canvas API**: For drawing hand landmarks on video
- **Local Storage**: For persistent progress tracking
- **CSS Grid/Flexbox**: Responsive layout system
- **Vanilla JavaScript**: Core application logic

### File Structure
```
ASL/
├── index.html      # Main HTML file
├── styles.css      # All styling and animations
├── app.js         # Core application logic
└── README.md      # This file
```

## Browser Requirements

- Modern browser with WebRTC support (Chrome, Firefox, Safari, Edge)
- Webcam/camera device
- Stable internet connection (for MediaPipe CDN resources)

## Features Explained

### Hand Tracking
- Uses MediaPipe Hands for real-time detection
- Tracks 21 hand landmarks per hand
- Shows confidence level while recording
- Visual feedback with hand skeleton overlay

### Gesture Analysis
- Analyzes hand position and finger configuration
- Provides accuracy scoring (0-100%)
- Tracks confidence for each frame
- Compares against ASL sign database

### Learning Tips
- Each sign comes with helpful hints
- Tips focus on key positioning elements
- Progressive difficulty through practice
- Instant feedback for improvement

### Achievements
- 🎯 First Sign: Make your first correct sign
- ⭐ 5 Signs: Learn 5 signs correctly
- ✨ 10 Signs: Learn 10 signs correctly
- 🔤 Alphabet Done: Complete all 26 letters
- 🔢 Numbers Done: Complete all 10 numbers
- 💯 Perfect: Maintain 90% accuracy

## Keyboard Shortcuts

- **Esc**: Back to main menu
- **Space**: Record/Stop gesture
- **Enter**: Submit gesture

## Tips for Best Results

1. **Lighting**: Ensure good lighting for better hand detection
2. **Distance**: Position your hand 1-2 feet from the camera
3. **Clarity**: Make clear, distinct hand shapes
4. **Stability**: Hold signs steady for better recognition
5. **Practice**: Repeat signs multiple times for better accuracy

## Data Privacy

- All progress is stored locally in your browser
- No data is sent to external servers
- Clear browser data to reset progress
- Each device maintains separate progress

## Troubleshooting

### Camera Not Working
- Check browser permissions for camera access
- Try a different browser
- Restart the browser and application

### Hand Not Detecting
- Ensure adequate lighting
- Position hand clearly in frame
- Try different angles
- Check camera quality

### Low Accuracy Scores
- Ensure signs are clear and distinct
- Hold positions steady
- Check distance from camera
- Review sign instructions carefully

## Future Enhancements

- [ ] Machine learning model training on user gestures
- [ ] Multiplayer learning challenges
- [ ] Video tutorials for each sign
- [ ] Advanced sign phrases
- [ ] Mobile app version
- [ ] Offline mode support
- [ ] Sign language by region variants
- [ ] Leaderboard and competitions

## Contributing

To improve this application:
1. Add more ASL signs and phrases
2. Improve gesture recognition algorithms
3. Enhance UI/UX design
4. Add more languages
5. Create video tutorials

## License

This project is open source and available for educational purposes.

## Resources

- [MediaPipe Hands Documentation](https://google.github.io/mediapipe/solutions/hands)
- [ASL Dictionary](https://www.handspeak.com/)
- [SignSchool ASL Resources](https://www.signschool.com/)

## Support

For issues or suggestions, please check the following:
1. Ensure your browser is up to date
2. Clear browser cache and cookies
3. Check console for error messages
4. Try a different browser or device

---

**Happy Learning! 🤟**

Made with ❤️ for the Deaf and Hard of Hearing community
