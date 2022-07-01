
import GXExpression from "./GXExpression";
import { GXJSONObject } from "./GXJson";

export default class GXDataBinding {
    static getExtend(extend?: GXJSONObject, gxTemplateData?: GXJSONObject): GXJSONObject {
        if (extend != null) {
            return GXExpression.desireData(extend, gxTemplateData) as GXJSONObject
        }
        return null;
    }

}