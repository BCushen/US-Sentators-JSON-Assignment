// JSON DATA IMPORT CODE. 

/*  The following section fetches JSON data for use later in the code.
    This code was adapted for the project based on samples provided as part of the module, namely FetchYoutubeData.html. Refer to Lecture 11.
    Basic Error Checking from Lecture 12 Slide 17 also included. */

const url = "senators.json";

fetch(url)
    .then((promise) => {
        if(!promise.ok) {
            throw new Error("Error with network response.");
        }
       return promise.json();
    })
    .then((data) => { countSenators(data);
                    leaderSenators(data);
                    getAllSenators(data);
                    createDropdowns(data); 
                    allData = data;})   // Data assigned to "allData" for use in getAllSenators function.

    .catch((error) => console.error("Problem with fetch: ", error));

// END OF JSON DATA IMPORT CODE



// CREATION OF DROPDOWNS

/*  This function extracts the "objects" array from the senators.json file and saves it as an array called ObjectList.
    The function then iterates through each object in the array assigning the object properties party, state and rank to 
    local variables of the same name. Empty arrays to contain the values have been initialised (i.e. partyList, stateList, rankList).
    A set of if statements and the includes() method are used to determine whether or not the value for party, state and rank are
    present in their respective list. If they are not present they are added with the push() method.
    This methodology has been chosen to avoid duplication of list items. 
    Dropdown are initialized as "All". See rankOptions, stateOptions, partyOptions.
    A set of for loops is used to add the contents of partyList, stateList and rankList to rankOptions, stateOptions and partyOptions, respectively.
    
    References:
    JavaScript Array includes() Method: https://www.w3schools.com/jsref/jsref_includes_array.asp
    JavaScript Array push() Method: https://www.w3schools.com/js/js_arrays.asp
*/

function createDropdowns(obj)
{
    let objectList = obj.objects;

    const partyList = [];
    const stateList = [];
    const rankList = [];

    for (let i = 0; i < objectList.length; i++)
    {
        let party = objectList[i].party;
        let state = objectList[i].state;
        let rank = objectList[i].senator_rank_label;

        if (!(partyList.includes(party))) 
        {
            partyList.push(party);              
        }

        if (!(stateList.includes(state))) 
        {
            stateList.push(state);
        }

        if (!(rankList.includes(rank))) 
        {
            rankList.push(rank);
        }
    }

    const stateListSorted = stateList.sort();

    let partyOptions = "<option value = 'All'>All</option>";
    let stateOptions = "<option value = 'All'>All</option>";
    let rankOptions = "<option value = 'All'>All</option>";

    for (let i = 0; i < partyList.length; i++)
    {
        partyOptions += '<option value = "' + partyList[i] + '">' + partyList[i] + '</option>'
    }
    for (let i = 0; i < stateListSorted.length; i++)
    {
        stateOptions += '<option value = "' + stateListSorted[i] + '">' + stateListSorted[i] + '</option>'
    }
    for (let i = 0; i < rankList.length; i++)
    {
        rankOptions += '<option value = "' + rankList[i] + '">' + rankList[i] + '</option>'
    }

    document.getElementById("partyDropdown").innerHTML = partyOptions;
    document.getElementById("stateDropdown").innerHTML = stateOptions;
    document.getElementById("rankDropdown").innerHTML = rankOptions;
}

// END OF DROPDOWN CREATION SEGMENT



// FILTER CONTROL

/*  The following section monitors the values of the drop downs menus used for filtering.
    The current values of the dropdowns are stored in the partyValue, stateValue and rankValue variables.
    These variables have been made global so that they are accessible to the setFilterValues function and the
    getAllSenators function (defined later in code).
    Filter value variables are all manually initialized to "All".
    Event Listeners are used to monitor the dropdowns and upon any change the setFilterValues function is called which
    updates all three filter variables to the current values of the dropdowns. The setFilterValues function then calls the
    getAllSenators function which serves to filter through the JSON data and display the filtered data requested.  */

let partyValue = "All"
let stateValue = "All"
let rankValue = "All"

document.getElementById("partyDropdown").addEventListener('change', setFilterValues)
document.getElementById("stateDropdown").addEventListener('change', setFilterValues)
document.getElementById("rankDropdown").addEventListener('change', setFilterValues)

function setFilterValues(obj)
{
    partyValue = document.getElementById("partyDropdown").value;
    stateValue = document.getElementById("stateDropdown").value;
    rankValue = document.getElementById("rankDropdown").value;

    getAllSenators(allData);
}

