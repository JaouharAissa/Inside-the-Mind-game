// Ending Scene (Patient healed)
class EndingScene {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.patient = null;
        this.mask = null;
        this.maskFalling = false;
        this.animationComplete = false;
    }

    create() {
        // Clear scene
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);

        const spotLight = new THREE.SpotLight(0xffd700, 1.5);
        spotLight.position.set(0, 8, 5);
        spotLight.angle = Math.PI / 4;
        this.scene.add(spotLight);

        // Floor
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(12, 12),
            new THREE.MeshPhongMaterial({ color: 0x5a5a5a })
        );
        floor.rotation.x = -Math.PI / 2;
        this.scene.add(floor);

        // Walls (brighter)
        const wallMaterial = new THREE.MeshPhongMaterial({ color: 0x6a6a6a });

        const backWall = new THREE.Mesh(
            new THREE.PlaneGeometry(12, 6),
            wallMaterial
        );
        backWall.position.set(0, 3, -6);
        this.scene.add(backWall);

        // Desk
        const desk = Models.createDesk();
        desk.position.set(0, 0, -3);
        this.scene.add(desk);

        // Patient chair
        const patientChair = Models.createChair(0x654321);
        patientChair.position.set(0, 0, 1);
        this.scene.add(patientChair);

        // Patient (happier posture)
        this.patient = Models.createCharacter(0xe74c3c, true);
        this.patient.position.set(0, 0, 0.8);
        this.scene.add(this.patient);

        // Sad mask (will fall)
        this.mask = Models.createSadMask();
        this.mask.position.set(0, 2, 0.3);
        this.mask.scale.set(1.2, 1.2, 1.2);
        this.mask.userData.velocity = new THREE.Vector3(0, 0, 0);
        this.mask.userData.angularVelocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.2,
            (Math.random() - 0.5) * 0.2
        );
        this.scene.add(this.mask);

        // Create happy face for patient (hidden initially)
        this.createHappyFace();

        // Position camera
        this.camera.position.set(0, 2, 6);
        this.camera.lookAt(0, 2, 0);

        // Update UI
        document.getElementById('scene-title').textContent = 'Guérison Complète';
        document.getElementById('instruction-text').classList.remove('hidden');
        document.getElementById('instruction-text').textContent = 'Mission accomplie ! Le patient est guéri !';

        // Start the ending animation
        setTimeout(() => {
            this.startEndingAnimation();
        }, 1000);
    }

    createHappyFace() {
        // Happy eyes and smile to replace the mask
        const group = new THREE.Group();

        // Happy eyes
        const eyeGeometry = new THREE.CircleGeometry(0.05, 16);
        const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.1, 0.08, 0.26);
        group.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.1, 0.08, 0.26);
        group.add(rightEye);

        // Happy smile (upward curve)
        const smileCurve = new THREE.EllipseCurve(
            0, 0, 0.15, 0.1, 0, Math.PI, false, 0
        );
        const smilePoints = smileCurve.getPoints(20);
        const smileGeometry = new THREE.BufferGeometry().setFromPoints(smilePoints);
        const smileMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 3 });
        const smile = new THREE.Line(smileGeometry, smileMaterial);
        smile.position.set(0, -0.05, 0.26);
        group.add(smile);

        group.position.set(0, 2, 0);
        group.visible = false;
        this.happyFace = group;
        this.scene.add(group);
    }

    startEndingAnimation() {
        // Make mask fall with physics
        this.maskFalling = true;
        audioManager.playHappy();

        // Create particles
        const particleSystem = new ParticleSystem(this.scene);
        particleSystem.createMagicSparkles(this.mask.position, 50, 0xffd700);
        this.particleSystem = particleSystem;

        // After mask falls, show happy face
        setTimeout(() => {
            if (this.happyFace) {
                this.happyFace.visible = true;
            }
        }, 1500);

        // Show game over screen after animation
        setTimeout(() => {
            this.showGameOver();
        }, 4000);
    }

    showGameOver() {
        this.animationComplete = true;

        // Hide HUD, show game over screen
        document.getElementById('hud').classList.remove('active');
        document.getElementById('game-over-screen').classList.add('active');
        document.getElementById('final-score').textContent = gameState.memoriesHealed;

        audioManager.playSuccess();
    }

    update(deltaTime, time) {
        // Physics for falling mask
        if (this.maskFalling && this.mask && this.mask.position.y > 0.1) {
            // Apply gravity
            this.mask.userData.velocity.y -= 0.02;

            // Update position
            this.mask.position.add(this.mask.userData.velocity);

            // Rotate
            this.mask.rotation.x += this.mask.userData.angularVelocity.x;
            this.mask.rotation.y += this.mask.userData.angularVelocity.y;
            this.mask.rotation.z += this.mask.userData.angularVelocity.z;

            // Fade out
            this.mask.traverse(child => {
                if (child.material) {
                    child.material.transparent = true;
                    child.material.opacity = Math.max(0, this.mask.position.y / 2);
                }
            });
        } else if (this.maskFalling && this.mask && this.mask.position.y <= 0.1) {
            // Remove mask when it hits the ground
            this.scene.remove(this.mask);
            this.mask = null;
            this.maskFalling = false;
        }

        // Animate happy face (subtle)
        if (this.happyFace && this.happyFace.visible) {
            this.happyFace.position.y = 2 + Math.sin(time * 3) * 0.02;
        }

        // Update particles
        if (this.particleSystem) {
            this.particleSystem.update(deltaTime);
        }
    }

    handleClick(intersectedObject) {
        // No interaction in ending scene
    }

    handleHover(intersectedObject) {
        // No hover effects in ending scene
    }

    cleanup() {
        this.patient = null;
        this.mask = null;
        this.maskFalling = false;
        this.animationComplete = false;
        if (this.particleSystem) {
            this.particleSystem.clear();
        }
    }
}
