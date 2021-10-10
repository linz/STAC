import o from 'ospec';
import Ajv from 'ajv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import { AjvOptions } from '../../validation.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemaPath = join(__dirname, '..', 'schema.json');
const exampleItemPath = join(__dirname, '..', 'examples/item.json');

o.spec('Aerial photo item', () => {
  let validate;
  const ajv = new Ajv(AjvOptions);

  o.before(async () => {
    const data = JSON.parse(await fs.readFile(schemaPath));
    validate = await ajv.compileAsync(data);
  });

  o('Example should pass validation', async () => {
    // given
    const aerialPhotoItemExample = JSON.parse(await fs.readFile(exampleItemPath));

    // when
    let valid = validate(aerialPhotoItemExample);

    // then
    o(valid).equals(true)(JSON.stringify(validate.errors, null, 2));
  });

  o("Example with an incorrect 'aerial-photo:run' field should fail validation", async () => {
    // given
    const aerialPhotoItemExample = JSON.parse(await fs.readFile(exampleItemPath));
    aerialPhotoItemExample.properties['aerial-photo:run'] = 1234;

    // when
    let valid = validate(aerialPhotoItemExample);

    // then
    o(valid).equals(false);
    o(
      validate.errors.some(
        (error) => error.dataPath === ".properties['aerial-photo:run']" && error.message === 'should be string',
      ),
    ).equals(true)(JSON.stringify(validate.errors));
  });

  o("Example without the mandatory 'aerial-photo:run' field should fail validation", async () => {
    // given
    const aerialPhotoItemExample = JSON.parse(await fs.readFile(exampleItemPath));
    delete aerialPhotoItemExample.properties['aerial-photo:run'];

    // when
    let valid = validate(aerialPhotoItemExample);

    // then
    o(valid).equals(false);
    o(
      validate.errors.some(
        (error) =>
          error.dataPath === '.properties' && error.message === "should have required property '['aerial-photo:run']'",
      ),
    ).equals(true)(JSON.stringify(validate.errors));
  });

  o("Example without a mandatory 'aerial-photo:sequence_number' field should fail validation", async () => {
    // given
    const aerialPhotoItemExample = JSON.parse(await fs.readFile(exampleItemPath));
    delete aerialPhotoItemExample.properties['aerial-photo:sequence_number'];

    // when
    let valid = validate(aerialPhotoItemExample);

    // then
    o(valid).equals(false);
    o(
      validate.errors.some(
        (error) =>
          error.dataPath === '.properties' &&
          error.message === "should have required property '['aerial-photo:sequence_number']'",
      ),
    ).equals(true)(JSON.stringify(validate.errors));
  });

  o("Example with an incorrect 'aerial-photo:sequence_number' field should fail validation", async () => {
    // given
    const aerialPhotoItemExample = JSON.parse(await fs.readFile(exampleItemPath));
    aerialPhotoItemExample.properties['aerial-photo:sequence_number'] = 'incorrect_example';

    // when
    let valid = validate(aerialPhotoItemExample);

    // then
    o(valid).equals(false);
    o(
      validate.errors.some(
        (error) =>
          error.dataPath === ".properties['aerial-photo:sequence_number']" && error.message === 'should be integer',
      ),
    ).equals(true)(JSON.stringify(validate.errors));
  });
});
