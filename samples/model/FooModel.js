module.exports = {
  required: true,
  type: 'object',
  properties: {
    data: {
      required: true,
      type: 'object',
      properties: {
        username: {
          required: true,
          type: "string"
        }
      }
    }
  }
};