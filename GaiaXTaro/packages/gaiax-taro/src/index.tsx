import GXTemplateEngine from './gaiax/GXTemplateEngine';

export { default as GXTemplateComponent } from './component/GXTemplateComponent';
export { default as GXTemplateEngine } from './gaiax/GXTemplateEngine';
export { GXTemplateData, GXMeasureSize, GXTemplateItem, GXTemplateInfo, IGXDataSource } from './gaiax/GXDefine';
export const GXEngineInstance = new GXTemplateEngine()