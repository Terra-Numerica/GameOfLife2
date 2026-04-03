# 🎮 Jeu de la Vie - Terra Numerica

Le célèbre **Jeu de la Vie de Conway** en 3D avec Three.js, TypeScript et le framework Terra Numerica.

## 🚀 Démarrage rapide

### 1️⃣ Extraction
```bash
unzip game-of-life-terra-numerica.zip
cd game-of-life-tn
```

### 2️⃣ Installation
```bash
npm install
```

### 3️⃣ Lancement
```bash
npm run dev
```

Le jeu s'ouvrira automatiquement dans votre navigateur à : **http://localhost:5173**

---

## 🎯 Qu'est-ce que le Jeu de la Vie ?

Le **Jeu de la Vie** est un automate cellulaire créé par le mathématicien **John Conway** en 1970.

Ce n'est pas un "jeu" au sens traditionnel :
- Vous créez une configuration initiale
- Vous observez son évolution selon des règles simples
- Des comportements complexes émergent !

---

## 📜 Les Règles

Chaque cellule peut être **vivante** (verte) ou **morte** (invisible).

À chaque génération :

| État | Voisins vivants | Résultat |
|------|-----------------|----------|
| Morte | 3 | ✅ Naissance |
| Vivante | 2-3 | ✅ Survie |
| Vivante | <2 ou >3 | ❌ Mort |

---

## 🎮 Comment jouer

### Contrôles
- **▶️ Démarrer/Pause** : Lance ou arrête la simulation
- **⏭️ Étape** : Avance d'une génération
- **🎲 Aléatoire** : Génère une configuration aléatoire
- **🔄 Effacer** : Remet à zéro
- **✏️ Dessiner** : Mode dessin pour créer vos propres formes

### Vitesse
Ajustez la vitesse de 1 à 30 générations par seconde avec le slider.

### Patterns Classiques
Chargez des configurations célèbres :
- **Planeur** : Se déplace en diagonale
- **Clignotant** : Oscille entre 2 états
- **Crapaud** : Oscillateur période 2
- **Balise** : Oscillateur période 2
- **Pulsar** : Oscillateur période 3
- **Canon à planeurs** : Génère des planeurs infiniment !
- **Gland** : Évolue pendant 5206 générations

---

## 🌟 Patterns intéressants

### Vaisseaux (se déplacent)
- **Planeur** : Le plus petit vaisseau (5 cellules)
- Génère des planeurs avec le **Canon à planeurs**

### Oscillateurs (se répètent)
- **Clignotant** : Période 2
- **Pulsar** : Période 3
- **Pentadecathlon** : Période 15

### Méthusélahs (évoluent longtemps)
- **Gland** : 5206 générations
- **R-pentomino** : 1103 générations

---

## 🧠 Concepts mathématiques

### Automates cellulaires
- Système discret où chaque cellule évolue selon des règles locales
- Le Jeu de la Vie est l'exemple le plus célèbre

### Émergence
- Des règles simples produisent des comportements complexes
- Illustre la complexité auto-organisée

### Turing-complet
- Le Jeu de la Vie peut simuler n'importe quel calcul
- On peut construire des ordinateurs dans le Jeu de la Vie !

### Applications
- **Biologie** : Modélisation de populations
- **Physique** : Systèmes dynamiques
- **Informatique** : Algorithmes génératifs
- **Art** : Art génératif et visualisations

---

## 🛠️ Technologies utilisées

- **Three.js** - Rendu 3D
- **TypeScript** - Typage fort
- **Framework Terra Numerica** - Interface et navigation
- **Vite** - Build tool
- **InstancedMesh** - Optimisation (affichage de 4800 cellules)

---

## 📁 Structure du projet

```
game-of-life-tn/
├── framework/                       # Framework Terra Numerica
├── src/
│   ├── ts/
│   │   ├── main.ts                 # Point d'entrée + UI
│   │   ├── GameOfLife.ts           # Logique du jeu
│   │   └── GameOfLifeVisualizer.ts # Rendu Three.js
│   └── css/
│       └── game.css                # Styles
├── index.html                       # Page principale
├── package.json                     # Dépendances
├── tsconfig.json                    # Config TypeScript
└── vite.config.ts                   # Config Vite
```

---

## 🎯 Fonctionnalités

✅ Grille 80×60 (4800 cellules)  
✅ Topologie torique (bords connectés)  
✅ 7 patterns classiques prédéfinis  
✅ Mode dessin interactif  
✅ Vitesse réglable (1-30 gen/s)  
✅ Rendu 3D optimisé (InstancedMesh)  
✅ TypeScript pour la robustesse  
✅ Framework Terra Numerica intégré  
✅ Interface intuitive  
✅ Statistiques en temps réel  

---

## 🔧 Commandes de développement

```bash
# Développement avec hot-reload
npm run dev

# Build de production
npm run build

# Preview du build
npm run preview
```

---

## 📚 Pour aller plus loin

### Ressources
- [LifeWiki](https://conwaylife.com/wiki) - Encyclopédie du Jeu de la Vie
- [Golly](http://golly.sourceforge.net/) - Simulateur avancé
- Livre "Winning Ways" de Conway

### Variantes
- **HighLife** : Règle B36/S23 (ajoute la naissance à 6 voisins)
- **Day & Night** : Règle B3678/S34678 (symétrique)
- **Seeds** : Règle B2/S (cellules meurent immédiatement)

### Améliorations possibles
- Support des règles personnalisées (B/S notation)
- Import/export RLE (format standard)
- Enregistrement de patterns personnalisés
- Mode webcam (comme la version originale)
- Historique et retour arrière

---

## 📝 Crédits

- **Concept original** : John Horton Conway (1937-2020)
- **Cette version** : Adaptation Three.js + TypeScript pour Terra Numerica
- **Inspiré de** : GameOfLife.zip (version originale)

---

**Explorez l'émergence de la complexité ! 🌱➡️🌳**
