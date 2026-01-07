# 🚀 HR Content Helper

A modern web application for creating professional LinkedIn job posts with AI assistance. Built with Firebase authentication, Express.js, and powered by LLaMA AI through Groq.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Features

- 🔐 **Multiple Authentication Methods**
  - Email/Password signup and login
  - Google OAuth integration
  - Demo account for quick testing
  - User profile with avatar display

- 🤖 **AI-Powered Content Generation (3 Variants)**
  - **Short LinkedIn Post** (150-200 words): Brief and engaging
  - **Long LinkedIn Post** (300-400 words): Comprehensive with details
  - **ATS-Friendly Description** (250-350 words): Keyword-optimized
  - Prompt mode: Natural language job description
  - Form mode: Structured job details input
  - Multiple tone options (Professional, Friendly, Concise, Enthusiastic)

- 🎨 **Modern UI/UX**
  - Enhanced user profile bar with avatar
  - Dark/Light theme toggle next to logout button
  - Theme preference saved to localStorage
  - Responsive design for all devices
  - Smooth animations and transitions
  - Lucide icon system with proper visibility

- 📊 **Content Analytics**
  - Real-time word count
  - Character count
  - Estimated reading time
  - Easy tab switching between variants

- 💾 **Template Library**
  - Save generated content as templates
  - Load previous templates
  - Delete unwanted templates
  - Templates stored in localStorage

- 📤 **Multiple Export Options**
  - Copy to clipboard (one-click)
  - Export to PDF
  - Export to CSV
  - Download as LinkedIn image graphic

- 📸 **LinkedIn Image Generator**
  - Professional job post graphics
  - Customizable templates
  - Company website integration
  - High-quality PNG download

- 🔒 **Secure Configuration**
  - Environment-based secrets management
  - Firebase config loaded from `.env`
  - No hardcoded credentials
  - Separate backend/frontend env files

## 🛠️ Tech Stack

**Frontend:**
- Vanilla JavaScript
- Firebase Authentication
- HTML5 Canvas (html2canvas)
- Lucide Icons

