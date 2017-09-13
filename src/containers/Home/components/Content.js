import React, { Component } from 'react';
import planeImg from 'static/images/b17.png';
import Bullet from './Bullet';

import './Content.less';

const keyMap = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
};

export default class Content extends Component {
  state = {
    time: 0,
    planeX: 250,
    planeY: 250,
  }
  onKeyDown = (e) => {
    const keyCase = {
      37: () => { this.setState({ planeX: this.state.planeX - 1 }); },
      38: () => { this.setState({ planeY: this.state.planeY - 1 }); },
      39: () => { this.setState({ planeX: this.state.planeX + 1 }); },
      40: () => { this.setState({ planeY: this.state.planeY + 1 }); },
    };
    keyCase[e.keyCode]();
  }
  render() {
    const { time, planeX, planeY } = this.state;
    const planeStyle = {
      top: planeY,
      left: planeX,
    };
    return (
      <div className="content">
        <div id="stage" tabIndex="0" onKeyDown={this.onKeyDown}>
          <Bullet x={100} y={100} />
          <div id="gameTime">now time: {time}</div>
          <img id="master" src={planeImg} alt="airplane" style={planeStyle} />
        </div>
      </div>
    );
  }
}
