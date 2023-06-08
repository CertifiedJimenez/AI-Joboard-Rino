const PORT_URL = 'http://127.0.0.1:5000';

export const get_salary_insight = async (name: string, location: string) => {
    const url = `${PORT_URL}/get_salary_api/${name}/${location}`;
    try {
        const response = await fetch(url);
        const result = await response.json(); // Parse the response as JSON
        return result; // Return the parsed result
      } catch (error) {
        console.log('error', error);
        throw error; // Throw the error to be caught in the component
      }
}


export const SalaryRangeIndicatorElement = ({average, price}) => {
  // Once the get_slary call has been made it will then use that data to know which inicator to display.  

  const number_average = convertToNumber(average);
  const number_price = convertToNumber(price);
  const bullish = (number_average < number_price) ? true : false;
  const percentage_difference = Math.abs((number_price - number_average) / number_average) * 100;
  const message = `${percentage_difference}% ${bullish ? 'Above' : 'Below'} Market Value`

  return (
    bullish ? <i className="bi bi-arrow-up" style={{color: 'green'}} title={message}></i> : <i className="bi bi-arrow-down red" style={{color: 'red'}}  title={message}></i>
  );
}

function convertToNumber(value) {
  if (!isNaN(value)) {
    return Number(value);
  }
  return value;
}