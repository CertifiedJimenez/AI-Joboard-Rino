from typing import List, Dict
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def Count_Vectorize_Jobs(cv_text: List[str], job_texts: List[Dict[str, str]], lazy_matching=False) -> List[Dict[str, str]]:
    """
    This function will match the job based on the count of how many skills
    match the job description.

    To avoid single description matches, set `lazy_matching` to False. This will
    make it so jobs with the most skills matched will rank on top compared to the jobs
    that have fewer skills matched.
    """

    # Combine job titles and descriptions into a list of strings
    job_texts_combined = [job['title'] + ' '.join(job['skills']) for job in job_texts]

    # Initialize the CountVectorizer
    vectorizer = CountVectorizer()

    # Fit the vectorizer to the job texts and transform them into feature vectors
    job_vectors = vectorizer.fit_transform(job_texts_combined)

    # Transform the CV skills into a feature vector
    cv_skill_vector = vectorizer.transform(cv_text)

    # Calculate cosine similarity between CV skills vector and each job vector
    similarities = cosine_similarity(cv_skill_vector, job_vectors)

    # Create a list of (job index, similarity) tuples
    job_similarities = list(enumerate(similarities[0]))

    if lazy_matching:
        # Sort jobs based on similarity in descending order
        sorted_jobs = sorted(job_similarities, key=lambda x: x[1], reverse=True)
    else:
        # Sort the jobs again based on the number of matching skills
        sorted_job_texts = sorted(job_texts, key=lambda x: len(set(x['skills']).intersection(cv_text)), reverse=True)
        sorted_jobs = [(job_texts.index(job), 0) for job in sorted_job_texts]

    # Return the sorted job_texts
    sorted_job_texts = [job_texts[i] for i, _ in sorted_jobs]
    return sorted_job_texts
