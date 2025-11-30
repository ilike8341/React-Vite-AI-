import "./outPutBox.css";
import { ScrollAnchor } from "./ScrollAnchor";

export function OutputBox({ stage, ifHistory, displayText }) {
  //如果是第一次，1、2阶段不渲染
  if (!ifHistory && (stage == 1 || stage == 2)) {
    return null;
  } else if (ifHistory && stage != 1) {
    //渲染用户输入时历史元素不需要滚动
    return (
      <div className="outPutBox">
        <div>{displayText}</div>
      </div>
    );
  }
  if (stage != 1 && stage != 6) {
    return (
      <ScrollAnchor trigger={stage == 3 || stage == 4} offsetBottom={0}>
        <div className="outPutBox">
          <div>{displayText}</div>
        </div>
      </ScrollAnchor>
    );
  }
}
