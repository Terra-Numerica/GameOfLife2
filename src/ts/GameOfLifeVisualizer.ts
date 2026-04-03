/**
 * Visualisateur du Jeu de la Vie avec Three.js
 */

import * as THREE from 'three';
import { GameOfLife } from './GameOfLife';

export class GameOfLifeVisualizer {
    private scene: THREE.Scene;
    private camera: THREE.Camera;
    private renderer: THREE.Renderer;
    
    private game: GameOfLife;
    private gridWidth: number;
    private gridHeight: number;
    private cellSize: number;
    
    private instancedMesh: THREE.InstancedMesh | null;
    private dummy: THREE.Object3D;
    
    private isRunning: boolean;
    private speed: number; // Étapes par seconde
    private lastStepTime: number;
    
    private raycaster: THREE.Raycaster;
    private mouse: THREE.Vector2;
    private drawMode: boolean;
    private isDrawing: boolean;

    constructor(scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.Renderer, gridWidth: number = 80, gridHeight: number = 60) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.cellSize = 1;
        
        this.game = new GameOfLife(gridWidth, gridHeight);
        this.instancedMesh = null;
        this.dummy = new THREE.Object3D();
        
        this.isRunning = false;
        this.speed = 5; // 5 étapes par seconde
        this.lastStepTime = 0;
        
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.drawMode = false;
        this.isDrawing = false;
        
        this.setupLights();
        this.createGrid();
        this.createCells();
        this.setupEventListeners();
    }

    setupLights(): void {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 10);
        this.scene.add(directionalLight);
    }

    createGrid(): void {
        const gridHelper = new THREE.GridHelper(
            Math.max(this.gridWidth, this.gridHeight) * this.cellSize,
            Math.max(this.gridWidth, this.gridHeight),
            0x444444,
            0x333333
        );
        gridHelper.position.set(0, -0.1, 0);
        this.scene.add(gridHelper);
    }

    createCells(): void {
        const cellGeometry = new THREE.BoxGeometry(
            this.cellSize - 0.05,
            0.3,
            this.cellSize - 0.05
        );
        
        const cellMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ff00,
            emissive: 0x00aa00,
            emissiveIntensity: 0.3,
            metalness: 0.3,
            roughness: 0.7
        });

        const maxCells = this.gridWidth * this.gridHeight;
        this.instancedMesh = new THREE.InstancedMesh(
            cellGeometry,
            cellMaterial,
            maxCells
        );

        this.scene.add(this.instancedMesh);
        
        // Positionner la caméra
        this.camera.position.set(0, this.gridHeight * 0.8, this.gridHeight * 0.8);
        this.camera.lookAt(0, 0, 0);
    }

    updateVisualization(): void {
        if (!this.instancedMesh) return;

        const grid = this.game.getGrid();
        let instanceIndex = 0;

        for (let y = 0; y < this.gridHeight; y++) {
            for (let x = 0; x < this.gridWidth; x++) {
                const alive = grid[y][x];
                
                // Position centrée
                this.dummy.position.set(
                    (x - this.gridWidth / 2) * this.cellSize,
                    0,
                    (y - this.gridHeight / 2) * this.cellSize
                );
                
                // Échelle selon l'état
                if (alive) {
                    this.dummy.scale.set(1, 1, 1);
                } else {
                    this.dummy.scale.set(0.01, 0.01, 0.01);
                }
                
                this.dummy.updateMatrix();
                this.instancedMesh.setMatrixAt(instanceIndex++, this.dummy.matrix);
            }
        }

        this.instancedMesh.instanceMatrix.needsUpdate = true;
    }

    start(): void {
        this.isRunning = true;
    }

    pause(): void {
        this.isRunning = false;
    }

    toggle(): void {
        this.isRunning = !this.isRunning;
    }

    step(): void {
        this.game.step();
        this.updateVisualization();
    }

    reset(): void {
        this.game.reset();
        this.updateVisualization();
    }

    randomize(): void {
        this.game.randomize(0.3);
        this.updateVisualization();
    }

    setSpeed(speed: number): void {
        this.speed = Math.max(1, Math.min(60, speed));
    }

    loadPattern(pattern: string): void {
        this.game.loadPattern(pattern);
        this.updateVisualization();
    }

    toggleDrawMode(): void {
        this.drawMode = !this.drawMode;
        document.body.style.cursor = this.drawMode ? 'crosshair' : 'default';

        // When entering draw mode, disable orbit camera interactions by
        // preventing pointer events on the renderer's canvas. The framework
        // creates OrbitControls bound to the renderer.domElement, so disabling
        // pointer events there stops camera rotation/zoom/pan while still
        // allowing our window-level mouse handlers to draw on the ground plane.
        try {
            const canvas = (this.renderer as any).domElement as HTMLElement | undefined;
            if (canvas) {
                canvas.style.pointerEvents = this.drawMode ? 'none' : 'auto';
            }
        } catch (e) {
            // Silent fallback if renderer.domElement isn't available or typed differently
            // (no action required).
        }
    }

    getGeneration(): number {
        return this.game.generation;
    }

    getPopulation(): number {
        return this.game.population;
    }

    isGameRunning(): boolean {
        return this.isRunning;
    }

    isInDrawMode(): boolean {
        return this.drawMode;
    }

    setupEventListeners(): void {
        window.addEventListener('mousedown', (e) => this.onMouseDown(e));
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('mouseup', () => this.onMouseUp());
    }

    onMouseDown(event: MouseEvent): void {
        if (!this.drawMode || !this.instancedMesh) return;
        
        this.isDrawing = true;
        this.handleDraw(event);
    }

    onMouseMove(event: MouseEvent): void {
        if (!this.drawMode || !this.isDrawing) return;
        this.handleDraw(event);
    }

    onMouseUp(): void {
        this.isDrawing = false;
    }

    handleDraw(event: MouseEvent): void {
        if (!this.instancedMesh) return;

        // Compute normalized device coordinates relative to the renderer's canvas
        // (not the window) to handle cases where the canvas doesn't fill the window
        // or is offset by other UI (navbar, margins...). This fixes cursor/grid
        // alignment issues.
        try {
            const canvas = (this.renderer as any).domElement as HTMLCanvasElement;
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        } catch (e) {
            // Fallback to window-based coords if renderer.domElement isn't available
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        }

        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Créer un plan au niveau du sol
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const intersectPoint = new THREE.Vector3();
        
        this.raycaster.ray.intersectPlane(plane, intersectPoint);

        if (intersectPoint) {
            // Convertir en coordonnées de grille
            // Take into account cell size in case it's != 1
            const gridX = Math.floor(intersectPoint.x / this.cellSize + this.gridWidth / 2);
            const gridZ = Math.floor(intersectPoint.z / this.cellSize + this.gridHeight / 2);

            // Dessiner/effacer la cellule
            if (gridX >= 0 && gridX < this.gridWidth && gridZ >= 0 && gridZ < this.gridHeight) {
                const currentState = this.game.getCell(gridX, gridZ);
                this.game.setCell(gridX, gridZ, !currentState);
                this.updateVisualization();
            }
        }
    }

    update(deltaTime: number): void {
        if (this.isRunning) {
            this.lastStepTime += deltaTime;
            const stepInterval = 1000 / this.speed;

            if (this.lastStepTime >= stepInterval) {
                this.step();
                this.lastStepTime = 0;
            }
        }
    }
}
