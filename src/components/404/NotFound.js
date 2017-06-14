import React from 'react';
import Section from 'grommet/components/Section';
import Paragraph from 'grommet/components/Paragraph';

class NotFound extends React.Component {
  render() {

    const fontSize="large";

    return (
      <Section pad="small" full="vertical" flex={true}>
        <h1>404 - Not Found</h1>
        <Paragraph size={fontSize}>
          Something went wrong with processing your request. The resource you are looking for cannot be found.
        </Paragraph>
      </Section>
    );
  }
}

export default NotFound;
