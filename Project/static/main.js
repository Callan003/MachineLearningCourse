var movies = [];
var rndInt;

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
        document.getElementById('sentiment').className = '';
        document.getElementById('sentiment').classList.add(resp['sentiment']);
        document.getElementById('probability').innerText = resp['probability'];
        document.getElementById('feedback').classList.remove('is_hidden')
        document.getElementById('thank-you-feedback').classList.add('is_hidden');
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
    }).then(() => {
        const randomColor = Math.floor(Math.random()*16777215).toString(16);
        document.getElementById('heart').style.color = randomColor;

        document.getElementById('feedback').classList.add('is_hidden');
        document.getElementById('thank-you-feedback').classList.remove('is_hidden');
    })
}

document.getElementById('correct').addEventListener('click', () => log_feedback(true))
document.getElementById('wrong').addEventListener('click', () => log_feedback(false))

function loadMovies() {
    fetch("/movies", {
    method: "GET",
    headers: {
        'Content-Type': 'application/json'
    }
}).then(res => resp = res.json()).then(resp => {
    this.movies = resp;
    this.rndInt = Math.floor(Math.random() * this.movies.length) + 1;
    console.log(this.rndInt);
    document.getElementById('movie-title').innerHTML = this.movies[this.rndInt - 1].toString().slice(0, -4);
    document.getElementById('movie-poster').src = '/static/moviesdb/' + this.movies[this.rndInt - 1]
})}

function changeMovie(n) {
    this.rndInt = this.rndInt + n;
    if(this.rndInt === 0){
        this.rndInt = this.movies.length;
    } else if (this.rndInt === this.movies.length + 1){
        this.rndInt = 1;
    }
    document.getElementById('movie-title').innerHTML = this.movies[this.rndInt - 1].toString().slice(0, -4);
    document.getElementById('movie-poster').src = '/static/moviesdb/' + this.movies[this.rndInt - 1];

    document.getElementsByClassName('text')[0].value = ''; 
    document.getElementById('feedback').classList.add('is_hidden');
    document.getElementById('response').classList.add('is_hidden');
}
