document.getElementsByClassName('classify')[0].addEventListener('click', function(){
    fetch("/predict",
    {
        method: "POST",
        body: JSON.stringify({
            text: document.getElementsByClassName('text')[0].value
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => resp = res.json())
    .then(resp => {
        document.getElementById('response').classList.remove('is_hidden');
        document.getElementById('sentiment').innerText = resp['sentiment'];
        document.getElementById('probability').innerText = resp['probability'];
        document.getElementById('feedback').classList.remove('is_hidden')
    })
})

function log_feedback(is_correct) {
    fetch("/log_feedback", {
        method: "POST",
        body: JSON.stringify(
            {
                text: document.getElementsByClassName('text')[0].value,
                predicted_sentiment: document.getElementById('sentiment').innerHTML,
                is_correct: is_correct
            }
        ), headers: {
            'Content-Type': 'application/json'
        }
    })
}

document.getElementById('correct').addEventListener('click', () => log_feedback(true))
document.getElementById('wrong').addEventListener('click', () => log_feedback(false))