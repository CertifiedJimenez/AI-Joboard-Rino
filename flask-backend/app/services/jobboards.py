import requests
from requests.auth import HTTPBasicAuth
from app.utils.skills_extractor import Text_Analyser

def serialize_data(url: str, title: str, company: str, job_description: str, location: str, 
                   source: str, date, job_type = None,  negotioble = False, salary_min = None, 
                   salary_max = None, extract_skills = False, extract_yoe = False, extact_qualification = False):
    
    if negotioble:
        salary_min, salary_max = None, None
    
    skills = None
    if extract_skills:
        skills = Text_Analyser.extract_skills(job_description)

    return {
        "url": url,
        "source": source,
        "title": title,
        "company": company,
        "description": job_description,
        "location": location,
        "job_type": job_type,
        "salary_max": salary_max,
        "salary_min": salary_min,
        "Date": date,
        "negotioble": negotioble,
        "skills": skills,
    }


def getIndeed(name, location):
    # Indeed Job Search API
    publisher_id = 'NEEDED'
    indeed_url = 'https://api.indeed.com/ads/apisearch'
    indeed_params = {
        'publisher': publisher_id,
        'q': name,
        'l': location,
        'sort': 'date',
        'limit': 50,
        'format': 'json'
    }
    indeed_response = requests.get(indeed_url, params=indeed_params)
    return indeed_response.json()


def getAdzuna(name, location, results=50, get_skills=False):
    # Adzuna API
    key, app_id = 'af3a8182b6d24d3114c3b49f53f8b4da', 'be326d5e'
    adzuna_url = f'http://api.adzuna.com/v1/api/jobs/gb/search/1'
    adzuna_params = {
        'app_id': app_id,
        'app_key': key,
        'results_per_page': results,
        'what': name,
        'where': location,
        'content-type': 'application/json'
    }
    adzuna_response = requests.get(adzuna_url, params=adzuna_params)
    results = [
        serialize_data(
            title=job.get('title'), job_description=job.get('description'),
            company=job.get('company').get('display_name'), source='Adzuna',
            location=job.get('location').get('display_name'), salary_min=job.get('salary_min'),
            salary_max=job.get('salary_max'), job_type=job.get('contract_type'),
            date=None, url=job.get('redirect_url'), extract_skills=get_skills
        )
        for job in adzuna_response.json().get('results', [])
    ]
    return results


def getTotalJobs(name, location):
    # Totaljobs API
    totaljobs_url = 'https://www.totaljobs.com/api/search/jobs'
    totaljobs_params = {
        'Keywords': name,
        'Location': location,
        'PageSize': 50,
        'PageNumber': 1
    }
    totaljobs_response = requests.get(totaljobs_url, params=totaljobs_params)
    return totaljobs_response.json()


def getMonster(name, location):
    # Monster API
    monster_url = 'https://services.monster.com/api/candidate/v2/jobs/search'
    monster_params = {
        'q': name,
        'where': location,
        'pg': 1,
        'pagesize': 50,
        'sort': 'relevance',
        'fields': 'JobTitle,Company,Location,PostedDate,JobViewUrl'
    }
    monster_response = requests.get(monster_url, params=monster_params)
    return monster_response.json()


def getReed(name, location, results = 50, get_skills = False):
    # Reed Job Search API
    key = 'aa04a771-9788-4d0b-bb72-44b7d5d2f234'
    reed_url = 'https://www.reed.co.uk/api/1.0/search'
    reed_params = {
        'keywords': name,
        'locationName': location,
        'resultsToTake': results
    }
    reed_response = requests.get(reed_url, params=reed_params, auth=HTTPBasicAuth(key,'password'))    
    results = [serialize_data(title=job.get('jobTitle'), job_description=job.get('jobDescription'),
                company=job.get('employerName'), source='Reed', location=job.get('locationName'),
                salary_min=job.get('minimumSalary'), salary_max=job.get('maximumSalary'), date=None,
                url=job.get('jobUrl'), extract_skills=get_skills) for job in reed_response.json().get('results', [])]
    return results
