const chai = require('chai');

const { expect } = chai;
const ResourceError = require('../../../lib/errors/ResourceError');

describe('ResourceError', () => {
  const { ERRORS } = ResourceError;

  it('Should be able to create an error', () => {
    const error = new ResourceError(ERRORS.INTERNAL);
    expect(error).to.have.property('name');
    expect(error).to.have.property('status');
    expect(error).to.have.property('code');
    expect(error).to.have.property('message');
    expect(error).to.have.property('details');
  });

  it('Should format the stack trace', () => {
    const error = new ResourceError(ERRORS.INTERNAL);
    const { details } = error;
    expect(details).to.be.an('Array');
    expect(details).to.have.length.above(0);
    const [firstEl] = details;
    expect(firstEl).to.have.property('blamingFile');
    expect(firstEl).to.have.property('line');
    expect(firstEl).to.have.property('column');
    expect(firstEl).to.have.property('blamingSource');
  });

  it('Should be able to generate toJSON struct', () => {
    const error = new ResourceError(ERRORS.INTERNAL);
    const toJSON = error.toJSON();
    expect(toJSON).to.be.an('Object');
    expect(toJSON).to.have.property('status');
    expect(toJSON).to.have.property('code');
    expect(toJSON).to.have.property('message');
    expect(toJSON).to.have.property('details');
  });

  it('Should contain standard struct for every generated Error', () => {
    Object.keys(ERRORS).forEach(errorKey => {
      const errorObj = ERRORS[errorKey];
      const message = `a message of type ${errorKey}`;
      const { code, status } = errorObj;
      const error = new ResourceError(errorObj, message);
      expect(error).to.have.property('status', status);
      expect(error).to.have.property('code', code);
      expect(error).to.have.property('message', message);
      expect(error).to.have.property('details');
    });
  });
});
