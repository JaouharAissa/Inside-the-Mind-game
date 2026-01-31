// Main Game Engine
class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });
        this.clock = new THREE.Clock();
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.currentSceneObj = null;
        this.isLoading = true;

        // Initialize scenes
        this.scenes = {
            waitingRoom: new WaitingRoomScene(this.scene, this.camera),
            office: new DoctorOfficeScene(this.scene, this.camera),
            brain: new BrainWorldScene(this.scene, this.camera),
            ending: new EndingScene(this.scene, this.camera)
        };

        this.init();
    }

    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x0a0e27);
        this.renderer.shadowMap.enabled = true;

        // Setup scene
        this.scene.fog = new THREE.Fog(0x0a0e27, 10, 50);

        // Event listeners
        window.addEventListener('resize', () => this.onWindowResize(), false);
        window.addEventListener('mousemove', (e) => this.onMouseMove(e), false);
        window.addEventListener('click', (e) => this.onClick(e), false);

        // UI event listeners
        document.getElementById('start-btn').addEventListener('click', () => {
            this.startGame();
        });

        document.getElementById('dialogue-next').addEventListener('click', () => {
            if (this.currentSceneObj && this.currentSceneObj.nextDialogue) {
                this.currentSceneObj.nextDialogue();
            }
        });

        document.getElementById('replay-btn').addEventListener('click', () => {
            this.resetGame();
        });

        // Game state listeners
        gameState.on('currentScene', (sceneName) => {
            this.switchScene(sceneName);
        });

        // Hide loading screen
        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('hidden');
            this.isLoading = false;
        }, 1500);

        // Start game loop
        this.animate();
    }

    startGame() {
        audioManager.playClick();
        document.getElementById('title-screen').classList.remove('active');
        document.getElementById('hud').classList.add('active');
        gameState.setState('gameStarted', true);
        gameState.setState('currentScene', 'waitingRoom');
    }

    switchScene(sceneName) {
        // Cleanup current scene
        if (this.currentSceneObj && this.currentSceneObj.cleanup) {
            this.currentSceneObj.cleanup();
        }

        // Switch to new scene
        this.currentSceneObj = this.scenes[sceneName];
        if (this.currentSceneObj && this.currentSceneObj.create) {
            this.currentSceneObj.create();
        }
    }

    resetGame() {
        audioManager.playClick();

        // Reset game state
        gameState.reset();

        // Hide game over screen
        document.getElementById('game-over-screen').classList.remove('active');
        document.getElementById('title-screen').classList.add('active');
        document.getElementById('hud').classList.remove('active');

        // Clear animations
        animationController.clear();
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onMouseMove(event) {
        // Calculate mouse position in normalized device coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Raycasting for hover effects
        this.raycaster.setFromCamera(this.mouse, this.camera);

        if (this.currentSceneObj && this.currentSceneObj.interactableObjects) {
            const intersects = this.raycaster.intersectObjects(
                this.currentSceneObj.interactableObjects,
                true
            );

            if (intersects.length > 0) {
                // Find the top-level interactable object
                let object = intersects[0].object;
                while (object.parent && !object.userData.isPatient &&
                    !object.userData.isMemory && !object.userData.isPortal) {
                    object = object.parent;
                }

                if (this.currentSceneObj.handleHover) {
                    this.currentSceneObj.handleHover(object);
                }

                this.canvas.style.cursor = 'pointer';
            } else {
                if (this.currentSceneObj.handleHover) {
                    this.currentSceneObj.handleHover(null);
                }
                this.canvas.style.cursor = 'default';
            }
        }
    }

    onClick(event) {
        if (this.isLoading || !gameState.gameStarted) return;

        // Calculate mouse position
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Raycasting
        this.raycaster.setFromCamera(this.mouse, this.camera);

        if (this.currentSceneObj && this.currentSceneObj.interactableObjects) {
            const intersects = this.raycaster.intersectObjects(
                this.currentSceneObj.interactableObjects,
                true
            );

            if (intersects.length > 0) {
                // Find the top-level interactable object
                let object = intersects[0].object;
                while (object.parent && !object.userData.isPatient &&
                    !object.userData.isMemory && !object.userData.isPortal) {
                    object = object.parent;
                }

                audioManager.playClick();

                if (this.currentSceneObj.handleClick) {
                    this.currentSceneObj.handleClick(object);
                }
            }
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const deltaTime = this.clock.getDelta();
        const elapsedTime = this.clock.getElapsedTime();

        // Update current scene
        if (this.currentSceneObj && this.currentSceneObj.update) {
            this.currentSceneObj.update(deltaTime, elapsedTime);
        }

        // Update animation controller
        animationController.update(deltaTime * 1000);

        // Render
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize game when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
});
