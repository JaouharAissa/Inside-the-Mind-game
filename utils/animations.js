// Animation Utilities
class AnimationController {
    constructor() {
        this.animations = [];
    }

    // Simple easing functions
    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    easeOutCubic(t) {
        return (--t) * t * t + 1;
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    // Animate a property over time
    animate(obj, prop, start, end, duration, easing = 'easeInOutQuad', onComplete = null) {
        const animation = {
            obj,
            prop,
            start,
            end,
            duration,
            elapsed: 0,
            easing: this[easing] || this.easeInOutQuad,
            onComplete
        };
        this.animations.push(animation);
        return animation;
    }

    // Animate camera position
    animateCamera(camera, targetPosition, duration = 2000, onComplete = null) {
        const startPos = camera.position.clone();
        this.animate(
            camera.position,
            'x',
            startPos.x,
            targetPosition.x,
            duration,
            'easeInOutCubic'
        );
        this.animate(
            camera.position,
            'y',
            startPos.y,
            targetPosition.y,
            duration,
            'easeInOutCubic'
        );
        this.animate(
            camera.position,
            'z',
            startPos.z,
            targetPosition.z,
            duration,
            'easeInOutCubic',
            onComplete
        );
    }

    // Animate camera look-at
    animateCameraTarget(camera, controls, targetPos, duration = 2000) {
        if (controls && controls.target) {
            const startTarget = controls.target.clone();
            this.animate(controls.target, 'x', startTarget.x, targetPos.x, duration, 'easeInOutCubic');
            this.animate(controls.target, 'y', startTarget.y, targetPos.y, duration, 'easeInOutCubic');
            this.animate(controls.target, 'z', startTarget.z, targetPos.z, duration, 'easeInOutCubic');
        }
    }

    // Update all animations (call in game loop)
    update(deltaTime) {
        for (let i = this.animations.length - 1; i >= 0; i--) {
            const anim = this.animations[i];
            anim.elapsed += deltaTime;

            const progress = Math.min(anim.elapsed / anim.duration, 1);
            const easedProgress = anim.easing(progress);

            anim.obj[anim.prop] = anim.start + (anim.end - anim.start) * easedProgress;

            if (progress >= 1) {
                if (anim.onComplete) anim.onComplete();
                this.animations.splice(i, 1);
            }
        }
    }

    // Clear all animations
    clear() {
        this.animations = [];
    }
}

// Particle system for magical effects
class ParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
    }

    createMagicSparkles(position, count = 20, color = 0xffd700) {
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const velocities = [];

        for (let i = 0; i < count; i++) {
            // Random position around center
            positions.push(
                position.x + (Math.random() - 0.5) * 2,
                position.y + (Math.random() - 0.5) * 2,
                position.z + (Math.random() - 0.5) * 2
            );

            // Random velocity
            velocities.push(
                (Math.random() - 0.5) * 0.1,
                Math.random() * 0.15,
                (Math.random() - 0.5) * 0.1
            );
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            color: color,
            size: 0.15,
            transparent: true,
            opacity: 1,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);

        const particleData = {
            mesh: particles,
            velocities: velocities,
            life: 1.0,
            geometry: geometry
        };

        this.particles.push(particleData);
        return particleData;
    }

    createHealingEffect(position) {
        // Golden sparkles
        this.createMagicSparkles(position, 30, 0xffd700);
        // Purple sparkles
        setTimeout(() => {
            this.createMagicSparkles(position, 20, 0xa78bfa);
        }, 100);
    }

    update(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            const positions = particle.geometry.attributes.position.array;

            // Update particle positions
            for (let j = 0; j < positions.length; j += 3) {
                positions[j] += particle.velocities[j] * deltaTime * 60;
                positions[j + 1] += particle.velocities[j + 1] * deltaTime * 60;
                positions[j + 2] += particle.velocities[j + 2] * deltaTime * 60;

                // Apply gravity
                particle.velocities[j + 1] -= 0.005;
            }

            particle.geometry.attributes.position.needsUpdate = true;

            // Fade out
            particle.life -= deltaTime;
            particle.mesh.material.opacity = particle.life;

            // Remove dead particles
            if (particle.life <= 0) {
                this.scene.remove(particle.mesh);
                particle.geometry.dispose();
                particle.mesh.material.dispose();
                this.particles.splice(i, 1);
            }
        }
    }

    clear() {
        this.particles.forEach(particle => {
            this.scene.remove(particle.mesh);
            particle.geometry.dispose();
            particle.mesh.material.dispose();
        });
        this.particles = [];
    }
}

const animationController = new AnimationController();
