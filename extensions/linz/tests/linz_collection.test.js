import o from 'ospec';
import Ajv from 'ajv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';
import { AjvOptions, DefaultTimeoutMillis } from '../../../validation.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemaPath = join(__dirname, '..', 'schema.json');
const examplePath = join(__dirname, '..', 'examples/collection.json');

o.spec('LINZ collection', () => {
  o.specTimeout(DefaultTimeoutMillis);
  let validate;
  const ajv = new Ajv(AjvOptions);

  o.before(async () => {
    const data = JSON.parse(await fs.readFile(schemaPath));
    validate = await ajv.compileAsync(data);
  });

  o('Example should pass validation', async () => {
    // given
    const example = JSON.parse(await fs.readFile(examplePath));

    // when
    const valid = validate(example);

    // then
    o(valid).equals(true)(JSON.stringify(validate.errors, null, 2));
  });

  o("Example with unsupported 'linz:*' property should fail validation", async () => {
    // given
    const example = JSON.parse(await fs.readFile(examplePath));
    const parameterName = 'linz:unknown';
    example[parameterName] = 1;

    // when
    let valid = validate(example);

    // then
    o(valid).equals(false);
    o(
      validate.errors.some(
        (error) =>
          error.params.additionalProperty === parameterName && error.message === 'must NOT have additional properties',
      ),
    ).equals(true)(JSON.stringify(validate.errors));
  });

  o("Example with unsupported 'quality:*' property should fail validation", async () => {
    // given
    const example = JSON.parse(await fs.readFile(examplePath));
    const parameterName = 'quality:unknown';
    example[parameterName] = 1;

    // when
    let valid = validate(example);

    // then
    o(valid).equals(false);
    o(
      validate.errors.some(
        (error) =>
          error.params.additionalProperty === parameterName && error.message === 'must NOT have additional properties',
      ),
    ).equals(true)(JSON.stringify(validate.errors));
  });

  o("Example with invalid 'proj:epsg' value should fail validation", async () => {
    // given
    const example = JSON.parse(await fs.readFile(examplePath));
    example['assets']['example']['proj:epsg'] = 'string';

    // when
    let valid = validate(example);

    // then
    o(valid).equals(false);
    o(
      validate.errors.some(
        (error) => error.instancePath === '/assets/example/proj:epsg' && error.message === 'must be integer,null',
      ),
    ).equals(true)(JSON.stringify(validate.errors));
  });

  o("Summaries with no 'created' property should fail validation", async () => {
    // given
    const example = JSON.parse(await fs.readFile(examplePath));
    delete example['summaries']['created'];

    // when
    let valid = validate(example);

    // then
    o(valid).equals(false);
    o(
      validate.errors.some(
        (error) => error.instancePath === '/summaries' && error.message === "must have required property 'created'",
      ),
    ).equals(true)(JSON.stringify(validate.errors));
  });

  o("Example with no 'linz:geospatial_type' property should fail validation", async () => {
    // given
    const example = JSON.parse(await fs.readFile(examplePath));
    delete example['linz:geospatial_type'];

    // when
    let valid = validate(example);

    // then
    o(valid).equals(false);
    o(
      validate.errors.some(
        (error) => error.instancePath === '' && error.message === "must have required property 'linz:geospatial_type'",
      ),
    ).equals(true)(JSON.stringify(validate.errors));
  });

  o("Example with no values in 'linz:geospatial_type' property should fail validation", async () => {
    // given
    const example = JSON.parse(await fs.readFile(examplePath));
    example['linz:geospatial_type'] = [];

    // when
    let valid = validate(example);

    // then
    o(valid).equals(false);
    o(
      validate.errors.some(
        (error) =>
          error.instancePath === '/linz:geospatial_type' && error.message === 'must NOT have fewer than 1 items',
      ),
    ).equals(true)(JSON.stringify(validate.errors));
  });

  o("Asset with no 'created' property should fail validation", async () => {
    // given
    const example = JSON.parse(await fs.readFile(examplePath));
    delete example['assets']['example']['created'];

    // when
    let valid = validate(example);

    // then
    o(valid).equals(false);
    o(
      validate.errors.some(
        (error) =>
          error.instancePath === '/assets/example' && error.message === "must have required property 'created'",
      ),
    ).equals(true)(JSON.stringify(validate.errors));
  });

  o("Asset with no 'updated' property should fail validation", async () => {
    // given
    const example = JSON.parse(await fs.readFile(examplePath));
    delete example['assets']['example']['updated'];

    // when
    let valid = validate(example);

    // then
    o(valid).equals(false);
    o(
      validate.errors.some(
        (error) =>
          error.instancePath === '/assets/example' && error.message === "must have required property 'updated'",
      ),
    ).equals(true)(JSON.stringify(validate.errors));
  });

  o("Example without the mandatory 'linz:history' field should fail validation", async () => {
    // given
    const example = JSON.parse(await fs.readFile(examplePath));
    delete example['linz:history'];

    // when
    let valid = validate(example);

    // then
    o(valid).equals(false);
    o(
      validate.errors.some(
        (error) => error.instancePath === '' && error.message === "must have required property 'linz:history'",
      ),
    ).equals(true)(JSON.stringify(validate.errors));
  });

  o("Example without 'linz:lifecycle' property should fail validation", async () => {
    // given
    const example = JSON.parse(await fs.readFile(examplePath));
    delete example['linz:lifecycle'];

    // when
    let valid = validate(example);

    // then
    o(valid).equals(false);
    o(
      validate.errors.some(
        (error) => error.instancePath === '' && error.message === "must have required property 'linz:lifecycle'",
      ),
    ).equals(true)(JSON.stringify(validate.errors));
  });

  o("Example without 'linz:providers' property should fail validation", async () => {
    // given
    const example = JSON.parse(await fs.readFile(examplePath));
    delete example['linz:providers'];

    // when
    let valid = validate(example);

    // then
    o(valid).equals(false);
    o(
      validate.errors.some(
        (error) => error.instancePath === '' && error.message === "must have required property 'linz:providers'",
      ),
    ).equals(true)(JSON.stringify(validate.errors));
  });

  o("Example without 'linz:security_classification' property should fail validation", async () => {
    // given
    const example = JSON.parse(await fs.readFile(examplePath));
    delete example['linz:security_classification'];

    // when
    let valid = validate(example);

    // then
    o(valid).equals(false);
    o(
      validate.errors.some(
        (error) =>
          error.instancePath === '' && error.message === "must have required property 'linz:security_classification'",
      ),
    ).equals(true)(JSON.stringify(validate.errors));
  });

  o("Example without 'linz:providers' 'name' property should fail validation", async () => {
    // given
    const example = JSON.parse(await fs.readFile(examplePath));
    delete example['linz:providers'][0].name;

    // when
    let valid = validate(example);

    // then
    o(valid).equals(false);
    o(
      validate.errors.some(
        (error) => error.instancePath === '/linz:providers/0' && error.message === "must have required property 'name'",
      ),
    ).equals(true)(JSON.stringify(validate.errors));
  });

  o("Example without 'providers' property should fail validation", async () => {
    // given
    const example = JSON.parse(await fs.readFile(examplePath));
    delete example.providers;

    // when
    let valid = validate(example);

    // then
    o(valid).equals(false);
    o(validate.errors.some((error) => error.message === "must have required property 'providers'")).equals(true)(
      JSON.stringify(validate.errors),
    );
  });

  o('Collection without required provider roles should fail validation', async () => {
    // given
    for (const role of ['producer', 'licensor']) {
      const example = JSON.parse(await fs.readFile(examplePath));
      example.providers = example.providers.filter((provider) => !role in provider.roles);

      // when
      let valid = validate(example);

      // then
      o(valid).equals(false);
      o(
        validate.errors.some(
          (error) => error.instancePath === '/providers' && error.message === 'must contain at least 1 valid item(s)',
        ),
      ).equals(true)(JSON.stringify(validate.errors));
    }
  });

  o('Example without required linz:provider roles should fail validation', async () => {
    // given
    for (const role of ['manager', 'custodian']) {
      const example = JSON.parse(await fs.readFile(examplePath));
      example['linz:providers'] = example['linz:providers'].filter((provider) => !role in provider.roles);

      // when
      let valid = validate(example);

      // then
      o(valid).equals(false);
      o(
        validate.errors.some(
          (error) =>
            error.instancePath === '/linz:providers' && error.message === 'must contain at least 1 valid item(s)',
        ),
      ).equals(true)(JSON.stringify(validate.errors));
    }
  });

  o("Example without 'title' property should fail validation", async () => {
    // given
    const example = JSON.parse(await fs.readFile(examplePath));
    delete example.title;

    // when
    let valid = validate(example);

    // then
    o(valid).equals(false);
    o(
      validate.errors.some(
        (error) => error.instancePath === '' && error.message === "must have required property 'title'",
      ),
    ).equals(true)(JSON.stringify(validate.errors));
  });

  o("Example without 'version' property should fail validation", async () => {
    // given
    const example = JSON.parse(await fs.readFile(examplePath));
    delete example.version;

    // when
    let valid = validate(example);

    // then
    o(valid).equals(false);
    o(validate.errors.some((error) => error.message === "must have required property 'version'")).equals(true)(
      JSON.stringify(validate.errors),
    );
  });
});
