class WeatherWidget {
    constructor() {
        this.apiKey = localStorage.getItem('openWeatherApiKey') || '805b142aaa4b0305c991f291c921bfa4';
        this.animations = new WeatherAnimations(document.getElementById('weather-animation'));
        this.setupEventListeners();
        this.setupCustomColorPreview();
        this.loadCustomization();
        this.loadApiKey();
        this.loadFromEmbed();
    }

    loadApiKey() {
        const apiKeyInput = document.getElementById('api-key');
        apiKeyInput.value = this.apiKey;
    }

    setupEventListeners() {
        // API Key save button
        document.getElementById('save-api-key').addEventListener('click', () => {
            const apiKey = document.getElementById('api-key').value.trim();
            if (apiKey) {
                this.apiKey = apiKey;
                localStorage.setItem('openWeatherApiKey', apiKey);
                alert('API Key saved successfully!');
            } else {
                alert('Please enter a valid API Key');
            }
        });

        // Theme change
        document.getElementById('theme-select').addEventListener('change', () => {
            this.applyCustomization();
            this.saveCustomization();
        });

        // Color changes
        ['bg-color-start', 'bg-color-end', 'text-color'].forEach(id => {
            document.getElementById(id).addEventListener('input', () => {
                this.applyCustomization();
                this.saveCustomization();
            });
        });

        // Font change
        document.getElementById('font-select').addEventListener('change', () => {
            const font = document.getElementById('font-select').value;
            const widget = document.getElementById('weather-widget');
            
            // Apply font to the widget and all its children
            const elements = widget.getElementsByTagName('*');
            for (let element of elements) {
                if (!(element instanceof SVGElement)) {
                    element.style.setProperty('font-family', `${font}, sans-serif`, 'important');
                }
            }
            widget.style.setProperty('font-family', `${font}, sans-serif`, 'important');
            
            // Save the customization
            this.saveCustomization();
        });

        // Size change
        document.getElementById('size-select').addEventListener('change', () => {
            this.applyCustomization();
            this.saveCustomization();
        });

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
            this.saveCustomization();
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
        const customization = {
            theme: document.getElementById('theme-select').value,
            bgColorStart: document.getElementById('bg-color-start').value,
            bgColorEnd: document.getElementById('bg-color-end').value,
            textColor: document.getElementById('text-color').value,
            font: document.getElementById('font-select').value,
            size: document.getElementById('size-select').value,
            unit: document.getElementById('unit-select').value,
            apiKey: this.apiKey,
            locationType: document.getElementById('location-type').value,
            location: this.getLocationData()
        };

        const params = new URLSearchParams();
        params.append('embed', 'true');
        params.append('data', btoa(JSON.stringify(customization)));
        const embedUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
        return `<iframe src="${embedUrl}" width="350" height="500" frameborder="0"></iframe>`;
    }

    generateNotionLink() {
        const customization = {
            theme: document.getElementById('theme-select').value,
            bgColorStart: document.getElementById('bg-color-start').value,
            bgColorEnd: document.getElementById('bg-color-end').value,
            textColor: document.getElementById('text-color').value,
            font: document.getElementById('font-select').value,
            size: document.getElementById('size-select').value,
            unit: document.getElementById('unit-select').value,
            apiKey: this.apiKey,
            locationType: document.getElementById('location-type').value,
            location: this.getLocationData()
        };

        const params = new URLSearchParams();
        params.append('embed', 'true');
        params.append('data', btoa(JSON.stringify(customization)));
        return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    }

    getLocationData() {
        const locationType = document.getElementById('location-type').value;
        if (locationType === 'zip') {
            return {
                zipCode: document.getElementById('zip-code').value,
                countryCode: document.getElementById('country-code').value
            };
        } else {
            return {
                latitude: document.getElementById('latitude').value,
                longitude: document.getElementById('longitude').value
            };
        }
    }

    loadFromEmbed() {
        const params = new URLSearchParams(window.location.search);
        if (params.get('embed') === 'true' && params.get('data')) {
            try {
                const data = JSON.parse(atob(params.get('data')));
                
                // Apply customization
                document.getElementById('theme-select').value = data.theme;
                document.getElementById('bg-color-start').value = data.bgColorStart;
                document.getElementById('bg-color-end').value = data.bgColorEnd;
                document.getElementById('text-color').value = data.textColor;
                document.getElementById('font-select').value = data.font;
                document.getElementById('size-select').value = data.size;
                document.getElementById('unit-select').value = data.unit;
                
                // Set API key
                if (data.apiKey) {
                    this.apiKey = data.apiKey;
                    document.getElementById('api-key').value = data.apiKey;
                }

                // Set location
                if (data.location) {
                    document.getElementById('location-type').value = data.locationType;
                    if (data.locationType === 'zip') {
                        document.getElementById('zip-code').value = data.location.zipCode;
                        document.getElementById('country-code').value = data.location.countryCode;
                    } else {
                        document.getElementById('latitude').value = data.location.latitude;
                        document.getElementById('longitude').value = data.location.longitude;
                    }
                }

                // Apply customization and fetch weather
                this.applyCustomization();
                this.fetchWeather();

                // Hide customization panel in embed mode
                document.getElementById('customization-panel').style.display = 'none';
                document.querySelector('.embed-section').style.display = 'none';
            } catch (error) {
                console.error('Error loading embed data:', error);
            }
        }
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
            // Apply text color to all text elements
            widget.querySelectorAll('span, div:not(.weather-animation)').forEach(element => {
                element.style.color = customization.textColor;
            });
            widget.querySelectorAll('i').forEach(element => {
                element.style.color = customization.textColor;
            });
        } else {
            widget.style.background = customization.theme === 'dark' 
                ? 'linear-gradient(135deg, #2c3e50, #3498db)'
                : 'linear-gradient(135deg, #6e8efb, #a777e3)';
            widget.style.color = '#ffffff';
            // Reset text color for all elements in non-custom theme
            widget.querySelectorAll('span, div:not(.weather-animation)').forEach(element => {
                element.style.color = '#ffffff';
            });
            widget.querySelectorAll('i').forEach(element => {
                element.style.color = '#ffffff';
            });
        }

        // Apply font to all text elements
        widget.style.fontFamily = `${customization.font}, sans-serif`;
        widget.querySelectorAll('span, div:not(.weather-animation)').forEach(element => {
            element.style.fontFamily = `${customization.font}, sans-serif`;
        });

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
        this.saveCustomization();
    }

    saveCustomization() {
        const customization = {
            theme: document.getElementById('theme-select').value,
            bgColorStart: document.getElementById('bg-color-start').value,
            bgColorEnd: document.getElementById('bg-color-end').value,
            textColor: document.getElementById('text-color').value,
            font: document.getElementById('font-select').value,
            size: document.getElementById('size-select').value,
            unit: document.getElementById('unit-select').value
        };
        localStorage.setItem('weatherWidgetCustomization', JSON.stringify(customization));
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