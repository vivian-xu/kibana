/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import { identity, pickBy } from 'lodash';

export type KibanaConfig = ReturnType<typeof readKibanaConfig>;

export const readKibanaConfig = () => {
  const kibanaConfigDir = path.join(__filename, '../../../../../../../config');
  const kibanaDevConfig = path.join(kibanaConfigDir, 'kibana.dev.yml');
  const kibanaConfig = path.join(kibanaConfigDir, 'kibana.yml');

  const loadedKibanaConfig = (yaml.load(
    fs.readFileSync(fs.existsSync(kibanaDevConfig) ? kibanaDevConfig : kibanaConfig, 'utf8')
  ) || {}) as {};

  const cliEsCredentials = pickBy(
    {
      'elasticsearch.username': process.env.ELASTICSEARCH_USERNAME,
      'elasticsearch.password': process.env.ELASTICSEARCH_PASSWORD,
      'elasticsearch.hosts': process.env.ELASTICSEARCH_HOST,
    },
    identity
  ) as {
    'elasticsearch.username'?: string;
    'elasticsearch.password'?: string;
    'elasticsearch.hosts'?: string;
  };

  return {
    'xpack.apm.indices.transaction': 'traces-apm*,apm-*,traces-*.otel-*',
    'xpack.apm.indices.metric': 'metrics-apm*,apm-*,metrics-*.otel-*',
    'xpack.apm.indices.error': 'logs-apm*,apm-*,logs-*.otel-*',
    'xpack.apm.indices.span': 'traces-apm*,apm-*,traces-*.otel-*',
    'xpack.apm.indices.onboarding': 'apm-*',
    'elasticsearch.hosts': 'http://localhost:9200',
    ...loadedKibanaConfig,
    ...cliEsCredentials,
  };
};
