from flask import Blueprint, current_app, flash, jsonify, make_response, redirect, request, url_for

# App specific
from .services.jobboards import getReed, getAdzuna
from .utils.skills_extractor import Text_Analyser
from .utils.google_custom_searches import get_company_logo, seach_linkedin, get_linkedin_people
from .utils.job_insights import request_salary_insight

# sorting algorythms
from .utils.td_idf_vectorizer import TD_IDF_Vectorize_Jobs
from .utils.count_vectorizer import Count_Vectorize_Jobs

from .models import db, Jobs, Company
import json
from datetime import datetime, timedelta
from sqlalchemy import or_, and_, distinct, func
import warnings
import logging
import ast


bp = Blueprint('main', __name__)


@bp.route('/')
def index():
    return 'Hello, World!'


# @bp.route('/get_all_possible_jobs/<location>', methods=['POST'])
# def get_all_possible_jobs(location):
#     """
#     This will extract all the skills on your cv and do a round search 
#     and skills rank each job your skills offer to the most optimsied job.
#     """

#     if request.method == 'POST':
#         data = request.get_json()
#         cv_skills = Text_Analyser.extract_skills(data['Resume'])
#         jobs_found = []
#         for skill in cv_skills:
#             jobs = get_jobs(skill, location)
#             jobs_found.append(jobs.json)

#         jobs_ranked = set((order_jobs_by_skills(cv_skills, jobs_found, method='Count__Vectorize')))
#         return jsonify(jobs_ranked)


@bp.route('/get_jobs_skills_match/<name>/<location>', methods=['POST'])
def get_jobs_skills_match(name, location):
    """
    Ranks the cv against the job listings. It will call the AI
    to rank jobs based on this cv.
    """

    if request.method == 'POST':
        start = int(request.args.get('start', 0))
        end = int(request.args.get('end', 999))
        add_jobs_str = request.args.get('add_jobs', 'false')
        add_jobs = not (add_jobs_str.lower() == 'false')

        # Get the JSON data from the request body
        data = request.get_json()
        if data and data.get('Resume'):
            cv_skills = Text_Analyser.extract_skills(data['Resume'])
        else:
            return jsonify({'error': 'Invalid data provided'})

        jobs = get_jobs(name, location, start, end, add_jobs)
        if jobs.status_code != 200:
            return jsonify({'error': 'Failed to retrieve jobs'})

        jobs_ranked = order_jobs_by_skills(cv_skills, jobs.json['results'], method='Count__Vectorize')
        return jsonify({'results':jobs_ranked, 'length': jobs.json['length']})


@bp.route('/get_jobs/<name>/<location>', methods=['GET'])
def get_jobs(name, location, start=0, end=20, add_jobs='false'):
    """
    This builds new entries in the database and adds
    new jobs to the following list.
    """

    try:
        # Retrieve query parameters
        start = int(request.args.get('start', start))
        end = int(request.args.get('end', start + 20))
        difference = end - end

        add_jobs_str = request.args.get('add_jobs', str(add_jobs))
        add_jobs = not (add_jobs_str.lower() == 'false')

        jobs_list = []
        found_jobs, max_found_jobs  = load_jobs(name, location, start, end)
        jobs_list.extend(found_jobs)

        if add_jobs or len(found_jobs) == 0 or difference > len(found_jobs): 
            #if run out of searches add new entries
            jobs_list.extend(build_job_search(name, location))
            
        return jsonify({'results':jobs_list, 'length': max_found_jobs})

    except Exception as e:
        # Handle other exceptions
        print('error: ', e)
        return jsonify({'error': 'An error occurred'}), 500


def load_jobs(name, location, start, end) -> list[dict, int]:
    """
    This loads jobs but does not add any new entries
    in the database queries.
    """

    # Define the filters
    name_filter = Jobs.title.ilike(f'%{name}%')
    location_filter = Jobs.location.ilike(f'%{location}%')
    description_filter = Jobs.description.ilike(f'%{name}%')

    # Construct the query
    thirty_days_ago = datetime.now() - timedelta(days=30) # Filter by 30 days
    jobs = Jobs.query.filter(and_(or_(location_filter, name_filter, description_filter), Jobs.location.ilike(f'%{location}%'), Jobs.date_posted >= thirty_days_ago))

    # Add the ordering
    jobs = jobs.order_by(
        name_filter.desc(),
        description_filter.desc()
    )

    jobs_count = jobs.with_entities(func.count()).scalar() 

    jobs_subset = jobs.order_by(Jobs.id.asc()).slice(start, end).all()  # Fetch the subset of jobs directly from the database


    return [[{
        'id': job.id,
        'title': job.title,
        'description': job.description,
        'location': job.location,
        'company': job.company,
        'url': job.url,
        'source': job.source,
        'job_type': job.job_type,
        'salary_min': job.salary_min,
        'salary_max': job.salary_max,
        'date_posted': job.date_posted.strftime('%Y-%m-%d %H:%M:%S'),
        'skills': ast.literal_eval(job.skills)

    } for job in jobs_subset ], jobs_count]


