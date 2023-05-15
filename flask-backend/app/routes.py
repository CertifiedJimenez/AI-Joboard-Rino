from flask import Blueprint, current_app, flash, jsonify, make_response, redirect, request, url_for

# App specific
from .services.jobboards import getReed, getAdzuna
from .utils.skills_extractor import Text_Analyser
from .utils.td_idf_vectorizer import TD_IDF_Vectorize_Jobs
from .models import db, Jobs

import json
from sqlalchemy import or_
import warnings
import logging


bp = Blueprint('main', __name__)


@bp.route('/')
def index():
    return 'Hello, World!'


@bp.route('/get_all_possible_jobs/<location>', methods=['POST'])
def get_all_possible_jobs(location):
    """
    This will extract all the skills on your cv and do
    a round search and skills rank each job your skills offer
    to the most optimsied job.
    """

    if request.method == 'POST':
        data = request.get_json()
        cv_skills = Text_Analyser.extract_skills(data['Resume'])

        jobs_ranked = []
        jobs_found = []
        for skill in cv_skills:
            jobs = get_jobs(skill, location)
            jobs_found.append(jobs.json)

        jobs_ranked.extend(order_jobs_by_skills(cv_skills, jobs_found))
        return jsonify(jobs_ranked)


@bp.route('/get_jobs_skills_match/<name>/<location>', methods=['POST'])
def get_jobs_skills_match(name, location):
    """
    Ranks the cv against the job listings. It will call the AI
    to rank jobs based on this cv.
    """

    if request.method == 'POST':
        data = request.get_json()
        cv_skills = Text_Analyser.extract_skills(data['Resume'])
        jobs = get_jobs(name, location)

        jobs_ranked = order_jobs_by_skills(cv_skills, jobs.json)
        return jsonify(jobs_ranked)


@bp.route('/get_jobs/<name>/<location>')
def get_jobs(name, location):
    """
    This builds new entries in the database and adds
    new jobs to the following list.
    """

    jobs_list = []
    jobs_list.extend(build_job_search(name, location))
    jobs_list.extend(load_jobs(name, location))
    return jsonify(jobs_list)


def load_jobs(name, location):
    """
    This loads jobs but does not add any new entries
    in the database queries.
    """

    jobs = Jobs.query.filter(or_(Jobs.title.ilike(f'%{name}%'), Jobs.location.ilike(f'%{location}%'), Jobs.description.ilike(f'%{name}%')))

    jobs_list = []
    for job in jobs:
        job_dict = {
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
            'skills': job.skills.split(', ')
        }
        jobs_list.append(job_dict)
    return jobs_list


def build_job_search(name, location):
    """
    This will make a query to the APIs and process them to
    add to the database using the serailized method in servies.
    """

    job_pending = []
    job_pending.extend(getReed(name, location, 999, True))
    job_pending.extend(getAdzuna(name, location, 999, True))
                
    for job in job_pending:
        if not Jobs.query.filter_by(title=job['title'], company=job['company']).first():
            job_model = Jobs(title=job['title'],
                        description=job['job_description'],
                        location=job['location'],
                        company=job['company'],
                        url=job['url'],
                        source=job['source'],
                        job_type=job['job_type'],
                        salary_min=job['salary_min'],
                        salary_max=job['salary_max'],
                        date_posted=job['Date'],
                        skills=json.dumps(job['skills']))

            db.session.add(job_model)
            db.session.commit()
    return job_pending


def order_jobs_by_skills(cv_skills: list, jobs_list: list) -> list[dict]:
    """
    This uses the TD IDF vectorizer to skills match
    the job posting.
    """
    return TD_IDF_Vectorize_Jobs(cv_skills, jobs_list)