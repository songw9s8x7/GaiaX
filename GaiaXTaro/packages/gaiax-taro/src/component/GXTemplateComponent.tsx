import React from 'react';
import { GXEngineInstance } from '../gaiax';
import { GXTemplateItem, GXMeasureSize, GXTemplateData } from "../gaiax/GXTemplateEngine";

/**
 * 
 */
export interface GXTemplateComponentState {

}

/**
 * 
 */
export interface GXTemplateComponentProps {

  /**
   * 
   */
  templateItem: GXTemplateItem

  /**
   * 
   */
  measureSize: GXMeasureSize

  /**
   * 
   */
  templateData: GXTemplateData
}

/**
 * 
 */
export class GXTemplateComponent extends React.Component<GXTemplateComponentProps, GXTemplateComponentState> {
  render() {
    const { templateItem, measureSize, templateData } = this.props
    return GXEngineInstance.createView(templateItem, templateData, measureSize);
  }
}
