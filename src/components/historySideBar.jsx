// Sidebar.jsx
import "./historySideBar.css";

export function Sidebar({
  titles,
  activeIndex,
  onActiveIndex,
  onStageBack,
  onHistoryClear,
  onTitleClear,
  onGreetingReset,

  //回到阶段1，清除history，清除title
}) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>对话历史</h2>
        <button
          className="clearBtn"
          onClick={() => {
            onStageBack(1);
            onHistoryClear([]);
            onTitleClear([]);
            localStorage.removeItem("chatHistory");
            localStorage.removeItem("sidebarTitles");
            onGreetingReset(false);
          }}
        >
          清除
        </button>
      </div>
      <div className="history-list">
        {titles.map((title, index) => (
          <div
            key={index}
            className={`history-item ${index === activeIndex ? "active" : ""}`}
            onClick={() => {
              onActiveIndex(index);
              onStageBack(6);
            }}
            // 点击侧边栏时触发滚动
          >
            {title}
          </div>
        ))}
      </div>
      <div className="login"></div>
    </div>
  );
}
