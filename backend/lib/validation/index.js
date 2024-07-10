const Ajv = require('ajv');

const ajv = new Ajv();

const validateSchema = (schema, data) => {
  const validate = ajv.compile(schema);
  const valid = validate(data);
  if (!valid) {
    return valid;
  }
  return valid;
};

module.exports = validateSchema;
