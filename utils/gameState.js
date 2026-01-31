// Game State Management
class GameState {
    constructor() {
        this.currentScene = 'title'; // title, waitingRoom, office, brain, ending
        this.memoriesHealed = 0;
        this.totalMemories = 6;
        this.selectedPatient = null;
        this.listeners = {};
        this.gameStarted = false;
        this.brainExplored = false;
    }

    setState(key, value) {
        this[key] = value;
        this.emit(key, value);
    }

    getState(key) {
        return this[key];
    }

    incrementMemories() {
        this.memoriesHealed++;
        this.emit('memoriesHealed', this.memoriesHealed);
        
        if (this.memoriesHealed >= this.totalMemories) {
            this.emit('allMemoriesHealed', true);
        }
    }

    reset() {
        this.currentScene = 'title';
        this.memoriesHealed = 0;
        this.selectedPatient = null;
        this.gameStarted = false;
        this.brainExplored = false;
    }

    // Event system
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    }
}

const gameState = new GameState();