def build_job_search(name, location, entries = 999) -> list[dict]:
    """
    This will make a query to the APIs and process them to
    add to the database using the serailized method in servies.
    """

    job_pending = []
    saved_models = []
    job_pending.extend(getReed(name, location, entries, True))
    job_pending.extend(getAdzuna(name, location, entries, True))

    for job in job_pending:
        if not Jobs.query.filter_by(title=job['title'], company=job['description']).first():
            job_model = Jobs(
                title=job['title'],
                description=job['description'],
                location=job['location'],
                company=job['company'],
                url=job['url'],
                source=job['source'],
                job_type=job['job_type'],
                salary_min=job['salary_min'],
                salary_max=job['salary_max'],
                date_posted=job['Date'],
                skills=json.dumps(job['skills'])
            )
            db.session.add(job_model)
            db.session.commit()
            serialized_job = {
                'id': job_model.id,
                'title': job_model.title,
                'description': job_model.description,
                'location': job_model.location,
                'company': job_model.company,
                'url': job_model.url,
                'source': job_model.source,
                'job_type': job_model.job_type,
                'salary_min': job_model.salary_min,
                'salary_max': job_model.salary_max,
                'date_posted': job_model.date_posted,
                'skills': json.loads(job_model.skills)
            }
            saved_models.append(serialized_job)
    return saved_models



def order_jobs_by_skills(cv_skills: list, jobs_list: list, method='TD_IDF__Vectorize') -> list[dict]:
    """
    This uses is a function that calls different sorting
    algorythms to get the most relavent jobs.

    Types of methods you can call:
        - TD_IDF__Vectorize 
        - Count__Vectorize
    """

    if method == 'TD_IDF__Vectorize':
        sort_algorithm = TD_IDF_Vectorize_Jobs
    elif method == 'Count__Vectorize':
        sort_algorithm = Count_Vectorize_Jobs
    else:
        raise ValueError("Invalid method specified.")
    
    return sort_algorithm(cv_skills, jobs_list)


@bp.route('/get_job_posting/<id>', methods=['GET'])
def get_job_posting(id, addition_context_required = True):
    job = Jobs.query.get(id)
    if job is not None:
        data = {
        'id': job.id,
        'title': job.title,
        'description': job.description,
        'location': job.location,
        'company': job.company,
        'url': job.url,
        'source': job.source,
        'job_type': job.job_type,
        'salary_min': job.salary_min,
        'salary_max': job.salary_max,
        'date_posted': job.date_posted.strftime('%Y-%m-%d %H:%M:%S'),
        'skills': ast.literal_eval(job.skills), 
        }

        if addition_context_required:
            additional_context = get_company_info_or_create(job.company, job.location)
            if(additional_context):
                data['additional_context']= {}
                data['additional_context']['logo'] = additional_context[0].get('pagemap').get('cse_image')[0].get('src')
                data['additional_context']['copmany_description'] = additional_context[0].get('pagemap').get('metatags')[0].get('og:description')
                data['additional_context']['company_website'] = additional_context[0].get('link')
                data['additional_context']['linkedin_people'] = get_linkedin_people(additional_context)        
        return jsonify(data)
    else:
        data = {
            'valid': False,
            'messsage': 'Job not found.'
        }
        return jsonify(data)
    

def get_company_info_or_create(name: str, location: str):
    company = Company.query.filter_by(name=name, location=location).first()
    if company is not None:
        # Company exists, do something with it
        return company.logo
    else:
        new_company = Company(name=name, location=location, logo = seach_linkedin(name, location))
        db.session.add(new_company)
        db.session.commit()
        return new_company.logo
    


@bp.route('/get_salary_api/<title>/<location>', methods=['GET'])
def get_salary_api(title: str, location: str):

    print(request_salary_insight(title,location))

    data = {
        'name': 'django',
        'location': 'london',
        'average': 80000
    }
    return jsonify(data)