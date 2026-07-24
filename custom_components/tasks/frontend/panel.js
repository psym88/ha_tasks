export const VERSION = "20260725.1";
import { TasksPanel } from "./controller.js";

TasksPanel.version = VERSION;
if(!customElements.get("tasks-panel"))customElements.define("tasks-panel",TasksPanel);
