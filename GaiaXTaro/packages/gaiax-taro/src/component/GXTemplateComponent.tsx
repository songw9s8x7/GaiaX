import React from 'react';
import { GXEngineInstance } from '..';
import { GXTemplateComponentProps, GXTemplateComponentState } from '../../types/gx-template-component';

/**
 * 
 */
export default class GXTemplateComponent extends React.Component<GXTemplateComponentProps, GXTemplateComponentState> {
  render() {
    const { templateItem, measureSize, templateData } = this.props
    return GXEngineInstance.createView(templateItem, templateData, measureSize);
  }
}
