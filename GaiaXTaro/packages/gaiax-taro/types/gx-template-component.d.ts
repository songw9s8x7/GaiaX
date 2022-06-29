
import { ComponentClass } from 'react'
import { GXTemplateItem, GXMeasureSize, GXTemplateData } from "../src/gaiax/GXTemplateEngine";

export interface GXTemplateComponentState {

}

export interface GXTemplateComponentProps {

    templateItem: GXTemplateItem

    measureSize: GXMeasureSize

    templateData: GXTemplateData
}

declare const GXTemplateComponent: ComponentClass<GXTemplateComponentProps>

export default GXTemplateComponent
