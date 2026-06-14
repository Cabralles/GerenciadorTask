from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    """Base user schema"""
    username: str
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    """User creation schema"""
    password: str


class UserUpdate(BaseModel):
    """User update schema"""
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None


class UserResponse(UserBase):
    """User response schema"""
    id: int
    is_admin: bool
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class TaskBase(BaseModel):
    """Base task schema"""
    title: str
    description: Optional[str] = None
    status: str = "pending"
    priority: str = "medium"
    due_date: datetime
    assigned_to: Optional[int] = None


class TaskCreate(TaskBase):
    """Task creation schema"""
    order_number: str


class TaskUpdate(BaseModel):
    """Task update schema"""
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[datetime] = None
    assigned_to: Optional[int] = None


class TaskResponse(TaskBase):
    """Task response schema"""
    id: int
    order_number: str
    created_by_id: int
    created_at: datetime
    updated_at: datetime
    assignee: Optional[UserResponse] = None
    
    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """Token response schema"""
    access_token: str
    token_type: str


class LoginRequest(BaseModel):
    """Login request schema"""
    username: str
    password: str


class NotificationResponse(BaseModel):
    """Notification response schema"""
    id: int
    user_id: int
    task_id: Optional[int]
    title: str
    message: Optional[str]
    is_read: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
