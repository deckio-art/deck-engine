const projectConfigModules = import.meta.glob('../projects/*/project.config.js', { eager: true })
const projectAppModules = import.meta.glob('../projects/*/*.jsx', { eager: true })

function toPascalCase(value) {
  return value
    .split('-')
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

function getDefaultExport(module) {
  return module?.default ?? module
}

function getProjectIdFromConfigPath(path) {
  return path.match(/^\.\.\/projects\/([^/]+)\/project\.config\.js$/)?.[1] ?? null
}

function getAppComponent(projectId) {
  const expectedFileName = `${toPascalCase(projectId)}App.jsx`

  for (const [path, module] of Object.entries(projectAppModules)) {
    if (!path.startsWith(`../projects/${projectId}/`)) continue

    const fileName = path.split('/').pop()
    if (fileName !== expectedFileName) continue

    return getDefaultExport(module)
  }

  return null
}

export function getProjects() {
  return Object.entries(projectConfigModules)
    .map(([path, module]) => {
      const config = getDefaultExport(module)
      const id = config?.id ?? getProjectIdFromConfigPath(path)

      if (!id) return null

      return {
        ...config,
        id,
        component: getAppComponent(id),
      }
    })
    .filter(project => project?.component)
    .sort((left, right) => {
      const leftOrder = left.order ?? Number.MAX_SAFE_INTEGER
      const rightOrder = right.order ?? Number.MAX_SAFE_INTEGER

      if (leftOrder !== rightOrder) return leftOrder - rightOrder
      return left.title.localeCompare(right.title)
    })
}

