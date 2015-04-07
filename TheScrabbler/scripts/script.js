// GLOBAL VARIABLES ================================================
var ROWS = 7;
var COLUMNS = 7;
//==================================================================

//==================MODEL CLASS=====================================
function Model(){
	// Local Variables
	var grid = initGrid(ROWS, COLUMNS); // calls with global vars
	var hl_grid = initGrid(ROWS, COLUMNS);
	var words = [];

	// Fields
	this.grid = grid;
	this.hl_grid = hl_grid; 
	this.dictionary = getDictionary();
	this.words = words;
	
	// Public Methods

	/* public int getResult()
	 * Driver/Stub for now?
	 */
	this.getResult = function () {
		var regExp = /a\w\w\w/g; 
		var results = (this.dictionary).matchesPattern(4, regExp);
		return results[0].score;
	};
	
	/* public String createRegex()
	 *  may later be modified into char[]
	 * @return: regM (regex of highlighted area)
	 */

	this.createRegex = function() {
		var reMain = "";
		var Direction = findHl();
		console.log(Direction);

		// if vertical, create vertical regexs
		if (Direction.d == "vertical") {
			for (var i = 0; i < ROWS; i++) {
				if(this.grid[i][Direction.x] != "") {
					if (this.hl_grid[i][Direction.x] == "H"
						|| adj(i, Direction.x, "vertical")) {

						reMain += this.grid[i][Direction.x];
					}
				} else if(this.hl_grid[i][Direction.x] == "H") {
					
					if (this.grid[i][Direction.x] == "") {
						reMain+="[a-z]";
					
					} else {
						reMain += this.grid[i][Direction.x];
					}
					
				}
			}
		} else if (Direction.d == "horizontal") {
			for (var j = 0; j < COLUMNS; j++) {
				if (this.grid[Direction.y][j] != "") {
					if (this.hl_grid[Direction.y][j] == "H"
						|| adj(Direction.y, j, "horizontal")) {

						reMain += this.grid[Direction.y][j];
					}
				} else if(this.hl_grid[Direction.y][j] == "H") {

					if (this.grid[Direction.y][j] == "") {
						reMain +="[a-z]";
					
					} else {
						reMain += this.grid[Direction.y][j];
					}
				}
			}
		}
		var regm = new RegExp(reMain);
		console.log(regm);
		return regm;
	};
	
	
	
	//--Static Methods

	/* private Class Heap
	 * public: size, add, top, pop
	 * private: exch, less, sink, swim
	 */

	function Heap(){
		// field: words[]
		this.words = ['-'];

		/* public int size()
		 * @return: size of queue
		 */
		this.size = function() {
			return this.words.length - 1;
		};

		// helper function
		this.exch = function(i,j) {
			var temp = this.words[i];
			this.words[i] = this.words[j];
			this.words[j] = temp;
		};

		// helper function
		this.less = function(i,j) {
			return this.words[i].score < this.words[j].score;
		};

		/* public void add(Object Word)
		 * sorts ADT Word into priqueue/heap
		 */
		this.add = function(wordADT) {
			this.words.push(wordADT);
			this.swim(this.words.length -1);
		};

		/* public Word top()
		 * @return: returns max
		 */
		this.top = function(){
			if (this.size() == 0) {return null;}
			else {
				var top = this.words[1];
				return top;
			}
			
		};
	
		/* public Word pop()
		 * @return: returns and deletes max
		 */
		this.pop = function() {
			if (this.size() == 0) {
				return null;
			}
			var max = this.words[1];
			this.words.splice(1, 1);
			this.exch(1, this.size());
			this.sink(1);
			return max;
		};

		// helper function
		this.sink = function(index){
			var size = this.size();
			while (2*index <= size){
				var j = 2*index;
				if (j< size && this.less(j,j+1)){
					j++;
				}
				if (!this.less(index,j)){
					break;
				}
				this.exch(index,j);
				index = j;
			}
		};
	
		// helper function
		this.swim = function(index){
			var size = this.size();
	
			while (index > 1 && this.less(Math.floor(index/2),index)){
				this.exch(Math.floor(index/2),index);
				index = Math.floor(index/2);
			}
		};

	}

	//--Instance Methods               

	// Private Methods

	function adj(i, j, d) {
		if (d == "vertical") {
			if (i < (ROWS - 1) && hl_grid[i+1][j] == "H") {
				return true;
			
			} else if(i > 0 && hl_grid[i-1][j] == "H") {
				return true;
			
			} else {
				return false;
			}
		
		} else if(d == "horizontal") {
			if (j < (COLUMNS - 1) && hl_grid[i][j+1] == "H") {
				return true;
			
			} else if(j > 0 && hl_grid[i][j-1] == "H") {
				return true;
			
			} else {
				return false;
			}
		}
	}

	function findHl() {
		// Finds what direction the highlighted cells are
		// returns: d: vertical, horizontal or single 
		// 			as well as start coordinates x, y
		for (var i = 0; i < ROWS; i++) {
			for (var j = 0; j < COLUMNS; j++) {
				if (hl_grid[i][j] == "H") {
					if (i < (ROWS - 1) && hl_grid[i+1][j] == "H") {
						return {d: "vertical", y:i, x:j};
					
					} else if (j < (COLUMNS - 1) && hl_grid[i][j+1] == "H") {
						return {d:"horizontal", y:i, x:j};
					
					} else {
						return {d:"single", y:i, x:j};

					}
				}
			}
		}

	}

	function initGrid(rows, columns) {
		var grid = [];
		for (var i = 0; i < rows; i++) {
			var row = [];
			for (var j = 0; j < columns; j++) {
				row.push("");
			}
			grid.push(row);
		}
		return grid;
	}

	function getDictionary(){
	//requesting and reading from file and if its found then reading from it
	 	var bst = new BST();
	    var rawFile = new XMLHttpRequest();
	    var url = "input/dictionary.txt";
	    rawFile.open("GET", url, true);
	    rawFile.onreadystatechange = function ()
	    {
	        if(rawFile.readyState === 4)
	        {
	            if(rawFile.status === 200 || rawFile.status == 0)
	            {
	                var allText = rawFile.responseText;
	                //console.log(allText); //TODO make a data structure
	                words = allText.split("\n");
	               
	                for (var i = 0; i <words.length; i++) {
	                	if(words[i].length <=7){
	                		bst.insert(words[i].length,new Word(words[i]));
	                	}	
	                };
	                //console.log("herpa derpa derpa");
	                //console.log(bst.search(5));
	                //bst.print();
	                
	            }
	        }
	    }
	    rawFile.send(null);
		return bst;
	}


	//console.table(grid);  (TESTING)

} // end of class
//==================================================================

