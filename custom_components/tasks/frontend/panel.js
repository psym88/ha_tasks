export const VERSION = "20260724.5";
import { TasksPanel } from "./main.js";

TasksPanel.version = VERSION;
if(!customElements.get("tasks-panel"))customElements.define("tasks-panel",TasksPanel);
