export const styles = {
  // Square1 스타일
  square1Container: {
    width: "215px",
    height: "120px",
    backgroundColor: "#3D4657",
    display: "inline-block",
    position: "relative",
    borderRadius: "4px",
    margin: "15px 15px 0 0",
  },
  progressBarStyle: {
    position: "absolute",
    bottom: "15px",
    left: "10px",
    right: "10px",
    width: "195px",
    height: "15px",
    borderRadius: "4px 4px 0 0",
  },
  progressBarStyle2: {
    position: "absolute",
    bottom: "10px",
    left: "10px",
    right: "10px",
    width: "195px",
    height: "5px",
    borderRadius: "0 0 4px 4px",
    border: "1px solid #D8DADD",
  },
  progressBarBorder: {
    position: "absolute",
    bottom: "15px",
    left: "10px",
    right: "10px",
    width: "195px",
    height: "15px",
    borderRadius: "4px 4px 0 0",
    border: "1px solid #D8DADD",
  },
  getProgressFillStyle: (props) => ({
    height: "100%",
    width: `${props.progress}%`,
    backgroundImage:
      "linear-gradient(to right, #00C5A0 0%, #00C5A0 50%, #FF0016 100%)",
  }),
  getTopLeftTextStyle: (props) => ({
    position: "absolute",
    top: "10px",
    left: "10px",
    color: props.topLeftColor || "#FFFFFF",
    fontSize: props.topLeftFontSize || "13px",
  }),
  getCenterTextStyle: (props) => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: props.centerColor || "#BDD6DB",
    fontSize: props.centerFontSize || "18px",
    fontWeight: props.topLeftFontWeight || "bold",
  }),
  getCenterLeftTextStyle: (props) => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    overflow: "hidden",
    wordWrap: "break-word", // 자동 줄바꿈
    whiteSpace: "normal", // 여러 줄 텍스트 허용
    maxWidth: "calc(100% - 20px)",
    color: props.centerColor || "#BDD6DB",
    fontSize: props.centerFontSize || "18px",
    fontWeight: props.topLeftFontWeight || "bold",
  }),
  // Square1_5 스타일
  square1_5Container: {
    width: "215px",
    height: "100px",
    backgroundColor: "#3D4657",
    display: "inline-block",
    position: "relative",
    borderRadius: "4px",
    margin: "15px 15px 0 0",
  },

  // Square2 스타일
  square2Container: {
    width: "100px",
    height: "100px",
    backgroundColor: "#3D4657",
    display: "inline-block",
    position: "relative",
    borderRadius: "4px",
    margin: "15px 15px 0 0",
  },

  // Square3 스타일
  square3Container: {
    width: "675px",
    height: "200px",
    backgroundColor: "#3D4657",
    display: "inline-block",
    position: "relative",
    borderRadius: "4px",
    margin: "15px 15px 0 0",
  },

  // Square4 스타일
  square4Container: {
    width: "675px",
    minHeight: "150px", // 최소 높이
    maxWidth: "100%", // 최대 너비 제한
    backgroundColor: "#3D4657",
    display: "inline-block",
    position: "relative",
    borderRadius: "4px",
    margin: "15px 15px 0 0",
    padding: "10px", // 내부 여백
    boxSizing: "border-box", // 패딩 포함
    overflow: "auto", // 내용이 넘치지 않게 설정
    whiteSpace: "pre-wrap", // 줄바꿈 유지
    wordWrap: "break-word", // 단어를 강제로 줄바꿈
    lineHeight: "1.5", // 읽기 편한 줄 간격
  },
};

export default styles;
