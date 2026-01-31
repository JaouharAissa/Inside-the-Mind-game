// Puzzle System Framework
class PuzzleSystem {
    constructor() {
        this.currentPuzzle = null;
        this.isActive = false;
        this.onComplete = null;
    }

    startPuzzle(puzzleType, memoryData, onComplete) {
        this.isActive = true;
        this.onComplete = onComplete;

        // Create puzzle overlay
        const overlay = document.getElementById('puzzle-overlay');
        overlay.classList.add('active');

        // Clear previous puzzle
        const container = document.getElementById('puzzle-container');
        container.innerHTML = '';

        // Create appropriate puzzle
        switch (puzzleType) {
            case 'reconstruction':
                this.currentPuzzle = new ReconstructionPuzzle(container, memoryData);
                break;
            case 'rhythm':
                this.currentPuzzle = new RhythmPuzzle(container, memoryData);
                break;
            case 'memory':
                this.currentPuzzle = new MemoryCardPuzzle(container, memoryData);
                break;
            default:
                console.error('Unknown puzzle type:', puzzleType);
                return;
        }

        // Listen for puzzle completion
        this.currentPuzzle.onComplete = () => {
            this.completePuzzle();
        };

        // Update UI
        document.getElementById('puzzle-title').textContent = memoryData.name || 'Réparer le souvenir';
        document.getElementById('puzzle-description').textContent = memoryData.description || '';
    }

    completePuzzle() {
        audioManager.playSuccess();

        // Show completion message
        const container = document.getElementById('puzzle-container');
        container.innerHTML = `
            <div class="puzzle-complete">
                <div class="success-icon">✨</div>
                <h2>Souvenir Guéri !</h2>
                <p>La mémoire a été transformée avec succès</p>
            </div>
        `;

        // Hide overlay after delay
        setTimeout(() => {
            document.getElementById('puzzle-overlay').classList.remove('active');
            this.isActive = false;

            if (this.onComplete) {
                this.onComplete();
            }
        }, 2500);
    }

    closePuzzle() {
        if (this.currentPuzzle) {
            this.currentPuzzle.cleanup();
        }
        document.getElementById('puzzle-overlay').classList.remove('active');
        this.isActive = false;
    }
}

// Global puzzle system instance
const puzzleSystem = new PuzzleSystem();
