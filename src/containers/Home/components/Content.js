import React, { Component } from 'react';
import planeImg from 'static/images/b17.png';
import Bullet from './Bullet';

import './Content.less';

const stageConfig = {
  width: 500,
  height: 500,
  bulletSpeedBase: 0.7, // 子彈基礎速度，要是太快就很難閃了
  bulletSpeedRandom: 0.5, // 子彈隨機加速
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
    Object.keys(this.keyPressed).map(key => (keyCase[key] && keyCase[key]()));
    this.setState(newPosition);
  }

  createBullet = () => {
    const randomRangeX = Math.floor(Math.random() * stageConfig.width);
    const randomRangeY = Math.floor(Math.random() * stageConfig.height);
    const randomSpeed = stageConfig.bulletSpeedBase + (Math.random() * stageConfig.bulletSpeedRandom);
    const preparedBullet = {
      0: { x: 1, y: randomRangeY },
      1: { x: stageConfig.width, y: randomRangeY },
      2: { x: randomRangeX, y: 1 },
      3: { x: randomRangeX, y: stageConfig.height },
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
      key: randomSpeed,
      boom: false,
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
        bulletData.x < stageConfig.width &&
        bulletData.y > 0 &&
        bulletData.y < stageConfig.height
      ));
    if (newBullets.length < this.state.time) {
      newBullets.push(this.createBullet());
    }
    const { planeCenterX, planeCenterY } = this.state;
    const hasCollision = newBullets.find(bulletData => (
      Math.sqrt(
        ((bulletData.x - planeCenterX) ** 2) +
        ((bulletData.y - planeCenterY) ** 2)
      ) < 15
    ));
    if (hasCollision) {
      alert('game over');
      hasCollision.boom = true;
      this.setState({ gameStatus: false, bullets: newBullets });
      window.document.removeEventListener('keydown', this.registKeyDown);
      window.document.removeEventListener('keyup', this.registKeyUp);
      this.keyPressed = {};
    } else {
      this.setState({ bullets: newBullets });
    }
  }

  registKeyDown = (e) => {
    this.keyPressed[e.keyCode] = true;
  }

  registKeyUp = (e) => {
    delete this.keyPressed[e.keyCode];
  }

  updateTime = () => {
    const time = Math.floor((new Date() - this.startTime) / 1000);
    this.setState({ time });
  }

  gameLoop = () => {
    this.movePlane();
    this.updateBullet();
    this.updateTime();
    if (this.state.gameStatus) {
      window.requestAnimationFrame(this.gameLoop);
    }
  }

  toggleGame = () => {
    if (!this.state.gameStatus) {
      this.setState({
        time: 0,
        planeCenterX: 250,
        planeCenterY: 250,
        gameStatus: true,
        bullets: [],
      }, this.gameLoop);
      this.startTime = new Date();
      window.document.addEventListener('keydown', this.registKeyDown, false);
      window.document.addEventListener('keyup', this.registKeyUp, false);
    }
  }

  render() {
    const { time, planeCenterX, planeCenterY, gameStatus } = this.state;
    const planeStyle = {
      transform: `translate(${planeCenterX - 20}px, ${planeCenterY - 20}px)`
    };
    return (
      <div className="content">
        <button id="gameStartButton" disabled={gameStatus} onClick={this.toggleGame}>開始遊戲</button>
        <div id="stage">
          {
            this.state.bullets.map(
              bulletData =>
                <Bullet key={bulletData.key} x={bulletData.x} y={bulletData.y} boom={bulletData.boom} />
            )
          }
          <img id="master" src={planeImg} alt="airplane" style={planeStyle} />\
          <div id="gameTime">{time}</div>
        </div>
      </div>
    );
  }
}
