import requests

def request_salary_insight(title: str, location: str):
    """
    This uses the PayScale API to get the average salary
    """


    generate_reports_url = 'https://jobalyzer.payscale.com/jobalyzer/v2/reports'
    get_token_url = 'https://accounts.payscale.com/connect/token'

    client_id = '<your-client-id>'
    client_secret = '<your-client-secret>'

    payload = {
        'grant_type': 'client_credentials',
        'scope': 'jobalyzer',
        'client_id': client_id,
        'client_secret': client_secret
    }

    token_response = requests.post(get_token_url, data=payload)

    if token_response.status_code == 200:
        token = token_response.json()['access_token']
        headers = {'Authorization': f'Bearer {token}'}

        data = {
            "AutoResolveJobTitle": True,
            "requestedReports": ["yoe", "pay"],
            "answers": {
                "JobTitle": title,
                "City": location,
            }
        }
        
        request_response = requests.post(generate_reports_url, json=data, headers=headers)
        if request_response.status_code == 200:
            reports = request_response.json()
            print(reports)
        else:
            print(f'Failed to generate reports: {request_response.text}')
    else:
        print(f'Failed to get token: {token_response.text}')



