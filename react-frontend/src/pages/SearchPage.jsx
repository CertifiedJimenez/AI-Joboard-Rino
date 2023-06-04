import React from 'react';
import JobCard from '../components/SearchPage/jobCard'; 
import JobRender from '../components/RenderPage/JobRender'; 
// import {get_jobs_skills_match, get_jobs} from '../services/server_calls';


function SearchPage() {
    
    return (
      <div>
        <h1 className="text-center">Search Page</h1>
  
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-md-6 px-0'>
              <JobCard/>
            </div>
            <div className='col-md-6 px-0'>
              <JobRender />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default SearchPage;
  