import React, { Component } from 'react';
import Tip from 'grommet/components/Tip';
import Button from 'grommet/components/Button';
import Box from 'grommet/components/Box';
import Close from 'grommet/components/icons/base/Close';

class MyTips extends React.Component{

  childToggleTip(e) {
    e.stopPropagation();
    this.props.toggle1();
    if(this.props.toggle2){
      this.props.toggle2()
    }
  }

  stopTip(e) {
    e.stopPropagation();
    this.props.toggle1();
  }

  render(){

    let promptStyle = {color: "#3b3b3b"};
    return(
      <Tip target={this.props.target} onClose={this.childToggleTip.bind(this)} colorIndex={"accent-2"} align="center">
            <Box align={"end"}><Button icon={<Close size="xsmall"/>} onClick={this.stopTip.bind(this)} /></Box>
            {this.props.content}
            <b style={promptStyle}>{this.props.prompt}</b>
      </Tip>
    )
  }
}

MyTips.propTypes = {
  target:             React.PropTypes.string.isRequired,
  content:            React.PropTypes.string.isRequired,
  prompt:             React.PropTypes.string.isRequired,
  toggle1:            React.PropTypes.func.isRequired,
  toggle2:            React.PropTypes.func
};

export default MyTips;
