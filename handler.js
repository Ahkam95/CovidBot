'use strict';
const axios = require("axios");

module.exports.getCovidData = async event => {
  
  const caseTitle = event.currentIntent.slots["case"];
  const country = event.currentIntent.slots["country"];

  const url = "https://api.covid19api.com/summary";

  try {
    const response = await axios.get(url);
    const data = response.data.Countries;
    //data = data['Countries'];
    
    var countryObject= data.find(obj => {
      return obj.Slug == country;
    })
    
    var caseType="";
    if(caseTitle=="new"){
      caseType= "NewConfirmed";
    }else if(caseTitle=="recovered"){
      caseType= "TotalRecovered";
    }else if(caseTitle=="deaths"){
      caseType= "TotalDeaths";
    }
   
    //const answer= "Covid " + cases + " cases in "+ country + " is " + data[data.length -1][cases.charAt(0).toUpperCase()+cases.slice(1)];
    //const answer = "Covid " + caseType + " case in "+ country + " is " + data['Countries'][data['Countries']['Slug']== country][caseType];
    const answer = "Covid " + caseType + " case in "+ country + " is " + countryObject[caseType];

    // returning structure where aws lex can understand 
    return {
      "sessionAttributes": {},
      "dialogAction": {
        "type": "Close",
        "fulfillmentState": "Fulfilled",
        "message": {
          "contentType": "PlainText",
          "content": answer
        }
      }
    }
  } catch (error) {
    console.log(error);
  }

};
