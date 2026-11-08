import fs from 'node:fs'
import path from 'node:path'
import { parse } from '@vue/compiler-sfc'
import { parse as parseScript } from '@babel/parser'
const publicId = 'virtual:route-component-names'
const resolvedId = '\0' + publicId
const filesIn = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name)
    return entry.isDirectory()
      ? filesIn(file)
      : file.endsWith('.vue')
        ? [file]
        : []
  })
function componentName(file) {
  const { descriptor } = parse(fs.readFileSync(file, 'utf8'))
  const script = [descriptor.script?.content, descriptor.scriptSetup?.content]
    .filter(Boolean)
    .join('\n')
  const source = parseScript(script, { sourceType: 'module' })
  let name
  const visit = (node) => {
    if (
      node.type === 'CallExpression' &&
      node.callee.type === 'Identifier' &&
      node.callee.name === 'defineOptions'
    ) {
      const options = node.arguments[0]
      if (options?.type === 'ObjectExpression') {
        const property = options.properties.find(
          (item) =>
            item.type === 'ObjectProperty' &&
            !item.computed &&
            (item.key.name ?? item.key.value) === 'name'
        )
        if (property?.value.type === 'StringLiteral')
          name = property.value.value
      }
    }
    for (const value of Object.values(node)) {
      if (Array.isArray(value))
        value.forEach((child) => {
          if (child?.type) visit(child)
        })
      else if (value?.type) visit(value)
    }
  }
  visit(source)
  return (
    name ??
    path
      .basename(file, '.vue')
      .replace(/(^\w|-\w)/g, (word) => word.replace('-', '').toUpperCase())
  )
}
/** 通过虚拟模块提供缓存组件名，不向源码目录写入构建产物。 */
export default function vueFilePathPlugin() {
  let root = process.cwd()
  return {
    name: 'vue-route-component-names',
    configResolved(config) {
      root = config.root
    },
    resolveId(id) {
      if (id === publicId) return resolvedId
    },
    load(id) {
      if (id !== resolvedId) return
      const names = Object.fromEntries(
        filesIn(path.join(root, 'src/views')).map((file) => [
          '/' + path.relative(root, file).replace(/\\/g, '/'),
          componentName(file)
        ])
      )
      return 'export const componentNames = ' + JSON.stringify(names)
    },
    configureServer(next) {
      const changed = (_event, file) => {
        if (
          !file.replace(/\\/g, '/').includes('/src/views/') ||
          !file.endsWith('.vue')
        )
          return
        const module = next.moduleGraph.getModuleById(resolvedId)
        if (module) next.moduleGraph.invalidateModule(module)
        next.ws.send({ type: 'full-reload' })
      }
      next.watcher.on('all', changed)
      next.httpServer?.once('close', () => next.watcher.off('all', changed))
    }
  }
}
