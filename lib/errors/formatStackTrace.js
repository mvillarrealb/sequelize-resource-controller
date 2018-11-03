const parseStackTrace = errorLine => {
  const resultingObj = {};
  const traceFields = {
    blamingFile: /\(\S+\)/,
    blamingLines: /:\d+:\d+/,
    blamingSource: /at \S+/
  };
  Object.keys(traceFields).forEach(traceField => {
    const traceRegexp = traceFields[traceField];
    const matchResult = errorLine.match(traceRegexp);
    if (matchResult && matchResult.length > 0) {
      const [firstMatch] = matchResult;
      resultingObj[traceField] = firstMatch;
    }
  });
  return resultingObj;
};

const transformStackTrace = errorLine => {
  let line = null;
  let column = null;
  let { blamingFile, blamingLines, blamingSource } = errorLine;
  if (blamingFile != null && typeof blamingFile === 'string') {
    blamingFile = blamingFile
      .replace('(', '')
      .replace(')', '')
      .replace(blamingLines, '');
  }
  if (blamingSource != null && typeof blamingFile === 'string') {
    blamingSource = blamingSource.replace('at', '').trim();
  }
  if (blamingLines != null) {
    blamingLines = blamingLines.split(':');
    [, line, column] = blamingLines;
  }
  return { blamingFile, line, column, blamingSource };
};

/**
 * Transforms a stackTrace into an array of objects
 * containing pretty formatted information about an
 * original stack trace, for example:
 * 
 * Error: ERROR_INTERNO
    at Object.<anonymous> (/home/mvillarreal/Marco/develop/nodejs/my-node-modules/sequelize-resource-controller/lib/errors/resourceErr.js:3:13)
    at Module._compile (internal/modules/cjs/loader.js:689:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:700:10)
    at Module.load (internal/modules/cjs/loader.js:599:32)
    at tryModuleLoad (internal/modules/cjs/loader.js:538:12)
    at Function.Module._load (internal/modules/cjs/loader.js:530:3)
    at Function.Module.runMain (internal/modules/cjs/loader.js:742:12)
    at startup (internal/bootstrap/node.js:266:19)
    at bootstrapNodeJSCore (internal/bootstrap/node.js:596:3)

    Will be mapped into:

 * [{
    blamingFile: '/home/mvillarreal/Marco/develop/nodejs/my-node-modules/sequelize-resource-controller/lib/errors/resourceErr.js',
    line: '3',
    column: '13',
    blamingSource: 'Object.<anonymous>'
  },
  {
    blamingFile: 'internal/modules/cjs/loader.js',
    line: '689',
    column: '30',
    blamingSource: 'Module._compile'
  },
  {
    blamingFile: 'internal/modules/cjs/loader.js',
    line: '700',
    column: '10',
    blamingSource: 'Object.Module._extensions..js'
  },
  {
    blamingFile: 'internal/modules/cjs/loader.js',
    line: '599',
    column: '32',
    blamingSource: 'Module.load'
  },
  {
    blamingFile: 'internal/modules/cjs/loader.js',
    line: '538',
    column: '12',
    blamingSource: 'tryModuleLoad'
  },
  {
    blamingFile: 'internal/modules/cjs/loader.js',
    line: '530',
    column: '3',
    blamingSource: 'Function.Module._load'
  },
  {
    blamingFile: 'internal/modules/cjs/loader.js',
    line: '742',
    column: '12',
    blamingSource: 'Function.Module.runMain'
  },
  {
    blamingFile: 'internal/bootstrap/node.js',
    line: '266',
    column: '19',
    blamingSource: 'startup'
  },
  {
    blamingFile: 'internal/bootstrap/node.js',
    line: '596',
    column: '3',
    blamingSource: 'bootstrapNodeJSCore'
  }
]
 * @param {String} stackTrace The stacktrace string to be mapped
 * @return {Array} an array of the containing information of the
 * stack trace
 */
module.exports = stackTrace => {
  const formattedStack = stackTrace
    .split('\n')
    .map(line => parseStackTrace(line))
    .filter(line => Object.keys(line).length > 0)
    .map(line => transformStackTrace(line))
    .filter(stackDetail => stackDetail.line != null && stackDetail.column != null);
  return formattedStack;
};
