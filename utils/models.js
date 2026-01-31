// 3D Model Creation Utilities
const Models = {
    // Create a simple character model
    createCharacter(color = 0x8B4513, hasGuitar = false) {
        const group = new THREE.Group();

        // Legs
        const legGeometry = new THREE.CylinderGeometry(0.12, 0.15, 0.8, 8);
        const legMaterial = new THREE.MeshPhongMaterial({ color: 0x2c3e50 });

        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-0.18, 0.4, 0);
        group.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(0.18, 0.4, 0);
        group.add(rightLeg);

        // Torso (larger, more shirt-like)
        const torsoGeometry = new THREE.BoxGeometry(0.6, 0.7, 0.35);
        const torsoMaterial = new THREE.MeshPhongMaterial({ color: color });
        const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
        torso.position.y = 1.2;
        group.add(torso);

        // Arms
        const armGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.6, 8);
        const armMaterial = new THREE.MeshPhongMaterial({ color: 0xffdbac });

        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-0.38, 1.1, 0);
        leftArm.rotation.z = 0.3;
        group.add(leftArm);

        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(0.38, 1.1, 0);
        rightArm.rotation.z = -0.3;
        group.add(rightArm);

        // Neck
        const neckGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.15, 8);
        const neckMaterial = new THREE.MeshPhongMaterial({ color: 0xffdbac });
        const neck = new THREE.Mesh(neckGeometry, neckMaterial);
        neck.position.y = 1.65;
        group.add(neck);

        // Head (larger and rounder)
        const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const headMaterial = new THREE.MeshPhongMaterial({ color: 0xffdbac });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 2.0;
        group.add(head);

        // Eyes (bigger and more visible)
        const eyeGeometry = new THREE.SphereGeometry(0.06, 8, 8);
        const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });

        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.12, 2.08, 0.25);
        group.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.12, 2.08, 0.25);
        group.add(rightEye);

        // Happy smile
        const smileCurve = new THREE.EllipseCurve(
            0, 0, 0.15, 0.08, Math.PI, 0, false, 0
        );
        const smilePoints = smileCurve.getPoints(20);
        const smileGeometry = new THREE.BufferGeometry().setFromPoints(smilePoints);
        const smileMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
        const smile = new THREE.Line(smileGeometry, smileMaterial);
        smile.position.set(0, 1.88, 0.26);
        group.add(smile);

        // Guitar for singer (MUCH BIGGER AND MORE VISIBLE)
        if (hasGuitar) {
            const guitarGroup = new THREE.Group();

            // Guitar body (larger, rounded shape using multiple spheres)
            const guitarBodyGeo = new THREE.SphereGeometry(0.4, 16, 16);
            const guitarBodyMat = new THREE.MeshPhongMaterial({
                color: 0xD2691E,
                shininess: 30
            });
            const guitarBody = new THREE.Mesh(guitarBodyGeo, guitarBodyMat);
            guitarBody.scale.set(1, 1.3, 0.4); // Flatten it
            guitarGroup.add(guitarBody);

            // Sound hole
            const holeGeo = new THREE.CircleGeometry(0.12, 16);
            const holeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
            const hole = new THREE.Mesh(holeGeo, holeMat);
            hole.position.set(0, 0, 0.17);
            guitarGroup.add(hole);

            // Guitar neck (longer and more visible)
            const guitarNeck = new THREE.Mesh(
                new THREE.BoxGeometry(0.12, 1.0, 0.08),
                new THREE.MeshPhongMaterial({ color: 0x8B4513 })
            );
            guitarNeck.position.set(0, 0.7, 0);
            guitarGroup.add(guitarNeck);

            // Headstock
            const headstock = new THREE.Mesh(
                new THREE.BoxGeometry(0.2, 0.25, 0.08),
                new THREE.MeshPhongMaterial({ color: 0x654321 })
            );
            headstock.position.set(0, 1.3, 0);
            guitarGroup.add(headstock);

            // Strings (6 visible strings)
            for (let i = 0; i < 6; i++) {
                const string = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.005, 0.005, 1.2),
                    new THREE.MeshBasicMaterial({ color: 0xFFD700 })
                );
                string.position.set(-0.04 + i * 0.016, 0.35, 0.05);
                guitarGroup.add(string);
            }

            // Position guitar on the character
            guitarGroup.position.set(0.45, 0.9, 0.1);
            guitarGroup.rotation.z = -0.3;
            guitarGroup.rotation.y = -0.2;
            group.add(guitarGroup);
        }

        group.userData.isCharacter = true;
        return group;
    },

    // Create a sad mask
    createSadMask() {
        const group = new THREE.Group();

        // Mask face
        const maskGeometry = new THREE.CircleGeometry(0.3, 32);
        const maskMaterial = new THREE.MeshPhongMaterial({
            color: 0x444444,
            side: THREE.DoubleSide
        });
        const mask = new THREE.Mesh(maskGeometry, maskMaterial);
        group.add(mask);

        // Sad eyes
        const eyeGeometry = new THREE.CircleGeometry(0.05, 16);
        const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.1, 0.08, 0.01);
        group.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.1, 0.08, 0.01);
        group.add(rightEye);

        // Sad mouth (curve)
        const mouthCurve = new THREE.EllipseCurve(
            0, -0.05, 0.15, 0.1, 0, Math.PI, false, 0
        );
        const mouthPoints = mouthCurve.getPoints(20);
        const mouthGeometry = new THREE.BufferGeometry().setFromPoints(mouthPoints);
        const mouthMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 3 });
        const mouth = new THREE.Line(mouthGeometry, mouthMaterial);
        mouth.rotation.z = Math.PI;
        mouth.position.z = 0.01;
        group.add(mouth);

        group.userData.isMask = true;
        return group;
    },

    // Create a chair
    createChair(color = 0x8B4513) {
        const group = new THREE.Group();

        // Seat
        const seat = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.1, 0.8),
            new THREE.MeshPhongMaterial({ color: color })
        );
        seat.position.y = 0.8;
        group.add(seat);

        // Backrest
        const backrest = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.8, 0.1),
            new THREE.MeshPhongMaterial({ color: color })
        );
        backrest.position.set(0, 1.3, -0.35);
        group.add(backrest);

        // Legs
        const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8);
        const legMaterial = new THREE.MeshPhongMaterial({ color: color });

        const positions = [
            [-0.3, 0.4, -0.3],
            [0.3, 0.4, -0.3],
            [-0.3, 0.4, 0.3],
            [0.3, 0.4, 0.3]
        ];

        positions.forEach(pos => {
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            leg.position.set(...pos);
            group.add(leg);
        });

        return group;
    },

    // Create a desk
    createDesk() {
        const group = new THREE.Group();

        // Desktop
        const desktop = new THREE.Mesh(
            new THREE.BoxGeometry(2, 0.1, 1),
            new THREE.MeshPhongMaterial({ color: 0x8B4513 })
        );
        desktop.position.y = 1.2;
        group.add(desktop);

        // Legs
        const legGeometry = new THREE.BoxGeometry(0.1, 1.2, 0.1);
        const legMaterial = new THREE.MeshPhongMaterial({ color: 0x654321 });

        const positions = [
            [-0.9, 0.6, -0.4],
            [0.9, 0.6, -0.4],
            [-0.9, 0.6, 0.4],
            [0.9, 0.6, 0.4]
        ];

        positions.forEach(pos => {
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            leg.position.set(...pos);
            group.add(leg);
        });

        return group;
    },

    // Create broken guitar (bad memory)
    createBrokenGuitar() {
        const group = new THREE.Group();

        // Body (cracked)
        const body1 = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.7, 0.15),
            new THREE.MeshPhongMaterial({ color: 0x4a4a4a, emissive: 0x000000 })
        );
        body1.position.set(-0.1, 0, 0);
        body1.rotation.z = 0.2;
        group.add(body1);

        const body2 = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.7, 0.15),
            new THREE.MeshPhongMaterial({ color: 0x4a4a4a, emissive: 0x000000 })
        );
        body2.position.set(0.1, 0, 0);
        body2.rotation.z = -0.2;
        group.add(body2);

        // Broken neck
        const neck = new THREE.Mesh(
            new THREE.BoxGeometry(0.08, 0.8, 0.08),
            new THREE.MeshPhongMaterial({ color: 0x3a3a3a })
        );
        neck.position.set(0, 0.6, 0);
        neck.rotation.z = 0.5;
        group.add(neck);

        group.userData.isMemory = true;
        group.userData.memoryType = 'brokenGuitar';
        group.userData.isHealed = false;

        return group;
    },

    // Create fixed guitar (good memory)
    createFixedGuitar() {
        const group = new THREE.Group();

        // Body (whole and shiny)
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 0.9, 0.2),
            new THREE.MeshPhongMaterial({
                color: 0xD4A574,
                emissive: 0xFFD700,
                emissiveIntensity: 0.3,
                shininess: 100
            })
        );
        group.add(body);

        // Neck
        const neck = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 1.0, 0.1),
            new THREE.MeshPhongMaterial({ color: 0x8B4513 })
        );
        neck.position.set(0, 0.9, 0);
        group.add(neck);

        // Strings
        for (let i = 0; i < 4; i++) {
            const string = new THREE.Mesh(
                new THREE.CylinderGeometry(0.01, 0.01, 1.8),
                new THREE.MeshBasicMaterial({ color: 0xCCCCCC })
            );
            string.position.set(-0.15 + i * 0.1, 0.4, 0.11);
            group.add(string);
        }

        return group;
    },

    // Create microphone (bad memory - shattered)
    createShatteredMicrophone() {
        const group = new THREE.Group();

        // Broken pieces
        for (let i = 0; i < 5; i++) {
            const piece = new THREE.Mesh(
                new THREE.SphereGeometry(0.1 + Math.random() * 0.1, 8, 8),
                new THREE.MeshPhongMaterial({ color: 0x333333 })
            );
            piece.position.set(
                (Math.random() - 0.5) * 0.5,
                (Math.random() - 0.5) * 0.5,
                (Math.random() - 0.5) * 0.5
            );
            group.add(piece);
        }

        group.userData.isMemory = true;
        group.userData.memoryType = 'shatteredMic';
        group.userData.isHealed = false;

        return group;
    },

    // Create microphone (good memory - whole)
    createMicrophone() {
        const group = new THREE.Group();

        // Mic head
        const head = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 16, 16),
            new THREE.MeshPhongMaterial({
                color: 0xC0C0C0,
                emissive: 0xFFD700,
                emissiveIntensity: 0.2,
                metalness: 0.8
            })
        );
        head.position.y = 0.5;
        group.add(head);

        // Handle
        const handle = new THREE.Mesh(
            new THREE.CylinderGeometry(0.05, 0.05, 0.5),
            new THREE.MeshPhongMaterial({ color: 0x222222 })
        );
        handle.position.y = 0.2;
        group.add(handle);

        return group;
    },

    // Create crowd silhouette (bad memory - booing)
    createBooingCrowd() {
        const group = new THREE.Group();

        // Multiple dark figures with X mouths
        for (let i = 0; i < 5; i++) {
            const figure = new THREE.Mesh(
                new THREE.CylinderGeometry(0.15, 0.15, 0.4, 8),
                new THREE.MeshPhongMaterial({ color: 0x222222 })
            );
            figure.position.set((i - 2) * 0.4, 0.3, 0);
            group.add(figure);

            // Dark head
            const head = new THREE.Mesh(
                new THREE.SphereGeometry(0.12, 8, 8),
                new THREE.MeshPhongMaterial({ color: 0x111111 })
            );
            head.position.set((i - 2) * 0.4, 0.8, 0);
            group.add(head);
        }

        group.userData.isMemory = true;
        group.userData.memoryType = 'booingCrowd';
        group.userData.isHealed = false;

        return group;
    },

    // Create cheering crowd (good memory)
    createCheeringCrowd() {
        const group = new THREE.Group();

        // Multiple bright figures with happy poses
        for (let i = 0; i < 5; i++) {
            const figure = new THREE.Mesh(
                new THREE.CylinderGeometry(0.15, 0.15, 0.4, 8),
                new THREE.MeshPhongMaterial({
                    color: 0x4488ff,
                    emissive: 0x2266dd,
                    emissiveIntensity: 0.3
                })
            );
            figure.position.set((i - 2) * 0.4, 0.3, 0);
            group.add(figure);

            // Bright head
            const head = new THREE.Mesh(
                new THREE.SphereGeometry(0.12, 8, 8),
                new THREE.MeshPhongMaterial({ color: 0xffdbac })
            );
            head.position.set((i - 2) * 0.4, 0.8, 0);
            group.add(head);

            // Arms up
            const arm = new THREE.Mesh(
                new THREE.BoxGeometry(0.3, 0.05, 0.05),
                new THREE.MeshPhongMaterial({ color: 0x4488ff })
            );
            arm.position.set((i - 2) * 0.4, 0.7, 0);
            arm.rotation.z = Math.PI / 4;
            group.add(arm);
        }

        return group;
    },

    // Create neural network structure
    createNeuralNetwork() {
        const group = new THREE.Group();

        // Create neurons
        for (let i = 0; i < 20; i++) {
            const neuron = new THREE.Mesh(
                new THREE.SphereGeometry(0.1, 8, 8),
                new THREE.MeshPhongMaterial({
                    color: 0x6366f1,
                    emissive: 0x4f46e5,
                    emissiveIntensity: 0.5,
                    transparent: true,
                    opacity: 0.7
                })
            );

            neuron.position.set(
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10
            );

            group.add(neuron);
        }

        return group;
    }
};
