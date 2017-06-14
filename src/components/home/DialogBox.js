import React from 'react';
import Layer from 'grommet/components/Layer';
import Button from 'grommet/components/Button';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';


let DialogBox = ({ dialog, onYes, onNo }) => (
  <Layer align="center" closer="true">
    <Header>
      <Title>{dialog}</Title>
    </Header>
    <Header justify="between">
      <Button label="Yes" onClick={onYes} />
      <Button label="No" secondary={true} onClick={onNo} />
    </Header>
  </Layer>
);

DialogBox.propTypes = {
  dialog: React.PropTypes.string.isRequired,
  onYes:  React.PropTypes.func.isRequired,
  onNo:   React.PropTypes.func.isRequired
};

export default DialogBox;
