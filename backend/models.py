from pydantic import BaseModel, Field
from datetime import date
from typing import Optional, List

class HomeWork(BaseModel):
    date: str
    count: int = Field(0, ge=0)

class User(BaseModel):
    telegram_id: int = Field(...)
    token: str = Field(...)
    homeworks: Optional[List[HomeWork]] = Field(default=[])

    class Config:
        json_schema_extra = {
            "example":
            {
                "telegram_id": 0000000,
                "token": "2faff0d80f02553281a64c4cedb08b50",
                "homeworks": [{"date": "2024-10-22", "count": 10}, {"date": "2024-10-21", "count": 30}]
            }
        }