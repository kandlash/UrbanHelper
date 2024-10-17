from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

homeworks = {}

@app.post('/homeworks_add')
async def homeworks_add():
    if 'homeworks_count' in homeworks:
        homeworks['homeworks_count'] += 1
    else:
        homeworks['homeworks_count'] = 1
    return {"status": 'Added'}

@app.get('/homeworks_get')
async def homeworks_get():
    return {"homeworks_count": homeworks.get('homeworks_count', 0)}


class Template(BaseModel):
    text_template: str

template = ''
@app.post('/post_comment_template')
async def post_comment_template(text_template: Template):
    global template
    print(text_template)
    template = text_template
    return {'status': 'added template', 'template': template}

@app.get('/get_comment_template')
async def get_comment_template():
    return {"template": template}

