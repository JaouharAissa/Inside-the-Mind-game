// Reconstruction Puzzle - Reassemble broken guitar pieces
class ReconstructionPuzzle {
    constructor(container, memoryData) {
        this.container = container;
        this.pieces = [];
        this.placedPieces = 0;
        this.totalPieces = 6;
        this.onComplete = null;
        this.draggedPiece = null;

        this.init();
    }

    init() {
        this.container.innerHTML = `
            <div class="reconstruction-puzzle">
                <div class="puzzle-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" id="recon-progress" style="width: 0%"></div>
                    </div>
                    <span class="progress-text"><span id="recon-placed">0</span>/${this.totalPieces} pièces placées</span>
                </div>
                
                <div class="puzzle-main">
                    <div class="reconstruction-area">
                        <svg id="guitar-outline" viewBox="0 0 300 500" class="guitar-outline">
                            <!-- Guitar body (ellipse) -->
                            <ellipse cx="150" cy="200" rx="80" ry="100" fill="none" stroke="#6366f1" stroke-width="3" opacity="0.5"/>
                            <!-- Guitar neck -->
                            <rect x="135" y="80" width="30" height="150" rx="5" fill="none" stroke="#6366f1" stroke-width="3" opacity="0.5"/>
                            <!-- Guitar headstock -->
                            <rect x="125" y="30" width="50" height="60" rx="5" fill="none" stroke="#6366f1" stroke-width="3" opacity="0.5"/>
                        </svg>
                        
                        <div id="drop-zones" class="drop-zones"></div>
                    </div>
                
                    <div class="pieces-tray" id="pieces-tray">
                        <p class="hint">👆 Glissez les pièces vers les zones correspondantes</p>
                    </div>
                </div>
            </div>
        `;

        this.createPieces();
        this.setupDragAndDrop();
    }

    createPieces() {
        const pieceDefinitions = [
            { id: 'body-left', zone: 0, color: '#D2691E', label: '🎸', x: 70, y: 150, width: 70, height: 90 },
            { id: 'body-right', zone: 1, color: '#CD853F', label: '🎸', x: 180, y: 150, width: 70, height: 90 },
            { id: 'neck', zone: 2, color: '#8B4513', label: '🎵', x: 135, y: 80, width: 30, height: 150 },
            { id: 'headstock', zone: 3, color: '#654321', label: '🎼', x: 125, y: 30, width: 50, height: 60 },
            { id: 'hole', zone: 4, color: '#1a1a1a', label: '⚫', x: 130, y: 180, width: 40, height: 40 },
            { id: 'strings', zone: 5, color: '#FFD700', label: '🎶', x: 140, y: 90, width: 20, height: 200 }
        ];

        const tray = document.getElementById('pieces-tray');
        const dropZones = document.getElementById('drop-zones');

        // Shuffle pieces for randomness
        const shuffled = [...pieceDefinitions].sort(() => Math.random() - 0.5);

        shuffled.forEach((def, index) => {
            // Create draggable piece
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.id = `piece-${def.id}`;
            piece.draggable = true;
            piece.dataset.zoneId = def.zone;
            piece.style.background = def.color;
            piece.style.width = '80px';
            piece.style.height = '80px';
            piece.textContent = def.label;

            // Special styling for circular hole
            if (def.id === 'hole') {
                piece.style.borderRadius = '50%';
            }

            // Randomize initial rotation in tray
            const randomRotation = Math.random() * 40 - 20;
            piece.style.transform = `rotate(${randomRotation}deg)`;
            piece.dataset.originalRotation = randomRotation;

            tray.appendChild(piece);
        });

        // Create drop zones
        pieceDefinitions.forEach((def) => {
            const zone = document.createElement('div');
            zone.className = 'drop-zone';
            zone.id = `zone-${def.zone}`;
            zone.dataset.zoneId = def.zone;
            zone.style.left = def.x + 'px';
            zone.style.top = def.y + 'px';
            zone.style.width = def.width + 'px';
            zone.style.height = def.height + 'px';

            // Match border radius for hole
            if (def.id === 'hole') {
                zone.style.borderRadius = '50%';
            }

            dropZones.appendChild(zone);
        });
    }

    setupDragAndDrop() {
        const pieces = this.container.querySelectorAll('.puzzle-piece');
        const zones = this.container.querySelectorAll('.drop-zone');

        pieces.forEach(piece => {
            // Drag start
            piece.addEventListener('dragstart', (e) => {
                this.draggedPiece = piece;
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', piece.id);
                piece.classList.add('dragging');

                if (window.audioManager) {
                    audioManager.playClick();
                }
            });

            // Drag end
            piece.addEventListener('dragend', (e) => {
                piece.classList.remove('dragging');
                this.draggedPiece = null;
            });

            // Touch support for mobile
            piece.addEventListener('touchstart', (e) => {
                this.draggedPiece = piece;
                piece.classList.add('dragging');
            });

            piece.addEventListener('touchend', (e) => {
                piece.classList.remove('dragging');
                this.draggedPiece = null;
            });
        });

        zones.forEach(zone => {
            // Dragover - allow drop
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                zone.classList.add('drag-over');
            });

            // Dragleave - remove highlight
            zone.addEventListener('dragleave', (e) => {
                zone.classList.remove('drag-over');
            });

            // Drop event
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');

                const pieceId = e.dataTransfer.getData('text/plain');
                const piece = document.getElementById(pieceId);

                if (!piece) return;

                const correctZone = piece.dataset.zoneId === zone.dataset.zoneId;
                const zoneOccupied = zone.querySelector('.puzzle-piece');

                if (correctZone && !zoneOccupied) {
                    // Correct placement!
                    this.placePiece(piece, zone);
                } else if (zoneOccupied) {
                    // Zone already has a piece
                    this.showFeedback(piece, 'occupied');
                } else {
                    // Wrong zone
                    this.showFeedback(piece, 'wrong');
                }
            });
        });
    }

    placePiece(piece, zone) {
        // Move piece to zone
        zone.appendChild(piece);
        piece.draggable = false;
        piece.classList.add('placed');
        piece.style.transform = 'rotate(0deg)';
        piece.style.width = '100%';
        piece.style.height = '100%';

        this.placedPieces++;
        this.updateProgress();

        // Play success sound
        if (window.audioManager) {
            audioManager.playHeal();
        }

        // Check if puzzle is complete
        if (this.placedPieces === this.totalPieces) {
            setTimeout(() => this.complete(), 800);
        }
    }

    showFeedback(piece, type) {
        if (type === 'wrong') {
            // Wrong placement - shake animation
            piece.classList.add('shake');
            setTimeout(() => piece.classList.remove('shake'), 500);

            if (window.audioManager) {
                audioManager.playSad();
            }
        } else if (type === 'occupied') {
            // Zone occupied - subtle shake
            piece.classList.add('shake');
            setTimeout(() => piece.classList.remove('shake'), 500);

            if (window.audioManager) {
                audioManager.playClick();
            }
        }
    }

    updateProgress() {
        const percentage = (this.placedPieces / this.totalPieces) * 100;
        const progressBar = document.getElementById('recon-progress');
        const placedText = document.getElementById('recon-placed');

        if (progressBar) {
            progressBar.style.width = percentage + '%';
        }

        if (placedText) {
            placedText.textContent = this.placedPieces;
        }
    }

    complete() {
        if (this.onComplete) {
            this.onComplete();
        }
    }

    cleanup() {
        // Clean up event listeners if needed
        this.draggedPiece = null;
    }
}
