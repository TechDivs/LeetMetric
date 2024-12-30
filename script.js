document.addEventListener("DOMContentLoaded", function() {

    const searchBtn = document.getElementById("search-btn");
    const usernameinp = document.getElementById("userinp");
    const statsCont = document.querySelector(".stats");
    const progress = document.querySelector(".progress");
    const easy_circle = document.querySelector(".easypro");
    const med_circle = document.querySelector(".medpro");
    const hard_circle = document.querySelector(".hardpro");
    const easy_label = document.getElementById("easy");
    const med_label = document.getElementById("med");
    const hard_label = document.getElementById("hard");
    const stats_cards = document.querySelector(".stats-cards");

    function validate(username) {
        if(username === "") {
            alert("Username cannot be empty");
            return false;
        }

        const regex = /^[a-zA-Z][a-zA-Z0-9_-]{2,15}$/;
        const isOk = regex.test(username);
        if(!isOk) {
            alert("Invalid Username");
        }
        return isOk;
    }

    function updateProgress(solved,total,label,circle) {
        const progressDeg = (solved/total)*100;
        circle.style.setProperty("--percentage", `${progressDeg}%`);
        label.textContent = `${solved}/${total}`;
    }

    function displayData(data) {
        const totalEasy = 846;
        const totalMed = 1775;
        const totalHard = 784;
        const totalSolved = data.solvedProblem;
        const easyQs = data.easySolved;
        const medQs = data.mediumSolved;
        const hardQs = data.hardSolved;

        const cardsData = [
            {label:"Total Questions Solved:", value:totalSolved},
            {label:"Easy Submissions:", value:data.totalSubmissionNum[1].submissions},
            {label:"Medium Submissions:", value:data.totalSubmissionNum[2].submissions},
            {label:"Hard Submissions:", value:data.totalSubmissionNum[3].submissions},
        ];

        stats_cards.innerHTML = cardsData.map(
            data =>
                    `<div class="card">
                    <h4>${data.label}</h4>
                    <p>${data.value}</p>
                    </div>`
        ).join("");

        updateProgress(easyQs,totalEasy,easy_label,easy_circle);
        updateProgress(medQs,totalMed,med_label,med_circle);
        updateProgress(hardQs,totalHard,hard_label,hard_circle);
        progress.style.contentVisibility = "visible";
    }

    async function fetchDetails(username) {
        const url = `https://alfa-leetcode-api.onrender.com/${username}/solved`;
    
        try {
            searchBtn.textContent = "Searching...";
            searchBtn.disabled = true;
    
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Unable to fetch data");
            }
    
            const data = await response.json();
            console.log("User details:", data);
            
            displayData(data);
        } catch (error) {
            console.error("Error fetching details:", error.message);
            alert("Something went wrong while fetching user details.");
        } finally {
            searchBtn.textContent = "Search"; 
            searchBtn.disabled = false; 
        }
    }
    

    searchBtn.addEventListener('click', function() {
        const user = usernameinp.value;
        console.log(`Username: ${user}`);

        if(validate(user)) {
            fetchDetails(user);
        }
    })
});