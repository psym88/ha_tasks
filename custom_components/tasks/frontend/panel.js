export const VERSION = "20260724.8";
import { TasksPanel } from "./controller.js";

TasksPanel.version = VERSION;
if(!customElements.get("tasks-panel"))customElements.define("tasks-panel",TasksPanel);
