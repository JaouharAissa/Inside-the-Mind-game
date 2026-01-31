# 🔧 Guide de Dépannage - Mind Healer

## Problème : Le jeu reste bloqué sur "Cliquez pour commencer..."

### Solution 1 : Tester d'abord si Three.js charge correctement

1. **Ouvrez le fichier** `test.html` dans votre navigateur
2. Vous devriez voir :
   - ✅ Three.js chargé avec succès
   - ✅ Canvas HTML5 disponible  
   - ✅ WebGL supporté
3. Cliquez sur "Lancer le test 3D"
4. Si vous voyez un **cube violet qui tourne** et une **sphère qui flotte**, Three.js fonctionne ! ✅

**Si le test échoue** :
- ❌ Pas de connexion Internet → Three. js ne peut pas charger depuis le CDN
- ❌ Navigateur trop ancien → Utilisez Chrome, Firefox ou Edge récent
- ❌ WebGL désactivé → Activez WebGL dans les paramètres du navigateur

### Solution 2 : Vérifier les erreurs JavaScript

1. Ouvrez `index.html` dans votre navigateur
2. **Appuyez sur F12** pour ouvrir les outils de développement
3. Allez dans l'onglet **"Console"**
4. Cliquez sur le bouton "Commencer"
5. **Regardez s'il y a des messages d'erreur en rouge**

**Erreurs courantes** :

#### Erreur : "THREE is not defined"
→ **Cause** : Three.js n'a pas chargé depuis le CDN
→ **Solution** : Vérifiez votre connexion Internet

#### Erreur : "Cannot read property 'createCharacter' of undefined"
→ **Cause** : Le fichier `utils/models.js` n'est pas chargé
→ **Solution** : Vérifiez que tous les fichiers sont bien dans les bons dossiers

#### Erreur : "gameState is not defined"
→ **Cause** : Le fichier `utils/gameState.js` n'est pas chargé  
→ **Solution** : Vérifiez l'ordre de chargement des scripts dans `index.html`

### Solution 3 : Vérifier la structure des fichiers

Assurez-vous que vous avez cette structure exacte :

```
game/
├── index.html
├── style.css
├── game.js
├── test.html          ← Fichier de test
├── README.md
├── utils/
│   ├── gameState.js
│   ├── animations.js
│   ├── audio.js
│   └── models.js
└── scenes/
    ├── waitingRoom.js
    ├── doctorOffice.js
    ├── brainWorld.js
    └── endingScene.js
```

### Solution 4 : Attendre le chargement complet

Le jeu peut mettre **2-3 secondes** à charger si :
- Votre connexion Internet est lente (Three.js fait 600 KB)
- Votre ordinateur est lent

**Attendez** que l'écran de chargement (spinner) disparaisse complètement avant de cliquer sur "Commencer".

### Solution 5 : Rafraîchir la page

Parfois un simple **CTRL + F5** (rafraîchissement forcé) résout le problème !

---

## Comment me dire quel est le problème exact

Si aucune solution ne fonctionne, faites ceci :

1. Ouvrez `index.html`
2. Appuyez sur **F12**  
3. Allez dans **Console**
4. Prenez une capture d'écran des messages d'erreur (s'il y en a)
5. Dites-moi :
   - ✅ ou ❌ Est-ce que `test.html` fonctionne ?
   - Quel navigateur vous utilisez ?
   - Quels messages d'erreur vous voyez dans la console ?

Je pourrai alors corriger le problème spécifique ! 🔧
