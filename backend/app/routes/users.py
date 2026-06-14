from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.security import verify_token
from app.models import User, Notification
from app.schemas import UserResponse, NotificationResponse


router = APIRouter(prefix="/api/users", tags=["users"])


def get_current_user(token: str = None, db: Session = Depends(get_db)) -> User:
    """Get current authenticated user"""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    user_id = verify_token(token)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user


@router.get("", response_model=List[UserResponse])
def get_all_users(
    token: str = None,
    db: Session = Depends(get_db),
):
    """Get all users (admin only)"""
    
    current_user = get_current_user(token, db)
    
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    users = db.query(User).all()
    return users


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    token: str = None,
    db: Session = Depends(get_db),
):
    """Get a specific user by ID"""
    
    current_user = get_current_user(token, db)
    
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user


@router.get("/notifications/me", response_model=List[NotificationResponse])
def get_my_notifications(
    token: str = None,
    db: Session = Depends(get_db),
):
    """Get current user's notifications"""
    
    current_user = get_current_user(token, db)
    
    notifications = db.query(Notification).filter(
        Notification.user_id == current_user.id
    ).order_by(Notification.created_at.desc()).all()
    
    return notifications


@router.put("/notifications/{notification_id}/read")
def mark_notification_read(
    notification_id: int,
    token: str = None,
    db: Session = Depends(get_db),
):
    """Mark a notification as read"""
    
    current_user = get_current_user(token, db)
    
    notification = db.query(Notification).filter(
        Notification.id == notification_id
    ).first()
    
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )
    
    if notification.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this notification"
        )
    
    notification.is_read = True
    db.commit()
    db.refresh(notification)
    
    return notification
