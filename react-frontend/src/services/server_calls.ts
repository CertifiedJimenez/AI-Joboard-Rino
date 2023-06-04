
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

export const get_jobs_skills_match = async (name: string, location: string, params:  Record<string, string | undefined>): Promise<JobData[]> => {
  debugger
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
  "Resume": "Cristofer Jimenez Hernandez London, United Kingdom · contact@cristoferjimenez.com · +44 75193 07667 · https://cristoferjimenez.com/ Work Rolecatcher Remote Full Stack Developer Feb 2022 - Present • Provided crucial support to a junior developer struggling with a complex project, offering guidance and troubleshooting assistance to help them overcome technical obstacles and achieve their objectives. • Directed the successful development and launch of an exciting project, overseeing the entire development lifecycle from initial design to user feedback analysis. • Led a team-wide effort to improve development processes, identifying areas for improvement and implementing new tools and methodologies to streamline workflows and improve project outcomes. • Designed and developed a data dashboard panel in Django that displayed key information to users, resulting in a 20% increase in user engagement. • Developed a highly efficient backend using the Django Python framework, leveraging CRUD operations and advanced techniques to optimize performance and streamline development processes. • Built a user settings page and email authentication system that improved user experience and boosted sign-ups by 25%. • Refactored code with an emphasis on reusability, object orientation and reducing load on the database server, leading to a 15% improvement in website speed and performance. • Successfully collaborated with a team of developers and designers to build and deploy multiple web applications on the Django framework, resulting in a 40% increase in user acquisition and retention. • Demonstrated expertise in Django frameworks, using REST API, PostgresSQL databases, as well as HTML, CSS, and JavaScript to develop visually appealing and user-friendly web pages. WePrepFBA Remote Zoho - Full Stack Developer Feb 2022 - May 2022 • Developed a warehouse management system that tracks incoming orders using SQL, Python, and Django, resulting in improved efficiency and meeting project requirements. • I leveraged the powerful combination of HTMX and Bootstrap4 to architect and develop the frontend for a comprehensive warehouse management system, demonstrating my proficiency in cutting-edge web development technologies. • Adapted quickly to new technologies, learning Deluge within 3 days and proposing using Django instead to better meet the aim for project requirements. • Collaborated effectively with cross-functional teams to troubleshoot and solve technical issues, resulting in a 25% decrease in project turnaround time. • Implemented various features, such as order tracking, inventory management, and reporting functionalities, to provide a comprehensive solution to the client's needs. • Led and participated in regular meetings and presentations with clients and cross-functional teams, ensuring that all project requirements and timelines were met while maintaining an open line of communication throughout the project. Norfolk Community Advice Network Norwich Project manager (Work Experience) Jun 2021 - Jul 2021 • Maintained effective communication channels with the client, providing regular updates on project progress and addressing any concerns or queries they had promptly. • Provided regular feedback and coaching to team members to enhance their skills and capabilities, resulting in improved team performance and job satisfaction. • Led a team of 8 professionals in delivering a high-quality website that resulted in a 50% increase in productivity. • Gathered and processed client requirements into a Gantt chart, boosting team productivity and achieving a 15% improvement in project completion time. • Efficiently managed a large volume of pending requirements and technical issues, ensuring smooth project execution and a 30% decrease in project delay. • Coordinated with internal stakeholders to ensure that project milestones were met on time and within budget. Project AI Job Board Flask, NumPy, Pandas, SQL, Scikit-learn Reference upon request As part of a team, I built an AI-powered job board using Flask that allows job seekers to easily find the most relevant job openings based on their skills and experience. The job board features an AI model that extracts skills from job listings and ranks them against a user's CV, providing a customized list of the most relevant job openings. Trading Portfolio Tracker Django, JavaScript, RESTful API, Data visualization Reference upon request Developed a Django web application that allows users to track their MetaTrader account, view portfolio and account information, and journal trades for analysis. This project provided users with real-time updates on their account performance, resulting in a 25% increase in user engagement and satisfaction. The app also allowed for seamless integration with different MetaTrader account types and can be easily customized to meet the specific needs of different traders and investment firms. Python Indeed Scraper Library Selenium, Data extraction, Web crawling, Automation https://github.com/CertifiedJimenez/Indeed-Auto-Apply-Python I created a Python library package that automates the job application process on Indeed using BeautifulSoup and Selenium. This led to a 40% increase in relevant job applications and saved 10 hours per week for the job seeker. The library is scalable and customizable for different industries. Skills Frontend: HTML, CSS, React, JQuery Backend: Django, Flask Database: PostgresSQL Languages: Python, Javascript, Typescript, SQL Version Control: Github, Git, Bash Interests: FIGMA UX/UI, Photoshop, Premier Pro Education DevelopEBP Norwich, England BTEC National Diploma Information Technology GPA: Distinction Aug 2019 - Jul 2022 University of Essex Colchester, England BSc Computer Science Aug 2022 - Interrupted" 
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


export const get_jobs = async (name: string, location: string, params:  Record<string, string | undefined>): Promise<JobData[]> => {
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


