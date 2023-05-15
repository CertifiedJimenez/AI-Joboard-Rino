from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from typing import List, Dict
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def TD_IDF_Vectorize_Jobs(cv_text: List[str], job_texts: List[Dict[str, List[str]]]) -> List[Dict[str, List[str]]]:
    # Create a TF-IDF vectorizer object
    vectorizer = TfidfVectorizer()

    # Extract the job descriptions from the list of dictionaries
    job_descs = [', '.join(job_text['skills']) for job_text in job_texts]

    # Fit and transform the vectorizer on the candidate CV and job descriptions
    cv_vector = vectorizer.fit_transform([', '.join(cv_text)])
    job_vectors = vectorizer.transform(job_descs)

    # Calculate the cosine similarities between the candidate CV and each job description
    cosine_sims = cosine_similarity(cv_vector, job_vectors)

    # Create a list of tuples with the cosine similarities and job texts
    job_sims = list(zip(cosine_sims[0], job_texts))

    # Sort the job descriptions in descending order of similarity score
    sorted_jobs = sorted(job_sims, key=lambda x: x[0], reverse=True)
    
    # Extract the job texts from the sorted list of tuples
    sorted_job_texts = [job_text for _, job_text in sorted_jobs]

    return sorted_job_texts
