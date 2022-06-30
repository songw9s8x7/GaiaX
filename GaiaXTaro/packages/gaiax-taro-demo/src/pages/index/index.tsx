
import { View } from "@tarojs/components";
import { Component } from "react";
import { GXEngineInstance, GXTemplateComponent, IGXDataSource, GXTemplateItem, GXMeasureSize, GXTemplateData, GXTemplateInfo } from "@gaiax/taro";
import "./index.scss";
import { GXFastPreviewInstance, IGXFastPreviewListener } from "../../gaiax/GXFastPreview";


class GXFastPreviewDataSource implements IGXDataSource {

  private templates = new Map<string, any>();

  addData(templateId: string, template: any) {
    this.templates.set(templateId, template)
  }

  getData(templateId: string) {
    return this.templates.get(templateId);
  }

  getTemplateInfo(templateItem: GXTemplateItem): GXTemplateInfo {
    const templateData = this.templates.get(templateItem.templateId)
    let layer = templateData['index.json'];
    let css = templateData['index.css'];
    let data = templateData['index.databinding'];
    return GXTemplateInfo.create(layer, css, data)
  }
}

interface IParams {
  templateId: string;
}

const gxDataSource = new GXFastPreviewDataSource();

export default class Index extends Component<IParams> {

  state = {
    templateId: '',
  };

  componentWillMount() {

    const gxFastPreviewListener: IGXFastPreviewListener = {
      onUpdate: (templateId: string, template: any) => {
        gxDataSource.addData(templateId, template)
        this.setState({
          templateId: templateId
        });
      }
    }

    GXEngineInstance.registerDataSource(gxDataSource);
    GXFastPreviewInstance.startFastPreview();
    GXFastPreviewInstance.setListener(gxFastPreviewListener);
  }

  componentDidMount() { }

  componentWillUnmount() {
    GXFastPreviewInstance.stopFastPreview();
  }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    const { templateId } = this.state;
    if (templateId != '') {

      let templateItem = new GXTemplateItem();
      templateItem.templateBiz = '';
      templateItem.templateId = templateId;

      let templateData = new GXTemplateData();
      const template = gxDataSource.getData(templateId);
      if (template != undefined && template['index.mock'] != undefined) {
        templateData.templateData = template['index.mock'];
      } else {
        templateData.templateData = {};
      }

      const constraintSize = JSON.parse(template["index.json"])?.["package"]?.["constraint-size"]
      let measureSize = new GXMeasureSize();
      measureSize.templateWidth = constraintSize?.['width']
      measureSize.templateHeight = constraintSize?.['height']

      return (
        <View>
          <GXTemplateComponent templateData={templateData} templateItem={templateItem} measureSize={measureSize} />
        </View>
      );
    } else {
      return (
        <View></View>
      );
    }
  }
}