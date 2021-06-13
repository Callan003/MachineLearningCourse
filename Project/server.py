import joblib

model = joblib.load("sentiment.model")

from fastapi import FastAPI, Request
from pydantic import BaseModel
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from os import walk
import json

class MovieReview(BaseModel):
    text: str

class ReviewSentiment(BaseModel):
    sentiment: str
    probability: float

app = FastAPI()
log_file = open('requests.log', "a")
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")  

@app.get("/", response_class=HTMLResponse)
async def hello(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/predict", response_model=ReviewSentiment)
async def predict_sentiment(review: MovieReview):
    prediction = model.predict_proba([review.text])
    print(prediction)
    log_file.write(json.dumps({"text": review.text, "probability": prediction[0][0]}))
    log_file.write("\n")
    log_file.flush()
    if prediction[0][0] > 0.5:
        return ReviewSentiment(sentiment="negative", probability=prediction[0][0])
    else:
        return ReviewSentiment(sentiment="positive", probability=prediction[0][1])    

class FeedBack(BaseModel):
    text: str
    predicted_sentiment: str
    is_correct: bool

@app.post("/log_feedback")
async def review(feedback: FeedBack):
    log_file.write(feedback.json())
    log_file.write("\n")
    log_file.flush()
    return "Feedback logged"        

@app.get("/movies")
async def movies(request: Request): 
    filenames = next(walk('static/moviesdb'), (None, None, []))[2]
    return filenames
