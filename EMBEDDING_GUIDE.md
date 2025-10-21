# Chatbot Widget - Embeddable JavaScript Widget

A lightweight, customizable chatbot widget that can be embedded on any website with just a single script tag.

## 🚀 Quick Start

### Basic Integration

Add this single line to any website:

```html
<script src="https://your-domain.com/chatbot-widget.js"></script>
```

That's it! The chatbot widget will automatically appear in the bottom-right corner of the page.

### With Custom Configuration

```html
<script src="https://your-domain.com/chatbot-widget.js" 
        data-position="bottom-left"
        data-primary-color="#28a745"
        data-width="350px"
        data-height="450px"></script>
```

## 📋 Configuration Options

### Data Attributes

| Attribute | Description | Default | Example |
|-----------|-------------|---------|---------|
| `data-position` | Widget position | `bottom-right` | `bottom-left`, `top-right`, `top-left` |
| `data-primary-color` | Primary color for buttons and header | `#007bff` | `#28a745`, `#ff6b6b` |
| `data-background-color` | Chat window background | `#ffffff` | `#f8f9fa` |
| `data-text-color` | Text color | `#333333` | `#000000` |
| `data-width` | Chat window width | `300px` | `350px`, `400px` |
| `data-height` | Chat window height | `400px` | `450px`, `500px` |
| `data-border-radius` | Border radius | `8px` | `12px`, `0px` |
| `data-z-index` | Z-index for layering | `9999` | `10000` |

### Programmatic Configuration

For advanced control, disable auto-initialization and configure manually:

```html
<script src="https://your-domain.com/chatbot-widget.js" data-auto-init="false"></script>
<script>
  ChatbotWidget.init({
    position: 'bottom-right',
    primaryColor: '#007bff',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    width: '300px',
    height: '400px',
    borderRadius: '8px',
    zIndex: 9999
  });
</script>
```

## 🎛️ API Reference

### Methods

#### `ChatbotWidget.init(options)`
Initialize the widget with custom options.

```javascript
ChatbotWidget.init({
  position: 'bottom-left',
  primaryColor: '#ff6b6b'
});
```

#### `ChatbotWidget.config(options)`
Update widget configuration after initialization.

```javascript
ChatbotWidget.config({
  primaryColor: '#28a745',
  width: '350px'
});
```

#### `ChatbotWidget.open()`
Programmatically open the chat window.

```javascript
ChatbotWidget.open();
```

#### `ChatbotWidget.close()`
Programmatically close the chat window.

```javascript
ChatbotWidget.close();
```

#### `ChatbotWidget.sendMessage(message)`
Send a message programmatically.

```javascript
ChatbotWidget.sendMessage('Hello from JavaScript!');
```

## 🎨 Customization Examples

### Different Themes

#### Dark Theme
```html
<script src="https://your-domain.com/chatbot-widget.js" 
        data-primary-color="#2d3748"
        data-background-color="#1a202c"
        data-text-color="#ffffff"></script>
```

#### Green Theme
```html
<script src="https://your-domain.com/chatbot-widget.js" 
        data-primary-color="#28a745"
        data-background-color="#d4edda"></script>
```

#### Custom Size
```html
<script src="https://your-domain.com/chatbot-widget.js" 
        data-width="400px"
        data-height="500px"></script>
```

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically
4. Your widget will be available at: `https://your-project.vercel.app/chatbot-widget.js`

### Option 2: Netlify

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Set build command to: `echo "No build needed"`
4. Set publish directory to: `public`
5. Deploy

### Option 3: GitHub Pages

1. Push your code to GitHub
2. Go to repository Settings > Pages
3. Select source: "Deploy from a branch"
4. Choose branch: `main` and folder: `/public`
5. Your widget will be available at: `https://username.github.io/repository-name/chatbot-widget.js`

### Option 4: Any Static Host

Simply upload the `chatbot-widget.js` file to any web server or CDN and reference it in your script tag.

## 📱 Features

- ✅ **Zero Dependencies** - Pure vanilla JavaScript
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Customizable** - Colors, size, position, and more
- ✅ **Easy Integration** - Single script tag
- ✅ **Programmatic API** - Full control via JavaScript
- ✅ **Cross-Browser** - Works in all modern browsers
- ✅ **Lightweight** - Only ~8KB minified
- ✅ **Auto-Initialization** - Works out of the box

## 🔧 Development

### Local Testing

1. Serve the files locally:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve public

# Using PHP
php -S localhost:8000 -t public
```

2. Open `http://localhost:8000/demo.html` to test the widget

### File Structure

```
public/
├── chatbot-widget.js    # Main widget script
├── demo.html           # Demo page
└── ...                 # Other static files
```

## 🐛 Troubleshooting

### Widget Not Appearing

1. Check browser console for JavaScript errors
2. Ensure the script URL is accessible
3. Verify the script tag is placed before the closing `</body>` tag

### Styling Issues

1. Check for CSS conflicts with your site's styles
2. Adjust `z-index` if widget is hidden behind other elements
3. Use `!important` in custom CSS if needed

### API Not Working

1. Ensure `data-auto-init="false"` is set
2. Call `ChatbotWidget.init()` after the script loads
3. Check that the script has fully loaded before using the API

## 📄 License

MIT License - feel free to use in commercial and personal projects.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check the demo page for examples
- Review the API documentation above
