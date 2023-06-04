import requests
import re

API_KEY = 'AIzaSyCKNKfRCcvyxx8vreSpyD-SDK0k4Iis89Y'
CUSTOM_SEARCH_ENGINE_ID = '43d60d4ca5b05426f'

def seach_linkedin(company, location):
    """
    This function will do a search on the linkedin people
    assosiated with the account. 
    """   

    SEARCH_QUERY = company, '"linkedin"', location

    def search_linkedin(query):
        url = f"https://www.googleapis.com/customsearch/v1?key={API_KEY}&cx={CUSTOM_SEARCH_ENGINE_ID}&q={query}"
        response = requests.get(url)
        data = response.json()
        return data

    linkedin_results = []
    results = search_linkedin(SEARCH_QUERY)
    for item in results['items']:
        linkedin_results.append(item)

    return linkedin_results


def get_company_logo(company, location):
    """
    This function will do a search on the web for a company logo
    that matches the exact name.    
    """
    
    SEARCH_QUERY = company, '"LOGO"', location
    logos = []

    def search_images(query):
        url = f"https://www.googleapis.com/customsearch/v1?key={API_KEY}&cx={CUSTOM_SEARCH_ENGINE_ID}&q={query}&searchType=image"
        response = requests.get(url)
        data = response.json()
        return data

    
    results = search_images(SEARCH_QUERY)
    for item in results['items']:
        print(item['title'], item['link'])
        logos.append(item)
    return logos



def get_linkedin_people(data: dict) -> list[dict]:
    """
    Gets the linkedin people linkedin information
    that works at the company from the scrapped data.
    """
    person = []
    for pages in data:
        url = pages.get('link')
        #qualify as a person
        if '/in/' in url:
            data = {}
            data['link'] = url
            data['name'] = str(url.split('/in/')[1]).replace('-', ' ')
            data['image'] = pages.get('pagemap').get('cse_image')[0].get('src')
            person.append(data)

    return [person]