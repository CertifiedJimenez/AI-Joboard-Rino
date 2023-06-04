import React, { useState, useEffect } from 'react';
import {get_job_info} from '../../services/server_calls';


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
    description: "You will be joining an established team of agile Laravel developers building, improving and monitoring our product platforms, and supporting our Client Services team to deliver a great customer experience. You’ll be working closely with the wider product team (product owners, scrum master, front-end developers, testers, TechOps) to build solid, high-performance datadriven applications for both B2C and B2B users. This role includes monitoring the platform out of hours and acting where required. This work is on a rota, and you would be needed to be on-call 1 week a month on average. You’ll be mostly remote, with occasional travel to our central Guildford office to work with a crossfunctional team to collaborate in short design/development sprints. This is an opportunity to work with an agile team to build software that can make a real difference to our clients and their customers.",
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
  



function RenderJob({ jobId }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const jobData = await get_job_info(jobId); // Pass the jobId parameter to the API call
        setData(jobData);
        setIsLoading(false);
      } catch (error) {
        // Handle error
        setIsLoading(false);
      }
    };

    fetchData();
  }, [jobId])



    window.addEventListener('scroll', function() {
        var element = document.querySelector('.render-panel');
        var rect = element.getBoundingClientRect();
        var offsetTop = rect.top + window.pageYOffset;
      
        if (window.pageYOffset >= offsetTop) {
          element.style.position = 'fixed';
          element.style.top = Math.max(0, window.pageYOffset - offsetTop) + 'px';
          element.style.width = rect.width + 'px';
        } else {
          var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          if (scrollTop === 0) {
            element.style.position = 'static';
          }
        }
      });
      
      

    return (
      <div className={`p-5 table-border render-panel ${isLoading ? 'isLoading' : ''}`}>

        <div className='row align-items-center mb-2'>

        <div className='col-auto'>
          <div className='logo-bg'>
          {data?.additional_context?.logo && (
            <img src={data.additional_context.logo} className='logo' />
          )}
          </div>
        </div>
        <div className='col-10'>
          <h4 className='mb-2 w-auto'>{data ? data.title : 'No Title'}</h4>
        </div>
        </div>

        <div class="w-100">
        {data && (
          <>
            <div className='row'>
              {data.salary_min && data.salary_max && (
                <div className='w-auto'>
                  <h5>£{data.salary_min} - £{data.salary_max}</h5>
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

            <ul className='list-unstyled row'>
                {/* {data.skills.map((skill, index) => (
                  <li key={index} className="rounded-pills w-auto">{skill}</li>
                ))} */}
              </ul>
            
            <div className='row justify-content-between mb-3'>
                <div className="col-6">
                    <a href={data.url} target='_blank' className="btn btn-primary btn-block w-100" role="button" aria-pressed="true">Apply</a>
                </div>
                <div className="col-6">
                    <a href="#" className="btn btn-secondary btn-block w-100" role="button" aria-pressed="true">Save</a>
                </div>
            </div>

            <h4>About the job</h4>
            <p className='mb-3'>{data.description}</p>

            {/* <h4>About the company</h4>
            <div className='card px-4 py-3'>
              <p>{data.additional_context.copmany_description}</p>
              <div className='row justify-content-between'>
                <span className='w-auto'>Powerd By Google</span>
                  <a className='icon w-auto' target='_blank' href={data.additional_context.company_website}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-up-right" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
                      <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
                    </svg>
                  </a>
              </div>
            </div> */}


            {/* <h4>About the company</h4>
            <p className='mb-3'>{data.additional_context.copmany_description}</p> */}
          </>
        )}
        </div>
      </div>
    );
  }
  
  export default RenderJob;
  