# 🔑 Gemini API Setup Guide

## Step 1: Get Your Gemini API Key

1. **Visit Google AI Studio**
   - Go to: https://makersuite.google.com/app/apikey
   - Sign in with your Google account

2. **Create API Key**
   - Click "Create API Key" button
   - Select or create a Google Cloud project
   - Copy your generated API key

3. **API Key Format**
   - Your key will look like: `AIzaSy...` (long string)
   - Keep it secret and secure!

---

## Step 2: Add API Key to Your Project

### Option A: Create `.env` File (Recommended)

1. In your project root folder, create a file named `.env` (if it doesn't exist)
2. Add this line (replace with your actual key):

```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

### Option B: Update Existing `.env` File

If you already have a `.env` file, just add the new variable:

```env
# Existing variables...
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...

# Add this line:
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

---

## Step 3: Restart Your Development Server

After adding the API key:

1. Stop the dev server (Ctrl+C in terminal)
2. Run: `npm run dev`
3. The scanner will now use Gemini AI!

---

## ✅ How It Works

### Image Upload Flow:
1. User uploads/takes a photo of an electronic device
2. Image is converted to base64 format
3. Sent to Gemini API with expert prompt
4. AI analyzes components and hazards
5. Returns detailed JSON response
6. App displays beautiful results

### AI Prompt Engineering:
The system uses a comprehensive prompt that instructs Gemini to:
- Identify all visible components
- Detect hazardous materials (lead, mercury, cadmium, etc.)
- Assess risk levels accurately
- Provide specific safety recommendations
- Return structured JSON for easy parsing

### Fallback System:
- If API key is missing → Uses mock data
- If API call fails → Falls back to mock data
- Ensures app always works!

---

## 🎯 Testing the Integration

### Test with Real Images:
1. Navigate to Scanner page
2. Upload a photo of:
   - Old smartphone
   - Laptop motherboard
   - Circuit board
   - Battery
   - Any electronic device

3. Click "Analyze Device"
4. Watch AI identify components and hazards!

### Expected Results:
The AI should identify:
- **Components**: Battery, circuit board, display, etc.
- **Toxins**: Lead, mercury, lithium, etc.
- **Risk Level**: Based on detected hazards
- **Recommendations**: Safety guidelines

---

## 💡 Tips for Best Results

### Image Quality:
- Use clear, well-lit photos
- Show internal components if possible
- Avoid blurry or dark images
- Multiple angles help

### Device Types:
Select the correct device type for better accuracy:
- Smartphone 📱
- Laptop 💻
- Tablet 📱
- Monitor 🖥️
- Printer 🖨️
- etc.

---

## 🔒 Security & Privacy

### Important Notes:
- ✅ API key is stored client-side (environment variable)
- ✅ Images sent directly to Google's servers
- ✅ No intermediate storage
- ⚠️ Don't commit `.env` to Git (it's in .gitignore)

### Production Considerations:
For production apps, consider:
1. Using a backend proxy server
2. Implementing rate limiting
3. Adding user authentication
4. Caching common analyses

---

## 🐛 Troubleshooting

### Issue: "Gemini API key not found"
**Solution**: Check `.env` file exists and contains:
```env
VITE_GEMINI_API_KEY=your_key_here
```

### Issue: "Network error" or "Failed to fetch"
**Solutions**:
1. Check internet connection
2. Verify API key is valid
3. Check Google Cloud Console for API quota

### Issue: "Invalid JSON response"
**Solution**: The app automatically handles this and falls back to mock data

### Issue: Analysis seems generic
**Solution**: 
- Ensure image is clear and shows components
- Try different device type selection
- Check that API key has quota remaining

---

## 📊 API Usage & Pricing

### Free Tier (as of 2024):
- 15 requests per minute
- 1 million tokens per minute
- Completely free for development!

### Paid Tier:
- $0.000125 per 1K input tokens
- $0.0005 per 1K output tokens
- Very affordable for production use

### Monitor Usage:
- Check usage at: https://makersuite.google.com/
- Set up billing alerts
- Implement rate limiting if needed

---

## 🚀 Next Steps

### Enhancements You Can Add:
1. **Image Preprocessing**: Compress images before sending
2. **Batch Analysis**: Analyze multiple images
3. **History**: Save past scans to Firebase
4. **Comparison**: Compare similar devices
5. **Export**: Generate PDF reports
6. **AR View**: Show hazards in augmented reality

### Advanced Features:
- Custom training data
- Component database expansion
- User-contributed hazard reports
- Machine learning model fine-tuning

---

## 📞 Support

### Resources:
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Google AI Studio](https://makersuite.google.com/)
- [Pricing Details](https://ai.google.dev/pricing)

### Community:
- Stack Overflow: Tag `google-gemini`
- GitHub Issues: Report bugs
- Discord: AI developer communities

---

## ✨ Summary

You've successfully integrated Google's Gemini AI into your e-waste scanner! 

**What you get:**
- 🤖 AI-powered component detection
- ☠️ Hazard identification
- 📊 Risk assessment
- 🛡️ Safety recommendations
- 🔄 Automatic fallback system

**Next:**
1. Get your API key
2. Add to `.env`
3. Restart server
4. Start scanning!

Happy analyzing! 🎉
