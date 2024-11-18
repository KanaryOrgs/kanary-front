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
    color: props.centerColor || "#45828E",
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
    color: props.centerColor || "#45828E",
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
    minHeight: "150px", // 최소 높이 설정 (필요에 따라 조정)
    backgroundColor: "#3D4657",
    display: "inline-block",
    position: "relative",
    borderRadius: "4px",
    margin: "15px 15px 0 0",
    padding: "10px", // 내용과 여백을 위한 패딩 추가
    boxSizing: "border-box", // 패딩이 높이에 포함되도록 설정
  },
};

export default styles;
