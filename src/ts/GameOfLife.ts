/**
 * Jeu de la Vie de Conway
 * Implémentation TypeScript
 */

export class GameOfLife {
    private width: number;
    private height: number;
    private grid: boolean[][];
    private nextGrid: boolean[][];
    public generation: number;
    public population: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.generation = 0;
        this.population = 0;
        
        // Initialiser les grilles
        this.grid = this.createEmptyGrid();
        this.nextGrid = this.createEmptyGrid();
    }

    private createEmptyGrid(): boolean[][] {
        return Array(this.height).fill(null).map(() => 
            Array(this.width).fill(false)
        );
    }

    /**
     * Réinitialiser la grille
     */
    reset(): void {
        this.grid = this.createEmptyGrid();
        this.nextGrid = this.createEmptyGrid();
        this.generation = 0;
        this.population = 0;
    }

    /**
     * Remplir aléatoirement
     */
    randomize(density: number = 0.3): void {
        this.reset();
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.grid[y][x] = Math.random() < density;
            }
        }
        this.updatePopulation();
    }

    /**
     * Définir l'état d'une cellule
     */
    setCell(x: number, y: number, alive: boolean): void {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.grid[y][x] = alive;
            this.updatePopulation();
        }
    }

    /**
     * Obtenir l'état d'une cellule
     */
    getCell(x: number, y: number): boolean {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            return this.grid[y][x];
        }
        return false;
    }

    /**
     * Compter les voisins vivants
     */
    private countNeighbors(x: number, y: number): number {
        let count = 0;
        
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                
                const nx = x + dx;
                const ny = y + dy;
                
                // Bords avec wrap-around (tore)
                const wx = (nx + this.width) % this.width;
                const wy = (ny + this.height) % this.height;
                
                if (this.grid[wy][wx]) {
                    count++;
                }
            }
        }
        
        return count;
    }

    /**
     * Calculer la prochaine génération
     */
    step(): void {
        // Calculer la nouvelle grille
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const neighbors = this.countNeighbors(x, y);
                const alive = this.grid[y][x];
                
                // Règles du jeu de la vie
                if (alive) {
                    // Une cellule vivante avec 2 ou 3 voisins survit
                    this.nextGrid[y][x] = neighbors === 2 || neighbors === 3;
                } else {
                    // Une cellule morte avec exactement 3 voisins devient vivante
                    this.nextGrid[y][x] = neighbors === 3;
                }
            }
        }
        
        // Échanger les grilles
        [this.grid, this.nextGrid] = [this.nextGrid, this.grid];
        
        this.generation++;
        this.updatePopulation();
    }

    /**
     * Mettre à jour le compteur de population
     */
    private updatePopulation(): void {
        this.population = 0;
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.grid[y][x]) {
                    this.population++;
                }
            }
        }
    }

    /**
     * Obtenir la grille complète
     */
    getGrid(): boolean[][] {
        return this.grid;
    }

    /**
     * Charger un pattern prédéfini
     */
    loadPattern(pattern: string): void {
        this.reset();
        const centerX = Math.floor(this.width / 2);
        const centerY = Math.floor(this.height / 2);

        switch (pattern) {
            case 'glider':
                this.loadGlider(centerX, centerY);
                break;
            case 'blinker':
                this.loadBlinker(centerX, centerY);
                break;
            case 'toad':
                this.loadToad(centerX, centerY);
                break;
            case 'beacon':
                this.loadBeacon(centerX, centerY);
                break;
            case 'pulsar':
                this.loadPulsar(centerX, centerY);
                break;
            case 'gliderGun':
                this.loadGliderGun(centerX - 18, centerY - 5);
                break;
            case 'acorn':
                this.loadAcorn(centerX, centerY);
                break;
        }
        
        this.updatePopulation();
    }

    private loadGlider(x: number, y: number): void {
        const pattern = [
            [0, 1, 0],
            [0, 0, 1],
            [1, 1, 1]
        ];
        this.loadPatternArray(pattern, x, y);
    }

    private loadBlinker(x: number, y: number): void {
        const pattern = [
            [1, 1, 1]
        ];
        this.loadPatternArray(pattern, x, y);
    }

    private loadToad(x: number, y: number): void {
        const pattern = [
            [0, 1, 1, 1],
            [1, 1, 1, 0]
        ];
        this.loadPatternArray(pattern, x, y);
    }

    private loadBeacon(x: number, y: number): void {
        const pattern = [
            [1, 1, 0, 0],
            [1, 1, 0, 0],
            [0, 0, 1, 1],
            [0, 0, 1, 1]
        ];
        this.loadPatternArray(pattern, x, y);
    }

    private loadPulsar(x: number, y: number): void {
        const pattern = [
            [0,0,1,1,1,0,0,0,1,1,1,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0],
            [1,0,0,0,0,1,0,1,0,0,0,0,1],
            [1,0,0,0,0,1,0,1,0,0,0,0,1],
            [1,0,0,0,0,1,0,1,0,0,0,0,1],
            [0,0,1,1,1,0,0,0,1,1,1,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,1,1,1,0,0,0,1,1,1,0,0],
            [1,0,0,0,0,1,0,1,0,0,0,0,1],
            [1,0,0,0,0,1,0,1,0,0,0,0,1],
            [1,0,0,0,0,1,0,1,0,0,0,0,1],
            [0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,1,1,1,0,0,0,1,1,1,0,0]
        ];
        this.loadPatternArray(pattern, x - 6, y - 6);
    }

    private loadGliderGun(x: number, y: number): void {
        const pattern = [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
            [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
            [1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [1,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,1,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ];
        this.loadPatternArray(pattern, x, y);
    }

    private loadAcorn(x: number, y: number): void {
        const pattern = [
            [0,1,0,0,0,0,0],
            [0,0,0,1,0,0,0],
            [1,1,0,0,1,1,1]
        ];
        this.loadPatternArray(pattern, x, y);
    }

    private loadPatternArray(pattern: number[][], startX: number, startY: number): void {
        for (let y = 0; y < pattern.length; y++) {
            for (let x = 0; x < pattern[y].length; x++) {
                if (pattern[y][x] === 1) {
                    this.setCell(startX + x, startY + y, true);
                }
            }
        }
    }
}
