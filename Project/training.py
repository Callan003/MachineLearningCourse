import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import joblib

file_path = r'..\archive\IMDB_Dataset.csv'

data = pd.read_csv(file_path)
print(data.head())

X_train, X_test, y_train, y_test = train_test_split(data['review'], data['sentiment'])
print(X_train.shape, y_train.shape)

cv = CountVectorizer(ngram_range=[1,2], max_df=0.9, min_df=3)
lr = LogisticRegression(max_iter=200, C=0.1)

pipe = Pipeline([('cv', cv), ('lr', lr)])
pipe.fit(X_train, y_train)
print(pipe.score(X_test, y_test))

joblib.dump(pipe, "sentiment.model")