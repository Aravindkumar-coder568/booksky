import sys
import json
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def main():
    # 1. Get the target book ID from the command line arguments
    if len(sys.argv) < 2:
        print("Error: No target book ID provided.", file=sys.stderr)
        sys.exit(1)
        
    try:
        target_id = int(sys.argv[1])
    except ValueError:
        print("Error: Target book ID must be an integer.", file=sys.stderr)
        sys.exit(1)

    # 2. Read the books data (JSON) from standard input
    input_data = sys.stdin.read()
    if not input_data:
        print("Error: No input data provided.", file=sys.stderr)
        sys.exit(1)

    try:
        books_list = json.loads(input_data)
    except json.JSONDecodeError:
        print("Error: Invalid JSON input.", file=sys.stderr)
        sys.exit(1)

    # Convert the list of dictionaries to a Pandas DataFrame
    df = pd.DataFrame(books_list)

    # Check if the target_id exists in our DataFrame
    if target_id not in df['id'].values:
        # If not found, just return empty list
        print(json.dumps([]))
        return

    # 3. Create a combined text field for TF-IDF
    # We combine title, author, genre, and description.
    # We fill missing values with empty strings to avoid errors.
    df['combined_text'] = (
        df['title'].fillna('') + " " +
        df['author'].fillna('') + " " +
        df['genre'].fillna('') + " " +
        df['description'].fillna('')
    )

    # 4. Apply TF-IDF Vectorization
    # TF-IDF converts the text into numerical vectors.
    # stop_words='english' removes common words like "the", "and", "is".
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(df['combined_text'])

    # 5. Calculate Cosine Similarity
    # This measures how similar every book is to every other book.
    # The output is a matrix of similarity scores.
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

    # 6. Find the recommendations
    # Get the index of the target book in the DataFrame
    target_index = df[df['id'] == target_id].index[0]

    # Get the similarity scores for the target book
    sim_scores = list(enumerate(cosine_sim[target_index]))

    # Sort the books based on the similarity scores (highest to lowest)
    # x[1] is the similarity score
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

    # Get the scores of the 5 most similar books
    # We skip the first one (index 0) because it is the target book itself!
    top_similar = sim_scores[1:6]

    # Extract the book IDs of the top recommendations
    recommended_ids = [int(df.iloc[i[0]]['id']) for i in top_similar]

    # 7. Print the recommended IDs as a JSON array to standard output
    # The Node.js backend will capture this output.
    print(json.dumps(recommended_ids))

if __name__ == "__main__":
    main()
