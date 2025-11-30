import myLogo from "../assets/gear.svg";
import "./greeting.css";

export function Greeting({ stage }) {
  const wrapperClass =
    stage === 1
      ? "greetingWrapper greetingWrapper--fadeIn"
      : "greetingWrapper greetingWrapper--leaving";
  return (
    <>
      <div className={wrapperClass}>
        <div className="greetingWord">
          <h1>你好，用户</h1>
        </div>
        <div className="gearLogo">
          <img src={myLogo} className="myLogo" alt="my logo" />
        </div>
      </div>
    </>
  );
}
