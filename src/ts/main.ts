/**
 * Jeu de la Vie - Terra Numerica
 * Point d'entrée principal
 */

// Use a relative import so TypeScript and the IDE can resolve the file on disk.
import Framework from '../../framework/framework.js';
import { GameOfLifeVisualizer } from './GameOfLifeVisualizer';

// Initialiser le framework Terra Numerica
const framework = new Framework();

// Le framework expose la scène, la caméra et le renderer via `mainParameters`
// (voir la documentation du framework). Utiliser `framework.mainParameters`
// évite d'accéder à des propriétés non définies sur l'instance.
const scene = framework.mainParameters.scene;
const camera = framework.mainParameters.camera;
const renderer = framework.mainParameters.renderer;

// Initialiser le jeu
const game = new GameOfLifeVisualizer(scene, camera, renderer, 80, 60);

// Créer l'interface utilisateur
function createUI(): void {
    // HUD principal
    const hud = document.createElement('div');
    hud.id = 'game-hud';
    hud.innerHTML = `
        <h3>📊 Statistiques</h3>
        <div class="hud-row">
            <span class="hud-label">Génération:</span>
            <span id="generation" class="hud-value">0</span>
        </div>
        <div class="hud-row">
            <span class="hud-label">Population:</span>
            <span id="population" class="hud-value">0</span>
        </div>
        <div class="hud-row">
            <span class="hud-label">Statut:</span>
            <span id="status" class="hud-value">En pause</span>
        </div>
    `;
    document.body.appendChild(hud);

    // Contrôles
    const controls = document.createElement('div');
    controls.id = 'controls';
    controls.innerHTML = `
        <h3>🎮 Contrôles</h3>
        <button class="game-button" id="play-pause-btn">▶️ Démarrer</button>
        <button class="game-button" id="step-btn">⏭️ Étape</button>
        <button class="game-button" id="random-btn">🎲 Aléatoire</button>
        <button class="game-button" id="reset-btn">🔄 Effacer</button>
        <button class="game-button" id="draw-btn">✏️ Dessiner</button>
        
        <div class="speed-control">
            <label>Vitesse: <span class="speed-value" id="speed-value">5</span> gen/s</label>
            <input type="range" id="speed-slider" min="1" max="30" value="5">
        </div>
    `;
    document.body.appendChild(controls);

    // Patterns prédéfinis
    const patterns = document.createElement('div');
    patterns.id = 'patterns';
    patterns.innerHTML = `
        <h3>🎨 Patterns Classiques</h3>
        <div class="pattern-grid">
            <button class="pattern-button" data-pattern="glider">Planeur</button>
            <button class="pattern-button" data-pattern="blinker">Clignotant</button>
            <button class="pattern-button" data-pattern="toad">Crapaud</button>
            <button class="pattern-button" data-pattern="beacon">Balise</button>
            <button class="pattern-button" data-pattern="pulsar">Pulsar</button>
            <button class="pattern-button" data-pattern="gliderGun">Canon</button>
            <button class="pattern-button" data-pattern="acorn">Gland</button>
        </div>
    `;
    document.body.appendChild(patterns);

    // Instructions
    const instructions = document.createElement('div');
    instructions.id = 'instructions';
    instructions.innerHTML = `
        <h4>🎯 Règles de Conway</h4>
        <p><strong>Naissance:</strong> 3 voisins</p>
        <p><strong>Survie:</strong> 2-3 voisins</p>
        <p><strong>Mort:</strong> &lt;2 ou &gt;3 voisins</p>
    `;
    document.body.appendChild(instructions);

    // Événements
    const playPauseBtn = document.getElementById('play-pause-btn')!;
    playPauseBtn.addEventListener('click', () => {
        game.toggle();
        updateUI();
    });

    document.getElementById('step-btn')!.addEventListener('click', () => {
        game.step();
        updateUI();
    });

    document.getElementById('random-btn')!.addEventListener('click', () => {
        game.randomize();
        updateUI();
    });

    document.getElementById('reset-btn')!.addEventListener('click', () => {
        game.reset();
        updateUI();
    });

    const drawBtn = document.getElementById('draw-btn')!;
    drawBtn.addEventListener('click', () => {
        game.toggleDrawMode();
        if (game.isInDrawMode()) {
            drawBtn.textContent = '🛑 Arrêter';
            drawBtn.classList.add('draw-mode');
        } else {
            drawBtn.textContent = '✏️ Dessiner';
            drawBtn.classList.remove('draw-mode');
        }
    });

    const speedSlider = document.getElementById('speed-slider') as HTMLInputElement;
    speedSlider.addEventListener('input', (e) => {
        const speed = parseInt((e.target as HTMLInputElement).value);
        game.setSpeed(speed);
        document.getElementById('speed-value')!.textContent = speed.toString();
    });

    // Patterns
    document.querySelectorAll('.pattern-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const pattern = (e.target as HTMLElement).dataset.pattern!;
            game.loadPattern(pattern);
            updateUI();
        });
    });
}

