import pandas as pd

data = pd.read_json("requests.log", lines=True)

print(data.tail())

print(data['probability'].min(), data['probability'].mean(), data['probability'].max())

feedback = data[data['probability'].isna()]
print(feedback)

new_data = []
for idx, row in feedback.iterrows():
    if row['is_correct'] == 1:
        new_data.append({'review': row['text'], 'sentiment': row['predicted_sentiment']})
    else:
        if row['predicted_sentiment'] == 'positive':
            new_data.append({'review': row['text'], 'sentiment': 'negative'})
        else:
            new_data.append({'review': row['text'], 'sentiment': 'positive'})          

orig_data = pd.read_csv(r'..\archive\IMDB_Dataset.csv')
df = pd.DataFrame(new_data)

df = pd.concat([df, orig_data])
print(df)

df.to_csv("new_data.csv", header=False, index=False)