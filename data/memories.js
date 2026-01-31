// Memory definitions for the singer patient
const SINGER_MEMORIES = {
    memories: [
        {
            id: 'guitar_1',
            type: 'brokenGuitar',
            puzzleType: 'reconstruction',
            position: { x: -5, y: 0.5, z: -3 },
            floatOffset: 0,
            name: 'Guitare Brisée',
            story: 'La guitare précieuse du chanteur, cassée par son collègue jaloux...'
        },
        {
            id: 'mic_1',
            type: 'shatteredMic',
            puzzleType: 'rhythm',
            position: { x: 3, y: 0.5, z: -5 },
            floatOffset: Math.PI / 3,
            name: 'Microphone Brisé',
            story: 'Le microphone utilisé lors de la trahison publique...'
        },
        {
            id: 'crowd_1',
            type: 'booingCrowd',
            puzzleType: 'memory',
            position: { x: 0, y: 0.5, z: -8 },
            floatOffset: Math.PI * 2 / 3,
            name: 'Foule qui Hue',
            story: 'La foule qui l\'a sifflé et moqué ce jour terrible...'
        },
        {
            id: 'guitar_2',
            type: 'brokenGuitar',
            puzzleType: 'reconstruction',
            position: { x: 5, y: 0.5, z: 2 },
            rotation: Math.PI / 4,
            floatOffset: Math.PI,
            name: 'Guitare Cassée',
            story: 'Une autre guitare, symbole de tous ses rêves brisés...'
        },
        {
            id: 'mic_2',
            type: 'shatteredMic',
            puzzleType: 'rhythm',
            position: { x: -4, y: 0.5, z: 3 },
            floatOffset: Math.PI * 4 / 3,
            name: 'Micro Détruit',
            story: 'Le micro qui n\'a plus chanté depuis ce jour...'
        },
        {
            id: 'crowd_2',
            type: 'booingCrowd',
            puzzleType: 'memory',
            position: { x: 7, y: 0.5, z: -2 },
            rotation: -Math.PI / 3,
            floatOffset: Math.PI * 5 / 3,
            name: 'Public Hostile',
            story: 'Le public qui ne l\'a jamais soutenu...'
        }
    ],
    brainColor: 0x6366f1, // Violet purple for singer
    totalCount: 6
};
