import React, { useEffect, useState } from 'react';
import { get_job_info } from '../services/server_calls';
import { SalaryRangeIndicatorElement } from '../utils/salaryFetchAPI';


const example_json = {
  company: "La Fosse Associates",
  date_posted: "2023-05-14 18:30:37",
  description: "Responsibilities: Create web applications using the Django framework. Work in tandem with product managers, user experience designers, and other developers to create online applications that serve the needs of the company. Improve the speed, scalability, and safety of your web apps. Reduce application downtime with prompt problem solving and debugging. Take part in code reviews to improve code quality and offer helpful criticism to your peers. H...",
  job_type: "Full-Time",
  location: "London",
  salary_max: 500,
  salary_min: 450,
  skills: ["Django", "framework", "scalability", "debugging"],
  source: "Reed",
  title: "Django Developer",
  url: "https://www.reed.co.uk/jobs/django-developer/50195002"
};




function JobRender({ jobId, salaryData }) {


  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      const element = document.querySelector('.render-panel');
      const rect = element.getBoundingClientRect();
      const offsetTop = rect.top + window.pageYOffset;

      if (window.pageYOffset >= offsetTop) {
        element.style.position = 'fixed';
        element.style.top = Math.max(0, window.pageYOffset - offsetTop) - 0.8 + 'px';
        element.style.width = rect.width + 'px';
      } else {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop === 0) {
          element.style.position = 'static';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const jobData = await get_job_info(jobId);
        setData(jobData);
        setIsLoading(false);
      } catch (error) {
        setData(example_json)
        setIsLoading(true);
      }
    };
    fetchData();
  }, [jobId]);

  return (
    <div className={`p-5 table-border render-panel ${isLoading ? 'isLoading' : ''}`}>
      <div className='row align-items-center mb-2'>
        <div className='col-auto'>
          <div className='logo-bg'>
            {data?.additional_context?.logo && (
              <img src={data.additional_context.logo} className='logo' alt='Company Logo' />
            )}
          </div>
        </div>
        <div className='col-10'>
          <h4 className='mb-2 w-auto'>{data ? data.title : 'No Title'}</h4>
        </div>
      </div>

      {data && (
        <>
          <div className='row'>
            {data.salary_min && data.salary_max && (
              <div className='w-auto'>
                <h5>£{data.salary_min} - £{data.salary_max} <SalaryRangeIndicatorElement average={salaryData?.average} price={data.salary_max}/> </h5>
              </div>
            )}
            {data.job_type && (
              <div className='w-auto'>
                <h5>{data.job_type}</h5>
              </div>
            )}
            {data.company && (
              <div className='w-auto'>
                <h5>{data.company}</h5>
              </div>
            )}
            {data.location && (
              <div className='w-auto'>
                <h5>{data.location}</h5>
              </div>
            )}
          </div>

          <div className='row justify-content-between mb-3 mt-2'>
            <div className='col-6'>
              <a href={data.url} target='_blank' rel='noopener noreferrer' className='btn btn-primary btn-block w-100'>
                Apply
              </a>
            </div>
            <div className='col-6'>
              <a href='#' className='btn btn-secondary btn-block w-100'>
                Save
              </a>
            </div>
          </div>

          <h4>About the job</h4>
          <p className='mb-3'>{data.description}</p>

          {data?.skills?.length > 0 && (
            <ul className='list-unstyled row'>
              {data.skills.map((skill, index) => (
                <li key={index} className='rounded-pills w-auto'>
                  {skill}
                </li>
              ))}
            </ul>
          )}

          {data?.additional_context?.linkedin_people?.length > 0 && (
            <div className='card px-4 py-3 my-4'>
              <h6 className='pb-2'>Meet the hiring team</h6>
              <div className='row'>
                {data.additional_context.linkedin_people.map((profile, index) => (
                  <a key={index} href={profile.link} target='_blank' rel='noopener noreferrer' className='w-auto profile-image' title={profile.name}>
                    <img src={profile.image} alt={profile.name} className='profile-image filtered' />
                  </a>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

  
  export default JobRender;
  