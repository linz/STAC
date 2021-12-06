import * as fs from 'fs';
import * as https from 'https';

const stac_fields_url = 'https://cdn.jsdelivr.net/npm/@radiantearth/stac-fields/fields-normalized.json';

function extendJsonSchema(baseSchema, extendingSchema) {
  let extendedSchema = Object.assign({}, baseSchema);
  extendedSchema.metadata = Object.assign(baseSchema.metadata, extendingSchema.metadata);
  extendedSchema.extensions = Object.assign(baseSchema.extensions, extendingSchema.extensions);
  return extendedSchema;
}

https
  .get(stac_fields_url, (res) => {
    let baseSchema = '';
    res.on('data', (chunk) => {
      baseSchema += chunk;
    });
    res.on('end', () => {
      baseSchema = JSON.parse(baseSchema);
      let extendingSchema = JSON.parse(fs.readFileSync('./fields/custom-fields.json').toString());
      let extendedSchema = Object.assign(
        { $comment: 'DO NOT EDIT. This file is automatically generated by import-fields-json.js.' },
        extendJsonSchema(baseSchema, extendingSchema),
      );
      console.log(JSON.stringify(extendedSchema));
    });
  })
  .on('error', (err) => {
    console.log(err.message);
  });
