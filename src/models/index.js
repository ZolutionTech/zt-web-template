// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { CodeItem, LanguageItem } = initSchema(schema);

export {
  CodeItem,
  LanguageItem
};