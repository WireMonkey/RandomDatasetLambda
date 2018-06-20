'use strict';
const chance = require('chance').Chance();

exports.handler = (event, context, callback) => {
  const done = (err, res) => callback(null, {
    statusCode: err ? '400' : '200',
    body: err ? err.message : JSON.stringify(res),
    headers: {
      'Content-Type': 'application/json',
    },
  });

    const generate = (numberOfRows, layout) => {
      numberOfRows = numberOfRows || 1;
      var records = [];
    for (let i = 0; i < numberOfRows; i++) {
      var record = {};
      layout.forEach(function (x) {
        if(x.function.includes("help")) {
          record[x.columnName] = "https://chancejs.com/usage/" + x.function.replace('help','').replace(' ','') + '.html';
        } else {
          record[x.columnName] = chance[x.function](x.options);
        }
      });
      records.push(record);
    }
    return records;
  };

  switch (event.httpMethod) {
    case 'POST':
      var data = JSON.parse(event.body);
      done(null, generate(data.rowsToReturn, data.columns));
      break;
    case 'OPTIONS':
      done(new Error('https://chancejs.com/'));
      break;
    default:
      done(new Error(`Unsupported method "${event.httpMethod}"`));
  }
};
