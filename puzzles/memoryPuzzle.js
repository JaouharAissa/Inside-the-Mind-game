// Memory Card Puzzle - Match pairs of happy faces
class MemoryCardPuzzle {
    constructor(container, memoryData) {
        this.container = container;
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.totalPairs = 6;
        this.canFlip = true;
        this.onComplete = null;

        this.init();
    }

    init() {
        this.container.innerHTML = `
            <div class="memory-puzzle">
                <div class="memory-progress">
                    <p><span id="memory-pairs">0</span> / ${this.totalPairs} paires trouvées</p>
                    <p class="memory-hint">Trouvez toutes les paires de visages heureux</p>
                </div>
                
                <div class="memory-grid" id="memory-grid"></div>
            </div>
        `;

        this.createCards();
    }

    createCards() {
        // Define card pairs (emojis representing happy memories)
        const cardSymbols = ['😊', '🎵', '🎸', '🌟', '❤️', '🎉'];

        // Create pairs
        const cardData = [];
        cardSymbols.forEach((symbol, index) => {
            cardData.push({ id: index, symbol: symbol });
            cardData.push({ id: index, symbol: symbol });
        });

        // Shuffle
        cardData.sort(() => Math.random() - 0.5);

        // Create card elements
        const grid = document.getElementById('memory-grid');

        cardData.forEach((data, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.id = data.id;
            card.dataset.index = index;

            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">?</div>
                    <div class="card-back">${data.symbol}</div>
                </div>
            `;

            card.addEventListener('click', () => this.flipCard(card, data));

            grid.appendChild(card);
            this.cards.push({ element: card, data: data });
        });
    }

    flipCard(cardElement, cardData) {
        if (!this.canFlip) return;
        if (cardElement.classList.contains('flipped')) return;
        if (cardElement.classList.contains('matched')) return;
        if (this.flippedCards.length >= 2) return;

        // Flip the card
        cardElement.classList.add('flipped');
        audioManager.playClick();
        this.flippedCards.push({ element: cardElement, data: cardData });

        if (this.flippedCards.length === 2) {
            this.checkMatch();
        }
    }

    checkMatch() {
        this.canFlip = false;

        const [card1, card2] = this.flippedCards;

        setTimeout(() => {
            if (card1.data.id === card2.data.id) {
                // Match!
                card1.element.classList.add('matched');
                card2.element.classList.add('matched');
                audioManager.playHeal();

                this.matchedPairs++;
                this.updateProgress();

                if (this.matchedPairs === this.totalPairs) {
                    setTimeout(() => this.complete(), 800);
                }
            } else {
                // No match
                card1.element.classList.remove('flipped');
                card2.element.classList.remove('flipped');
                audioManager.playSad();
            }

            this.flippedCards = [];
            this.canFlip = true;
        }, 1000);
    }

    updateProgress() {
        document.getElementById('memory-pairs').textContent = this.matchedPairs;
    }

    complete() {
        // Animate all cards
        this.cards.forEach((card, index) => {
            setTimeout(() => {
                card.element.classList.add('celebrate');
            }, index * 50);
        });

        setTimeout(() => {
            if (this.onComplete) {
                this.onComplete();
            }
        }, 1000);
    }

    cleanup() {
        // Clean up
    }
}
