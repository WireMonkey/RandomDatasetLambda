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

  const validate = (data) => {
    //If the input is missing rowsToReturn or comlums it's invalid
    if(data.rowsToReturn === 'undefined' || data.columns === 'undefined'){
      return false;
    } else { //Each column must have a columnName and a function to be valid
      return data.columns.every(function(x) {
        return x.columnName !== 'undefined' && x.function !== 'undefined' ;
      });
    }

  }

  switch (event.httpMethod) {
    case 'POST':
      var data = JSON.parse(event.body);
      if(validate(data)){
        done(null, generate(data.rowsToReturn, data.columns));
      }else{
        done(new Error(`Data is not in expected format.`));  
      }
      break;
    case 'OPTIONS':
      done(new Error('https://chancejs.com/'));
      break;
    default:
      done(new Error(`Unsupported method "${event.httpMethod}"`));
  }
};
