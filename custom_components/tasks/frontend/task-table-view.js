export const INITIAL_TASK_SORTING = {column:"due_ts",direction:"asc"};
export const DEFAULT_HIDDEN_TASK_COLUMNS = ["labels","notifications","recurrence","rhythm"];
export const TASK_TABLE_LOCAL_STORAGE_KEY = "tasks-table-state-v1";
export const TASK_TABLE_SESSION_STORAGE_KEY = "tasks-table-session-v1";

function storedValue(storage,key,fallback) {
  try {
    const value=storage?.getItem(key);
    return value===null||value===undefined?fallback:JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function loadTaskTableView(localStorage,sessionStorage) {
  const local=storedValue(localStorage,TASK_TABLE_LOCAL_STORAGE_KEY,{});
  const session=storedValue(sessionStorage,TASK_TABLE_SESSION_STORAGE_KEY,{});
  const filters=session.filters;
  return {
    search:String(session.search||""),
    filters:filters&&typeof filters==="object"&&!Array.isArray(filters)?filters:{},
    sorting:local.sorting||INITIAL_TASK_SORTING,
    grouping:local.grouping,
    collapsed:local.collapsed,
    hiddenColumns:Array.isArray(local.hiddenColumns)?local.hiddenColumns:[...DEFAULT_HIDDEN_TASK_COLUMNS],
  };
}

export function storeTaskTableView(localStorage,sessionStorage,view) {
  try {
    localStorage?.setItem(TASK_TABLE_LOCAL_STORAGE_KEY,JSON.stringify({
      sorting:view.sorting,
      grouping:view.grouping,
      collapsed:view.collapsed,
      hiddenColumns:view.hiddenColumns,
    }));
  } catch {
    // Safari private browsing and locked-down WebViews can reject storage.
  }
  try {
    sessionStorage?.setItem(TASK_TABLE_SESSION_STORAGE_KEY,JSON.stringify({
      search:view.search||"",
      filters:view.filters||{},
    }));
  } catch {
    // Safari private browsing and locked-down WebViews can reject storage.
  }
}
