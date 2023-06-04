import React, { useState } from 'react';
import JobCard from '../components/SearchPage/jobCard'; 
import JobRender from '../components/RenderPage/JobRender'; 


function SearchPage() {
  const [selectedJob, setSelectedJob] = useState(1);

  const handleClick = (jobId) => {
    setSelectedJob(jobId);
  };

  return (
    <div>
      <h1 className="text-center">Search Page</h1>

      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-md-6 px-0'>
            <JobCard handleClick={handleClick}/>
          </div>
          <div className='col-md-6 px-0'>
            <JobRender jobId={selectedJob} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
  