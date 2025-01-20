class WeatherWidget {
    constructor() {
        this.apiKey = localStorage.getItem('openWeatherApiKey') || '';
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
        ['bg-color-start', 'bg-color-end', 'bg-color-solid', 'text-color'].forEach(id => {
            document.getElementById(id).addEventListener('input', () => {
                this.applyCustomization();
                this.saveCustomization();
            });
        });

        // Font change
        document.getElementById('font-select').addEventListener('change', () => {
            const font = document.getElementById('font-select').value;
            const widget = document.getElementById('weather-widget');
            
            // Apply font to the widget and all its children except icons
            const elements = widget.getElementsByTagName('*');
            for (let element of elements) {
                if (!(element instanceof SVGElement) && !element.classList.contains('material-icons')) {
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
        if (!this.apiKey) {
            alert('Please enter your OpenWeather API key first!');
            return;
        }

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
            if (!response.ok) {
                throw new Error('Invalid API key or network error');
            }
            const data = await response.json();
            this.updateWidget(data);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            if (error.message === 'Invalid API key or network error') {
                alert('Error: Invalid API key. Please check your OpenWeather API key.');
            } else {
                alert('Error fetching weather data. Please try again.');
            }
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
            bgColorSolid: document.getElementById('bg-color-solid').value,
            bgType: document.getElementById('bg-type-select').value,
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
        
        // Get current widget dimensions based on size setting
        const sizes = {
            small: { width: 250, height: 300 },
            medium: { width: 300, height: 350 },
            large: { width: 350, height: 400 }
        };
        const size = document.getElementById('size-select').value;
        const { width, height } = sizes[size];
        
        return `<!-- Weather Widget HTML -->
<div id="weather-widget-container" style="width: ${width}px;">
    <iframe 
        src="${embedUrl}" 
        style="width: 100%; height: ${height}px; border: none; overflow: hidden; display: block; border-radius: 20px;" 
        scrolling="no"
        loading="lazy"
        title="Weather Widget">
    </iframe>
</div>

<!-- Weather Widget Responsive CSS -->
<style>
#weather-widget-container {
    max-width: 100%;
    margin: 0 auto;
}
</style>`;
    }

    generateNotionLink() {
        const customization = {
            theme: document.getElementById('theme-select').value,
            bgColorStart: document.getElementById('bg-color-start').value,
            bgColorEnd: document.getElementById('bg-color-end').value,
            bgColorSolid: document.getElementById('bg-color-solid').value,
            bgType: document.getElementById('bg-type-select').value,
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
                // Set embed mode on body
                document.body.setAttribute('data-embed', 'true');
                
                const data = JSON.parse(atob(params.get('data')));
                
                // Apply customization
                document.getElementById('theme-select').value = data.theme || 'light';
                document.getElementById('bg-color-start').value = data.bgColorStart || '#6e8efb';
                document.getElementById('bg-color-end').value = data.bgColorEnd || '#a777e3';
                document.getElementById('bg-color-solid').value = data.bgColorSolid || '#ffffff';
                document.getElementById('bg-type-select').value = data.bgType || 'gradient';
                document.getElementById('text-color').value = data.textColor || '#ffffff';
                document.getElementById('font-select').value = data.font || 'Roboto';
                document.getElementById('size-select').value = data.size || 'medium';
                document.getElementById('unit-select').value = data.unit || 'celsius';
                
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
            } catch (error) {
                console.error('Error loading embed data:', error);
            }
        }
    }

    applyCustomization() {
        const theme = document.getElementById('theme-select').value;
        const bgColorStart = document.getElementById('bg-color-start').value;
        const bgColorEnd = document.getElementById('bg-color-end').value;
        const bgColorSolid = document.getElementById('bg-color-solid').value;
        const bgType = document.getElementById('bg-type-select').value;
        const textColor = document.getElementById('text-color').value;
        const font = document.getElementById('font-select').value;
        const size = document.getElementById('size-select').value;
        const unit = document.getElementById('unit-select').value;

        const widget = document.getElementById('weather-widget');

        // Apply theme background
        if (theme === 'custom') {
            if (bgType === 'gradient') {
                widget.style.background = `linear-gradient(135deg, ${bgColorStart}, ${bgColorEnd})`;
            } else {
                widget.style.background = bgColorSolid;
            }
        } else {
            const gradients = {
                light: ['#6e8efb', '#a777e3'],
                dark: ['#2c3e50', '#3498db'],
                sunset: ['#ff6b6b', '#feca57'],
                ocean: ['#00b894', '#0984e3'],
                forest: ['#55efc4', '#00b894'],
                aurora: ['#6c5ce7', '#00b894'],
                cosmic: ['#6c5ce7', '#fd79a8'],
                cherry: ['#ff758c', '#ff7eb3']
            };
            const [startColor, endColor] = gradients[theme] || gradients.light;
            widget.style.background = `linear-gradient(135deg, ${startColor}, ${endColor})`;
        }

        // Apply text color
        const textElements = widget.querySelectorAll('span:not(.material-icons), div:not(.weather-animation)');
        textElements.forEach(element => {
            element.style.color = textColor;
            element.style.webkitTextFillColor = textColor;
        });

        // Keep icons visible with text color
        const iconElements = widget.querySelectorAll('.material-icons');
        iconElements.forEach(icon => {
            icon.style.color = textColor;
            icon.style.webkitTextFillColor = textColor;
        });

        // Apply font to all text elements except icons
        widget.style.fontFamily = `${font}, sans-serif`;
        textElements.forEach(element => {
            if (!element.classList.contains('material-icons')) {
                element.style.fontFamily = `${font}, sans-serif`;
            }
        });

        // Apply size
        const sizes = {
            small: { width: '250px', height: '300px', padding: '15px' },
            medium: { width: '300px', height: '350px', padding: '20px' },
            large: { width: '350px', height: '400px', padding: '25px' }
        };
        widget.style.width = sizes[size].width;
        widget.style.height = sizes[size].height;
        widget.style.padding = sizes[size].padding;
        
        // Update CSS variables
        document.documentElement.style.setProperty('--widget-width', sizes[size].width);
        document.documentElement.style.setProperty('--widget-padding', sizes[size].padding);

        // Apply temperature unit and convert if necessary
        const tempElement = document.getElementById('temperature');
        const unitElement = document.querySelector('.unit');
        const currentTemp = parseFloat(tempElement.textContent);
        
        if (!isNaN(currentTemp)) {
            if (unit === 'fahrenheit' && unitElement.textContent === '°C') {
                tempElement.textContent = Math.round((currentTemp * 9/5) + 32);
                unitElement.textContent = '°F';
            } else if (unit === 'celsius' && unitElement.textContent === '°F') {
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
            bgColorSolid: document.getElementById('bg-color-solid').value,
            bgType: document.getElementById('bg-type-select').value,
            textColor: document.getElementById('text-color').value,
            font: document.getElementById('font-select').value,
            size: document.getElementById('size-select').value,
            unit: document.getElementById('unit-select').value
        };
        localStorage.setItem('weatherWidgetCustomization', JSON.stringify(customization));
    }

    loadCustomization() {
        const savedCustomization = localStorage.getItem('weatherWidgetCustomization');
        if (savedCustomization) {
            try {
                const customization = JSON.parse(savedCustomization);
                document.getElementById('theme-select').value = customization.theme || 'light';
                document.getElementById('bg-color-start').value = customization.bgColorStart || '#6e8efb';
                document.getElementById('bg-color-end').value = customization.bgColorEnd || '#a777e3';
                document.getElementById('bg-color-solid').value = customization.bgColorSolid || '#ffffff';
                document.getElementById('bg-type-select').value = customization.bgType || 'gradient';
                document.getElementById('text-color').value = customization.textColor || '#ffffff';
                document.getElementById('font-select').value = customization.font || 'Roboto';
                document.getElementById('size-select').value = customization.size || 'medium';
                document.getElementById('unit-select').value = customization.unit || 'celsius';
                this.applyCustomization();
            } catch (error) {
                console.error('Error loading customization:', error);
            }
        }
    }

    setupCustomColorPreview() {
        const colorInputs = ['bg-color-start', 'bg-color-end', 'bg-color-solid', 'text-color'];
        const widget = document.getElementById('weather-widget');
        const customColors = document.getElementById('custom-colors');
        const gradientColors = document.getElementById('gradient-colors');
        const solidColor = document.getElementById('solid-color');
        
        // Background type change handler
        document.getElementById('bg-type-select').addEventListener('change', (e) => {
            if (e.target.value === 'gradient') {
                gradientColors.style.display = 'block';
                solidColor.style.display = 'none';
                const start = document.getElementById('bg-color-start').value;
                const end = document.getElementById('bg-color-end').value;
                widget.style.background = `linear-gradient(135deg, ${start}, ${end})`;
            } else {
                gradientColors.style.display = 'none';
                solidColor.style.display = 'block';
                const color = document.getElementById('bg-color-solid').value;
                widget.style.background = color;
            }
        });
        
        colorInputs.forEach(id => {
            document.getElementById(id).addEventListener('input', (e) => {
                if (id === 'text-color') {
                    const textElements = widget.querySelectorAll('span:not(.material-icons), div:not(.weather-animation)');
                    textElements.forEach(element => {
                        element.style.color = e.target.value;
                        element.style.webkitTextFillColor = e.target.value;
                    });
                    // Always apply color to icons
                    const iconElements = widget.querySelectorAll('.material-icons');
                    iconElements.forEach(icon => {
                        icon.style.color = e.target.value;
                        icon.style.webkitTextFillColor = e.target.value;
                    });
                } else if (document.getElementById('theme-select').value === 'custom') {
                    if (id === 'bg-color-solid') {
                        widget.style.background = e.target.value;
                    } else if (id.startsWith('bg-color-')) {
                        const start = document.getElementById('bg-color-start').value;
                        const end = document.getElementById('bg-color-end').value;
                        widget.style.background = `linear-gradient(135deg, ${start}, ${end})`;
                    }
                }
            });
        });

        // Theme select change handler
        document.getElementById('theme-select').addEventListener('change', (e) => {
            const widget = document.getElementById('weather-widget');
            const customColors = document.getElementById('custom-colors');
            
            if (e.target.value === 'custom') {
                customColors.style.display = 'block';
                const bgType = document.getElementById('bg-type-select').value;
                if (bgType === 'gradient') {
                    const start = document.getElementById('bg-color-start').value;
                    const end = document.getElementById('bg-color-end').value;
                    widget.style.background = `linear-gradient(135deg, ${start}, ${end})`;
                } else {
                    const color = document.getElementById('bg-color-solid').value;
                    widget.style.background = color;
                }
            } else {
                customColors.style.display = 'none';
                const gradients = {
                    light: ['#6e8efb', '#a777e3'],
                    dark: ['#2c3e50', '#3498db'],
                    sunset: ['#ff6b6b', '#feca57'],
                    ocean: ['#00b894', '#0984e3'],
                    forest: ['#55efc4', '#00b894'],
                    aurora: ['#6c5ce7', '#00b894'],
                    cosmic: ['#6c5ce7', '#fd79a8'],
                    cherry: ['#ff758c', '#ff7eb3']
                };
                const [startColor, endColor] = gradients[e.target.value];
                widget.style.background = `linear-gradient(135deg, ${startColor}, ${endColor})`;
            }
            
            // Update text color for all elements
            const textElements = widget.querySelectorAll('span:not(.material-icons), div:not(.weather-animation)');
            textElements.forEach(element => {
                element.style.color = document.getElementById('text-color').value;
            });
        });
    }
}

// Initialize the widget when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new WeatherWidget();
}); 