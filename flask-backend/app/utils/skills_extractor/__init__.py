import re
import json
import os
# Get the absolute path to the directory containing this script
script_dir = os.path.dirname(os.path.abspath(__file__))

# Construct the full path to the skills.json file relative to the script directory
skills_file_path = os.path.join(script_dir, 'skills.json')


class Text_Analyser:

    def extract_skills(job_description):
        """ 
        Extract skills from job description 
        """

        extracted_qualifications = []
        with open(skills_file_path) as f:
            skills = json.load(f)
            pattern = re.compile(r'\b(' + '|'.join(skills.keys()) + r')\b', flags=re.IGNORECASE)
            extracted_qualifications = list(set(pattern.findall(job_description)))

        return extracted_qualifications