# 🔧 Hand Detection Troubleshooting Guide

## Quick Fixes

### 1. **Camera Not Working**
- ✅ Check browser allows camera access (check browser notifications/settings)
- ✅ Try a different browser (Chrome/Chromium works best)
- ✅ Restart your browser completely
- ✅ Check if another app is using your camera
- ✅ Ensure camera is physically connected/not disabled

### 2. **Hand Not Detected**
- ✅ **Good Lighting**: Make sure your hand is well-lit
- ✅ **Clear View**: Keep your hand in the center of the video frame
- ✅ **Distance**: Position hand 1-2 feet from camera (not too close, not too far)
- ✅ **Clear Shapes**: Make distinct hand shapes (not blurry or partial)
- ✅ **One or Two Hands**: The app detects up to 2 hands at once
- ✅ **Contrast**: Wear contrasting colors to hand (light hand = dark background, etc.)

### 3. **Low Confidence Score**
- ✅ Increase lighting around you
- ✅ Move hand more into the center of frame
- ✅ Hold your hand very still when making shapes
- ✅ Make bolder, clearer hand gestures

### 4. **Page Not Loading**
- ✅ Check your internet connection (MediaPipe loads from CDN)
- ✅ Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
- ✅ Try opening in incognito/private mode
- ✅ Disable browser extensions that might interfere

## Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome/Edge | ✅ Best | Recommended - most stable |
| Firefox | ✅ Good | Works well with permissions |
| Safari | ✅ Good | macOS/iOS versions supported |
| Opera | ✅ Good | Chromium-based |
| IE | ❌ No | Not supported |

## Enable Browser Console (For Advanced Troubleshooting)

### Windows/Linux:
- Press `F12` or `Ctrl+Shift+I`

### Mac:
- Press `Cmd+Option+I`

## Debug in Console

Once the browser console is open, run this command:

```javascript
debugASL()
```

This will show you:
- MediaPipe status
- Camera availability
- Hand detector status
- Your current progress data
- Browser information

## Common Error Messages

### "Camera Error: Permission Denied"
**Solution**: 
1. Go to browser settings
2. Find Privacy/Permissions section
3. Allow camera access for this website
4. Refresh the page

### "No hands detected"
**Solution**:
1. Move hand into frame slowly
2. Check lighting (open lights or go near window)
3. Try different hand positions
4. Make sure hand isn't blurry

### "MediaPipe not loading"
**Solution**:
1. Check internet connection
2. Wait 5-10 seconds for CDN to load
3. Refresh page
4. Try different browser

### "Canvas context not available"
**Solution**:
1. Refresh the page
2. Try different browser
3. Check console for more details (F12)

## Lighting Tips

### Good Lighting Setup:
- Natural window light (best)
- Desk lamp angled toward hand
- Avoid backlit situations
- Avoid harsh shadows on hand
- Well-lit face area helps detection

### Poor Lighting:
- ❌ Dark room with only screen light
- ❌ Direct sunlight (overexposure)
- ❌ One side of hand in shadow
- ❌ Hand against white background only

## Camera Positioning

### Optimal Setup:
```
    👤 (Your Face - optional in view)
    
    ✋ (Your Hand - center of frame)
    
    📱 (Camera - eye level or slightly below)
```

### Best Practices:
1. Position camera at arm's level or slightly higher
2. Keep 2-3 feet distance from camera
3. Center your hand in the frame
4. Leave some space around your hand
5. Avoid partial hand visibility

## Performance Tips

- Close other browser tabs for better performance
- Disable unnecessary browser extensions
- Ensure your computer has adequate resources
- Update your browser to latest version
- Use wired internet if possible (more stable than WiFi)

## Video Quality Issues

### If video looks laggy:
1. Check internet connection
2. Close other applications
3. Try lowering browser resolution (zoom out)
4. Use Chrome for better performance
5. Restart computer if very slow

### If video looks grainy:
1. Improve lighting conditions
2. Clean camera lens
3. Move to brighter area
4. Adjust camera angle

## Still Not Working?

### Try These Steps in Order:

1. **Full Refresh**
   - Close browser completely
   - Wait 10 seconds
   - Reopen browser
   - Open ASL app again

2. **Clear Cache**
   - Press Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
   - Clear all time, all data
   - Refresh page

3. **Try Different Browser**
   - If Chrome doesn't work, try Firefox or Safari
   - Each browser loads resources differently

4. **Check Permissions**
   - Browser Settings → Privacy/Security
   - Find Camera permissions
   - Ensure site has permission
   - Refresh page

5. **Debug Information**
   - Press F12 to open console
   - Type `debugASL()` and press Enter
   - Share screenshot of console output if asking for help

6. **Internet Connection**
   - MediaPipe resources load from CDN
   - Need stable internet connection
   - Try on different network if available

7. **Hardware Check**
   - Test camera in other application (Zoom, Skype)
   - If camera doesn't work elsewhere, it's a hardware issue
   - Try USB camera if built-in camera broken

## Advanced Troubleshooting

### Access Full Console Logs:
1. Open browser console (F12)
2. Click on "Console" tab
3. Scroll through messages
4. Look for red error messages
5. Take screenshot of errors

### Check Network Issues:
1. Open browser console (F12)
2. Click on "Network" tab
3. Reload page
4. Look for red failed requests
5. Check if MediaPipe files loaded (should be green)

### Test Camera Separately:
```javascript
// Run in console to test camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(() => console.log('✓ Camera works!'))
  .catch(err => console.error('✗ Camera error:', err));
```

## Getting Help

When asking for help, provide:
1. Browser and version
2. Operating system
3. Screenshot of error
4. Console output (F12 → Console)
5. Steps you already tried
6. Result of `debugASL()` command

## FAQ

**Q: Why does it need camera access?**
A: Camera access is required for real-time hand tracking. The app runs locally - no video is recorded or sent anywhere.

**Q: Is my video recorded?**
A: No! All processing happens on your computer. No video is saved or uploaded.

**Q: Why does hand detection take time?**
A: MediaPipe AI model needs to process video frames. Better computers are faster. This is normal.

**Q: Can I use just one hand?**
A: Yes! App detects 1-2 hands. You can use one or both.

**Q: Why is confidence low sometimes?**
A: Confidence depends on lighting, hand clarity, and hand visibility. Better lighting = higher confidence.

**Q: Does it work on mobile?**
A: Not optimized for mobile yet. Works best on desktop/laptop.

---

**Still stuck?** Try these resources:
- MediaPipe Documentation: https://google.github.io/mediapipe/solutions/hands
- Browser Console Help: Open F12 in any browser
- Check your internet: speedtest.net

**Pro Tip**: Good lighting is 80% of the solution! 💡
