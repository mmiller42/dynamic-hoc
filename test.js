const fs = require('fs')
const _glob = require('glob')
const path = require('path')

const promisify = fn => (...args) =>
  new Promise((resolve, reject) => {
    try {
      fn(thisVal, ...args, (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    } catch (err) {
      reject(err)
    }
  })

const glob = promisify(_glob)

const _readFile = promisify(fs.readFile)
const copyFile = promisify(fs.copyFile)

const backUpFile = async path => copyFile(path, `${path}.bak`)

const readFile = async path => _readFile(path, { encoding: 'utf8' })

const flatten = array => array.reduce((flattenedArray, value) => {
  const values = Array.isArray(value) ? value : [value]
  flattenedArray.push(...values)

  return flattenedArray
}, [])

const getFirstNonRejection = async promiseFactories => {
  for (const [index, promiseFactory] of promiseFactories.entries()) {
    try {
      return [index, await promiseFactory()]
    } catch (err) {
      if (promiseFactory === promiseFactories[promiseFactories.length - 1]) {
        return null
      }
    }
  }
}

const getAbsolutePath = (...relativePath) => path.join(__dirname, ...relativePath)

const globDirectories = async pattern => {
  const dirPattern = pattern.endsWith('/') ? pattern : `${pattern}/`
  return glob(dirPattern, { cwd: __dirname, absolute: true })
}

const run = async () => {
  const packageJsonPath = getAbsolutePath('package.json')
  const lockFilePaths = ['yarn.lock', 'package-lock.json'].map(getAbsolutePath)

  const [packageJsonSource, lockFileResult] = await Promise.all([
    async () => readFile(packageJsonPath),
    async () => getFirstNonRejection(lockFilePaths.map(readFile))
  ])

  const packageJson = { path: packageJsonPath, source: packageJsonSource, parsed: JSON.parse(packageJsonSource) }

  let lockFile = null

  if (lockFileResult) {
    const [index, source] = lockFileResult
    lockFile = { path: lockFilePaths[index], source }
  }

  const workspacePackageJsons = package.workspaces && package.workspaces.length > 0
    ? flatten(await Promise.all(package.workspaces.map(async pattern => {
      const workspaceDirectories = await globDirectories(pattern)

      return Promise.all(workspaceDirectories.map(async workspaceDirectory => {
        const source = await readFile(path.join(workspaceDirectory, 'package.json'))

        return { path: workspaceDirectory, source, parsed: JSON.parse(source) }
      }))
    })))
    : []

  const filesToBackUp = [packageJson, ...workspacePackageJsons]

  if (lockFile) {
    filesToBackUp.push(lockFile)
  }

  await Promise.all(filesToBackUp.map(async ({ path }) => backUpFile(path)))

  // next:
  // npm/yarn upgrade
  // execute tests
  // for all packages:
  //  - for all their dependency arrays, filter to those that are not exact values (e.g. ^, ~, >=, *, etc.)
  //  - convert them to their *exact* version and write to the package.json file
  // yarn/npm install
  // execute tests
  // restore files and delete backups
  // yarn/npm install

  const cli = lockFile && path.basename(lockFile.path) === 'yarn.lock' ? 'yarn' : 'npm'


}
const packageJson = require('./package.json')