function updateUI(): void {
    document.getElementById('generation')!.textContent = game.getGeneration().toString();
    document.getElementById('population')!.textContent = game.getPopulation().toString();
    
    const statusElement = document.getElementById('status')!;
    const playPauseBtn = document.getElementById('play-pause-btn')!;
    
    if (game.isGameRunning()) {
        statusElement.textContent = '▶️ En cours';
        statusElement.style.color = '#4ade80';
        playPauseBtn.textContent = '⏸️ Pause';
        playPauseBtn.classList.add('active');
    } else {
        statusElement.textContent = '⏸️ En pause';
        statusElement.style.color = '#fbbf24';
        playPauseBtn.textContent = '▶️ Démarrer';
        playPauseBtn.classList.remove('active');
    }
}

// Ajouter des boutons à la bannière Terra Numerica
framework.addButtonToNavbar({
    text: '📖 Règles',
    onClick: () => {
        const modal = framework.getPermanentModal();
        modal.setTitle('📖 Le Jeu de la Vie de Conway');
        modal.setContent(`
            <div style="font-size: 16px; line-height: 1.8;">
                <h3 style="color: #4ade80;">🎯 Objectif</h3>
                <p>Le <strong>Jeu de la Vie</strong> est un automate cellulaire créé par le mathématicien John Conway en 1970.</p>
                <p>Ce n'est pas vraiment un "jeu" au sens traditionnel : vous créez une configuration initiale et observez son évolution !</p>
                
                <h3 style="color: #4ade80; margin-top: 20px;">📜 Les Règles</h3>
                <p>Chaque cellule peut être <strong>vivante</strong> (verte) ou <strong>morte</strong> (invisible).</p>
                <p>À chaque génération, l'état des cellules change selon leurs voisins :</p>
                <ul>
                    <li><strong>Naissance:</strong> Une cellule morte avec exactement 3 voisins vivants devient vivante</li>
                    <li><strong>Survie:</strong> Une cellule vivante avec 2 ou 3 voisins reste vivante</li>
                    <li><strong>Mort:</strong> Une cellule vivante avec moins de 2 ou plus de 3 voisins meurt</li>
                </ul>

                <h3 style="color: #4ade80; margin-top: 20px;">🎮 Comment jouer</h3>
                <ul>
                    <li><strong>Démarrer/Pause:</strong> Lance ou arrête la simulation</li>
                    <li><strong>Étape:</strong> Avance d'une génération</li>
                    <li><strong>Aléatoire:</strong> Génère une configuration aléatoire</li>
                    <li><strong>Dessiner:</strong> Active le mode dessin pour créer vos propres formes</li>
                    <li><strong>Patterns:</strong> Charge des configurations célèbres</li>
                </ul>

                <h3 style="color: #4ade80; margin-top: 20px;">🧠 Concepts mathématiques</h3>
                <p>Le Jeu de la Vie illustre plusieurs concepts importants :</p>
                <ul>
                    <li><strong>Automates cellulaires:</strong> Systèmes où chaque cellule évolue selon des règles simples</li>
                    <li><strong>Émergence:</strong> Des comportements complexes naissent de règles simples</li>
                    <li><strong>Turing-complet:</strong> Le Jeu de la Vie peut simuler n'importe quel calcul !</li>
                </ul>

                <h3 style="color: #4ade80; margin-top: 20px;">🌟 Patterns célèbres</h3>
                <ul>
                    <li><strong>Planeur:</strong> Se déplace indéfiniment</li>
                    <li><strong>Clignotant:</strong> Oscille entre 2 états</li>
                    <li><strong>Pulsar:</strong> Oscille avec une période de 3</li>
                    <li><strong>Canon à planeurs:</strong> Génère des planeurs infiniment !</li>
                    <li><strong>Gland:</strong> Évolue pendant 5206 générations avant de se stabiliser</li>
                </ul>
            </div>
        `);
        modal.open();
    }
});

framework.addButtonToNavbar({
    text: '🎨 À propos',
    onClick: () => {
        const modal = framework.getPermanentModal();
        modal.setTitle('🎨 Le Jeu de la Vie');
        modal.setContent(`
            <div style="font-size: 16px; line-height: 1.8;">
                <h3 style="color: #4ade80;">Créé par John Conway</h3>
                <p>Le Jeu de la Vie a été inventé par le mathématicien britannique <strong>John Horton Conway</strong> en 1970.</p>
                
                <h3 style="color: #4ade80; margin-top: 20px;">Pourquoi est-il important ?</h3>
                <p>Le Jeu de la Vie a eu un impact majeur en mathématiques et en informatique :</p>
                <ul>
                    <li>Premier exemple populaire de système complexe émergeant de règles simples</li>
                    <li>Démonstration que des calculs universels peuvent émerger de règles basiques</li>
                    <li>Influence majeure sur les sciences de la complexité</li>
                    <li>Utilisé en biologie, physique, économie, art génératif...</li>
                </ul>

                <h3 style="color: #4ade80; margin-top: 20px;">Cette version</h3>
                <p>Version interactive 3D développée avec Three.js et le framework Terra Numerica.</p>
                <p>Grille : 80×60 cellules avec topologie torique (les bords sont connectés).</p>
            </div>
        `);
        modal.open();
    }
});

// Créer l'interface
createUI();
updateUI();

// Boucle de rendu
let lastTime = performance.now();

function animate(): void {
    requestAnimationFrame(animate);
    
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    game.update(deltaTime);
    framework.update();
    
    // Mettre à jour l'UI si le jeu est en cours
    if (game.isGameRunning()) {
        updateUI();
    }
    
    renderer.render(scene, camera);
}

// Gestion du redimensionnement
framework.onResize();

// Démarrer l'animation
animate();
