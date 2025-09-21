# CAT 2025 Reading Comprehension Practice App

A modern, responsive web application for practicing reading comprehension skills with dynamic content management. Built with React, TypeScript, and Tailwind CSS.

## Features

- 📚 **Dynamic Essay Management** - Add essays via JSON or external text files
- ⏱️ **Timed Assessments** - Built-in timer for realistic practice
- 📊 **Detailed Results** - Comprehensive score analysis and feedback
- 📱 **Responsive Design** - Works perfectly on all devices
- 🎨 **Beautiful UI** - Modern, elegant interface with Tailwind CSS
- ⚡ **Fast Performance** - Optimized for speed and efficiency

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Production Deployment (Netlify)

1. **Connect your repository** to Netlify
2. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Deploy** - Netlify will automatically build and deploy

## Content Management

### Adding New Essays

#### Method 1: External Text Files (Recommended)

1. Create a text file in `public/data/essays/` (e.g., `essay-002.txt`)
2. Write your essay content with proper formatting
3. Add to `public/data/essays.json`:

```json
{
  "id": "essay-002",
  "title": "Your Essay Title",
  "contentFile": "essays/essay-002.txt",
  "wordCount": 200,
  "difficulty": "Hard",
  "timeLimit": 15,
  "createdAt": "2024-01-20",
  "questions": [
    {
      "id": "q-002-1",
      "question": "Your question?",
      "options": [
        { "id": "a1", "text": "Option 1", "isCorrect": false },
        { "id": "a2", "text": "Option 2", "isCorrect": true }
      ]
    }
  ]
}
```

#### Method 2: Inline Content

For short essays, add content directly to JSON:

```json
{
  "content": "Your essay content here...",
  "questions": [...]
}
```

## File Structure

```
├── public/
│   ├── data/
│   │   ├── essays.json          # Main configuration
│   │   ├── essays/              # Essay content files
│   │   │   ├── essay-001.txt
│   │   │   └── essay-template.txt
│   │   └── README.md            # Content management guide
│   └── index.html
├── src/
│   ├── components/              # React components
│   ├── types/                   # TypeScript definitions
│   ├── utils/                   # Utility functions
│   └── main.tsx
└── netlify.toml                 # Netlify configuration
```

## Technology Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Netlify

## Performance Optimizations

- ✅ Code splitting and lazy loading
- ✅ Optimized bundle size
- ✅ Efficient re-rendering with React hooks
- ✅ Cached static assets
- ✅ Minified production build

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes.

## Support

For questions or issues, please open an issue on GitHub.
# CAT2025RC
