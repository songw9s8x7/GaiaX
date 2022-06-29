import GXTemplateEngine from './gaiax/GXTemplateEngine';

export { default as GXTemplateComponent } from './component/GXTemplateComponent';
export { default as GXTemplateEngine } from './gaiax/GXTemplateEngine';
export { IGXDataSource, GXTemplateData, GXMeasureSize, GXTemplateItem, GXTemplateInfo } from './gaiax/GXTemplateEngine';
export const GXEngineInstance = new GXTemplateEngine()

