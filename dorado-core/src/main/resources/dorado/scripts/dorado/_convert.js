const fs = require('fs');
const path = require('path');

const dir = __dirname;

const files = [
  'debugger.js',
  'tag-editor.js',
  'touch-patch.js',
  'block-view.js',
  'color-picker.js',
  'layout.js',
  'list.js',
  'list-support.js',
  'tree.js',
  'tree-grid.js',
];

function transformToTS(content) {
  // Preserve strings/comments by replacing them with placeholders
  const placeholders = [];
  function saveAndReplace(str) {
    const idx = placeholders.length;
    placeholders.push(str);
    return `\x00PLACEHOLDER${idx}\x00`;
  }
  let code = content;

  // Replace string literals and template literals (simplified)
  code = code.replace(/(?:^|[\s=(:+,*\-/?&|!<>;{}\[\].])(("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|`(?:[^`\\]|\\.)*`)/g, function (match) {
    // Find the string portion (could be preceded by separator)
    const m = match.match(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)$/);
    if (m) {
      const prefix = match.slice(0, match.length - m[0].length);
      return prefix + saveAndReplace(m[0]);
    }
    return match;
  });

  // Replace // line comments
  code = code.replace(/\/\/[^\n]*/g, function (match) {
    return saveAndReplace(match);
  });

  // Replace /* block comments */
  code = code.replace(/\/\*[\s\S]*?\*\//g, function (match) {
    return saveAndReplace(match);
  });

  // Replace var with let (simple)
  code = code.replace(/\bvar\s+/g, 'let ');

  // Replace `function name(args)` -> `function name(arg1: any, arg2: any)`
  // Also replace `function (args)` -> `function (arg1: any, ...)`
  // Also replace named and anonymous methods

  // This gets tricky. Use a simpler approach: iterate lines, find function declarations.
  const lines = code.split('\n');
  const out = [];
  for (const line of lines) {
    let newLine = line;
    // function name(args) or function(args) or methodname: function(args)
    // Also support function(args) in expressions
    // Match `function maybeName(args)` where args is balanced
    // Use a regex that finds patterns like function xxx(...) or function (...)
    // Handle common case: function keyword followed by optional name, then (params)

    // Let's match all `function (something):` / `function name(something):` / `key: function(something)` etc.
    // Do a simple scan: find 'function' followed by optional name, then '(' and the matching ')'
    let scanIdx = 0;
    while (true) {
      const funcIdx = newLine.indexOf('function', scanIdx);
      if (funcIdx === -1) break;
      // Check word boundary
      const beforeChar = funcIdx > 0 ? newLine[funcIdx - 1] : '';
      const afterIdx = funcIdx + 'function'.length;
      const afterChar = newLine[afterIdx] || '';
      if (!/[\s(]/.test(afterChar)) {
        scanIdx = afterIdx;
        continue;
      }
      // Skip function keyword
      let i = afterIdx;
      // Allow optional name: spaces + identifier
      let namePart = '';
      while (i < newLine.length && /\s/.test(newLine[i])) i++;
      if (/[A-Za-z_$]/.test(newLine[i])) {
        const nameStart = i;
        while (i < newLine.length && /[A-Za-z0-9_$]/.test(newLine[i])) i++;
        namePart = newLine.substring(nameStart, i);
      }
      // Now expect '('
      while (i < newLine.length && /\s/.test(newLine[i])) i++;
      if (newLine[i] !== '(') {
        scanIdx = i;
        continue;
      }
      // Find matching ')'
      let depth = 1;
      let j = i + 1;
      while (j < newLine.length && depth > 0) {
        if (newLine[j] === '(') depth++;
        else if (newLine[j] === ')') depth--;
        if (depth === 0) break;
        j++;
      }
      if (j >= newLine.length) {
        scanIdx = j;
        continue;
      }
      const paramsRaw = newLine.substring(i + 1, j);
      // Only add type annotations if params aren't already annotated (no ':')
      if (paramsRaw.indexOf(':') === -1 && paramsRaw.indexOf('...') === -1) {
        let params = paramsRaw;
        if (params.trim() !== '') {
          // Split by comma at top level (no nesting since placeholder strings removed complexity)
          const parts = [];
          let partStart = 0;
          let depth2 = 0;
          for (let k = 0; k < params.length; k++) {
            const c = params[k];
            if (c === '(' || c === '[' || c === '{') depth2++;
            else if (c === ')' || c === ']' || c === '}') depth2--;
            else if (c === ',' && depth2 === 0) {
              parts.push(params.substring(partStart, k));
              partStart = k + 1;
            }
          }
          parts.push(params.substring(partStart));
          const annotated = parts.map(p => {
            const trimmed = p.trim();
            if (!trimmed) return p;
            // identifier
            const m = trimmed.match(/^([A-Za-z_$][A-Za-z0-9_$]*)\s*$/);
            if (m) {
              const ident = m[1];
              const leadingSpaces = p.length - p.trimLeft().length;
              return ' '.repeat(leadingSpaces) + ident + ': any';
            }
            return p;
          }).join(',');
          params = annotated;
        }
        newLine = newLine.substring(0, i + 1) + params + newLine.substring(j);
        scanIdx = i + 1 + params.length;
      } else {
        scanIdx = j;
      }
    }
    out.push(newLine);
  }

  code = out.join('\n');

  // Restore placeholders
  code = code.replace(/\x00PLACEHOLDER(\d+)\x00/g, function (_, idx) {
    return placeholders[parseInt(idx, 10)];
  });

  return code;
}

let converted = 0;
for (const file of files) {
  const src = path.join(dir, file);
  if (!fs.existsSync(src)) {
    console.log('SKIP (not found):', file);
    continue;
  }
  const content = fs.readFileSync(src, 'utf8');
  const transformed = transformToTS(content);
  const tsName = file.replace(/\.js$/, '.ts');
  const dest = path.join(dir, tsName);
  // Prepend reference directive
  const finalContent = '/// <reference path="globals.d.ts" />\n' + transformed;
  fs.writeFileSync(dest, finalContent);
  console.log('Converted:', file, '->', tsName, '(', content.length, 'chars )');
  converted++;
}
console.log('Done. Total converted:', converted);
