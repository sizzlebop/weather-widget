class WeatherWidget {
    constructor() {
        this.apiKey = '805b142aaa4b0305c991f291c921bfa4';
        this.animations = new WeatherAnimations(document.getElementById('weather-animation'));
        this.setupEventListeners();
        this.loadCustomization();
    }

    setupEventListeners() {
        // Location type toggle
        document.getElementById('location-type').addEventListener('change', (e) => {
            const zipInput = document.getElementById('zip-input');
            const coordsInput = document.getElementById('coords-input');
            if (e.target.value === 'zip') {
                zipInput.classList.remove('hidden');
                coordsInput.classList.add('hidden');
            } else {
                zipInput.classList.add('hidden');
                coordsInput.classList.remove('hidden');
            }
        });

        // Get weather button
        document.getElementById('get-weather').addEventListener('click', () => this.fetchWeather());

        // Settings toggle
        document.getElementById('settings-toggle').addEventListener('click', () => {
            const panel = document.getElementById('customization-panel');
            panel.classList.toggle('hidden');
        });

        // Embed code button
        document.getElementById('show-embed-code').addEventListener('click', () => {
            const preview = document.getElementById('embed-preview');
            const code = document.getElementById('embed-code');
            preview.classList.toggle('hidden');
            if (!preview.classList.contains('hidden')) {
                const embedCode = this.generateEmbedCode();
                code.textContent = embedCode;
            }
        });

        // Notion link button
        document.getElementById('show-notion-link').addEventListener('click', () => {
            const preview = document.getElementById('notion-preview');
            const link = document.getElementById('notion-link');
            preview.classList.toggle('hidden');
            if (!preview.classList.contains('hidden')) {
                const notionLink = this.generateNotionLink();
                link.value = notionLink;
            }
        });

        // Copy buttons
        document.getElementById('copy-embed').addEventListener('click', () => {
            const code = document.getElementById('embed-code');
            navigator.clipboard.writeText(code.textContent);
            alert('Embed code copied to clipboard!');
        });

        document.getElementById('copy-notion').addEventListener('click', () => {
            const link = document.getElementById('notion-link');
            navigator.clipboard.writeText(link.value);
            alert('Notion link copied to clipboard!');
        });

        // Customization apply button
        document.getElementById('apply-customization').addEventListener('click', () => this.applyCustomization());
    }

    async fetchWeather() {
        const locationType = document.getElementById('location-type').value;
        let url;

        if (locationType === 'zip') {
            const zipCode = document.getElementById('zip-code').value;
            const countryCode = document.getElementById('country-code').value;
            url = `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},${countryCode}&appid=${this.apiKey}&units=metric`;
        } else {
            const lat = document.getElementById('latitude').value;
            const lon = document.getElementById('longitude').value;
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
        }

        try {
            const response = await fetch(url);
            const data = await response.json();
            this.updateWidget(data);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            alert('Error fetching weather data. Please try again.');
        }
    }

    updateWidget(data) {
        document.getElementById('location-name').textContent = data.name;
        document.getElementById('temperature').textContent = Math.round(data.main.temp);
        document.getElementById('weather-description').textContent = data.weather[0].description;
        document.getElementById('humidity').textContent = `${data.main.humidity}%`;
        document.getElementById('wind').textContent = `${data.wind.speed} m/s`;

        this.animations.setAnimation(data.weather[0].id);
    }

    generateEmbedCode() {
        const currentUrl = window.location.href;
        return `<iframe src="${currentUrl}" width="350" height="500" frameborder="0"></iframe>`;
    }

    generateNotionLink() {
        return window.location.href;
    }

    applyCustomization() {
        const theme = document.getElementById('theme-select').value;
        const bgColorStart = document.getElementById('bg-color-start').value;
        const bgColorEnd = document.getElementById('bg-color-end').value;
        const textColor = document.getElementById('text-color').value;
        const font = document.getElementById('font-select').value;
        const size = document.getElementById('size-select').value;
        const unit = document.getElementById('unit-select').value;

        const widget = document.getElementById('weather-widget');
        const customization = {
            theme,
            bgColorStart,
            bgColorEnd,
            textColor,
            font,
            size,
            unit
        };

        this.applyStyles(widget, customization);
        this.saveCustomization(customization);
    }

    applyStyles(widget, customization) {
        if (customization.theme === 'custom') {
            widget.style.background = `linear-gradient(135deg, ${customization.bgColorStart}, ${customization.bgColorEnd})`;
            widget.style.color = customization.textColor;
        } else {
            widget.style.background = customization.theme === 'dark' 
                ? 'linear-gradient(135deg, #2c3e50, #3498db)'
                : 'linear-gradient(135deg, #6e8efb, #a777e3)';
            widget.style.color = '#ffffff';
        }

        widget.style.fontFamily = customization.font;

        // Apply size
        const sizes = {
            small: { width: '250px', padding: '15px' },
            medium: { width: '300px', padding: '20px' },
            large: { width: '350px', padding: '25px' }
        };
        widget.style.width = sizes[customization.size].width;
        widget.style.padding = sizes[customization.size].padding;

        // Apply temperature unit
        const temp = document.querySelector('.unit');
        temp.textContent = customization.unit === 'celsius' ? '°C' : '°F';
    }

    saveCustomization(customization) {
        localStorage.setItem('weatherWidgetCustomization', JSON.stringify(customization));
    }

    loadCustomization() {
        const saved = localStorage.getItem('weatherWidgetCustomization');
        if (saved) {
            const customization = JSON.parse(saved);
            document.getElementById('theme-select').value = customization.theme;
            document.getElementById('bg-color-start').value = customization.bgColorStart;
            document.getElementById('bg-color-end').value = customization.bgColorEnd;
            document.getElementById('text-color').value = customization.textColor;
            document.getElementById('font-select').value = customization.font;
            document.getElementById('size-select').value = customization.size;
            document.getElementById('unit-select').value = customization.unit;

            this.applyStyles(document.getElementById('weather-widget'), customization);
        }
    }
}

// Initialize the widget when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new WeatherWidget();
}); 