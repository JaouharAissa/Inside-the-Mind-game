# 🧠 Mind Healer - 3D Psychologist Game

Un jeu narratif 3D où vous incarnez un psychologue spécial capable d'entrer dans l'esprit des patients pour guérir leurs souvenirs traumatiques.

## 🎮 Comment Jouer

1. **Ouvrez le fichier `index.html`** dans votre navigateur web (Chrome, Firefox, Edge recommandés)
2. Cliquez sur **"Commencer"** sur l'écran titre
3. Suivez l'histoire à travers 4 scènes principales

## 📖 Scénario

### Acte 1 - Salle d'Attente
- Sélectionnez le **patient chanteur** (celui avec une guitare)
- Les autres patients ne sont pas le bon choix

### Acte 2 - Cabinet du Docteur  
- Observez le patient déprimé avec son masque triste
- Lisez les dialogues en cliquant sur "Continuer"
- Cliquez sur le **portail violet** au-dessus de la tête du patient pour entrer dans son cerveau

### Acte 3 - Monde Intérieur du Cerveau
- **Déplacez-vous** avec les touches **WASD**
- **Regardez autour** en bougeant la souris
- Trouvez les **6 mauvais souvenirs** :
  - 🎸 Guitares cassées
  - 🎤 Microphones brisés
  - 👥 Foules qui huent
- **Cliquez** sur chaque mauvais souvenir pour le transformer en bon souvenir avec votre baguette magique ✨

### Acte 4 - Guérison
- Retournez au cabinet automatiquement une fois tous les souvenirs guéris
- Regardez le masque triste tomber
- Le patient retrouve sa joie de vivre ! 🎉

## 🎨 Fonctionnalités

- **Graphismes 3D** avec Three.js
- **Environnements immersifs** avec effets de lumière et particules
- **Système de dialogue** narratif
- **Exploration en première personne** dans le cerveau
- **Effets de transformation magiques** pour guérir les souvenirs
- **Animations fluides** et effets visuels
- **Interface utilisateur moderne** avec glassmorphisme
- **Sons procéduraux** pour l'ambiance

## 🛠️ Technologies Utilisées

- **Three.js** - Moteur 3D WebGL
- **HTML5 / CSS3** - Structure et style
- **Vanilla JavaScript** - Logique de jeu
- **Web Audio API** - Effets sonores

## 📁 Structure du Projet

```
game/
├── index.html          # Page principale
├── style.css           # Styles et interface
├── game.js             # Moteur de jeu principal
├── utils/
│   ├── gameState.js    # Gestion d'état
│   ├── animations.js   # Contrôleur d'animations
│   ├── audio.js        # Gestionnaire audio
│   └── models.js       # Création de modèles 3D
└── scenes/
    ├── waitingRoom.js  # Scène salle d'attente
    ├── doctorOffice.js # Scène cabinet médical
    ├── brainWorld.js   # Scène monde du cerveau
    └── endingScene.js  # Scène finale
```

## 🎯 Objectif du Jeu

Guérir les 6 souvenirs traumatiques du patient chanteur pour lui rendre sa passion pour la musique et sa joie de vivre.

## 🔧 Dépannage

**Le jeu ne se charge pas ?**
- Vérifiez que vous avez une connexion Internet (pour charger Three.js depuis le CDN)
- Utilisez un navigateur moderne (Chrome 90+, Firefox 88+, Edge 90+)
- Ouvrez la console (F12) pour voir les erreurs éventuelles

**Les contrôles ne fonctionnent pas ?**
- Assurez-vous d'être dans la scène du cerveau
- Cliquez sur le canvas de jeu pour donner le focus
- Utilisez WASD (pas les flèches directionnelles)

**Performance lente ?**
- Fermez les autres onglets
- Réduisez la taille de la fenêtre du navigateur
- Vérifiez que votre GPU est activé dans les paramètres du navigateur

## 🎨 Crédits

Développé avec ❤️ par Antigravity AI
Concept créatif et narratif original

---

**Amusez-vous bien et guérissez ces esprits ! 🧠✨**
