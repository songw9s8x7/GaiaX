export { default as GXTemplateComponent } from './component/GXTemplateComponent';
import { GXTemplateEngine } from './gaiax/GXTemplateEngine';

export { IGXDataSource, GXTemplateData, GXMeasureSize, GXTemplateEngine, GXTemplateItem, GXTemplateInfo } from './gaiax/GXTemplateEngine';
export const GXEngineInstance = new GXTemplateEngine()

