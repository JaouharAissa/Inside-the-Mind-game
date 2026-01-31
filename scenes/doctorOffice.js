// Doctor's Office Scene
class DoctorOfficeScene {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.patient = null;
        this.mask = null;
        this.portal = null;
        this.interactableObjects = []; // ADDED: needed for raycasting
        this.dialogueStep = 0;
        this.dialogues = [
            { speaker: 'Patient', text: 'Docteur... je ne sens plus rien. Ma passion pour la musique a disparu...' },
            { speaker: 'Docteur', text: 'Ne vous inquiétez pas. Je vais entrer dans votre esprit et guérir vos souvenirs.' },
            { speaker: 'Patient', text: 'Vous pouvez vraiment faire ça?' },
            { speaker: 'Docteur', text: 'Oui. Préparez-vous, je vais plonger dans votre cerveau maintenant.' }
        ];
    }

    create() {
        // Clear scene
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const spotLight = new THREE.SpotLight(0xffffff, 1);
        spotLight.position.set(0, 8, 5);
        spotLight.angle = Math.PI / 4;
        this.scene.add(spotLight);

        // Floor
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(12, 12),
            new THREE.MeshPhongMaterial({ color: 0x3d3d3d })
        );
        floor.rotation.x = -Math.PI / 2;
        this.scene.add(floor);

        // Walls
        const wallMaterial = new THREE.MeshPhongMaterial({ color: 0x4a4a4a });

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

        // Patient with sad mask
        this.patient = Models.createCharacter(0xe74c3c, true);
        this.patient.position.set(0, 0, 0.8);
        this.scene.add(this.patient);

        // Add sad mask to patient's face
        this.mask = Models.createSadMask();
        this.mask.position.set(0, 2, 0.3);
        this.mask.scale.set(1.2, 1.2, 1.2);
        this.scene.add(this.mask);

        // Create portal effect above patient's head
        this.createPortal();

        // Position camera
        this.camera.position.set(0, 2, 6);
        this.camera.lookAt(0, 2, 0);

        // Update UI
        document.getElementById('scene-title').textContent = 'Cabinet du Docteur';
        document.getElementById('instruction-text').classList.add('hidden');

        // Start dialogue
        this.showDialogue();
    }

    createPortal() {
        const portalGeometry = new THREE.TorusGeometry(0.5, 0.1, 16, 32);
        const portalMaterial = new THREE.MeshPhongMaterial({
            color: 0x6366f1,
            emissive: 0xa78bfa,
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.7
        });
        this.portal = new THREE.Mesh(portalGeometry, portalMaterial);
        this.portal.position.set(0, 2.8, 0);
        this.portal.rotation.x = Math.PI / 2;
        this.portal.userData.isPortal = true;
        this.scene.add(this.portal);

        // Add particles around portal
        const particleCount = 50;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 2;
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particleMaterial = new THREE.PointsMaterial({
            color: 0xa78bfa,
            size: 0.05,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        const particleSystem = new THREE.Points(particles, particleMaterial);
        particleSystem.position.copy(this.portal.position);
        this.portal.userData.particles = particleSystem;
        this.scene.add(particleSystem);

        // ADDED: Make portal clickable
        this.interactableObjects.push(this.portal);
    }

    showDialogue() {
        if (this.dialogueStep < this.dialogues.length) {
            const dialogue = this.dialogues[this.dialogueStep];
            const dialogueBox = document.getElementById('dialogue-box');
            const speaker = document.getElementById('dialogue-speaker');
            const text = document.getElementById('dialogue-text');

            dialogueBox.classList.remove('hidden');
            speaker.textContent = dialogue.speaker;
            text.textContent = dialogue.text;

            audioManager.playClick();
        } else {
            // Dialogue finished, show portal instruction
            document.getElementById('dialogue-box').classList.add('hidden');
            document.getElementById('instruction-text').classList.remove('hidden');
            document.getElementById('instruction-text').textContent =
                'Cliquez sur le portail au-dessus de la tête du patient pour entrer dans son cerveau';
        }
    }

    nextDialogue() {
        this.dialogueStep++;
        this.showDialogue();
    }

    update(deltaTime, time) {
        // Animate mask (subtle breathing)
        if (this.mask) {
            this.mask.position.y = 2 + Math.sin(time * 2) * 0.03;
        }

        // Animate portal
        if (this.portal) {
            this.portal.rotation.z += deltaTime;

            // Animate portal particles
            if (this.portal.userData.particles) {
                const positions = this.portal.userData.particles.geometry.attributes.position.array;
                for (let i = 0; i < positions.length; i += 3) {
                    positions[i + 1] += Math.sin(time * 3 + i) * 0.01;
                }
                this.portal.userData.particles.geometry.attributes.position.needsUpdate = true;
            }
        }
    }

    handleClick(intersectedObject) {
        if (intersectedObject && intersectedObject.userData.isPortal) {
            // Enter brain world
            audioManager.playSuccess();
            document.getElementById('instruction-text').textContent = 'Entrée dans le cerveau...';

            // Portal effect
            animationController.animate(
                this.portal.scale,
                'x',
                1, 3,
                1000,
                'easeInOutCubic'
            );
            animationController.animate(
                this.portal.scale,
                'y',
                1, 3,
                1000,
                'easeInOutCubic'
            );
            animationController.animate(
                this.portal.material,
                'opacity',
                0.7, 0,
                1000,
                'easeInOutCubic'
            );

            setTimeout(() => {
                gameState.setState('currentScene', 'brain');
            }, 1000);
        }
    }

    handleHover(intersectedObject) {
        if (intersectedObject && intersectedObject.userData.isPortal) {
            this.portal.material.emissiveIntensity = 1.2;
        } else if (this.portal) {
            this.portal.material.emissiveIntensity = 0.8;
        }
    }

    cleanup() {
        this.patient = null;
        this.mask = null;
        this.portal = null;
        this.dialogueStep = 0;
    }
}
