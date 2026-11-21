import pandas as pd

data = pd.read_csv("dataset/cleaned_train.csv")

neutral_emoji = data[data["text"].str.contains("😐", na=False)]

print("Rows containing 😐:")
print(neutral_emoji[["text", "label"]].to_string(index=False))

print("\nSentiment distribution:")
print(neutral_emoji["label"].value_counts())