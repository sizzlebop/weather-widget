<div align="center">
<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8ba3fc;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#b98fe7;stop-opacity:1" />
    </linearGradient>
  </defs>
  <!-- Sun rays (made larger) -->
  <circle cx="30" cy="52" r="20" fill="#FFD700"/>
  <!-- Main cloud (adjusted path to create space for sun) -->
  <path d="M95 65c0-11-9-20-20-20-1.1 0-2.2 0.1-3.2 0.3C69.5 34.5 60.2 27 49 27c-13.8 0-25 11.2-25 25 0 0.7 0-0.7 0 0C15.7 52.9 9 60.1 9 69c0 9.4 7.6 17 17 17h52c9.4 0 17-7.6 17-17z" fill="url(#grad1)"/>
  <!-- Rain drops (adjusted to come out from under the cloud) -->
  <path d="M40 82l-3 8M55 82l-3 8M70 82l-3 8" stroke="#4169E1" stroke-width="3" stroke-linecap="round"/>
</svg>

# 🌦️ Weather Widget</div>

A beautiful, customizable weather widget that you can embed anywhere. Perfect for websites, blogs, and Notion pages.

![Weather Widget Preview](https://res.cloudinary.com/di7ctlowx/image/upload/v1737380828/weather-widget_kybydv.png)

## ✨ Features

- 🎨 Multiple themes and customization options
- 📱 Responsive design with different size options
- 🌡️ Temperature in Celsius or Fahrenheit
- 💅 Custom fonts and colors
- 🔌 Easy embedding functionality
- 🎬 Smooth weather animations
- 📍 Location support via ZIP code or coordinates

## 🚀 Getting Started

### Prerequisites

- An OpenWeather API key (free tier available)
- A modern web browser

### 📝 Getting Your OpenWeather API Key

1. Visit [OpenWeather](https://openweathermap.org/api)
2. Click "Sign Up" and create a free account
3. After verification, go to your account dashboard
4. Navigate to "API Keys" section
5. Copy your API key

> ⚠️ Note: New API keys may take a few hours to activate

## 🛠️ Usage

1. Enter your OpenWeather API key in the settings panel
2. Choose your location method:
   - ZIP/Postal Code + Country
   - Coordinates (latitude & longitude)
3. Click "Get Weather" to fetch current conditions
4. Customize the widget appearance:
   - Choose from preset themes
   - Set custom colors
   - Select font family
   - Adjust widget size
   - Choose temperature unit

## 🔗 Embedding

### Website Embedding

1. Click the "Embed Code" button
2. Copy the generated HTML code
3. Paste it into your website's HTML

### Notion Embedding

1. Click the "Embed Link" button
2. Copy the generated URL
3. In Notion:
   - Type `/embed`
   - Paste the URL
   - Press Enter

## 🎨 Available Themes

- Light
- Dark
- Sunset
- Ocean
- Forest
- Aurora
- Cosmic
- Cherry
- Custom

## 📐 Size Options

- Small (250x320px)
- Medium (300x350px)
- Large (350x400px)

## 🎭 Text Effects

### Shadow Options
- None
- Light (2px offset, 4px blur)
- Medium (3px offset, 6px blur)
- Heavy (4px offset, 8px blur)
- Customizable shadow color

### Stroke Options
- None
- Thin (1px)
- Medium (2px)
- Customizable stroke color

## 🔤 Supported Fonts

- Roboto
- Lato
- Montserrat
- Open Sans
- Poppins
- Raleway
- Ubuntu
- Source Sans Pro
- Nunito
- Quicksand
- Dancing Script
- Lobster
- Livvic
- Inter

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🔒 Privacy

The widget only collects weather data for the specified location. No personal data is stored or transmitted beyond what's necessary for weather functionality.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ⚡ Performance

The widget is lightweight and optimized for performance:

- Minimal dependencies
- Efficient animations
- Lazy loading of weather data
- Caching of API responses

## 🐛 Troubleshooting

**Widget shows "Enter Location"**

- Verify your API key is correct
- Check your location input
- Ensure your API key is activated

**Animations not showing**

- Check if JavaScript is enabled
- Verify browser compatibility
- Clear browser cache

## 📧 Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

Made with ❤️ by pinkpixel
