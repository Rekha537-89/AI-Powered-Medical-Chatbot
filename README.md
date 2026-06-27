# AI-Powered Medical Chatbot using IBM Watson

An intelligent healthcare assistance application powered by IBM Watson AI that provides personalized, context-aware healthcare guidance, wellness recommendations, and general medical information through natural language conversations.

![Healthcare Assistant](https://img.shields.io/badge/AI-Healthcare%20Assistant-blue)
![IBM Watson](https://img.shields.io/badge/Powered%20by-IBM%20Watson-052FAD)
![Status](https://img.shields.io/badge/Status-Active-success)

## 🎯 Project Overview

This AI Healthcare Assistant leverages IBM Watson's advanced natural language processing capabilities and the IBM Granite 3 H Small language model to deliver:

- **24/7 Healthcare Support**: Round-the-clock access to health information
- **Natural Language Interface**: Conversational AI for easy interaction
- **Personalized Recommendations**: Context-aware wellness and nutrition guidance
- **Preventive Healthcare**: Promotes healthy lifestyle practices
- **Professional Guidance**: Encourages consultation with healthcare professionals when needed

## ✨ Key Features

### 🤖 AI-Powered Chat Interface
- Real-time conversational AI using IBM Watson
- Context-aware responses based on conversation history
- Natural language understanding and generation
- Typing indicators and smooth animations

### 🏥 Healthcare Capabilities
- General health information and guidance
- Symptom information (educational purposes only)
- Wellness and nutrition recommendations
- Exercise and fitness tips
- Mental health and stress management advice
- Sleep quality improvement suggestions
- Preventive care guidelines

### 💡 Quick Actions
- Pre-defined health queries for common topics
- One-click access to frequently asked questions
- Fast navigation to wellness topics

### 📊 Wellness Dashboard
- Heart health monitoring tips
- Nutrition guidance
- Fitness recommendations
- Mental health resources
- Sleep quality improvement
- Preventive care information

### 🎨 Modern User Interface
- Clean, healthcare-themed design
- Responsive layout for all devices
- Smooth animations and transitions
- Accessible and user-friendly
- Dark mode compatible

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **AI Platform**: IBM Watson AI
- **Language Model**: IBM Granite 3 H Small
- **API**: IBM Watson ML REST API
- **Authentication**: IBM Cloud IAM
- **Storage**: LocalStorage for conversation history

## 📋 Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- IBM Cloud account with Watson AI access
- Valid IBM Watson API credentials

## 🚀 Getting Started

### 1. Clone or Download the Project

```bash
git clone <repository-url>
cd healthcare-assistance
```

### 2. Configure IBM Watson Credentials

The application is pre-configured with the following credentials:

```javascript
const IBM_CONFIG = {
    projectId: 'a0a5cc1f-6385-4952-be11-f9c19c29b36e',
    apiKey: 's2tJtVXy9V9H8iMjsMo_aGtMyIGMElrR-IYzlSecKcyP',
    endpoint: 'https://us-south.ml.cloud.ibm.com',
    modelId: 'ibm/granite-3-8b-instruct'
};
```

**Note**: For production use, replace these with your own IBM Watson credentials.

### 3. Run the Application

#### Option A: Using a Local Server (Recommended)

**Using Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Using Node.js:**
```bash
npx http-server -p 8000
```

**Using PHP:**
```bash
php -S localhost:8000
```

Then open your browser and navigate to:
```
http://localhost:8000
```

#### Option B: Direct File Access

Simply open `index.html` in your web browser. However, some features may be limited due to CORS restrictions.

## 📖 Usage Guide

### Starting a Conversation

1. **Type Your Question**: Enter your health-related query in the chat input box
2. **Use Quick Actions**: Click on pre-defined quick action buttons for common queries
3. **Explore Wellness Topics**: Navigate to the Wellness section for specific health topics

### Example Queries

- "What are the symptoms of common cold?"
- "Give me tips for better sleep"
- "What is a healthy diet plan?"
- "How to manage stress?"
- "Exercise recommendations for beginners"
- "How to boost immunity?"

### Navigation

- **Chat Tab**: Main conversation interface
- **Wellness Tab**: Health topic dashboard
- **About Tab**: Information about the assistant

### Features

- **Clear Chat**: Remove conversation history
- **Conversation Persistence**: Chat history is saved locally
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🔒 Security & Privacy

- All API calls are made securely over HTTPS
- Conversation history is stored locally in your browser
- No personal health information is transmitted to third parties
- IBM Watson API credentials should be kept secure

## ⚠️ Important Disclaimer

**THIS AI ASSISTANT IS NOT A SUBSTITUTE FOR PROFESSIONAL MEDICAL ADVICE, DIAGNOSIS, OR TREATMENT.**

- Always consult qualified healthcare professionals for medical advice
- Never disregard professional medical advice based on AI responses
- In case of emergency, call your local emergency services immediately
- This tool provides general information only, not personalized medical advice

## 🏗️ Project Structure

```
healthcare-assistance/
│
├── index.html          # Main HTML file with UI structure
├── styles.css          # Complete styling and responsive design
├── script.js           # JavaScript with IBM Watson integration
└── README.md           # Project documentation
```

## 🎨 Customization

### Changing Colors

Edit the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #0f62fe;
    --secondary-color: #0043ce;
    --success-color: #24a148;
    /* ... more variables */
}
```

### Modifying System Prompt

Edit the `SYSTEM_PROMPT` constant in `script.js` to customize the AI's behavior:

```javascript
const SYSTEM_PROMPT = `Your custom system prompt here...`;
```

### Adding Quick Actions

Add new quick action buttons in `index.html`:

```html
<button class="quick-btn" data-query="Your query here">
    <i class="fas fa-icon"></i>
    <span>Button Label</span>
</button>
```

## 🐛 Troubleshooting

### API Connection Issues

1. **Check Internet Connection**: Ensure you have a stable internet connection
2. **Verify Credentials**: Confirm IBM Watson API credentials are correct
3. **Check Console**: Open browser developer tools to see error messages
4. **CORS Issues**: Use a local server instead of opening HTML directly

### Chat Not Working

1. **Clear Browser Cache**: Clear cache and reload the page
2. **Check LocalStorage**: Ensure browser allows localStorage
3. **Disable Extensions**: Some browser extensions may interfere

### Styling Issues

1. **Clear Cache**: Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
2. **Check CSS Loading**: Verify `styles.css` is loading correctly
3. **Browser Compatibility**: Use a modern, updated browser

## 🔄 Future Enhancements

- [ ] Multi-language support
- [ ] Voice input/output capabilities
- [ ] Integration with health tracking devices
- [ ] Appointment scheduling assistance
- [ ] Medication reminders
- [ ] Health metrics tracking
- [ ] Export chat history
- [ ] Dark mode toggle
- [ ] User authentication
- [ ] Backend API for enhanced security

## 📊 API Information

### IBM Watson ML API

- **Endpoint**: `https://us-south.ml.cloud.ibm.com`
- **Model**: IBM Granite 3 H Small (`ibm/granite-3-8b-instruct`)
- **Authentication**: IBM Cloud IAM Bearer Token
- **Rate Limits**: Subject to IBM Cloud plan limits

### API Parameters

```javascript
{
    decoding_method: 'greedy',
    max_new_tokens: 900,
    min_new_tokens: 0,
    stop_sequences: [],
    repetition_penalty: 1.0
}
```

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is provided as-is for educational and demonstration purposes.

## 👥 Support

For issues or questions:
- Check the troubleshooting section
- Review IBM Watson documentation
- Contact IBM Cloud support for API-related issues

## 🙏 Acknowledgments

- **IBM Watson**: For providing the AI platform and language model
- **IBM Granite 3**: Advanced language model powering the assistant
- **Font Awesome**: For the icon library
- **IBM Plex**: For the typography

## 📞 Emergency Contacts

**This is not an emergency service. For medical emergencies:**

- **USA**: 911
- **UK**: 999 or 112
- **India**: 102 or 108
- **Australia**: 000
- **Canada**: 911

Always call your local emergency number in case of a medical emergency.

---

**Built with ❤️ for better healthcare accessibility**

*Powered by IBM Watson AI | Version 1.0.0*