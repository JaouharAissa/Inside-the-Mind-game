// Brain World Scene (Inside the patient's mind)
class BrainWorldScene {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.memories = [];
        this.interactableObjects = [];
        this.neuralNetwork = null;
        this.particleSystem = null;
        this.controls = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            moveSpeed: 0.1
        };
        this.setupControls();
    }

    setupControls() {
        // WASD movement
        document.addEventListener('keydown', (e) => {
            if (gameState.currentScene !== 'brain') return;

            switch (e.key.toLowerCase()) {
                case 'w': this.controls.forward = true; break;
                case 's': this.controls.backward = true; break;
                case 'a': this.controls.left = true; break;
                case 'd': this.controls.right = true; break;
            }
        });

        document.addEventListener('keyup', (e) => {
            switch (e.key.toLowerCase()) {
                case 'w': this.controls.forward = false; break;
                case 's': this.controls.backward = false; break;
                case 'a': this.controls.left = false; break;
                case 'd': this.controls.right = false; break;
            }
        });
    }

    create() {
        // Clear scene
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0]);
        }

        // Create surreal brain environment
        // Ambient light (darker, more mysterious)
        const ambientLight = new THREE.AmbientLight(0x4040ff, 0.4);
        this.scene.add(ambientLight);

        // Point lights for atmosphere
        const light1 = new THREE.PointLight(0x6366f1, 1, 20);
        light1.position.set(5, 5, 5);
        this.scene.add(light1);

        const light2 = new THREE.PointLight(0xa78bfa, 1, 20);
        light2.position.set(-5, 5, -5);
        this.scene.add(light2);

        // Create floor (neural surface)
        const floorGeometry = new THREE.PlaneGeometry(30, 30, 20, 20);
        const floorMaterial = new THREE.MeshPhongMaterial({
            color: 0x1a1a3e,
            wireframe: false,
            emissive: 0x2a2a5e,
            emissiveIntensity: 0.3
        });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -1;

        // Animate floor vertices
        const positions = floor.geometry.attributes.position;
        floor.userData.originalPositions = [];
        for (let i = 0; i < positions.count; i++) {
            floor.userData.originalPositions.push(positions.getY(i));
        }
        floor.userData.isAnimated = true;

        this.scene.add(floor);
        this.floor = floor;

        // Add neural network background
        this.neuralNetwork = Models.createNeuralNetwork();
        this.neuralNetwork.position.set(0, 2, -10);
        this.scene.add(this.neuralNetwork);

        // Create bad memories scattered around
        this.createBadMemories();

        // Position camera for first-person view
        this.camera.position.set(0, 1.6, 5);
        this.camera.lookAt(0, 1.6, 0);

        // Update UI
        document.getElementById('scene-title').textContent = 'Esprit du Patient';
        document.getElementById('memory-counter').classList.remove('hidden');
        document.getElementById('total-memories').textContent = gameState.totalMemories;
        document.getElementById('memories-healed').textContent = gameState.memoriesHealed;

        // Show controls temporarily
        const controlsDiv = document.getElementById('brain-controls');
        controlsDiv.classList.remove('hidden');
        setTimeout(() => {
            controlsDiv.classList.add('hidden');
        }, 5000);

        document.getElementById('instruction-text').classList.remove('hidden');
        document.getElementById('instruction-text').textContent =
            'Trouvez les mauvais souvenirs et résolvez les puzzles pour les guérir ✨';

        // Change cursor to magic wand
        document.getElementById('game-canvas').classList.add('magic-cursor');

        // Initialize particle system
        this.particleSystem = new ParticleSystem(this.scene);
    }

    createBadMemories() {
        // Broken guitar
        const brokenGuitar = Models.createBrokenGuitar();
        brokenGuitar.position.set(-5, 0.5, -3);
        brokenGuitar.userData.floatOffset = 0;
        this.scene.add(brokenGuitar);
        this.memories.push(brokenGuitar);
        this.interactableObjects.push(brokenGuitar);

        // Shattered microphone
        const shatteredMic = Models.createShatteredMicrophone();
        shatteredMic.position.set(3, 0.5, -5);
        shatteredMic.userData.floatOffset = Math.PI / 3;
        this.scene.add(shatteredMic);
        this.memories.push(shatteredMic);
        this.interactableObjects.push(shatteredMic);

        // Booing crowd
        const booingCrowd = Models.createBooingCrowd();
        booingCrowd.position.set(0, 0.5, -8);
        booingCrowd.userData.floatOffset = Math.PI * 2 / 3;
        this.scene.add(booingCrowd);
        this.memories.push(booingCrowd);
        this.interactableObjects.push(booingCrowd);

        // More broken guitars
        const brokenGuitar2 = Models.createBrokenGuitar();
        brokenGuitar2.position.set(5, 0.5, 2);
        brokenGuitar2.rotation.y = Math.PI / 4;
        brokenGuitar2.userData.floatOffset = Math.PI;
        this.scene.add(brokenGuitar2);
        this.memories.push(brokenGuitar2);
        this.interactableObjects.push(brokenGuitar2);

        // Another mic
        const shatteredMic2 = Models.createShatteredMicrophone();
        shatteredMic2.position.set(-4, 0.5, 3);
        shatteredMic2.userData.floatOffset = Math.PI * 4 / 3;
        this.scene.add(shatteredMic2);
        this.memories.push(shatteredMic2);
        this.interactableObjects.push(shatteredMic2);

        // Another crowd
        const booingCrowd2 = Models.createBooingCrowd();
        booingCrowd2.position.set(7, 0.5, -2);
        booingCrowd2.rotation.y = -Math.PI / 3;
        booingCrowd2.userData.floatOffset = Math.PI * 5 / 3;
        this.scene.add(booingCrowd2);
        this.memories.push(booingCrowd2);
        this.interactableObjects.push(booingCrowd2);

        // Add dark particles around bad memories
        this.memories.forEach(memory => {
            memory.userData.darkAura = this.createDarkAura(memory.position);
        });
    }

    createDarkAura(position) {
        const particleCount = 30;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const radius = 0.5 + Math.random() * 0.5;
            positions[i * 3] = position.x + Math.cos(angle) * radius;
            positions[i * 3 + 1] = position.y + (Math.random() - 0.5) * 2;
            positions[i * 3 + 2] = position.z + Math.sin(angle) * radius;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: 0x222222,
            size: 0.1,
            transparent: true,
            opacity: 0.8
        });

        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        return particles;
    }

    update(deltaTime, time) {
        // Player movement (first-person)
        const forward = new THREE.Vector3();
        this.camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();

        const right = new THREE.Vector3();
        right.crossVectors(forward, new THREE.Vector3(0, 1, 0));

        if (this.controls.forward) {
            this.camera.position.addScaledVector(forward, this.controls.moveSpeed);
        }
        if (this.controls.backward) {
            this.camera.position.addScaledVector(forward, -this.controls.moveSpeed);
        }
        if (this.controls.left) {
            this.camera.position.addScaledVector(right, -this.controls.moveSpeed);
        }
        if (this.controls.right) {
            this.camera.position.addScaledVector(right, this.controls.moveSpeed);
        }

        // Keep camera at head height
        this.camera.position.y = 1.6;

        // Animate floor
        if (this.floor && this.floor.userData.isAnimated) {
            const positions = this.floor.geometry.attributes.position;
            for (let i = 0; i < positions.count; i++) {
                const x = positions.getX(i);
                const z = positions.getZ(i);
                const wave = Math.sin(time * 2 + x * 0.5) * Math.cos(time * 2 + z * 0.5) * 0.3;
                positions.setY(i, this.floor.userData.originalPositions[i] + wave);
            }
            positions.needsUpdate = true;
        }

        // Animate memories (floating)
        this.memories.forEach(memory => {
            if (!memory.userData.isHealed) {
                memory.position.y = 0.5 + Math.sin(time * 2 + memory.userData.floatOffset) * 0.2;
                memory.rotation.y += deltaTime * 0.5;

                // Animate dark aura
                if (memory.userData.darkAura) {
                    memory.userData.darkAura.rotation.y += deltaTime;
                }
            }
        });

        // Animate neural network
        if (this.neuralNetwork) {
            this.neuralNetwork.rotation.y += deltaTime * 0.1;
            this.neuralNetwork.children.forEach((neuron, i) => {
                neuron.position.y += Math.sin(time * 2 + i) * 0.005;
            });
        }

        // Update particle system
        if (this.particleSystem) {
            this.particleSystem.update(deltaTime);
        }
    }

    handleClick(intersectedObject) {
        if (intersectedObject && intersectedObject.userData.isMemory && !intersectedObject.userData.isHealed) {
            // Launch appropriate puzzle based on memory type
            const memoryType = intersectedObject.userData.memoryType;
            let puzzleType, memoryData;

            switch (memoryType) {
                case 'brokenGuitar':
                    puzzleType = 'reconstruction';
                    memoryData = {
                        name: '🎸 Guitare Brisée',
                        description: 'Reconstruisez la guitare cassée en plaçant les pièces au bon endroit'
                    };
                    break;
                case 'shatteredMic':
                    puzzleType = 'rhythm';
                    memoryData = {
                        name: '🎤 Microphone Brisé',
                        description: 'Réparez le microphone en reproduisant la mélodie correcte'
                    };
                    break;
                case 'booingCrowd':
                    puzzleType = 'memory';
                    memoryData = {
                        name: '👥 Foule qui Hue',
                        description: 'Transformez la foule en trouvant toutes les paires de visages heureux'
                    };
                    break;
                default:
                    // Fallback - shouldn't happen
                    this.healMemory(intersectedObject);
                    return;
            }

            // Start the puzzle
            puzzleSystem.startPuzzle(puzzleType, memoryData, () => {
                // On puzzle complete, heal the memory
                this.healMemory(intersectedObject);
            });
        }
    }

    healMemory(memory) {
        audioManager.playHeal();
        memory.userData.isHealed = true;

        // Remove from interactable
        const index = this.interactableObjects.indexOf(memory);
        if (index > -1) {
            this.interactableObjects.splice(index, 1);
        }

        // Create healing particle effect
        this.particleSystem.createHealingEffect(memory.position);

        // Remove dark aura
        if (memory.userData.darkAura) {
            this.scene.remove(memory.userData.darkAura);
        }

        // Transform to good memory
        const position = memory.position.clone();
        const rotation = memory.rotation.clone();

        // Remove bad memory
        this.scene.remove(memory);

        // Create good memory replacement
        let goodMemory;
        if (memory.userData.memoryType === 'brokenGuitar') {
            goodMemory = Models.createFixedGuitar();
        } else if (memory.userData.memoryType === 'shatteredMic') {
            goodMemory = Models.createMicrophone();
        } else if (memory.userData.memoryType === 'booingCrowd') {
            goodMemory = Models.createCheeringCrowd();
        }

        if (goodMemory) {
            goodMemory.position.copy(position);
            goodMemory.rotation.copy(rotation);
            goodMemory.userData.isHealed = true;
            goodMemory.userData.floatOffset = memory.userData.floatOffset;
            this.scene.add(goodMemory);

            // Replace in memories array
            const memIndex = this.memories.indexOf(memory);
            if (memIndex > -1) {
                this.memories[memIndex] = goodMemory;
            }
        }

        // Update counter
        gameState.incrementMemories();
        document.getElementById('memories-healed').textContent = gameState.memoriesHealed;

        // Check if all memories healed
        if (gameState.memoriesHealed >= gameState.totalMemories) {
            setTimeout(() => {
                this.exitBrain();
            }, 2000);
        }
    }

    exitBrain() {
        document.getElementById('instruction-text').textContent = 'Tous les souvenirs sont guéris ! Retour au cabinet...';
        audioManager.playSuccess();

        setTimeout(() => {
            document.getElementById('game-canvas').classList.remove('magic-cursor');
            gameState.setState('currentScene', 'ending');
        }, 2000);
    }

    handleHover(intersectedObject) {
        if (intersectedObject && intersectedObject.userData.isMemory && !intersectedObject.userData.isHealed) {
            // Pulse effect on hover
            intersectedObject.traverse(child => {
                if (child.isMesh) {
                    child.material.emissive = new THREE.Color(0xffd700);
                    child.material.emissiveIntensity = 0.5;
                }
            });
        } else {
            // Reset all memories
            this.memories.forEach(memory => {
                if (!memory.userData.isHealed) {
                    memory.traverse(child => {
                        if (child.isMesh) {
                            child.material.emissive = new THREE.Color(0x000000);
                            child.material.emissiveIntensity = 0;
                        }
                    });
                }
            });
        }
    }

    cleanup() {
        document.getElementById('game-canvas').classList.remove('magic-cursor');
        document.getElementById('memory-counter').classList.add('hidden');
        this.memories = [];
        this.interactableObjects = [];
        if (this.particleSystem) {
            this.particleSystem.clear();
        }
    }
}