**Backend:**
- Node.js & Express.js
- Groq AI (LLaMA 3.3 70B)
- CORS enabled
- dotenv for configuration

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Firebase account ([Sign up here](https://console.firebase.google.com/))
- Groq API key ([Get it here](https://console.groq.com/))

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "webapp hr"
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```
   Or manually:
   ```bash
   npm install
   cd backend && npm install && cd ..
   ```

3. **Configure environment variables**

   Create a `.env` file in the **root directory**:
   ```env
   # Firebase Configuration
   # Get these from: https://console.firebase.google.com/ → Project Settings
   FIREBASE_API_KEY=your_firebase_api_key_here
   FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   FIREBASE_APP_ID=your_app_id
   FIREBASE_MEASUREMENT_ID=your_measurement_id

   # Server Ports (Optional - defaults shown)
   FRONTEND_PORT=3000
   BACKEND_PORT=5000
   ```

   Create a `.env` file in the **backend directory** (`backend/.env`):
   ```env
   # LLaMA API Configuration
   # Get your API key from: https://console.groq.com/keys
   LLAMA_API_KEY=your_llama_api_key_here
   ```

   **⚠️ IMPORTANT**: Both `.env` files are required for the application to work correctly.
   FRONTEND_PORT=3000
   BACKEND_PORT=5000
   ```

4. **Set up Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use existing
   - Enable Authentication:
     - Go to Authentication → Sign-in method
     - Enable **Email/Password**
     - Enable **Google** provider
   - Add `localhost` to Authorized domains (Authentication → Settings → Authorized domains)
   - Copy configuration from Project Settings → General → Your apps → Web app
   - Paste all values into your `.env` file

5. **Get Groq API Key**
   - Sign up at [Groq Console](https://console.groq.com/)
   - Navigate to API Keys section
   - Click "Create API Key"
   - Copy the key and add to `.env` as `LLAMA_API_KEY`

## 🎯 Running the Application

### Option 1: Run Both Servers Together (Recommended)
```bash
npm start
```
This starts both frontend (port 3000) and backend (port 5000) simultaneously.

### Option 2: Run Separately

**Frontend (Port 3000):**
```bash
npm run start:frontend
```

**Backend (Port 5000):**
```bash
npm run start:backend
```

## 📱 Usage

1. **Open your browser**
   ```
   http://localhost:3000
   ```

2. **Login**
   - Try Demo Account: `demo@example.com` / `demo123` (fastest)
   - Continue with Google
   - Email/Password signup/login

3. **View Your Profile**
   - After login, see your profile bar at the top
   - Profile picture (from Google) or initial avatar
   - User name and email displayed
   - Theme toggle (sun/moon icon) next to logout button

4. **Generate Content**
   
   **Prompt Mode:**
   - Write a natural description of your job posting
   - Select tone (Professional, Friendly, Concise, or Enthusiastic)
   - Click "Enhance from Prompt"
   
   **Form Mode:**
   - Fill in structured fields:
     - Company Name
     - Job Role
     - Required Skills
     - Eligibility Criteria
     - Company Website (optional)
     - Add custom fields as needed
   - Select tone
   - Click "Enhance from Form"

5. **Review Generated Content**
   - Switch between 3 variants using tabs:
     - **Short Post**: Quick LinkedIn post (150-200 words)
     - **Long Post**: Detailed description (300-400 words)
     - **ATS Description**: Optimized for job boards
   - View metrics: word count, character count, reading time

6. **Export Your Content**
   - **Copy**: One-click copy to clipboard
   - **Save Template**: Save for future use
   - **Export PDF**: Print-friendly format
   - **Export CSV**: Spreadsheet format with all variants
   - **Download Image**: LinkedIn-ready graphic

7. **Manage Templates**
   - Scroll to Template Library section
   - Load saved templates
   - Delete unwanted templates

8. **Toggle Theme**
   - Click sun/moon icon in user profile bar
   - Theme preference automatically saved

## 🔒 Security Notes

- ⚠️ **NEVER commit your `.env` file to version control**
- ✅ The `.env` file is already in `.gitignore`
- ✅ Use `.env.example` as a template for others
- 🔑 Keep your Firebase and Groq API keys private
- 🔄 Rotate keys immediately if exposed

## 🎨 Features Walkthrough

### User Profile Bar
- **Profile Picture**: Displays Google profile photo or first letter of email
- **User Info**: Shows display name and full email address
- **Theme Toggle**: Sun/moon icon for dark/light mode switching
- **Logout Button**: Quick and easy logout access

### Authentication
- **Email/Password**: Minimum 6 characters required with validation
- **Google OAuth**: One-click authentication with profile sync
- **Demo Account**: `demo@example.com` / `demo123` for instant testing
- **Error Handling**: Clear error messages for all authentication issues

### Content Generation (3 Variants)
- **Short LinkedIn Post**: 150-200 words, 8-12 lines, engaging format
- **Long LinkedIn Post**: 300-400 words, 20-25 lines, comprehensive details
- **ATS Description**: 250-350 words, structured with bullet points
- **Tone Options**:
  - Professional: Formal, corporate language
  - Friendly: Warm, conversational approach
  - Concise: Brief, direct messaging
  - Enthusiastic: Energetic, passionate tone

### Content Input Methods
- **Prompt Mode**: Natural language job description
- **Form Mode**: 
  - Company name, role, skills, eligibility
  - Company website and logo upload
  - Dynamic custom fields (add as many as needed)

### Template Management
- **Save Templates**: Store generated content for future use
- **Load Templates**: Quick access to previous job posts
- **Delete Templates**: Clean up unwanted entries
- **Template Info**: View company, role, date, and tone used

### Export Options
- **Copy to Clipboard**: Instant copy with success notification
- **Export PDF**: Print-ready document format
- **Export CSV**: All 3 variants in spreadsheet format
- **Download Image**: High-quality PNG for LinkedIn (1080x1080)

### Theme System
- **Light Theme**: Warm gradient background with visible icons
- **Dark Theme**: Cool dark gradient with adjusted colors
- **Persistence**: Theme choice saved across sessions
- **Smooth Transitions**: All color changes animated

## 📁 Project Structure

```
webapp hr/
├── .env                    # Frontend environment variables
├── .gitignore             # Git ignore rules
├── README.md              # This file
├── package.json           # Frontend dependencies
├── frontend.js            # Frontend server
├── start.js              # Combined server starter
├── backend/
│   ├── .env              # Backend environment variables
│   ├── server.js         # Express API server
│   └── package.json      # Backend dependencies
└── public/
    ├── index.html        # Main HTML file
    └── assets/
        └── bg2.png       # Template background
```

## 🔧 Configuration

### Firebase Setup
1. Enable Email/Password authentication
2. Enable Google authentication
3. Add authorized domains: `localhost`
4. Configure OAuth consent screen

### Groq AI Setup
1. Sign up for Groq account
2. Generate API key
3. Model used: `llama-3.3-70b-versatile`

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Firebase Errors
- Check if API key is correct in `.env` (root directory)
- Verify auth methods are enabled in Firebase Console
- Ensure authorized domains include `localhost`
- Clear browser cache and try again
- Check browser console for detailed error messages

### LLaMA/Groq API Issues
- Verify `LLAMA_API_KEY` is set in `backend/.env` (not root `.env`)
- Check API key is valid at https://console.groq.com/
- Ensure you have API credits/quota available
- Test API connection: Run `node` in backend directory and test
- Check backend console logs for detailed error messages

### Backend Not Connecting
- Ensure port 5000 is not blocked by firewall
- Verify `backend/.env` file exists and has `LLAMA_API_KEY`
- Check internet connection for Groq API access
- Look for "Backend running on http://localhost:5000" in console
- Test backend health: Visit http://localhost:5000/health

### Text Not Visible in Output
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache
- Check if content was generated (look for word count > 0)
- Try switching between light/dark themes

### Theme Toggle Icon Not Visible
- Ensure Lucide icons are loading (check browser console)
- Hard refresh the page
- Check internet connection (icons loaded from CDN)
- In light theme, sun icon should be dark gray
- In dark theme, moon icon should be light gray

### Template Library Not Working
- Check browser console for localStorage errors
- Try in incognito/private mode
- Clear browser localStorage and try again
- Ensure cookies/storage is enabled in browser

### Profile Picture Not Showing
- Only Google login provides profile pictures
- Email/password login shows first letter of email
- Check if Google account has a profile photo
- Refresh page after login

## 🌟 Features Roadmap

- [ ] Multiple language support (i18n)
- [ ] More LinkedIn template designs
- [ ] Job post analytics and insights
- [ ] Team collaboration features
- [ ] Batch job post generation
- [ ] Browser extension
- [ ] Mobile app version
- [ ] Integration with LinkedIn API
- [ ] Company branding presets
- [ ] AI tone customization
- [ ] Export to Word/Google Docs
- [ ] Scheduled posting
- [ ] A/B testing for job posts

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name

## 🙏 Acknowledgments

- [Firebase](https://firebase.google.com/) - Authentication and real-time features
- [Groq](https://groq.com/) - Ultra-fast AI inference with LLaMA 3.3 70B
- [Lucide Icons](https://lucide.dev/) - Beautiful, consistent icon system
- [html2canvas](https://html2canvas.hertzen.com/) - Client-side screenshot generation
- [Express.js](https://expressjs.com/) - Fast, minimalist web framework
- [Node.js](https://nodejs.org/) - JavaScript runtime

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check the Troubleshooting section above
- Review browser console for error messages

## 🔄 Version History

### v1.0.0 (Current)
- ✅ Multi-variant content generation (Short, Long, ATS)
- ✅ Enhanced user profile with avatars
- ✅ Theme toggle in user bar
- ✅ Template library with save/load
- ✅ Multiple export options (PDF, CSV, Image)
- ✅ Real-time content metrics
- ✅ Improved icon visibility
- ✅ Fixed LLaMA integration
- ✅ Responsive design

---

**Made with ❤️ for HR professionals**