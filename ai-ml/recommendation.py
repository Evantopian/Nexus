from fastapi import FastAPI, HTTPException
import pandas as pd
import numpy as np
import ast
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.neighbors import NearestNeighbors
import uvicorn
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.exc import OperationalError


app = FastAPI()

load_dotenv()
'''
url = URL.create(
    drivername="postgresql+psycopg2",
    username=os.getenv("NEXUSUSERNAME"),
    password=os.getenv("NEXUSPASSWORD"),
    host=os.getenv("HOST"),
    port=os.getenv("PORT"),
    database=os.getenv("NEXUSDATABASE")
)
'''
url = os.getenv("DATABASE_URL")
engine = create_engine(url)

query = """
SELECT 
  uuid,
  reputation,
  rank,
  age,
  preferences->>'region' AS region,
  preferences->>'playstyle' AS playstyle,
  preferences->>'favoritePlatform' AS platform,
  preferences->>'favoriteGameGenre' AS genre
FROM users
"""
df = pd.read_sql_query(query, engine)

friends_df = pd.read_sql_query("""
    SELECT user_id, ARRAY_AGG(friend_id) AS friends
    FROM public.friends
    GROUP BY user_id
""", engine)

df = pd.merge(df, friends_df, how='left', left_on='uuid', right_on='user_id')

df.fillna({
    'region': 'UNKNOWN',
    'playstyle': 'UNKNOWN',
    'platform': 'UNKNOWN',
    'genre': 'UNKNOWN',
    'rank': 'UNRANKED',
    'reputation': 0,
    'age': 13,
}, inplace=True)

default_weights = {
    'region': 0.6,
    'genre': 0.3,
    'playstyle': 0.1,
    'platform': 0.6,
    'rank': 0.1,
    'reputation': 0.4,
    'age': 0.2
}


@app.on_event("startup")
async def startup_event():
    global df, preprocessor, X, X_weighted, knn, numerical_features, categorical_features, encoded_categorical_features

    categorical_features = ['region', 'playstyle', 'platform', 'genre', 'rank']
    numerical_features = ['reputation', 'age']

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_features),
            ('cat', OneHotEncoder(), categorical_features)
        ]
    )

    X = preprocessor.fit_transform(
        df[numerical_features + categorical_features])

    encoded_categorical_features = preprocessor.transformers_[
        1][1].get_feature_names_out(categorical_features).tolist()

    dweights = np.array(
        [default_weights[feature] for feature in numerical_features] +
        [default_weights[feature.split('_')[0]]
         for feature in encoded_categorical_features]
    )

    X = X.toarray()
    X_weighted = X * dweights

    total_num_users = len(df) - 1
    knn = NearestNeighbors(n_neighbors=total_num_users, metric='cosine')
    knn.fit(X_weighted)


@app.get("/recommendations/{player_id}")
async def get_recommendations(player_id: str, num_recommendations: int = 5):
    df = pd.read_sql_query(query, engine)
    friends_df = pd.read_sql_query("""
        SELECT user_id, ARRAY_AGG(friend_id) AS friends
        FROM public.friends
        GROUP BY user_id
    """, engine)
    df = pd.merge(df, friends_df, how='left',
                  left_on='uuid', right_on='user_id')

    if str(player_id) not in df['uuid'].astype(str).values:
        raise HTTPException(status_code=404, detail="User ID not found")

    player_index = df[df['uuid'].astype(str) == str(player_id)].index[0]
    recommendations = get_recommendations_ml(player_index, num_recommendations)

    return recommendations.to_dict(orient="records")


@app.post("/refresh")
async def refresh_model():
    global df, preprocessor, X, X_weighted, knn, encoded_categorical_features

    df = pd.read_sql_query(query, engine)
    friends_df = pd.read_sql_query("""
        SELECT user_id, ARRAY_AGG(friend_id) AS friends
        FROM public.friends
        GROUP BY user_id
    """, engine)
    df = pd.merge(df, friends_df, how='left',
                  left_on='uuid', right_on='user_id')

    X = preprocessor.fit_transform(
        df[numerical_features + categorical_features]).toarray()

    encoded_categorical_features = preprocessor.transformers_[
        1][1].get_feature_names_out(categorical_features).tolist()

    dweights = np.array(
        [default_weights[feature] for feature in numerical_features] +
        [default_weights[feature.split('_')[0]]
         for feature in encoded_categorical_features]
    )

    X_weighted = X * dweights
    knn = NearestNeighbors(n_neighbors=len(df)-1, metric='cosine')
    knn.fit(X_weighted)

    return {"message": "Model refreshed with latest users"}


def get_recommendations_ml(player_index, num_recommendations=5, weighted_matrix=None):
    if weighted_matrix is None:
        weighted_matrix = X_weighted

    player_data = weighted_matrix[player_index].reshape(1, -1)
    _, indices = knn.kneighbors(player_data)
    similar_indices = indices.flatten()[1:]

    user_id = df.iloc[player_index]['uuid']
    user_friends = df[df['uuid'] == user_id]['friends'].values[0] or []
    candidate_ids = df.iloc[similar_indices]['uuid'].values
    new_friend_ids = candidate_ids[~np.isin(candidate_ids, user_friends)]

    if len(new_friend_ids) == 0:
        raise HTTPException(
            status_code=404, detail="No new users to recommend.")

    recommendations = pd.DataFrame(
        {'uuid': new_friend_ids[:num_recommendations]})
    full_recommendations = pd.merge(recommendations, df, on='uuid')

    return full_recommendations[['uuid', 'region', 'genre', 'platform', 'playstyle', 'rank', 'reputation', 'age']]


'''
if __name__ == "__main__":
    uvicorn.run("recommend:app", host="0.0.0.0", port=8000, reload=True)

docker build -t fastapi .
docker run --env-file .env -p 8000:8000 fastapi
'''
