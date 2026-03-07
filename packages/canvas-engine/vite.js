export function canvasPlugin() {
  return {
    name: 'canvas-engine',
    config() {
      return {
        resolve: {
          dedupe: ['react', 'react-dom'],
        },
      }
    },
  }
}

export default canvasPlugin
