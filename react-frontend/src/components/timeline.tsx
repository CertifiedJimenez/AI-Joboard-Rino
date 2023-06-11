import React, { useState, useEffect } from 'react';
import {get_jobs, get_jobs_skills_match} from '../services/server_calls';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf';

async function extractTextFromPDF(file: File) {
  try {
    const reader = new FileReader();

    // Convert file to ArrayBuffer
    const fileDataPromise = new Promise<Uint8Array>((resolve, reject) => {
      reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer));
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });

    const pdfData = await fileDataPromise;

    // Set the worker source to the default path
    GlobalWorkerOptions.workerSrc = '/pdf.worker.js'; // CHANGE THIS WHEN CLEANING ADD A WARNING
    // GlobalWorkerOptions.workerSrc = '/node_modules/pdfjs-dist/build/pdf.worker.js'; // Update the worker source path based on the location of pdf.worker.js

    // Load the PDF document
    const loadingTask = getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;

    // Get the number of pages in the PDF
    const numPages = pdf.numPages;

    let text = '';

    // Iterate over each page and extract the text
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item['str']).join(' ');
      text += pageText;
    }

    return text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw error;
  }
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

const example_json = {
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


function Card({ jsonData, isLoading, onClick }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(jsonData);
  }, [jsonData]);

  const handleClick = () => {
    if (data && data.id) {
      onClick(data.id);
    }
  };
  
  return (
    <div className={`p-5 table-border clickable w-100 ${isLoading ? 'isLoading' : ''}`} onClick={handleClick}>
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
        </>
      )}
    </div>
  );
}

function Result({ results, title, location, onchange }){
  const [uploadPlaceholder, setUploadPlaceholder] = useState('Upload Resume');

  useEffect(() => {
    const handleScroll = () => {
      const element = document.querySelector('.search-results-banner') as HTMLElement; // Use type assertion
      const rect = element.getBoundingClientRect();
      const offsetTop = rect.top + window.pageYOffset;

      if (window.pageYOffset >= offsetTop) {
        element.style.position = 'fixed';
        element.style.top = Math.max(0, window.pageYOffset - offsetTop) -0.7 + 'px';
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

  // useEffect(() => {
  //   setUploadPlaceholder('Upload Resume')
  // },[title, location])
  

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setUploadPlaceholder(file.name)
    try {
      const extractedText = await extractTextFromPDF(file);
      onchange(extractedText)
    } catch (error) {
      console.error('Error extracting text:', error);
    }
  };

  return (
    <div className='col-12 search-results-banner p-3 text-capitalize'>
      <div className='row'>
        <div className='col'>
          <h6 className='text-white'>{title + ' in ' + location}</h6>
          <span className='text-white'>{results} results</span>
        </div>
        <div className='col-3 d-flex align-items-center justify-content-center'>
          <label htmlFor='resume-upload' className='text-white text-truncate' title={uploadPlaceholder}>
           {uploadPlaceholder}
          </label>
          <input
            id='resume-upload'
            type='file'
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>
      </div>
    </div>
  )
}



function Timeline({ handleClick, title, location, onload = function(id){} }) {
  const [jobs, setJobs] = useState([]);
  const [results, setResults] = useState<number>(0);
  const [infiniteScroll, setInfiniteScroll] = useState(true);
  const [isloading, setIsLoading] = useState(false)



  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const data = await get_jobs(title, location, undefined);
        setJobs(data['results']);
        setResults(data['length']);
        setIsLoading(false)
        onload(data['results'][0]['id'])
      } catch (error: any) {
        console.log('error', error);
      }
    };

    fetchData();
  }, [title, location]);

  useEffect(() => {
    const fetchMoreJobs = async () => {
      try {
        const params = {
          start: String(jobs.length),
          end: String(jobs.length + 20),
        };
        const newJobs = await get_jobs(title, location, params);
        setJobs((prevJobs) => [...prevJobs, ...newJobs['results']]);
      } catch (error: any) {
        console.log('error', error);
      }
    };

    const handleScroll = () => {
      const isBottom =
        window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
      if (isBottom && infiniteScroll) {
        fetchMoreJobs();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [jobs, title]); // Add 'jobs' and 'title' as dependencies

  const onChange = async (resumeText) => {
    setIsLoading(true)
    const params = {
      'add_jobs': 'true'
    }
    const matchedJobs = await get_jobs_skills_match(title, location, resumeText, params);
    setJobs(matchedJobs['results']);
    setResults(matchedJobs['length']);
    setIsLoading(false)
    setInfiniteScroll(false);
  };

  return (
    <div>
      <Result results={results} title={title} location={location} onchange={onChange} />
      {jobs && jobs.length > 0 ? (
        jobs.map((item, _) => (
          <Card jsonData={item} isLoading={isloading} onClick={handleClick} />
        ))
      ) : (
        Array.from({ length: 10 }, (_, index) => (
          <Card jsonData={example_json} isLoading={true} onClick={handleClick} key={index} />
        ))      
      )}
    </div>
  );
}


export default Timeline;
