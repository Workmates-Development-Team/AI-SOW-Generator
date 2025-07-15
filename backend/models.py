from pydantic import BaseModel, Field
from typing import List, Optional, Any

class Slide(BaseModel):
    id: str
    type: str
    template: str
    title: str
    content: str
    contentType: str
    sowNumber: Optional[str] = None
    sowDate: Optional[str] = None

class Sow(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    userId: str
    title: str
    sowNumber: str
    clientName: str
    slides: List[Slide]
    prompt: Optional[Any] = None

class User(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    name: str
    email: str
    tokenIdentifier: str
