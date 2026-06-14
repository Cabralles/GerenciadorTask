from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.core.database import Base


class TaskStatus(str, enum.Enum):
    """Task status enumeration"""
    pending = "pending"
    in_progress = "in_progress"
    urgent = "urgent"
    completed = "completed"


class TaskPriority(str, enum.Enum):
    """Task priority enumeration"""
    low = "low"
    medium = "medium"
    high = "high"
    urgent = "urgent"


class User(Base):
    """User model"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    is_admin = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    tasks = relationship("Task", back_populates="assignee", foreign_keys="Task.assigned_to")
    created_tasks = relationship("Task", back_populates="created_by", foreign_keys="Task.created_by_id")
    
    def __repr__(self):
        return f"<User {self.username}>"


class Task(Base):
    """Task/OS model"""
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(Enum(TaskStatus), default=TaskStatus.pending, index=True)
    priority = Column(Enum(TaskPriority), default=TaskPriority.medium)
    due_date = Column(DateTime, nullable=False)
    
    assigned_to = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    assignee = relationship("User", back_populates="tasks", foreign_keys=[assigned_to])
    created_by = relationship("User", back_populates="created_tasks", foreign_keys=[created_by_id])
    
    def __repr__(self):
        return f"<Task {self.order_number}>"


class Notification(Base):
    """Notification model for important alerts"""
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    task_id = Column(Integer, ForeignKey("tasks.id"), nullable=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f"<Notification {self.title}>"
