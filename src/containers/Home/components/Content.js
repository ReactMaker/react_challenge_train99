import React, { Component } from 'react';
import planeImg from 'static/images/b17.png';
import Bullet from './Bullet';

import './Content.less';

const planeConfig = {
  width: 40,
  height: 40,
};
const stageConfig = {
  width: 500,
  height: 500,
};

export default class Content extends Component {
  state = {
    time: 0,
    planeCenterX: 250,
    planeCenterY: 250,
    gameStatus: false,
    bullets: [],
  }
  keyPressed = {}
  startTime = 0;

  movePlane = () => {
    const { planeCenterX, planeCenterY } = this.state;
    const newPosition = {
      planeCenterX,
      planeCenterY,
    };
    const keyCase = {
      37: () => { if (planeCenterX > 0) { newPosition.planeCenterX -= 1; } },
      38: () => { if (planeCenterY > 0) { newPosition.planeCenterY -= 1; } },
      39: () => { if (planeCenterX < stageConfig.width) { newPosition.planeCenterX += 1; } },
      40: () => { if (planeCenterY < stageConfig.height) { newPosition.planeCenterY += 1; } },
    };
    Object.keys(this.keyPressed).map(key => keyCase[key]());
    this.setState(newPosition);
  }

  createBullet = () => {
    const randomRange = Math.floor(Math.random() * 498) + 1;
    const randomSpeed = 1 + (Math.random() * 1);
    const preparedBullet = {
      0: { x: 1, y: randomRange },
      1: { x: 499, y: randomRange },
      2: { x: randomRange, y: 1 },
      3: { x: randomRange, y: 499 },
    };
    const side = Math.floor(Math.random() * 4);
    const newBullet = preparedBullet[side];
    const diffX = this.state.planeCenterX - newBullet.x;
    const diffY = this.state.planeCenterY - newBullet.y;
    const powx = diffX ** 2;
    const powy = diffY ** 2;
    const vroot = Math.sqrt(powx + powy);
    const vx = randomSpeed * (diffX / vroot);
    const vy = randomSpeed * (diffY / vroot);
    return {
      ...newBullet,
      vx,
      vy,
      key: randomSpeed
    };
  }

  updateBullet = () => {
    const newBullets = this.state.bullets
      .map(bulletData => ({
        ...bulletData,
        x: bulletData.x + bulletData.vx,
        y: bulletData.y + bulletData.vy,
      }))
      .filter(bulletData => (
        bulletData.x > 0 &&
        bulletData.x < 500 &&
        bulletData.y > 0 &&
        bulletData.y < 500
      ));
    if (newBullets.length < 30) {
      newBullets.push(this.createBullet());
    }
    this.setState({ bullets: newBullets });
  }

  registKeyDown = (e) => {
    this.keyPressed[e.keyCode] = true;
  }

  registKeyUp = (e) => {
    delete this.keyPressed[e.keyCode];
  }

  gameLoop = () => {
    this.movePlane();
    this.updateBullet();
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
    const { time, planeCenterX, planeCenterY } = this.state;
    const planeStyle = {
      left: planeCenterX - (planeConfig.width / 2),
      top: planeCenterY - (planeConfig.height / 2),
    };
    return (
      <div className="content">
        <button onClick={this.toggleGame}> toggle game {String(this.state.gameStatus)}</button>
        <div id="stage">
          {
            this.state.bullets.map(
              bulletData =>
                <Bullet key={bulletData.key} x={bulletData.x} y={bulletData.y} />
            )
          }
          <div id="gameTime">now time: {time}</div>
          <img id="master" src={planeImg} alt="airplane" style={planeStyle} />
        </div>
      </div>
    );
  }
}
