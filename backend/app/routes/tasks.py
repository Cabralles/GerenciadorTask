from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.security import verify_token
from app.models import Task, User
from app.schemas import TaskCreate, TaskUpdate, TaskResponse


router = APIRouter(prefix="/api/tasks", tags=["tasks"])


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


@router.get("", response_model=List[TaskResponse])
def get_tasks(
    status_filter: str = Query(None, alias="status"),
    priority: str = Query(None),
    assigned_to: int = Query(None),
    token: str = None,
    db: Session = Depends(get_db),
):
    """Get all tasks with optional filters"""
    
    current_user = get_current_user(token, db)
    
    query = db.query(Task)
    
    if status_filter:
        query = query.filter(Task.status == status_filter)
    
    if priority:
        query = query.filter(Task.priority == priority)
    
    if assigned_to:
        query = query.filter(Task.assigned_to == assigned_to)
    
    tasks = query.order_by(Task.created_at.desc()).all()
    return tasks


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: int,
    token: str = None,
    db: Session = Depends(get_db),
):
    """Get a single task by ID"""
    
    current_user = get_current_user(token, db)
    
    task = db.query(Task).filter(Task.id == task_id).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    return task


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    task: TaskCreate,
    token: str = None,
    db: Session = Depends(get_db),
):
    """Create a new task"""
    
    current_user = get_current_user(token, db)
    
    # Check if order_number already exists
    existing_task = db.query(Task).filter(Task.order_number == task.order_number).first()
    if existing_task:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Task with this order number already exists"
        )
    
    db_task = Task(
        order_number=task.order_number,
        title=task.title,
        description=task.description,
        status=task.status,
        priority=task.priority,
        due_date=task.due_date,
        assigned_to=task.assigned_to,
        created_by_id=current_user.id,
    )
    
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    
    return db_task


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    task_update: TaskUpdate,
    token: str = None,
    db: Session = Depends(get_db),
):
    """Update a task"""
    
    current_user = get_current_user(token, db)
    
    task = db.query(Task).filter(Task.id == task_id).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Check if user is creator or admin
    if task.created_by_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this task"
        )
    
    # Update fields
    update_data = task_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)
    
    db.commit()
    db.refresh(task)
    
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int,
    token: str = None,
    db: Session = Depends(get_db),
):
    """Delete a task"""
    
    current_user = get_current_user(token, db)
    
    task = db.query(Task).filter(Task.id == task_id).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Check if user is creator or admin
    if task.created_by_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this task"
        )
    
    db.delete(task)
    db.commit()
