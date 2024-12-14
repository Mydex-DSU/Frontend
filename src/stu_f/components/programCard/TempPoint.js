import React from "react";
import "./TempPoint.css";

function TempPoint({ points }) {
  return (
    <div className="temp-point">
      <img src="/Vector.png" />
      <span>{points}</span> {/* 하트 내부에 숫자 표시 */}
    </div>
  );
}

export default TempPoint;
