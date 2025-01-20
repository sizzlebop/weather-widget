class WeatherAnimations {
    constructor(container) {
        this.container = container;
        // Set up container with overflow hidden to keep animations within bounds
        this.container.style.cssText = `
            position: relative;
            z-index: 2;
            overflow: hidden;
            width: 150px;
            height: 150px;
            border-radius: 10px;
        `;
    }

    clearAnimation() {
        this.container.innerHTML = '';
    }

    createSunnyAnimation() {
        const sun = document.createElement('div');
        sun.style.cssText = `
            width: 60px;
            height: 60px;
            background: #FDB813 !important;
            background-color: #FDB813 !important;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: pulse 2s infinite;
            z-index: 2;
            color-scheme: light !important;
            forced-color-adjust: none;
            box-shadow: 0 0 20px #FDB813 !important;
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
                0% { transform: translateY(-10px); opacity: 1; }
                100% { transform: translateY(160px); opacity: 0; }
            }
        `;

        document.head.appendChild(keyframes);

        for (let i = 0; i < drops; i++) {
            const drop = document.createElement('div');
            drop.style.cssText = `
                width: 2px;
                height: 20px;
                background: #87CEEB !important;
                background-color: #87CEEB !important;
                position: absolute;
                top: -20px;
                left: ${Math.random() * 100}%;
                animation: rain 1s infinite linear;
                animation-delay: ${Math.random() * 1}s;
                z-index: 2;
                color-scheme: light !important;
                forced-color-adjust: none;
                box-shadow: 0 0 5px #87CEEB !important;
            `;
            this.container.appendChild(drop);
        }
    }

    createCloudyAnimation() {
        const cloud = document.createElement('div');
        cloud.style.cssText = `
            width: 80px;
            height: 30px;
            background: #FFFFFF !important;
            background-color: #FFFFFF !important;
            border-radius: 20px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: float 3s infinite ease-in-out;
            z-index: 2;
            color-scheme: light !important;
            forced-color-adjust: none;
            box-shadow: 0 0 15px #FFFFFF !important;
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
                0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
                100% { transform: translateY(160px) rotate(360deg); opacity: 0; }
            }
        `;

        document.head.appendChild(keyframes);

        for (let i = 0; i < flakes; i++) {
            const flake = document.createElement('div');
            flake.style.cssText = `
                width: 8px;
                height: 8px;
                background: #FFFFFF !important;
                background-color: #FFFFFF !important;
                border-radius: 50%;
                position: absolute;
                top: -10px;
                left: ${Math.random() * 100}%;
                animation: snow 3s infinite linear;
                animation-delay: ${Math.random() * 3}s;
                z-index: 2;
                color-scheme: light !important;
                forced-color-adjust: none;
                box-shadow: 0 0 8px #FFFFFF !important;
            `;
            this.container.appendChild(flake);
        }
    }

    createFogAnimation() {
        const fogLayers = 3;
        const keyframes = document.createElement('style');
        keyframes.textContent = `
            @keyframes fog {
                0% { transform: translateX(-100%); opacity: 0; }
                50% { opacity: 0.5; }
                100% { transform: translateX(100%); opacity: 0; }
            }
        `;

        document.head.appendChild(keyframes);

        for (let i = 0; i < fogLayers; i++) {
            const fog = document.createElement('div');
            fog.style.cssText = `
                width: 200px;
                height: 20px;
                background: #FFFFFF !important;
                background-color: #FFFFFF !important;
                position: absolute;
                top: ${30 + (i * 20)}%;
                left: 0;
                animation: fog ${4 + i}s infinite linear;
                animation-delay: ${i * 1.5}s;
                z-index: 2;
                color-scheme: light !important;
                forced-color-adjust: none;
                box-shadow: 0 0 10px #FFFFFF !important;
                opacity: 0.7;
            `;
            this.container.appendChild(fog);
        }
    }

    createThunderstormAnimation() {
        this.createRainyAnimation();

        const lightning = document.createElement('div');
        lightning.style.cssText = `
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            background: transparent !important;
            animation: lightning 5s infinite;
            z-index: 3;
            color-scheme: light !important;
            forced-color-adjust: none;
        `;

        const keyframes = document.createElement('style');
        keyframes.textContent = `
            @keyframes lightning {
                0%, 95%, 98% { background: transparent !important; }
                96%, 99% { background: #FFFFD4 !important; box-shadow: 0 0 25px #FFFFD4 !important; }
                97%, 100% { background: transparent !important; }
            }
        `;

        document.head.appendChild(keyframes);
        this.container.appendChild(lightning);
    }

    setAnimation(weatherCode) {
        this.clearAnimation();
        
        // Weather codes based on OpenWeather API
        if (weatherCode >= 200 && weatherCode < 300) { // Thunderstorm
            this.createThunderstormAnimation();
        } else if (weatherCode >= 300 && weatherCode < 400) { // Drizzle
            this.createRainyAnimation();
        } else if (weatherCode >= 500 && weatherCode < 600) { // Rain
            this.createRainyAnimation();
        } else if (weatherCode >= 600 && weatherCode < 700) { // Snow
            this.createSnowAnimation();
        } else if (weatherCode >= 700 && weatherCode < 800) { // Atmosphere (fog, mist, etc.)
            this.createFogAnimation();
        } else if (weatherCode === 800) { // Clear
            this.createSunnyAnimation();
        } else if (weatherCode > 800) { // Clouds
            this.createCloudyAnimation();
        }
    }
} 