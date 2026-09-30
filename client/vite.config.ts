import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rolldownOptions: {
            output: {
                codeSplitting: {
                    groups: [
                        {
                            name: 'playcanvas-engine',
                            test: /node_modules[\\/]playcanvas[\\/]/,
                            priority: 10
                        }
                    ]
                }
            }
        }
    }
});
