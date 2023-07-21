// ENTRY QUESTIONNAIRE

Qualtrics.SurveyEngine.addOnPageSubmit(function(type)
{
	if(type == "next") {
		let access_token = localStorage.getItem("HEALTHBYTES_ACCESS");
		let urlParams = new URLSearchParams(window.location.search);
		let pid = urlParams.get('PID');
		var request = new XMLHttpRequest();

		request.open('POST', 'http://localhost:3333/user/completeEntryQuestionnaire?pid=' + pid);

		request.setRequestHeader('Content-Type', 'application/json');
		request.setRequestHeader('Authorization', 'Bearer ' + access_token);
		
		var body = {
			
		}
		
		request.send(JSON.stringify(body));
	}
});

// EXIT QUESTIONNAIRE
Qualtrics.SurveyEngine.addOnPageSubmit(function(type)
{
	if(type == "next") {
		let access_token = localStorage.getItem("HEALTHBYTES_ACCESS");
		let urlParams = new URLSearchParams(window.location.search);
		let pid = urlParams.get('PID');
		var request = new XMLHttpRequest();

		request.open('POST', 'http://localhost:3333/user/completeEntryQuestionnaire?pid=' + pid);

		request.setRequestHeader('Content-Type', 'application/json');
		request.setRequestHeader('Authorization', 'Bearer ' + access_token);
		
		var body = {
			
		}
		
		request.send(JSON.stringify(body));
	}
});