class WeatherWidget {
    constructor() {
        this.apiKey = '805b142aaa4b0305c991f291c921bfa4';
        this.animations = new WeatherAnimations(document.getElementById('weather-animation'));
        this.setupEventListeners();
        this.setupCustomColorPreview();
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

        // Temperature unit toggle
        document.getElementById('unit-select').addEventListener('change', (e) => {
            const tempElement = document.getElementById('temperature');
            const unitElement = document.querySelector('.unit');
            const currentTemp = parseFloat(tempElement.textContent);
            
            if (!isNaN(currentTemp)) {
                if (e.target.value === 'fahrenheit' && unitElement.textContent === '°C') {
                    tempElement.textContent = Math.round((currentTemp * 9/5) + 32);
                    unitElement.textContent = '°F';
                } else if (e.target.value === 'celsius' && unitElement.textContent === '°F') {
                    tempElement.textContent = Math.round((currentTemp - 32) * 5/9);
                    unitElement.textContent = '°C';
                }
            }
        });

        // Get weather button
        document.getElementById('get-weather').addEventListener('click', () => this.fetchWeather());

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
        
        // Get the current unit preference
        const unitSelect = document.getElementById('unit-select');
        const tempElement = document.getElementById('temperature');
        const unitElement = document.querySelector('.unit');
        
        // Temperature comes in Celsius from the API
        const tempCelsius = data.main.temp;
        
        if (unitSelect.value === 'fahrenheit') {
            tempElement.textContent = Math.round((tempCelsius * 9/5) + 32);
            unitElement.textContent = '°F';
        } else {
            tempElement.textContent = Math.round(tempCelsius);
            unitElement.textContent = '°C';
        }
        
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

        // Apply the styles immediately
        if (customization.theme === 'custom') {
            widget.style.background = `linear-gradient(135deg, ${customization.bgColorStart}, ${customization.bgColorEnd})`;
            widget.style.color = customization.textColor;
        } else {
            widget.style.background = customization.theme === 'dark' 
                ? 'linear-gradient(135deg, #2c3e50, #3498db)'
                : 'linear-gradient(135deg, #6e8efb, #a777e3)';
            widget.style.color = '#ffffff';
        }

        widget.style.fontFamily = `${customization.font}, sans-serif`;

        // Apply size
        const sizes = {
            small: { width: '250px', padding: '15px' },
            medium: { width: '300px', padding: '20px' },
            large: { width: '350px', padding: '25px' }
        };
        widget.style.width = sizes[customization.size].width;
        widget.style.padding = sizes[customization.size].padding;

        // Apply temperature unit and convert if necessary
        const tempElement = document.getElementById('temperature');
        const unitElement = document.querySelector('.unit');
        const currentTemp = parseFloat(tempElement.textContent);
        
        if (!isNaN(currentTemp)) {
            if (customization.unit === 'fahrenheit' && unitElement.textContent === '°C') {
                tempElement.textContent = Math.round((currentTemp * 9/5) + 32);
                unitElement.textContent = '°F';
            } else if (customization.unit === 'celsius' && unitElement.textContent === '°F') {
                tempElement.textContent = Math.round((currentTemp - 32) * 5/9);
                unitElement.textContent = '°C';
            }
        }

        // Save the customization
        localStorage.setItem('weatherWidgetCustomization', JSON.stringify(customization));
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

    loadCustomization() {
        const saved = localStorage.getItem('weatherWidgetCustomization');
        if (saved) {
            const customization = JSON.parse(saved);
            
            // Set the form values
            document.getElementById('theme-select').value = customization.theme;
            document.getElementById('bg-color-start').value = customization.bgColorStart;
            document.getElementById('bg-color-end').value = customization.bgColorEnd;
            document.getElementById('text-color').value = customization.textColor;
            document.getElementById('font-select').value = customization.font;
            document.getElementById('size-select').value = customization.size;
            document.getElementById('unit-select').value = customization.unit;

            // Apply the saved customization
            this.applyStyles(document.getElementById('weather-widget'), customization);
        } else {
            // Set default values for color pickers
            document.getElementById('bg-color-start').value = '#6e8efb';
            document.getElementById('bg-color-end').value = '#a777e3';
            document.getElementById('text-color').value = '#ffffff';
        }
    }

    // Add event listeners for real-time preview of custom colors
    setupCustomColorPreview() {
        const colorInputs = ['bg-color-start', 'bg-color-end', 'text-color'];
        const widget = document.getElementById('weather-widget');
        
        colorInputs.forEach(id => {
            document.getElementById(id).addEventListener('input', (e) => {
                if (document.getElementById('theme-select').value === 'custom') {
                    if (id === 'text-color') {
                        widget.style.color = e.target.value;
                    } else {
                        const start = document.getElementById('bg-color-start').value;
                        const end = document.getElementById('bg-color-end').value;
                        widget.style.background = `linear-gradient(135deg, ${start}, ${end})`;
                    }
                }
            });
        });

        // Add theme select change handler
        document.getElementById('theme-select').addEventListener('change', (e) => {
            const customColors = document.getElementById('custom-colors');
            if (e.target.value === 'custom') {
                customColors.style.display = 'block';
            } else {
                customColors.style.display = 'none';
                if (e.target.value === 'dark') {
                    widget.style.background = 'linear-gradient(135deg, #2c3e50, #3498db)';
                } else {
                    widget.style.background = 'linear-gradient(135deg, #6e8efb, #a777e3)';
                }
                widget.style.color = '#ffffff';
            }
        });
    }
}

// Initialize the widget when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new WeatherWidget();
}); 