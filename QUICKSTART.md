# Quick Start Guide - AI Healthcare Assistant

Get your AI Healthcare Assistant up and running in minutes!

## 🚀 Quick Setup (3 Steps)

### Step 1: Download the Project
Download all project files to a folder on your computer.

### Step 2: Start a Local Server

Choose one of these methods:

**Option A - Using Python (Easiest)**
```bash
# Open terminal/command prompt in the project folder
python -m http.server 8000
```

**Option B - Using Node.js**
```bash
# Install http-server globally (one-time)
npm install -g http-server

# Run the server
http-server -p 8000
```

**Option C - Using VS Code**
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Step 3: Open in Browser
Navigate to: `http://localhost:8000`

## ✅ Verify It's Working

You should see:
- ✅ Healthcare Assistant header with heartbeat icon
- ✅ Welcome message from the AI bot
- ✅ Chat input box at the bottom
- ✅ Quick action buttons on the left sidebar
- ✅ Navigation tabs (Chat, Wellness, About)

## 🎯 Try These First

Click on any quick action button or type:
- "What are the symptoms of common cold?"
- "Give me tips for better sleep"
- "How to boost immunity?"

## 📱 Features to Explore

### 1. Chat Interface
- Type any health-related question
- Get AI-powered responses
- View conversation history
- Clear chat when needed

### 2. Quick Actions (Left Sidebar)
- Common Cold Symptoms
- Sleep Tips
- Healthy Diet
- Stress Management
- Exercise Tips
- Boost Immunity

### 3. Wellness Dashboard
- Click "Wellness" tab
- Explore 6 health topics:
  - Heart Health
  - Nutrition
  - Fitness
  - Mental Health
  - Sleep Quality
  - Preventive Care

### 4. About Section
- Learn about the technology
- Read important disclaimers
- Understand capabilities

## 🔧 Troubleshooting

### Problem: Page doesn't load
**Solution**: Make sure you're using a local server, not opening the HTML file directly.

### Problem: Chat doesn't respond
**Solution**: 
1. Check your internet connection
2. Open browser console (F12) to see errors
3. Verify IBM Watson credentials are correct

### Problem: Styling looks broken
**Solution**: 
1. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache
3. Ensure `styles.css` is in the same folder

### Problem: CORS errors
**Solution**: Use a local server instead of opening HTML directly

## 🎨 Customization Tips

### Change Colors
Edit `styles.css` line 8-15:
```css
:root {
    --primary-color: #0f62fe;  /* Change this */
    --secondary-color: #0043ce; /* And this */
}
```

### Add Quick Actions
Edit `index.html` around line 60, add:
```html
<button class="quick-btn" data-query="Your question here">
    <i class="fas fa-heart"></i>
    <span>Your Label</span>
</button>
```

### Modify AI Behavior
Edit `script.js` line 11, change the `SYSTEM_PROMPT` text.

## 📊 System Requirements

- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Internet**: Active connection required
- **Storage**: ~2MB for application files
- **RAM**: Minimal (runs in browser)

## 🔐 Security Notes

- API key is embedded in `script.js` (line 3)
- For production, move credentials to environment variables
- All communication uses HTTPS
- No data is stored on external servers
- Conversation history stays in your browser

## 📞 Need Help?

1. **Check README.md** - Comprehensive documentation
2. **Browser Console** - Press F12 to see errors
3. **IBM Watson Docs** - https://cloud.ibm.com/docs/watson
4. **GitHub Issues** - Report bugs or ask questions

## ⚠️ Important Reminders

- 🚨 **NOT for emergencies** - Call 911 or local emergency services
- 👨‍⚕️ **NOT medical advice** - Always consult healthcare professionals
- 📚 **Educational only** - General information, not diagnosis
- 🔒 **Keep credentials safe** - Don't share API keys publicly

## 🎉 You're Ready!

Start chatting with your AI Healthcare Assistant and explore all the features!

---

**Need more details?** Check out the full [README.md](README.md) file.

**Having issues?** Open browser console (F12) and check for error messages.