// END OF FILTER CONTROL


// COUNTING SENATORS

/*  The following function uses a for loop to iterate through the JSON file and count the number of Democrat, Republican and Independent senators. 
    For each party a count variable is initialised to 0. A for loop is used to iterate through the array of senators in objectList and use conditional
    statements to increment the appropriate counter based on the "party" property value or each senator in the array. These are then displayed.
    This code for iterating through the array was adapted for the project based on samples provided as part of the module, namely readColorDataFetch.html. 
    Refer to Lecture 11. */

function countSenators(obj)
{
    let countDemocrat = 0;
    let countRepublican = 0;
    let countIndependent = 0;

    let objectList = obj.objects;

    for (let i = 0; i < objectList.length; i++)
        {
        let party = objectList[i].party;

        if (party == "Democrat")
        {
            countDemocrat += 1;
        }
        else if (party == "Republican")
        {
            countRepublican += 1;
        }
        else if (party == "Independent")
        {
            countIndependent += 1;
        }
        }

    htmlText = '<h2> Number of Democrat Senators</h2>'
    htmlText += '<p class="Democrat_Count">' + countDemocrat +'</p>'
    htmlText += '<h2>Number of Republican Senators</h2>'
    htmlText += '<p class="Republican_Count">' + countRepublican +'</p>'
    htmlText += '<h2>Number of Independent Senators</h2>'
    htmlText += '<p class="Independent_Count">' + countIndependent +'</p>'

    document.getElementById("totalSenators").innerHTML = htmlText;
}

// END OF COUNTING SENATORS   



// LEADER SENATORS

/*  This code iterates through the array of senator objects in objectList using a for loop and extracts the required senator data for display.
    Conditional statements are used to select senators for whom the leadership_title property of the object is not null. Conditional statements 
    differentiate between between party and generate HTML text which is stored in string variables (i.e. htmlTextLeadersDemocrats and htmlTextLeadersDemocrats.
    Code for selecting independent senators is include but is commented out as there are no independent senators in leadership roles and it was decided not
    to display this result.*/

function leaderSenators(obj)
{
    let objectList = obj.objects;

    htmlTextLeadersDemocrats = '<h2>Democrat Leaders</h2>';
    htmlTextLeadersRepublicans = '<h2>Republican Leaders</h2>';

    for (let i = 0; i < objectList.length; i++)
    {
        let leaderTitle = objectList[i].leadership_title;
        let party = objectList[i].party;
        let person = objectList[i].person;
        let firstname = person.firstname;
        let middlename = person.middlename;
        let lastname = person.lastname;


        if (leaderTitle != null && party == "Democrat")
        {
            htmlTextLeadersDemocrats += leaderTitle + ':\t' + firstname + " " + middlename + " " + lastname + " " + '(' + party + ')' +'<br>';
        }

        else if (leaderTitle != null && party == "Republican")
        {
            htmlTextLeadersRepublicans += leaderTitle + ':\t' + firstname + " " + middlename + " " + lastname + " " + '(' + party + ')' + '<br>';
        }

        /* else if (leaderTitle != null && party == "Independent")
        {
            htmlTextLeadersIndependents += leaderTitle + ':\t' + firstname + " " + middlename + " " + lastname + " " + '(' + party + ')' + '<br>';
        }*/
        
    }

    document.getElementById("leaders").innerHTML = htmlTextLeadersDemocrats + htmlTextLeadersRepublicans;
}
        
// END OF LEADER SENATORS


// FILTERING OF SENATORS VIA DROPDOWNS

/*  The following getAllSenators function uses the global partyValue, stateValue and rankValue variable values to filter the JSON data.
    Dropdown value logic has two possibilites for each dropdown, Value == All and Value != All. There are 2^3 = 8 possible All/!All dropdown 
    combinations and conditional statements have been used to accomodate each possible combination.
    
    For each combination, where the dropdown value is !All, the code iterates through the JSON senator objects and the selected property and value
    from the drop down (e.g. Party Dropdown Value = "Republican" is compared to the corresponding property value extracted from the JSON). 
    When these values are equal, the senatorsDisplay function (nested, see below) is called and adds HTML code for that senator to one of three string variables,
    htmlRepSenatorsText, htmlDemSenatorsText and htmlIndSenatorsText. These are then concatenated together in the order htmlDepSenatorsText + htmlDemSenatorsText
    + htmlIndSenatorsText in order to display senators in the order Democrat > Republican > Independent for cases where filter combinations result
    in output of senators from multiple parties for the chosen filter conditions.
    
    Note that each string variable is initialised to an empty string to facilitate logic which displays a message "No senators for these search conditions!"
    where the filter combinations return no results. 

    To satisfy the assignment requirement to display more senator data when a senator is selected, flip cards have been implemented. Hovering over the card
    flips the card to reveal further senator information.

    References:
    HTML Flip Cards Code: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_flip_card      

*/

