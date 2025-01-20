class WeatherAnimations {
    constructor(container) {
        this.container = container;
    }

    clearAnimation() {
        this.container.innerHTML = '';
    }

    createSunnyAnimation() {
        const sun = document.createElement('div');
        sun.style.cssText = `
            width: 60px;
            height: 60px;
            background: #FFD700;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 50px #FFD700;
            animation: pulse 2s infinite;
        `;

        const keyframes = document.createElement('style');
        keyframes.textContent = `
            @keyframes pulse {
                0% { transform: translate(-50%, -50%) scale(1); }
                50% { transform: translate(-50%, -50%) scale(1.1); }
                100% { transform: translate(-50%, -50%) scale(1); }
            }
        `;

        document.head.appendChild(keyframes);
        this.container.appendChild(sun);
    }

    createRainyAnimation() {
        const drops = 10;
        const keyframes = document.createElement('style');
        keyframes.textContent = `
            @keyframes rain {
                0% { transform: translateY(0); opacity: 1; }
                100% { transform: translateY(100px); opacity: 0; }
            }
        `;

        document.head.appendChild(keyframes);

        for (let i = 0; i < drops; i++) {
            const drop = document.createElement('div');
            drop.style.cssText = `
                width: 2px;
                height: 20px;
                background: #fff;
                position: absolute;
                top: 0;
                left: ${Math.random() * 100}%;
                animation: rain 1s infinite linear;
                animation-delay: ${Math.random() * 1}s;
            `;
            this.container.appendChild(drop);
        }
    }

    createCloudyAnimation() {
        const cloud = document.createElement('div');
        cloud.style.cssText = `
            width: 80px;
            height: 30px;
            background: #fff;
            border-radius: 20px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: float 3s infinite ease-in-out;
        `;

        const keyframes = document.createElement('style');
        keyframes.textContent = `
            @keyframes float {
                0% { transform: translate(-50%, -50%); }
                50% { transform: translate(-50%, -60%); }
                100% { transform: translate(-50%, -50%); }
            }
        `;

        document.head.appendChild(keyframes);
        this.container.appendChild(cloud);
    }

    createSnowAnimation() {
        const flakes = 15;
        const keyframes = document.createElement('style');
        keyframes.textContent = `
            @keyframes snow {
                0% { transform: translateY(0) rotate(0deg); }
                100% { transform: translateY(100px) rotate(360deg); }
            }
        `;

        document.head.appendChild(keyframes);

        for (let i = 0; i < flakes; i++) {
            const flake = document.createElement('div');
            flake.style.cssText = `
                width: 8px;
                height: 8px;
                background: #fff;
                border-radius: 50%;
                position: absolute;
                top: 0;
                left: ${Math.random() * 100}%;
                animation: snow 3s infinite linear;
                animation-delay: ${Math.random() * 3}s;
            `;
            this.container.appendChild(flake);
        }
    }

    setAnimation(weatherCode) {
        this.clearAnimation();
        
        // Weather codes based on OpenWeather API
        if (weatherCode >= 200 && weatherCode < 300) { // Thunderstorm
            this.createRainyAnimation();
        } else if (weatherCode >= 300 && weatherCode < 400) { // Drizzle
            this.createRainyAnimation();
        } else if (weatherCode >= 500 && weatherCode < 600) { // Rain
            this.createRainyAnimation();
        } else if (weatherCode >= 600 && weatherCode < 700) { // Snow
            this.createSnowAnimation();
        } else if (weatherCode >= 700 && weatherCode < 800) { // Atmosphere
            this.createCloudyAnimation();
        } else if (weatherCode === 800) { // Clear
            this.createSunnyAnimation();
        } else if (weatherCode > 800) { // Clouds
            this.createCloudyAnimation();
        }
    }
} 