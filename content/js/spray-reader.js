var SprayReader = function(container){
  this.container = $(container);
};
SprayReader.prototype = {
  wpm: null,
  msPerWord: null,
  wordIdx: null,
  input: null,
  words: null,
  isRunning: false,
  timers: [],
  
  setInput: function(input) {
    this.input = input;
    
    // Split on spaces
    var allWords = input.split(/\s+/);
    
    var word = '';
    var result = '';
    
    // Preprocess words
    var tmpWords = allWords.slice(0); // copy Array
    var t = 0;

    for (var i=0; i<allWords.length; i++){

      if(allWords[i].indexOf('.') != -1){
        tmpWords[t] = allWords[i].replace('.', '•');
      }

      // Double up on long words and words with commas.
      if((allWords[i].indexOf(',') != -1 || allWords[i].indexOf(':') != -1 || allWords[i].indexOf('-') != -1 || allWords[i].indexOf('(') != -1|| allWords[i].length > 8) && allWords[i].indexOf('.') == -1){
        tmpWords.splice(t+1, 0, allWords[i]);
        tmpWords.splice(t+1, 0, allWords[i]);
        t++;
        t++;
      }

      // Add an additional space after punctuation.
      if(allWords[i].indexOf('.') != -1 || allWords[i].indexOf('!') != -1 || allWords[i].indexOf('?') != -1 || allWords[i].indexOf(':') != -1 || allWords[i].indexOf(';') != -1|| allWords[i].indexOf(')') != -1){
        tmpWords.splice(t+1, 0, ".");
        tmpWords.splice(t+1, 0, ".");
        tmpWords.splice(t+1, 0, ".");
        t++;
        t++;
        t++;
      }

      t++;
    }

    this.words = tmpWords.slice(0);
    this.wordIdx = 0;
  },
  
  setWpm: function(wpm) {
    this.wpm = parseInt(wpm, 10);
    this.msPerWord = 60000/wpm;
  },
  
  start: function() {
    this.isRunning = true;
    
    thisObj = this;
    
    this.timers.push(setInterval(function() {
      thisObj.displayWordAndIncrement();
    }, this.msPerWord));
  },
  
  stop: function() {
    this.isRunning = false;
    
    for(var i = 0; i < this.timers.length; i++) {
      clearTimeout(this.timers[i]);
    }
  },
  
  displayWordAndIncrement: function() {
    var pivotedWord = pivot(this.words[this.wordIdx]);
  
    this.container.html(pivotedWord);
    
    this.wordIdx++;
    if (thisObj.wordIdx >= thisObj.words.length) {
      this.wordIdx = 0;
      this.stop();
    }
  }
};

// Find the red-character of the current word.
function pivot(word){
    var length = word.length;

    // Longer words are "right-weighted" for easier readability.
    if(length<6){

        var bit = 1;
        while(word.length < 22){
            if(bit > 0){
                word = word + '.';
            }
            else{
                word = '.' + word;
            }
            bit = bit * -1;
        }

        var start = '';
        var end = '';
        if((length % 2) === 0){
            start = word.slice(0, word.length/2);
            end = word.slice(word.length/2, word.length);
        } else{
            start = word.slice(0, word.length/2);
            end = word.slice(word.length/2, word.length);
        }

        var result;
        result = "<span class='spray_start'>" + start.slice(0, start.length -1);
        result = result + "</span><span class='spray_pivot'>";
        result = result + start.slice(start.length-1, start.length);
        result = result + "</span><span class='spray_end'>";
        result = result + end;
        result = result + "</span>";
    }

    else{

        var tail = 22 - (word.length + 7);
        word = '.......' + word + ('.'.repeat(tail));

        var start = word.slice(0, word.length/2);
        var end = word.slice(word.length/2, word.length);

        var result;
        result = "<span class='spray_start'>" + start.slice(0, start.length -1);
        result = result + "</span><span class='spray_pivot'>";
        result = result + start.slice(start.length-1, start.length);
        result = result + "</span><span class='spray_end'>";
        result = result + end;
        result = result + "</span>";

    }

    result = result.replace(/\./g, "<span class='invisible'>.</span>");

    return result;
}

// Let strings repeat themselves,
// because JavaScript isn't as awesome as Python.
String.prototype.repeat = function( num ){
    return new Array( num + 1 ).join( this );
}