function getAllSenators(obj)
{
    let objectList = obj.objects;

    // DISPLAYING SENATORS

    /*  The following function takes the extracted senators data and formats it into HTML text required to display a flipcard displaying
        all senator data requested as part of the assignment. Flip cards are grouped by party and finally concatenated into a single variable,
        htmlAllSenatorsText which is returned by the function and assigned to a variable with the same name (outside of the scope of senatorsDisplay 
        but within getAllSenators) and located in each conditional statement. */

    function senatorsDisplay(a, b, c, d, e, f, g, h, i, j, k, l, m ,n, o, p, q)
    {
        party = a;
        htmlAllSenatorsText = b;
        htmlDemSenatorsText = c;
        htmlRepSenatorsText = d;
        htmlIndSenatorsText = e;
        firstname = f;
        middlename = g;
        lastname = h;
        state = i;
        gender = j;
        rank = k;
        office = l;
        dob = m;
        startDate = n;
        twitterID = o;
        youtubeID = p;
        website = q;
        
        if (party == "Republican")
        {
            htmlRepSenatorsText +=  '<div class="flip-card">' +
                                    '<div class="flip-card-inner">' +
                                    '<div class="flip-card-front" ' +
                                    'style = "background-color: red;"' +
                                    '>' +
                                        '<h3><span class="flip_text_name">' + firstname + " " + middlename + " " + lastname + '</span></h3>' +
                                        '<p>' + "<strong>Party: </strong>" + party + '</p>' +
                                        '<p>' + "<strong>State: </strong>" + state + '</p>' +
                                        '<p>' + "<strong>Gender: </strong>" + gender + '</p>' +
                                        '<p>' + "<strong>Rank: </strong>" + rank + '</p>' +
                                        '</div>' +
                                        '<div class="flip-card-back">' +
                                        '<p><span class="flip_text"><strong>Office: </strong>' + office + '</span></p>' +
                                        '<p><span class="flip_text"><strong>DOB: </strong>' + dob + '</span></p>' +
                                        '<p><span class="flip_text"><strong>Start Date: </strong>' + startDate + '</span></p>' +
                                        '<p><span class="flip_text"><strong>Twitter: </strong>' + twitterID + '</span></p>' +
                                        '<p><span class="flip_text"><strong>YouTube: </strong>' + youtubeID + '</span></p>' +
                                        '<p><span class="flip_text"><a href="' + website + '">Clickable Link to Website</a></span></p>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>';
        }
    
        else if (party == "Democrat")
        {
            htmlDemSenatorsText +=  '<div class="flip-card">' +
                                    '<div class="flip-card-inner">' +
                                    '<div class="flip-card-front" ' +
                                    'style = "background-color: #3535FF;"' +
                                    '>' +
                                        '<h3><span class="flip_text_name">' + firstname + " " + middlename + " " + lastname + '</span></h3>' +
                                        '<p>' + "<strong>Party: </strong>" + party + '</p>' +
                                        '<p>' + "<strong>State: </strong>" + state + '</p>' +
                                        '<p>' + "<strong>Gender: </strong>" + gender + '</p>' +
                                        '<p>' + "<strong>Rank: </strong>" + rank + '</p>' +
                                        '</div>' +
                                        '<div class="flip-card-back">' +
                                        '<p><span class="flip_text"><strong>Office: </strong>' + office + '</span></p>' +
                                        '<p><span class="flip_text"><strong>DOB: </strong>' + dob + '</span></p>' +
                                        '<p><span class="flip_text"><strong>Start Date: </strong>' + startDate + '</span></p>' +
                                        '<p><span class="flip_text"><strong>Twitter: </strong>' + twitterID + '</span></p>' +
                                        '<p><span class="flip_text"><strong>YouTube: </strong>' + youtubeID + '</span></p>' +
                                        '<p><span class="flip_text"><a href="' + website + '"target="_blank">Clickable Link to Website</a></span></p>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>';
        }
        else if (party == "Independent")
        {
            htmlIndSenatorsText +=  '<div class="flip-card">' +
                                    '<div class="flip-card-inner">' +
                                    '<div class="flip-card-front" ' +
                                    'style = "background-color: gray;"' +
                                    '>' +
                                        '<h3><span class="flip_text_name">' + firstname + " " + middlename + " " + lastname + '</span></h3>' +
                                        '<p>' + "<strong>Party: </strong>" + party + '</p>' +
                                        '<p>' + "<strong>State: </strong>" + state + '</p>' +
                                        '<p>' + "<strong>Gender: </strong>" + gender + '</p>' +
                                        '<p>' + "<strong>Rank: </strong>" + rank + '</p>' +
                                        '</div>' +
                                        '<div class="flip-card-back">' +
                                        '<p><span class="flip_text"><strong>Office: </strong>' + office + '</span></p>' +
                                        '<p><span class="flip_text"><strong>DOB: </strong>' + dob + '</span></p>' +
                                        '<p><span class="flip_text"><strong>Start Date: </strong>' + startDate + '</span></p>' +
                                        '<p><span class="flip_text"><strong>Twitter: </strong>' + twitterID + '</span></p>' +
                                        '<p><span class="flip_text"><strong>YouTube: </strong>' + youtubeID + '</span></p>' +
                                        '<p><span class="flip_text"><a href="' + website + '">Clickable Link to Website</a></span></p>' +
                                        '</div>' +
                                        '</div>' +
                                        '</div>';
        
        
        }
        htmlAllSenatorsText = htmlDemSenatorsText + htmlRepSenatorsText + htmlIndSenatorsText;
        return htmlAllSenatorsText;
    }

    
    htmlAllSenatorsText = "";       // Set to "" to facilitate case where no senators found for specific filter conditions.
    htmlDemSenatorsText = "";
    htmlRepSenatorsText = "";
    htmlIndSenatorsText = "";

    // Shows all senators. 

    if(partyValue == "All" && stateValue == "All" && rankValue == "All")
    {
        for (let i = 0; i < objectList.length; i++)
        {
            let party = objectList[i].party;
            let state = objectList[i].state;
            let rank = objectList[i].senator_rank_label;
            let startDate = objectList[i].startdate;
            let website = objectList[i].website;

            let extra = objectList[i].extra;
            let office = extra.office;

            let person = objectList[i].person;
            let firstname = person.firstname;
            let middlename = person.middlename;
            let lastname = person.lastname;
            let gender = person.gender_label;
            let dob = person.birthday;
            let twitterID = person.twitterid;
            let youtubeID = person.youtubeid;

                                            
            htmlAllSenatorsText = senatorsDisplay(party, htmlAllSenatorsText, htmlDemSenatorsText, 
            htmlRepSenatorsText, htmlIndSenatorsText, firstname, middlename, lastname, 
            state, gender, rank, office, dob, startDate, twitterID, youtubeID, website);

        }
        
        //htmlAllSenatorsText = htmlDemSenatorsText + htmlRepSenatorsText + htmlIndSenatorsText;

        if (htmlAllSenatorsText == "")
        {
            htmlAllSenatorsText = "No senators for these search conditions!"
            document.getElementById("allSenators").innerHTML = htmlAllSenatorsText;
        }
        else
        {
            document.getElementById("allSenators").innerHTML = htmlAllSenatorsText;
        }
        
        
    }

    // Selects by Party. Shows all Juniors and Seniors.

    else if (partyValue != "All" && stateValue == "All" && rankValue == "All")
    {
        for (let i = 0; i < objectList.length; i++)
        {
            let party = objectList[i].party;
            let state = objectList[i].state;
            let rank = objectList[i].senator_rank_label;
            let startDate = objectList[i].startdate;
            let website = objectList[i].website;

            let extra = objectList[i].extra;
            let office = extra.office;

            let person = objectList[i].person;
            let firstname = person.firstname;
            let middlename = person.middlename;
            let lastname = person.lastname;
            let gender = person.gender_label;
            let dob = person.birthday;
            let twitterID = person.twitterid;
            let youtubeID = person.youtubeid;

            if(party == partyValue)
            {
                htmlAllSenatorsText = senatorsDisplay(party, htmlAllSenatorsText, htmlDemSenatorsText, 
                htmlRepSenatorsText, htmlIndSenatorsText, firstname, middlename, lastname, 
                state, gender, rank, office, dob, startDate, twitterID, youtubeID, website);
            }
        
        }

        if (htmlAllSenatorsText == "")
        {
            htmlAllSenatorsText = "No senators for these search conditions!"
            document.getElementById("allSenators").innerHTML = htmlAllSenatorsText;
        }
        else
        {
            document.getElementById("allSenators").innerHTML = htmlAllSenatorsText;
        }
    }

    // Selects by party and state. Shows all Juniors and Seniors.

    else if (partyValue != "All" && stateValue != "All" && rankValue == "All")
    {
        for (let i = 0; i < objectList.length; i++)
        {
            let party = objectList[i].party;
            let state = objectList[i].state;
            let rank = objectList[i].senator_rank_label;
            let startDate = objectList[i].startdate;
            let website = objectList[i].website;

            let extra = objectList[i].extra;
            let office = extra.office;

            let person = objectList[i].person;
            let firstname = person.firstname;
            let middlename = person.middlename;
            let lastname = person.lastname;
            let gender = person.gender_label;
            let dob = person.birthday;
            let twitterID = person.twitterid;
            let youtubeID = person.youtubeid;

            if(party == partyValue && state == stateValue)
            {
                htmlAllSenatorsText = senatorsDisplay(party, htmlAllSenatorsText, htmlDemSenatorsText, 
                htmlRepSenatorsText, htmlIndSenatorsText, firstname, middlename, lastname, 
                state, gender, rank, office, dob, startDate, twitterID, youtubeID, website);
            }
        
        }

        if (htmlAllSenatorsText == "")
        {
            htmlAllSenatorsText = "No senators for these search conditions!"
            document.getElementById("allSenators").innerHTML = htmlAllSenatorsText;
        }
        else
        {
            document.getElementById("allSenators").innerHTML = htmlAllSenatorsText;
        }
    }

    // Selects by Party, State and Rank
    else if (partyValue != "All" && stateValue != "All" && rankValue != "All")
    {
        for (let i = 0; i < objectList.length; i++)
        {
            let party = objectList[i].party;
            let state = objectList[i].state;
            let rank = objectList[i].senator_rank_label;
            let startDate = objectList[i].startdate;
            let website = objectList[i].website;

            let extra = objectList[i].extra;
            let office = extra.office;

            let person = objectList[i].person;
            let firstname = person.firstname;
            let middlename = person.middlename;
            let lastname = person.lastname;
            let gender = person.gender_label;
            let dob = person.birthday;
            let twitterID = person.twitterid;
            let youtubeID = person.youtubeid;

            if(party == partyValue && state == stateValue && rank == rankValue)
            {
                htmlAllSenatorsText = senatorsDisplay(party, htmlAllSenatorsText, htmlDemSenatorsText, 
                htmlRepSenatorsText, htmlIndSenatorsText, firstname, middlename, lastname, 
                state, gender, rank, office, dob, startDate, twitterID, youtubeID, website);
            }
        
        }

        if (htmlAllSenatorsText == "")
        {
            htmlAllSenatorsText = "No senators for these search conditions!"
            document.getElementById("allSenators").innerHTML = htmlAllSenatorsText;
        }
        else
        {
            document.getElementById("allSenators").innerHTML = htmlAllSenatorsText;
        }
    }

    // Selects by Rank. Shows all Parties & States
    else if (partyValue == "All" && stateValue == "All" && rankValue != "All")
    {
        for (let i = 0; i < objectList.length; i++)
        {
            let party = objectList[i].party;
            let state = objectList[i].state;
            let rank = objectList[i].senator_rank_label;
            let startDate = objectList[i].startdate;
            let website = objectList[i].website;

            let extra = objectList[i].extra;
            let office = extra.office;

            let person = objectList[i].person;
            let firstname = person.firstname;
            let middlename = person.middlename;
            let lastname = person.lastname;
            let gender = person.gender_label;
            let dob = person.birthday;
            let twitterID = person.twitterid;
            let youtubeID = person.youtubeid;

            if(rank == rankValue)
            {
                htmlAllSenatorsText = senatorsDisplay(party, htmlAllSenatorsText, htmlDemSenatorsText, 
                htmlRepSenatorsText, htmlIndSenatorsText, firstname, middlename, lastname, 
                state, gender, rank, office, dob, startDate, twitterID, youtubeID, website);
            }
        
        }

        if (htmlAllSenatorsText == "")
        {
            htmlAllSenatorsText = "No senators for these search conditions!"
            document.getElementById("allSenators").innerHTML = htmlAllSenatorsText;
        }
        else
        {
            document.getElementById("allSenators").innerHTML = htmlAllSenatorsText;
        }
    }
    
    // Selects by Rank and Party

    else if (partyValue != "All" && stateValue == "All" && rankValue != "All")
    {
        for (let i = 0; i < objectList.length; i++)
        {
            let party = objectList[i].party;
            let state = objectList[i].state;
            let rank = objectList[i].senator_rank_label;
            let startDate = objectList[i].startdate;
            let website = objectList[i].website;

            let extra = objectList[i].extra;
            let office = extra.office;

            let person = objectList[i].person;
            let firstname = person.firstname;
            let middlename = person.middlename;
            let lastname = person.lastname;
            let gender = person.gender_label;
            let dob = person.birthday;
            let twitterID = person.twitterid;
            let youtubeID = person.youtubeid;

            if(party == partyValue && rank == rankValue)
            {
                htmlAllSenatorsText = senatorsDisplay(party, htmlAllSenatorsText, htmlDemSenatorsText, 
                htmlRepSenatorsText, htmlIndSenatorsText, firstname, middlename, lastname, 
                state, gender, rank, office, dob, startDate, twitterID, youtubeID, website);
            }
        
        }

        if (htmlAllSenatorsText == "")
        {
            htmlAllSenatorsText = "No senators for these search conditions!"
            document.getElementById("allSenators").innerHTML = htmlAllSenatorsText;
        }
        else
        {
            document.getElementById("allSenators").innerHTML = htmlAllSenatorsText;
        }
    }

    else if (partyValue == "All" && stateValue != "All" && rankValue == "All")
    {
        for (let i = 0; i < objectList.length; i++)
        {
            let party = objectList[i].party;
            let state = objectList[i].state;
            let rank = objectList[i].senator_rank_label;
            let startDate = objectList[i].startdate;
            let website = objectList[i].website;

            let extra = objectList[i].extra;
            let office = extra.office;

            let person = objectList[i].person;
            let firstname = person.firstname;
            let middlename = person.middlename;
            let lastname = person.lastname;
            let gender = person.gender_label;
            let dob = person.birthday;
            let twitterID = person.twitterid;
            let youtubeID = person.youtubeid;

            if(state == stateValue)
            {
                htmlAllSenatorsText = senatorsDisplay(party, htmlAllSenatorsText, htmlDemSenatorsText, 
                htmlRepSenatorsText, htmlIndSenatorsText, firstname, middlename, lastname, 
                state, gender, rank, office, dob, startDate, twitterID, youtubeID, website);
            }
        
        }
        
        if (htmlAllSenatorsText == "")
        {
            htmlAllSenatorsText = "No senators for these search conditions!"
            document.getElementById("allSenators").innerHTML = htmlAllSenatorsText;
        }
        else
        {
            document.getElementById("allSenators").innerHTML = htmlAllSenatorsText;
        }
    }

    else if (partyValue == "All" && stateValue != "All" && rankValue != "All")
    {
        for (let i = 0; i < objectList.length; i++)
        {
            let party = objectList[i].party;
            let state = objectList[i].state;
            let rank = objectList[i].senator_rank_label;
            let startDate = objectList[i].startdate;
            let website = objectList[i].website;

            let extra = objectList[i].extra;
            let office = extra.office;

            let person = objectList[i].person;
            let firstname = person.firstname;
            let middlename = person.middlename;
            let lastname = person.lastname;
            let gender = person.gender_label;
            let dob = person.birthday;
            let twitterID = person.twitterid;
            let youtubeID = person.youtubeid;

            if(state == stateValue && rank == rankValue)
            {
                htmlAllSenatorsText = senatorsDisplay(party, htmlAllSenatorsText, htmlDemSenatorsText, 
                htmlRepSenatorsText, htmlIndSenatorsText, firstname, middlename, lastname, 
                state, gender, rank, office, dob, startDate, twitterID, youtubeID, website);
            }
        
        }
        
        if (htmlAllSenatorsText == "")
        {
            htmlAllSenatorsText = "No senators for these search conditions!"
            document.getElementById("allSenators").innerHTML = htmlAllSenatorsText;
        }
        else
        {
            document.getElementById("allSenators").innerHTML = htmlAllSenatorsText;
        }
    }

}
