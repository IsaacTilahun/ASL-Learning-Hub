# 🤟 ASL Learning Hub

An interactive, AI-powered web application for learning American Sign Language (ASL) alphabet and numbers with real-time hand tracking and intelligent feedback.

## Features

✨ **Interactive Learning**
- Learn ASL Alphabet (A-Z)
- Learn ASL Numbers (1-10)
- Real-time hand tracking with MediaPipe
- AI-based gesture recognition with accuracy scoring

🎮 **Engaging Gamification**
- Confidence meter for hand detection quality
- Accuracy percentage feedback
- Progress tracking and statistics
- Achievement system with badges
- Celebration animations on success

📊 **Progress Tracking**
- Track learning progress for each sign
- Overall accuracy percentage
- Statistics for alphabet and numbers
- Achievement unlock system
- Local storage persistence

🎨 **Beautiful UI**
- Modern, responsive design
- Dark theme with gradient accents
- Smooth animations and transitions
- Mobile-friendly layout
- Real-time visual feedback

## How to Use

### 1. **Start the Application**
- Open `index.html` in a modern web browser
- Allow camera permissions when prompted

### 2. **Choose a Learning Mode**
- **Alphabet (A-Z)**: Learn all 26 letters of ASL alphabet
- **Numbers (1-10)**: Learn numbers from 1 to 10
- **Progress Tracker**: View your learning statistics and achievements

### 3. **Learn a Sign**
1. Watch the target sign display with instructions
2. Position your hand in front of the camera
3. Click "Record Gesture" when ready
4. Click "Stop Recording" after showing the sign
5. Click "Submit" to check your accuracy
6. Get instant feedback with tips for improvement

### 4. **Track Progress**
- View your accuracy percentage in the header
- Check detailed statistics in the Progress Tracker
- Unlock achievements as you learn
- View what you've mastered vs. what needs practice

## Technical Details

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
