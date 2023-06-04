import React, { useState, useEffect } from 'react';
import {get_jobs, get_jobs_skills_match} from '../../services/server_calls';


interface JobCardProps {
  jsonData: JobData;
  isLoading: boolean;
}

interface JobData {
  company: string;
  date_posted: string;
  description: string;
  id: number;
  job_type: string | null;
  location: string;
  salary_max: number;
  salary_min: number;
  skills: string[];
  source: string;
  title: string;
  url: string;
}

const example_json: JobData = {
  company: "La Fosse Associates",
  date_posted: "2023-05-14 18:30:37",
  description: "Responsibilities: Create web applications using the Django framework. Work in tandem with product managers, user experience designers, and other developers to create online applications that serve the needs of the company. Improve the speed, scalability, and safety of your web apps. Reduce application downtime with prompt problem solving and debugging. Take part in code reviews to improve code quality and offer helpful criticism to your peers. H...",
  id: 1,
  job_type: "Full-Time",
  location: "London",
  salary_max: 500,
  salary_min: 450,
  skills: ["Django", "framework", "scalability", "debugging"],
  source: "Reed",
  title: "Django Developer",
  url: "https://www.reed.co.uk/jobs/django-developer/50195002"
};



function JobCard({ jsonData, isLoading }: JobCardProps) {
  const [data, setData] = useState<JobData | null>(null);

  useEffect(() => {
    setData(jsonData);
  }, [jsonData]);

  return (
    <div className={`p-5 table-border clickable w-100 ${isLoading ? 'isLoading' : ''}`}>
      <h4 className='mb-2'>{data ? data.title : 'No Title'}</h4>
      {data && (
        <>
          <p className='mb-3 preview-text'>{data.description}</p>

          <div className='row'>
            <ul className='list-unstyled row'>
              {data.skills.map((skill, index) => (
                <li key={index} className="rounded-pills w-auto">{skill}</li>
              ))}
            </ul>

            <div className='w-auto'>
              <h5>£{data.salary_min} - £{data.salary_max}</h5>
            </div>
            <div className='w-auto'>
              <h5>{data.job_type}</h5>
            </div>
            <div className='w-auto'>
              <h5>{data.company}</h5>
            </div>
            <div className='w-auto'>
              <h5>{data.location}</h5>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Timeline() {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [maxJobs, setMaxJobs] = useState<number>(40);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: JobData[] = await get_jobs('Django', 'London', undefined);
        setJobs(data.slice(0, maxJobs)); // Update the jobs state with the fetched data, limited to maxJobs
        console.log(data);
      } catch (error: any) {
        // Handle the error here
        console.log('error', error);
      }
    };

    fetchData();
  }, [maxJobs]);

  useEffect(() => {
    const fetchMoreJobs = async () => {
      try {
        const params = {
          'start': String(jobs.length),
          'end': String(jobs.length + 20),
        };
        const newJobs: JobData[] = await get_jobs('Django', 'London', params);
        setJobs((prevJobs) => [...prevJobs, ...newJobs.slice(0, maxJobs - prevJobs.length)]); // Append new jobs to the existing jobs state, limited to maxJobs
        if (jobs.length + newJobs.length < maxJobs) {
          window.addEventListener('scroll', handleScroll); // Add the scroll event listener back if there's still room for more jobs
        }
      } catch (error: any) {
        // Handle the error here
        console.log('error', error);
      }
    };

    const handleScroll = () => {
      const isBottom =
        window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
      if (isBottom) {
        fetchMoreJobs();
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };

  }, [jobs, maxJobs]);



  return (
    <div>
      {jobs.length > 0 ? (
        jobs.map((item, index) => (
          <JobCard key={index} jsonData={item} isLoading={false} />
        ))
      ) : (
        <>No Jobs found</>
      )}
    </div>
  );
}



export default Timeline;
