import { Shield, Zap } from "lucide-react";
import React from "react";

export function ChatHeader() {
  const isOnline = true;

  return (
    <header className="header-compact glass neon-border">
      <div className="flex items-center justify-between w-full px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="logo flex items-center gap-2">
            <Shield size={24} className="logo-icon" />
            <div>
              <div className="neon-text text-lg font-semibold">cyberBuddy</div>
              <div className="meta text-xs">Omnitrix · Ultimate ChatGPT</div>
            </div>
          </div>
        </div>
        <div className="status-indicator">
          <span className={`status-badge flex items-center gap-2 px-3 py-2 rounded-full ${isOnline ? "online" : "offline"}`}>
            <Zap size={16} />
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>
    </header>
  );
}