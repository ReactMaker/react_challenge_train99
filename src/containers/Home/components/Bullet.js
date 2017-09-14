import React from 'react';
import PropTypes from 'prop-types';

export default class Bullet extends React.Component {
  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    boom: PropTypes.bool,
  }
  render() {
    const { x, y, boom } = this.props;
    let bulletStyle = {
      transform: `translate(${x - 5}px, ${y - 5}px)`
    };
    if (boom) {
      bulletStyle = {
        transform: `translate(${x - 15}px, ${y - 15}px)`
      };
    }
    return (
      <div className={`bullet ${boom ? 'boom' : ''}`} style={bulletStyle} />
    );
  }
}
