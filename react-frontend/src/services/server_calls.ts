
const PORT_URL = 'http://127.0.0.1:5000';

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

export const get_jobs_skills_match = async (name: string, location: string, resume: string, params:  Record<string, string | undefined>) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
  "Resume": resume
  });

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const urlParams = new URLSearchParams(params);
  const queryString = urlParams.toString();
  return fetch(`${PORT_URL}/get_jobs_skills_match/${name}/${location}?${queryString}`, requestOptions)
  .then(response => response.json()) // Parse the response as JSON
  .then(result => {
    return result; // Return the parsed result
  })
  .catch(error => {
    console.log('error', error);
    throw error; // Throw the error to be caught in the component
  });
};


//: Promise<JobData[]>
export const get_jobs = async (name: string, location: string, params:  Record<string, string | undefined>) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const requestOptions: RequestInit = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };

  const urlParams = new URLSearchParams(params);
  const queryString = urlParams.toString();
  const url = `${PORT_URL}/get_jobs/${name}/${location}?${queryString}`;

  try {
    const response = await fetch(url, requestOptions);
    const result = await response.json(); // Parse the response as JSON
    return result; // Return the parsed result
  } catch (error) {
    console.log('error', error);
    throw error; // Throw the error to be caught in the component
  }
};


export const get_job_info = async (id: number, params:  Record<string, string | undefined>): Promise<JobData[]> => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const requestOptions: RequestInit = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };

  const urlParams = new URLSearchParams(params);
  const queryString = urlParams.toString();
  const url = `${PORT_URL}/get_job_posting/${id}`;

  try {
    const response = await fetch(url, requestOptions);
    const result = await response.json(); // Parse the response as JSON
    return result; // Return the parsed result
  } catch (error) {
    console.log('error', error);
    throw error; // Throw the error to be caught in the component
  }
};
