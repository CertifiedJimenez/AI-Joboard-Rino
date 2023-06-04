import React, { useState, useEffect } from 'react';


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
  




function RenderJob() {
    const [data, setData] = useState(example_json);

    let isLoading = false

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
        <h4 className='mb-2'>{data ? data.title : 'No Title'}</h4>
        <div class="w-100">
        {data && (
          <>

            <div className='row'>
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

            <ul className='list-unstyled row'>
                {data.skills.map((skill, index) => (
                  <li key={index} className="rounded-pills w-auto">{skill}</li>
                ))}
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
          </>
        )}
        </div>
      </div>
    );
  }
  
  export default RenderJob;
  