// Rhythm Puzzle - Repeat musical sequence  
class RhythmPuzzle {
    constructor(container, memoryData) {
        this.container = container;
        this.sequence = [];
        this.playerSequence = [];
        this.level = 1;
        this.maxLevel = 5;
        this.isPlaying = false;
        this.onComplete = null;

        this.notes = [
            { id: 'C', color: '#ef4444', freq: 261.63, name: 'Do' },
            { id: 'E', color: '#f59e0b', freq: 329.63, name: 'Mi' },
            { id: 'G', color: '#10b981', freq: 392.00, name: 'Sol' },
            { id: 'C2', color: '#3b82f6', freq: 523.25, name: 'Do aigu' }
        ];

        this.init();
    }

    init() {
        this.container.innerHTML = `
            <div class="rhythm-puzzle">
                <div class="rhythm-progress">
                    <p>Niveau <span id="rhythm-level">1</span> / ${this.maxLevel}</p>
                    <p class="rhythm-hint">Mémorisez et répétez la séquence musicale</p>
                </div>
                
                <div class="rhythm-display" id="rhythm-display">
                    <div class="sequence-indicator">♪ ♫ ♪</div>
                </div>
                
                <div class="rhythm-notes" id="rhythm-notes"></div>
                
                <div class="rhythm-controls">
                    <button id="replay-sequence" class="btn-secondary">
                        🔊 Rejouer la séquence
                    </button>
                </div>
            </div>
        `;

        this.createNoteButtons();
        this.setupControls();
        this.startLevel();
    }

    createNoteButtons() {
        const notesContainer = document.getElementById('rhythm-notes');

        this.notes.forEach(note => {
            const btn = document.createElement('button');
            btn.className = 'note-button';
            btn.id = `note-${note.id}`;
            btn.style.background = note.color;
            btn.innerHTML = `<span class="note-name">${note.name}</span>`;
            btn.dataset.noteId = note.id;

            btn.addEventListener('click', () => this.handleNoteClick(note));

            notesContainer.appendChild(btn);
        });
    }

    setupControls() {
        document.getElementById('replay-sequence').addEventListener('click', () => {
            if (!this.isPlaying) {
                this.playSequence();
            }
        });
    }

    startLevel() {
        this.playerSequence = [];
        this.generateSequence();

        setTimeout(() => {
            this.playSequence();
        }, 1000);
    }

    generateSequence() {
        // Add one more note to sequence each level
        const noteCount = 3 + this.level;
        this.sequence = [];

        for (let i = 0; i < noteCount; i++) {
            const randomNote = this.notes[Math.floor(Math.random() * this.notes.length)];
            this.sequence.push(randomNote.id);
        }
    }

    async playSequence() {
        this.isPlaying = true;
        this.disableNotes();

        const display = document.getElementById('rhythm-display');
        display.innerHTML = '<p class="watching-text">👀 Regardez et écoutez...</p>';

        for (let i = 0; i < this.sequence.length; i++) {
            const noteId = this.sequence[i];
            const note = this.notes.find(n => n.id === noteId);

            // Highlight button
            const btn = document.getElementById(`note-${noteId}`);
            btn.classList.add('playing');

            // Play sound
            this.playNote(note.freq);

            await this.wait(600);
            btn.classList.remove('playing');
            await this.wait(200);
        }

        display.innerHTML = '<p class="playing-text">🎵 À votre tour !</p>';
        this.isPlaying = false;
        this.enableNotes();
    }

    handleNoteClick(note) {
        if (this.isPlaying) return;

        // Play sound
        this.playNote(note.freq);

        // Animate button
        const btn = document.getElementById(`note-${note.id}`);
        btn.classList.add('clicked');
        setTimeout(() => btn.classList.remove('clicked'), 200);

        // Add to player sequence
        this.playerSequence.push(note.id);

        // Check if correct
        const currentIndex = this.playerSequence.length - 1;

        if (this.playerSequence[currentIndex] !== this.sequence[currentIndex]) {
            // Wrong note!
            this.failLevel();
        } else if (this.playerSequence.length === this.sequence.length) {
            // Completed sequence correctly!
            this.completeLevel();
        }
    }

    playNote(frequency) {
        const audioCtx = audioManager.context;
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.5);
    }

    completeLevel() {
        audioManager.playHeal();

        if (this.level >= this.maxLevel) {
            // Puzzle complete!
            const display = document.getElementById('rhythm-display');
            display.innerHTML = '<p class="success-text">🎉 Parfait ! Microphone réparé !</p>';

            setTimeout(() => {
                if (this.onComplete) {
                    this.onComplete();
                }
            }, 1500);
        } else {
            // Next level
            this.level++;
            document.getElementById('rhythm-level').textContent = this.level;

            const display = document.getElementById('rhythm-display');
            display.innerHTML = `<p class="success-text">✅ Bien ! Niveau ${this.level}...</p>`;

            setTimeout(() => {
                this.startLevel();
            }, 1500);
        }
    }

    failLevel() {
        audioManager.playSad();
        this.playerSequence = [];

        const display = document.getElementById('rhythm-display');
        display.innerHTML = '<p class="fail-text">❌ Incorrect ! Réessayez...</p>';

        this.disableNotes();
        setTimeout(() => {
            this.playSequence();
        }, 1500);
    }

    disableNotes() {
        document.querySelectorAll('.note-button').forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = '0.5';
        });
    }

    enableNotes() {
        document.querySelectorAll('.note-button').forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = '1';
        });
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    cleanup() {
        // Clean up
    }
}
