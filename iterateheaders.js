var h = require('./_headers')
const spawn = require('child_process').spawn
if (!RegExp.escape) {
  RegExp.escape = (S) => {
    // 1. let str be ToString(S).
    // 2. ReturnIfAbrupt(str).
    let str = String(S)
    // 3. Let cpList be a List containing in order the code
    // points as defined in 6.1.4 of str, starting at the first element of str.
    let cpList = Array.from(str[Symbol.iterator]())
    // 4. let cuList be a new List
    let cuList = []
    // 5. For each code point c in cpList in List order, do:
    for (let c of cpList) {
      // i. If c is a SyntaxCharacter then do:
      if ('^$\\.*+?()[]{}|'.indexOf(c) !== -1) {
        // a. Append "\" to cuList.
        cuList.push('\\')
      }
      // Append c to cpList.
      cuList.push(c)
    }
    // 6. Let L be a String whose elements are, in order, the elements of cuList.
    let L = cuList.join('')
    // 7. Return L.
    return L
  }
}

h.forEach(function (v) {
  if (v === 'EOF') {
    return
  }
  console.error('Proccessing ' + v)
const child = spawn(process.argv[0], ['uniqueparameters.js'], [RegExp.escape(v) + '" 2>>err.txt'], {
  detached: true,
  stdio: 'ignore'
})

child.unref();
 // const ls = spawn(('node uniqueparameters.js "' + RegExp.escape(v) + '" 2>>err.txt'))
 /* 
  ls.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`)
  })

  ls.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`)
  })
*/
  child.on('close', (code) => {
    console.log(`child process exited with code ${code}`)
  })
})

