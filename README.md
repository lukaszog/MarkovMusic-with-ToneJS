# Simple music with Markov Chain using Tone.js
Live example: https://blog.lukaszogan.com/informatyka/algorytmiczne-generowanie-muzyki-poczatek-cyklu/#Interaktywny_przyklad

Example:

![Alt Text](img/markov_music.gif)

Main script markov.js:

``` 
 function trainMarkovChain(data) {
           const result = {};
           for (let i = 0; i < data.length - 1; i++) {
               const from = data[i];
               const to = data[i + 1];
               result[from] = result[from] || [];
               result[from].push(to);
           }
           return result;
       }
   
 function predictWithMarkovChain(chain, from) {
   
      let options;
  
      if (from && chain.hasOwnProperty(from)) {
         options = chain[from];
      } else {
        options = Object.keys(chain);
      }
      return options[Math.floor(Math.random() * options.length)];
  }
       
```


