import React, {useEffect, useState } from 'react';
import 'bootstrap-select/dist/css/bootstrap-select.min.css';
import 'bootstrap-select/dist/js/bootstrap-select.min.js';
// import { Select } from 'react-bootstrap-select';
import { MultiSelect } from "react-multi-select-component";




function Advancedsearch({ company = [], skills = [], yoe = [] }) {
    const [Company, setCompany] = useState(company|| []);
    const [Skills, setSkills] = useState(skills || []);
    const [YOE, setYoe] = useState(yoe || []);

  
    useEffect(() => {
      setCompany(company || []);
      setSkills(skills || []);
    }, [company, skills, yoe]);
  


    const companyOptions = Company.map((name) => ({ label: name, value: name }));
    const [companySelected, setScompanySelected] = useState(companyOptions);
  
    const skillsOptions = Skills.map((name) => ({ label: name, value: name })); 
    const [skillsSelected, setskillsSelected] = useState(skillsOptions);

    return (
      <div className="row mt-4">
        <div className='col-md-4'>
            <label>
            Companies
            </label>    
            <MultiSelect
              options={companyOptions}
              value={companySelected}
              onChange={setScompanySelected}
              labelledBy="Select"
            />
        </div>
  
        <div className='col-md-4'>
          <label>
            Technology
          </label>
          <MultiSelect
              options={skillsOptions}
              value={skillsSelected}
              onChange={setskillsSelected}
              labelledBy="Select"
            />  
        </div>
  
        <div className='col-md-4'>
          <label>
            Years of experience
          </label>
          <select className="form-select" aria-label="Default select example">
            {YOE && YOE.map((name) => (
                <option key={name}>{name}</option>
            ))}
            </select>
        </div>
      </div>
    );
  }
  
  export default Advancedsearch;
  