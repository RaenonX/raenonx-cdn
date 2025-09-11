import {existsSync, readFileSync} from 'fs';
import {join, resolve} from 'path';

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import {load} from 'js-yaml';

// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import schema from '../../config.schema.json';

// Load config file by order: config.example.yaml > config.yaml
export function loadAppConfig() {
  const cwd = process.cwd();
  const configPaths = [
    resolve(join(cwd, 'config.yaml')),
    resolve(join(cwd, 'config.example.yaml')),
  ];

  let configPath: string | undefined;
  for (const path of configPaths) {
    if (existsSync(path)) {
      configPath = path;
      break;
    }
  }
  if (!configPath) {
    throw new Error('No config file found.');
  }

  const fileContents = readFileSync(configPath, 'utf8');
  const config = load(fileContents);

  // Validate config against schema
  const ajv = new Ajv({allErrors: true, strict: true});
  addFormats(ajv);
  const validate = ajv.compile(schema);
  const valid = validate(config);
  if (!valid) {
    console.error('Config validation errors:', validate.errors);
    throw new Error('Config file does not match schema.');
  }

  console.info('Loaded config file:', configPath);
  return config;
}
