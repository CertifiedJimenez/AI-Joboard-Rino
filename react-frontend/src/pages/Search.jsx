import React, {useEffect, useState } from 'react';
import Timeline from '../components/timeline'; 
import ViewPort from '../components/panel'; 
import SearchBar from '../components/searchbar'; 
import Advancedsearch from '../components/advancedsearch';

import { get_salary_insight } from '../utils/salaryFetchAPI';





function Search() {

  // job title 
  // job location
  const [jobTitle, setJobTitle] = useState('Python')
  const [jobLocation, setJobLocation] = useState('London')

  // select job
  const [selectedJob, setSelectedJob] = useState(null);

  //catched data for salary
  const [salaryData, setSalaryData] = useState(null);


  // search Preferences  
  const [searchPreferences, setSearchPreferences] =  useState(null);



  useEffect(() => {
    const fetchSalaryData = async () => {
      try {
        const salary = await get_salary_insight(jobTitle, jobLocation);
        setSalaryData(salary);
      } catch (error) {
        console.error('Error fetching salary data:', error);
      }
    };

    fetchSalaryData();
  }, [jobTitle, jobLocation]);

  const handleClick = (jobId) => {
    setSelectedJob(jobId);
  };

  const updateSearches = (data) => {
    setJobTitle(data.title)
    setJobLocation(data.location)
  }

  const onload = (id) => {
    setSelectedJob(id)
  }

  const updateSearchPreferences = (company, skills, yoe) =>{
    const prerefence = {
      'company':company,
      'skills':skills,
      'yoe': yoe
    }
    setSearchPreferences(prerefence)
  }

  return (
    <div>
      <div className='col-12 p-5 bg-white'>
        <div className='col-10 mx-auto'>
        <SearchBar submit={updateSearches} />

        <Advancedsearch company={searchPreferences && searchPreferences.company} skills={searchPreferences && searchPreferences.skills} /> 

        </div>
      </div> 
      <div className='container'>
        <div className='row justify-content-center'>
          <div className='col-md-6 px-0'>
            <Timeline handleClick={handleClick} title={jobTitle} location={jobLocation} onload={onload} updateSearchPreferences={updateSearchPreferences} />
          </div>
          <div className='col-md-6 px-0'>
            <ViewPort jobId={selectedJob} salaryData={salaryData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
