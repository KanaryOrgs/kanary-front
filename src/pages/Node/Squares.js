import React from "react";
import styles from "./SquareStyles";

// Square1 컴포넌트
export class Square1 extends React.Component {
  render() {
    return (
      <div style={styles.square1Container}>
        {/* 왼쪽 위에 텍스트 */}
        <div style={styles.getTopLeftTextStyle(this.props)}>
          {this.props.topLeftText}
        </div>
        {/* 가운데에 텍스트 */}
        <div style={styles.getCenterTextStyle(this.props)}>
          {this.props.children}
        </div>
        {/* 프로그레스 바 */}
        <div style={styles.progressBarStyle}>
          <div style={styles.getProgressFillStyle(this.props)}></div>
        </div>
        <div style={styles.progressBarBorder}></div>
        <div style={styles.progressBarStyle2}></div>
      </div>
    );
  }
}

// Square2 컴포넌트
export class Square2 extends React.Component {
  render() {
    return (
      <div style={styles.square2Container}>
        {/* 왼쪽 위에 텍스트 */}
        <div style={styles.getTopLeftTextStyle(this.props)}>
          {this.props.topLeftText}
        </div>
        {/* 가운데에 텍스트 */}
        <div style={styles.getCenterTextStyle(this.props)}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

// Square3 컴포넌트
export class Square3 extends React.Component {
  render() {
    return (
      <div style={styles.square3Container}>
        {/* 왼쪽 위에 텍스트 */}
        <div style={styles.getTopLeftTextStyle(this.props)}>
          {this.props.topLeftText}
        </div>
        {/* 가운데에 텍스트 */}
        <div style={styles.getCenterTextStyle(this.props)}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
