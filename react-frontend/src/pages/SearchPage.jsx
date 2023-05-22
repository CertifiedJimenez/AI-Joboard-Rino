import React from 'react';
import JobCard from '../components/SearchPage/jobCard'; 
// import {get_jobs_skills_match, get_jobs} from '../services/server_calls';


function SearchPage() {
    
    // const jobs = get_jobs('DJango', 'London');
  
    return (
      <div>
        {/* Add your search page content here */}
        <h1 className="text-center">Search Page</h1>
  
        <div className='container'>
          <div className='row row justify-content-start'>
            <div className='col-md-6'>
              <JobCard/>
            </div>
          </div>
        </div>
        {/* You can add more elements or components here */}
      </div>
    );
  }
  
  export default SearchPage;
  