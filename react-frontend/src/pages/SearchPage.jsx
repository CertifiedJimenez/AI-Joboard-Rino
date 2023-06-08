import React, {useEffect, useState } from 'react';
import JobCard from '../components/SearchPage/jobCard'; 
import JobRender from '../components/RenderPage/JobRender'; 
import { get_salary_insight } from '../utils/salaryFetchAPI';





function SearchPage() {
  const [selectedJob, setSelectedJob] = useState(1);
  const [salaryData, setSalaryData] = useState(null);

  const search_mode_settings = {
    title: 'Django',
    location: 'London'
  };

  useEffect(() => {
    const fetchSalaryData = async () => {
      try {
        const salary = await get_salary_insight(search_mode_settings.title, search_mode_settings.location);
        setSalaryData(salary);
      } catch (error) {
        console.error('Error fetching salary data:', error);
      }
    };

    fetchSalaryData();
  }, [search_mode_settings.title, search_mode_settings.location]);

  const handleClick = (jobId) => {
    setSelectedJob(jobId);
  };

  return (
    <div>
      <h1 className="text-center">Search Page</h1>
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-md-6 px-0'>
            <JobCard handleClick={handleClick} context={search_mode_settings} />
          </div>
          <div className='col-md-6 px-0'>
            <JobRender jobId={selectedJob} context={search_mode_settings} salaryData={salaryData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
