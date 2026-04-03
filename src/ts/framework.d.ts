/**
 * Déclarations de types pour le framework Terra Numerica
 */

import * as THREE from 'three';

// Declaration for absolute import used in some HTML/server-root imports
declare module '/framework/framework.js' {
  export default class Framework {
    mainParameters: { scene: THREE.Scene; camera: THREE.PerspectiveCamera; renderer: THREE.WebGLRenderer };
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;

    constructor();

    addButtonToNavbar(config: {
      text: string;
      onClick?: () => void;
      hover?: boolean;
      classesOfTheButton?: string[];
    }): HTMLElement | null;

    getPermanentModal(): {
      setTitle(title: string): void;
      setContent(content: string): void;
      open(): void;
      close(): void;
    };

    update(): void;
    onResize(...args: any[]): void;
  }
}

  // Permissive wildcard to cover any import that ends with 'framework.js'
  declare module '*framework.js' {
    const Framework: any;
    export default Framework;
  }

// Declaration for relative import path used in TypeScript sources
declare module '../../framework/framework.js' {
  export default class Framework {
    mainParameters: { scene: THREE.Scene; camera: THREE.PerspectiveCamera; renderer: THREE.WebGLRenderer };
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;

    constructor();

    addButtonToNavbar(config: {
      text: string;
      onClick?: () => void;
      hover?: boolean;
      classesOfTheButton?: string[];
    }): HTMLElement | null;

    getPermanentModal(): {
      setTitle(title: string): void;
      setContent(content: string): void;
      open(): void;
      close(): void;
    };

    update(): void;
    onResize(...args: any[]): void;
  }
}