//==================CONTROLLER CLASS================================


function Controller(){
	// Static Variables
	var canvasID = document.getElementById('canvas');
	var nextButton = document.getElementById("nextbtn");
	var backButton = document.getElementById("backbtn");
	var resetButton = document.getElementById("resetbtn");
	var view = new View(canvasID);
	var model = new Model();
	var state = "letters";

	// Event Listeners
	canvasID.addEventListener("click",onGridClick,false);
	nextButton.addEventListener("click",onNextClick,false);
	backButton.addEventListener("click",onBackClick,false);
	resetButton.addEventListener("click", resetN, false);
	

	// PUBLIC FUNCTIONS 

	// Static Functions
	function onGridClick(e) {
		var x = getClick(e).x;
		var y = getClick(e).y;
		if (state == "letters") {
			inputLetter(x, y);
		
		} else if (state == "highlight") {
			highlight(getLetter(x, y).toUpperCase(), x, y);
		
		} else {
			// model = new Model();
			// view = new View();
		}
		
	}

	// determines what state will be travelled to once
	// the Next button is pressed
	function onNextClick() {

		if (state == "letters") {
			state = "highlight";
			updatePStatus(state);
		
		} else if (state == "highlight") {
			if (hl_check()) {
				state = "result";
				updatePStatus(state)
				//getResult();
				model.createRegex();
				//call model.getResult
			}
			else {
				// invalid highlighting of cells
				window.alert("Fix your shit");
			}

		} else {
			resetN();
		}
	}

	// determines what state will be travelled to once
	// the Back button is pressed
	function onBackClick(){
		if (state == "highlight"){
			state = "letters";
			updatePStatus(state);
		}
		else if (state == "result"){
			state = "highlight";
			updatePStatus(state);
		}

	}

	function resetN() {
		location.reload();
	}

	function updatePStatus(state) {
		var s_i = "Click on the grid below and enter letters.  When finished, press next.  If you wish to delete a letter, simply click on it and hit enter.";

		var s_h = "Click the cells of which you would like to form a word from your tiles.  The cells must be adjacent and in a vertical or horizontal line.  When you're done, click next.";

		if (state == "letters") {
			view.updatePStatus(s_i);

		} else if (state == "highlight") {
			view.updatePStatus(s_h);
		}

	}
	
	function highlight(letter, x, y) {
		if (model.hl_grid[y][x] == "H") {

			// deletes highlight in array
			model.hl_grid[y][x] = "";
			view.addLetter(letter, x, y);
			console.table(model.hl_grid);

			// deletes highlight but keeps letter
			// in the view
			
		
		} else {

			// create highlight in array and view
			view.highlight(letter, x, y);
			model.hl_grid[y][x] = "H";
			console.table(model.hl_grid);
		}
	
	}
	
	function inputLetter(x, y) {

		var letter = prompt("Enter a letter.\nEnter nothing to delete a letter.");

		// creating a regular expression and setting it to
		// a var. This regex means from a-z and A-Z it is true
		var aLetters = /[A-Z]|[a-z]/;		

		if (letter != null) {  // cancel returns null
			if (letter == "") {
				model.grid[y][x] = letter; // do this first
				if (model.hl_grid[y][x] == "H") {
					view.addHLetter(letter, x, y); // keep highlight
				
				} else {
					view.addLetter(letter, x, y);
				}
				
				
			} else {
				//If the value has a-z or A-Z in it return true
				if (letter.match(aLetters)){		
					if (letter.length == 1) {
						// changing the letters to their uppercase when printing to the view and model
						model.grid[y][x] = letter.toLowerCase();
						if (model.hl_grid[y][x] == "H") {
							view.addHLetter(letter.toUpperCase(), x, y);
						
						} else {
							view.addLetter(letter.toUpperCase(),x, y);
						}
						
						console.table(model.grid); // TESTING
					}
				} else {
					window.alert("Please select a valid letter");
				}
			}
		}
	}

	
	// PRIVATE METHODS

	// Static Method 

	function hl_check() {
		var count = 0;
		var hlCoords = [];
		
		for(var i = 0; i < ROWS; i++){
			for(var j = 0; j < COLUMNS; j++){
				if (model.hl_grid[i][j] === "H"){
					count++;
					hlCoords.push([i,j]);
				}
			}
		}
		console.table(hlCoords);
		console.log(hlCoords.length);

		if (count < 1 || count > 7){
			return false;
		} else {
			var vertical = true;
			var horizontal = true;

			//horizontal check
			for(var i = 0; i < hlCoords.length; i++){
				
				for (var j = 0; j < hlCoords.length;j++){
					if (hlCoords[i][0] != hlCoords[j][0]){
						horizontal = false;
					}
					
				}
			}
			
			//vertical check
			for(var i = 0; i < hlCoords.length; i++){
				
				for (var j = 0; j < hlCoords.length;j++){
					if (hlCoords[i][1] != hlCoords[j][1]){
						vertical = false;
					}
				}
			}
			
			if (horizontal == vertical){
				return false;
			}

			if (vertical == true){
				if (hlCoords[hlCoords.length - 1][0] - hlCoords[0][0] + 1 != hlCoords.length){
				
					return false;
				}

			} 
				if (horizontal == true) {
				if (hlCoords[hlCoords.length - 1][1] - hlCoords[0][1] + 1 != hlCoords.length){
				
					return false;
			}

			return true;
			}

		}
	}

	function getLetter(x_Pos, y_Pos) {
		return model.grid[y_Pos][x_Pos];
	}

	function getClick(e){
		var x_Pos = e.clientX;
		var y_Pos = e.clientY;
		var position = normalize(x_Pos,y_Pos);
		console.log(position.x+","+position.y);
		return {x: position.x, y: position.y};
	}

	function normalize(x_Pos,y_Pos){
		var canvasSize = canvasID.getBoundingClientRect();
		

		var deltaX = (canvasSize.right-canvasSize.left)/COLUMNS;
		var deltaY = (canvasSize.bottom-canvasSize.top)/ROWS;

		// rel_x and rel_y are the grid coordinates starting from (0,0) bottom left
		var rel_x = Math.floor(((x_Pos - canvasSize.left)/(deltaX)));
		var rel_y = Math.floor(((y_Pos - canvasSize.top)/(deltaY)));
		return {x:rel_x,
			    y:rel_y
			   };	
	}


} // end of Controller class
//==================================================================


