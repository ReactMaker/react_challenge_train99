import React, { Component } from 'react';
import planeImg from 'static/images/b17.png';
import Bullet from './Bullet';

import './Content.less';

export default class Content extends Component {
  state = {
    time: 0,
    planeX: 250,
    planeY: 250,
    gameStatus: false,
  }
  keyPressed = {}

  movePlane = () => {
    const keyCase = {
      37: () => { this.setState({ planeX: this.state.planeX - 1 }); },
      38: () => { this.setState({ planeY: this.state.planeY - 1 }); },
      39: () => { this.setState({ planeX: this.state.planeX + 1 }); },
      40: () => { this.setState({ planeY: this.state.planeY + 1 }); },
    };
    Object.keys(this.keyPressed).map(key => keyCase[key]());
  }

  registKeyDown = (e) => {
    this.keyPressed[e.keyCode] = true;
  }

  registKeyUp = (e) => {
    delete this.keyPressed[e.keyCode];
  }

  gameLoop = () => {
    this.movePlane();
    if (this.state.gameStatus) {
      window.requestAnimationFrame(this.gameLoop);
    }
  }

  toggleGame = () => {
    if (!this.state.gameStatus) {
      this.setState({ gameStatus: true }, this.gameLoop);
      window.document.addEventListener('keydown', this.registKeyDown, false);
      window.document.addEventListener('keyup', this.registKeyUp, false);
    } else {
      this.setState({ gameStatus: false });
      window.document.removeEventListener('keydown', this.registKeyDown);
      window.document.removeEventListener('keyup', this.registKeyUp);
    }

  }

  render() {
    const { time, planeX, planeY } = this.state;
    const planeStyle = {
      top: planeY,
      left: planeX,
    };
    return (
      <div className="content">
        <button onClick={this.toggleGame}> toggle game {String(this.state.gameStatus)}</button>
        <div id="stage">
          <Bullet x={100} y={100} />
          <div id="gameTime">now time: {time}</div>
          <img id="master" src={planeImg} alt="airplane" style={planeStyle} />
        </div>
      </div>
    );
  }
}
