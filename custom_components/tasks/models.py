"""Typed runtime container for Tasks."""

from dataclasses import dataclass

from .store import TasksStore


@dataclass(slots=True)
class TasksData:
    """Runtime data stored on the config entry."""

    store: TasksStore

