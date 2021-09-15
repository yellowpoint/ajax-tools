import React, { Component } from 'react';
import { Switch, InputNumber } from 'antd';
import ReactJson from 'react-json-view';

import './Replacer.less';

export default class Replacer extends Component {
  constructor(props) {
    super();
    this.state = {
      showJSONEditor: false,
      txt: props.defaultValue,
      src: null,
      delayTime: props.delayTime
    }
    try {
      let src = JSON.parse(props.defaultValue);
      if (src && typeof src === 'object') {
        this.state.src = src;
      }
    } catch (e) {

    }
  }


  componentDidUpdate(prevProps, { showJSONEditor }) {
    if (showJSONEditor !== this.state.showJSONEditor) {
      this.props.updateAddBtnTop();
    }
  }

  handleOverrideTxtChange = (txt) => {
    let src;
    try {
      src = JSON.parse(txt);
      if (!(src && typeof src === 'object')) {
        src = null;
      }
    } catch (e) {

    }
    this.setState({ txt, src });

    window.setting.ajaxInterceptor_rules[this.props.index].overrideTxt = txt;
    this.props.set('ajaxInterceptor_rules', window.setting.ajaxInterceptor_rules);
  }

  handleJSONEditorChange = ({ updated_src: src }) => {
    let txt = JSON.stringify(src);
    this.setState({ txt, src });

    window.setting.ajaxInterceptor_rules[this.props.index].overrideTxt = txt;
    this.props.set('ajaxInterceptor_rules', window.setting.ajaxInterceptor_rules);
  }

  handleEditorSwitch = showJSONEditor => {
    this.setState({ showJSONEditor });
  }

  handleDelayTime = delayTime => {
    console.log('delayTime', delayTime)
    this.setState({ delayTime });
    window.setting.ajaxInterceptor_rules[this.props.index].delayTime = delayTime;
    this.props.set('ajaxInterceptor_rules', window.setting.ajaxInterceptor_rules);
  }

  render() {

    return (
      <>
        延时ms数： <InputNumber
          placeholder="0"
          value={this.state.delayTime}
          onBlur={e => this.handleDelayTime(e.target.value)} />
          返回http状态码：<InputNumber></InputNumber>
        <div className="replace-with">
          替换内容:
        </div>
        <br />
        <textarea
          className="overrideTxt"
          // placeholder="replace with"
          style={{ resize: 'none' }}
          value={this.state.txt}
          onChange={e => this.handleOverrideTxtChange(e.target.value)}
        />
        <Switch style={{ marginTop: '6px' }} onChange={this.handleEditorSwitch} checkedChildren="JSON格式化" unCheckedChildren="JSON格式化" size="small" />
        {this.state.showJSONEditor && (
          this.state.src ?
            <div className="JSONEditor">
              <ReactJson
                name={false}
                collapsed
                collapseStringsAfterLength={12}
                src={this.state.src}
                onEdit={this.handleJSONEditorChange}
                onAdd={this.handleJSONEditorChange}
                onDelete={this.handleJSONEditorChange}
                displayDataTypes={false}
              />
            </div> : <div className="JSONEditor Invalid">Invalid JSON</div>
        )}
      </br>
    );
  }
}