//==================VIEW CLASS======================================

function View(canvasID){
	var width =50;  // eventually will be globals
	var height =50;  // designating width of each cell
	
	var ctx = canvasID.getContext('2d');

	// Draws the rectangles
	for(var rows = 0; rows < ROWS; rows++) {
		for (var cols = 0; cols < COLUMNS; cols++) {
			ctx.strokeStyle = "black";
			ctx.fillStyle = "yellow";
			ctx.beginPath();
			ctx.lineWidth = 1;
			ctx.rect(width*rows, height*cols, width, height);
			ctx.closePath();
			ctx.fill();
			ctx.stroke(); 
		}
	}

	this.addLetter = function (letter, x, y) {
		// Clear previous entries
		ctx.clearRect(x*50, y*50, width, height);
		ctx.strokeStyle = "black";
		ctx.fillStyle = "yellow";
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.rect(width * x, height *y, width, height);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();

		// Make new entry based on valid input letter
		ctx.fillStyle="black";
		ctx.font="25px Georgia";
		ctx.fillText(letter,(15+(x*50)),35+(y*50));
	};

	this.addHLetter = function (letter, x, y) {
		ctx.clearRect(x*50, y*50, width, height);
		ctx.strokeStyle = "black";
		ctx.fillStyle = "blue";
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.rect(width * x, height *y, width, height);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();

		// Make new entry based on valid input letter
		ctx.fillStyle="white";
		ctx.font="25px Georgia";
		ctx.fillText(letter,(15+(x*50)),35+(y*50));

	}

	this.highlight = function(letter,x,y){
		//Highlight the certain square in the view
		ctx.clearRect(x*50, y*50, width, height);
		ctx.strokeStyle = "black";
		ctx.fillStyle = "blue";
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.rect(width * x, height *y, width, height);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();

		ctx.fillStyle="white";
		ctx.font="25px Georgia";
		ctx.fillText(letter,(15+(x*50)),35+(y*50));

	};

	this.updatePStatus = function(string) {
		document.getElementById("pstatus").innerHTML = string;
	};


} // end of View Class
