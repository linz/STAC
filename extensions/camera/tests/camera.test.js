import o from 'ospec';
import Ajv from 'ajv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import { AjvOptions } from '../../validation.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemaPath = join(__dirname, '..', 'schema.json');
const examplePath = join(__dirname, '..', 'examples/item.json');

o.spec('camera', () => {
  let validate;
  const ajv = new Ajv(AjvOptions);

  o.before(async () => {
    const data = JSON.parse(await fs.readFile(schemaPath));
    validate = await ajv.compileAsync(data);
  });

  o('camera-validates-successfully', async () => {
    // given
    const camera_item_example = JSON.parse(await fs.readFile(examplePath));

    // when
    let valid = validate(camera_item_example);

    // then
    o(valid).equals(true)(JSON.stringify(validate.errors, null, 2));
  });

  o('camera-validation-fails', async () => {
    // given
    const camera_item_example = JSON.parse(await fs.readFile(examplePath));
    camera_item_example.properties['camera:sequence_number'] = 'incorrect_value';

    // when
    let valid = validate(camera_item_example);

    // then
    o(valid).equals(false);
    o(validate.errors.length).equals(1);
    o(validate.errors[0].message).equals('should be integer');
  });
});
