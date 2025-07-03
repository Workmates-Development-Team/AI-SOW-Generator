from pydantic import BaseModel, Field
from typing import List, Optional

class Slide(BaseModel):
    id: str
    type: str
    template: str
    title: str
    content: str
    contentType: str

class Sow(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    userId: str
    title: str
    sowNumber: str
    clientName: str
    slides: List[Slide]

class User(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    name: str
    email: str
    tokenIdentifier: str
