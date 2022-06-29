import { Component } from 'react';
import { GXEngineInstance, GXTemplateProps } from "./GXTemplateEngine";

export class GXTemplate extends Component<GXTemplateProps, GXTemplateProps> {
  render() {
    const { templateItem } = this.props
    return GXEngineInstance.createView(templateItem);
  }
}
