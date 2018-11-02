const chai = require('chai');

const { expect } = chai;
const formatStackTrace = require('../../../lib/errors/formatStackTrace');

describe('formatStackTrace', () => {
  const error = new Error('A pretty cool error');
  it('Should format a stack trace', () => {
    const formatted = formatStackTrace(error.stack);
    expect(formatted).to.be.an('Array');
    const [firstEl] = formatted;
    expect(firstEl).to.have.property('blamingFile');
    expect(firstEl).to.have.property('line');
    expect(firstEl).to.have.property('column');
    expect(firstEl).to.have.property('blamingSource');
  });
});
