import React from 'react';
import PropTypes from 'prop-types';

export default class Bullet extends React.Component {
  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
  }
  render() {
    const bulletStyle = {
      top: this.props.x,
      left: this.props.y,
    };
    return (
      <div className="bullet" style={bulletStyle} />
    );
  }
}
