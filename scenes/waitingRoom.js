// Waiting Room Scene
class WaitingRoomScene {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.patients = [];
        this.interactableObjects = [];
        this.selectedPatient = null;
    }

    create() {
        // Clear scene
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 5);
        this.scene.add(directionalLight);

        // Floor
        const floorGeometry = new THREE.PlaneGeometry(15, 10);
        const floorMaterial = new THREE.MeshPhongMaterial({ color: 0x2c3e50 });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = 0;
        this.scene.add(floor);

        // Walls
        const wallMaterial = new THREE.MeshPhongMaterial({ color: 0x34495e });

        // Back wall
        const backWall = new THREE.Mesh(
            new THREE.PlaneGeometry(15, 5),
            wallMaterial
        );
        backWall.position.set(0, 2.5, -5);
        this.scene.add(backWall);

        // Side walls
        const leftWall = new THREE.Mesh(
            new THREE.PlaneGeometry(10, 5),
            wallMaterial
        );
        leftWall.rotation.y = Math.PI / 2;
        leftWall.position.set(-7.5, 2.5, 0);
        this.scene.add(leftWall);

        const rightWall = new THREE.Mesh(
            new THREE.PlaneGeometry(10, 5),
            wallMaterial
        );
        rightWall.rotation.y = -Math.PI / 2;
        rightWall.position.set(7.5, 2.5, 0);
        this.scene.add(rightWall);

        // Create chairs and patients
        this.createPatients();

        // Position camera
        this.camera.position.set(0, 3, 8);
        this.camera.lookAt(0, 1.5, 0);

        // Update UI
        document.getElementById('scene-title').textContent = 'Salle d\'Attente';
        document.getElementById('instruction-text').textContent =
            'Sélectionnez le patient chanteur (celui avec une guitare)';
    }

    createPatients() {
        const patientData = [
            { x: -4, z: -2, color: 0x3498db, hasGuitar: false, name: 'Patient A' },
            { x: -1, z: -2, color: 0xe74c3c, hasGuitar: true, name: 'Le Chanteur' }, // The singer
            { x: 2, z: -2, color: 0x2ecc71, hasGuitar: false, name: 'Patient C' },
            { x: 5, z: -2, color: 0xf39c12, hasGuitar: false, name: 'Patient D' }
        ];

        patientData.forEach((data, index) => {
            // Create chair
            const chair = Models.createChair(0x8B4513);
            chair.position.set(data.x, 0, data.z);
            this.scene.add(chair);

            // Create patient character
            const patient = Models.createCharacter(data.color, data.hasGuitar);
            patient.position.set(data.x, 0, data.z - 0.2);
            patient.userData.patientData = data;
            patient.userData.isPatient = true;
            patient.userData.isSinger = data.hasGuitar;
            this.scene.add(patient);

            this.patients.push(patient);
            this.interactableObjects.push(patient);

            // Slight idle animation
            patient.userData.initialY = patient.position.y;
            patient.userData.animOffset = index * Math.PI / 2;
        });
    }

    update(deltaTime, time) {
        // Animate patients (subtle breathing)
        this.patients.forEach(patient => {
            patient.position.y = patient.userData.initialY +
                Math.sin(time * 2 + patient.userData.animOffset) * 0.02;
        });
    }

    handleClick(intersectedObject) {
        if (intersectedObject && intersectedObject.userData.isPatient) {
            if (intersectedObject.userData.isSinger) {
                // Correct patient selected!
                this.selectedPatient = intersectedObject;
                audioManager.playSuccess();
                gameState.setState('selectedPatient', intersectedObject);

                // Highlight the selected patient
                intersectedObject.traverse(child => {
                    if (child.isMesh) {
                        child.material.emissive = new THREE.Color(0x00ff00);
                        child.material.emissiveIntensity = 0.3;
                    }
                });

                // Transition to office scene
                setTimeout(() => {
                    gameState.setState('currentScene', 'office');
                }, 1000);
            } else {
                // Wrong patient
                audioManager.playSad();
                document.getElementById('instruction-text').textContent =
                    'Ce n\'est pas le bon patient. Cherchez le chanteur avec une guitare !';

                // Flash red
                intersectedObject.traverse(child => {
                    if (child.isMesh) {
                        const originalColor = child.material.color.clone();
                        child.material.color.set(0xff0000);
                        setTimeout(() => {
                            child.material.color.copy(originalColor);
                        }, 300);
                    }
                });
            }
        }
    }

    handleHover(intersectedObject) {
        // Reset all patients
        this.patients.forEach(patient => {
            patient.traverse(child => {
                if (child.isMesh && patient !== this.selectedPatient) {
                    child.material.emissive = new THREE.Color(0x000000);
                    child.material.emissiveIntensity = 0;
                }
            });
        });

        // Highlight hovered patient
        if (intersectedObject && intersectedObject.userData.isPatient) {
            intersectedObject.traverse(child => {
                if (child.isMesh && intersectedObject !== this.selectedPatient) {
                    child.material.emissive = new THREE.Color(0x6366f1);
                    child.material.emissiveIntensity = 0.2;
                }
            });
        }
    }

    cleanup() {
        // Clean up scene
        this.patients = [];
        this.interactableObjects = [];
    }
}
