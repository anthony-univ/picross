/**
 * Class representing a grid. ON = black boxe and OFF = white boxe
 */
class Grid {
    /**
     * Create a grid.
     * @param {*} l - number of grid lines 
     * @param {*} c - number of grid columns
     */
    constructor(l, c) {
        this.l = parseInt(l);
        this.c = parseInt(c);
        this.g = new Array(this.l);
        for (let i = 0; i < this.l; i++) {
            this.g[i] = new Array(this.c);
            this.g[i].fill("OFF");       
        }
    }

    /**
     * Swap the value of a boxe in the grid.
     * @param {*} l - the line number you want to swap
     * @param {*} c - the column number you want to swap
     */
    toggle(l, c) {
        if(this.g[l][c] === "OFF") {
            this.g[l][c] = "ON";
        }else {
            this.g[l][c] = "OFF";
        }
    }

    /**
     * Get the description of a grid line.
     * @param {*} l - the line number
     * @returns {array} - the description line
     */
    getLineDescription(l) {
        let arr = new Array();
        let count = 0;
        
        // count the number of boxes "on" then we insert this number in the table when we find an off box
        for (let c = 0; c < this.c; c++) {
            if(this.g[l][c] === "ON") {
                count +=1;
            }else {
                if (count > 0) {
                    arr.push(count);
                }
                count = 0;
            } 
        }
        if (count > 0) {
            arr.push(count);
        }
        return arr;
    }

    /**
     * Get the description of a grid column.
     * @param {*} c - the column number
     * @returns {array} - the description column
     */
    getColumnDescription(c) {
        let arr = new Array();
        let count = 0;
        
        // count the number of boxes "on" then we insert this number in the table when we find an off box
        for (let l = 0; l < this.l; l++) {
            if(this.g[l][c] === "ON") {
                count +=1;
            }else {
                if (count > 0) {
                    arr.push(count);
                }
                count = 0;
            } 
        }
        if (count > 0) {
            arr.push(count);
        }
        return arr;
    }

    /**
     * Export the grid description as a string.
     * @returns {string} - the decription grid
     */
    exportToString() {
        let arr = new Array(); 
        arr[0] = new Array();
        arr[1] = new Array();
        
        for (let l = 0; l < this.l; l++) {
            arr[0].push(this.getLineDescription(l));
        }

        for (let c = 0; c < this.c; c++) {
            arr[1].push(this.getColumnDescription(c));
        }
        
        let str = JSON.stringify(arr);
        
        str = str.replaceAll('[','a');
        str = str.replaceAll(']','b');
        str = str.replaceAll(',','c');
        
        return str;
    }
}

/**
 * Create the grid html skeleton.
 * @param {string} f - the name of the function that should be triggered on mouse click 
 */
function creerGrid(f) { 
    let main = document.getElementsByTagName("main")[0];

    let table = document.createElement("table");
    table.setAttribute("class", "grid");
    main.appendChild(table);
    
    let tbody = document.createElement("tbody");
    table.appendChild(tbody);
    
    // 1st line (description of the number of black boxes per column)
    let tr = document.createElement("tr");
    tbody.appendChild(tr);
    
    for (let c = 0; c < grid.c+1; c++) {
        let td = document.createElement("td");
        tr.appendChild(td);
    }

    // other lines(2 to n) -> 1st column (description of the number of black boxes per line)
    //                     -> other column represent the boxes (black or white colors)
    for (let l = 0; l < grid.l; l++) {
        // new line
        let tr = document.createElement("tr");
        // new first column
        let td = document.createElement("td");
        tbody.appendChild(tr);
        tr.appendChild(td);

        for (let c = 0; c < grid.c; c++) {
            // new column
            let td = document.createElement("td");
            td.setAttribute("onclick", `${f}(this)`);
            tr.appendChild(td);
        }   
    }
}

/**
 * Create the edit page skeleton(the sharing link, the back link, the grid, ...).
 */
function createPageEdit() {
    let body = document.body;
    body.innerHTML = "";
    
    let main = document.createElement("main");
    body.appendChild(main);

    let p = document.createElement("p");
    p.innerHTML = "Lien de partage: ";
    main.appendChild(p);
    
    let a = document.createElement("a");
    a.style.color = "blue";
    p.appendChild(a);

    let retour = document.createElement("a");
    retour.setAttribute("href", url.pathname);
    retour.style.float = "right";
    retour.innerHTML = "Retour";
    p.appendChild(retour);

    updateLink();
    creerGrid("clickedPageEdit");
}

/**
 * Create the play page skeleton(the back link, the grid, ...).
 */
function createPagePlay() {
    let body = document.body;
    body.innerHTML = "";
    
    let main = document.createElement("main");
    body.appendChild(main);

    let p = document.createElement("p");
    main.appendChild(p);
    
    let retour = document.createElement("a");
    retour.setAttribute("href", url.pathname);
    retour.style.float = "right";
    retour.innerHTML = "Retour";
    p.appendChild(retour);

    creerGrid("clickedPagePlay");
    let tbody = document.getElementsByTagName("tbody")[0];
    
    for (let l = 0; l < descriptionLignesColonnes[0].length; l++) {
        tbody.children[l+1].children[0].innerHTML = descriptionLignesColonnes[0][l].toString().replaceAll(',', ' ');
    }

    for (let c = 0; c < descriptionLignesColonnes[1].length; c++) {
        tbody.children[0].children[c+1].innerHTML = descriptionLignesColonnes[1][c].toString().replaceAll(',', '<br>');
    }
}

/**
 * Fill the content of the textarea tag in case of error in the play argument of the url.
 */
function wrongValuePlay() {
    let textArea = document.getElementsByTagName("textarea")[0];
    textArea.innerHTML = url.searchParams.get("play");
    let error = document.getElementById("pError");
    error.innerHTML = "Code invalide";
}

/**
 * Update a grid box (toggle and change the appearance of the box on the webpage).
 * @param {*} l - the line number
 * @param {*} c - the column number
 */
function updateGrid(l, c) {
    grid.toggle(l, c);
    let tbody = document.getElementsByTagName("tbody")[0];
    if (grid.g[l][c] === "ON") {
        tbody.children[l+1].children[c+1].setAttribute("class", "clicked");
    }else {
        tbody.children[l+1].children[c+1].removeAttribute("class", "clicked");
    }
}

/**
 * Update the description of a line and a column of the grid (change the description displayed on the web page).
 * @param {*} l - the line number
 * @param {*} c - the column number
 */
function updateDescriptionGrid(l, c) {
    let tbody = document.getElementsByTagName("tbody")[0];
    tbody.children[l+1].children[0].innerHTML = grid.getLineDescription(l).toString().replaceAll(',', ' ');
    tbody.children[0].children[c+1].innerHTML = grid.getColumnDescription(c).toString().replaceAll(',', '<br>');
}

/**
 * Update share link.
 */
function updateLink() {
    let main = document.getElementsByTagName("main")[0];
    let link = `${url.pathname}?play=${grid.exportToString()}`;
    
    main.children[0].children[0].setAttribute("href", link);
    if(link.length>40) {
        main.children[0].children[0].innerHTML = link.substring(0,40) + "...";
    }else {
        main.children[0].children[0].innerHTML = link;
    }
}    

/**
 * Checks the satisfiability of the row and the column, between the description and the boxes that are actually colored.
 * @param {*} l - the line number
 * @param {*} c - the column number
 */
function checkSatisfiabiltyLineColumn(l, c) { 
    let tbody = document.getElementsByTagName("tbody")[0];
    
    // for the line : compares the line description to what the player did
    let arr = grid.getLineDescription(l);
    
    tbody.children[l+1].children[0].removeAttribute("class", "error");
    if(arr.length > descriptionLignesColonnes[0][l].length) {
        tbody.children[l+1].children[0].setAttribute("class", "error");
    }else {
        for (let index = 0; index < arr.length; index++) {
            if(arr[index] > descriptionLignesColonnes[0][l][index]) {
                tbody.children[l+1].children[0].setAttribute("class", "error");
                break;
            }
        }
    }

    // for the column : compares the column description to what the player did
    arr = grid.getColumnDescription(c);

    tbody.children[0].children[c+1].removeAttribute("class", "error");
    if(arr.length > descriptionLignesColonnes[1][c].length) {
        tbody.children[0].children[c+1].setAttribute("class", "error");
    }else {
        for (let index = 0; index < arr.length; index++) {
            if(arr[index] > descriptionLignesColonnes[1][c][index]) {
                tbody.children[0].children[c+1].setAttribute("class", "error");
                break;
            }
        }
    }
}

/**
 * Check the satisfiability of all lines and columns.
 */
function checkSatisfiabiltyGrid() {
    let nbError = document.getElementsByClassName("error");
    let nCaseClicked = document.getElementsByClassName("clicked");
    let table = document.getElementsByTagName("table")[0];
    let descriptionLignes = descriptionLignesColonnes[0];
    let acc = 0;
    
    // count the number of boxes that should be colored
    for (const tab of descriptionLignes) {
        for (const iterator of tab) {
            acc += parseInt(iterator);    
        }
    }
    
    if(nbError.length===0 && nCaseClicked.length===acc) { 
        // you have found the solution
        table.setAttribute("class", "grid finished");
    }else { 
        table.removeAttribute("class", "grid finished");
        table.setAttribute("class", "grid");
    }
}

/**
 * Function only used on the edit page.
 * 1. Update the grid with the coordinates of the selected box.
 * 2. Update the description grid with the coordinates of the selected box.
 * 3. Update the share link.
 * @param {*} x - the selected object (example : "<td onclick="clickedPageEdit(this)" class="clicked"></td>")
 */
function clickedPageEdit(x) {
    //x.parentNode.rowIndex-1 = the selected grid line in the DOM
    //x.cellIndex-1 = the selected grid column in the DOM
    updateGrid(x.parentNode.rowIndex-1,x.cellIndex-1);
    updateDescriptionGrid(x.parentNode.rowIndex-1,x.cellIndex-1);
    updateLink();
}

/**
 * Function only used on the play page.
 * 1. Update the grid with the coordinates of the selected box.
 * 2. Checks the satisfiability of the row and the column, between the description and the boxes that are actually colored.
 * 3. Checks the satisfiability all the grid with the decription grid.
 * @param {*} x - the selected object (example : "<td onclick="clickedPageEdit(this)" class="clicked"></td>")
 */
function clickedPagePlay(x){
    //x.parentNode.rowIndex-1 = the selected grid line in the DOM
    //x.cellIndex-1 = the selected grid column int the DOM
    updateGrid(x.parentNode.rowIndex-1,x.cellIndex-1);
    checkSatisfiabiltyLineColumn(x.parentNode.rowIndex-1,x.cellIndex-1);
    checkSatisfiabiltyGrid();
}

/** 
 * Waits for the Document Object Model of the page to be loaded and for the function e to be executed.
 * Function e : 
 *              Step 1. Get arguments from url.
 *              Step 2. Argument value processing.
 *                      case a- no arguments from url : we do nothing
 *                      case b- either the arguments edit, lines, cols : if no argument error, the edit page is displayed
 *                      case c- either the argument play : if no argument error, the play page is displayed else we display invalid code on the main page
 */             
document.addEventListener("DOMContentLoaded",function (e) {

    /*------------------------- Step 1 --------------------------------------------
    - Get arguments from url.
    ------------------------------------------------------------------------------*/

    url = new URL(document.URL);

    let edit = url.searchParams.get("edit");
    let play = url.searchParams.get("play");
    let lines = url.searchParams.get("lines");
    let cols = url.searchParams.get("cols");

     /*------------------------- Step 2 --------------------------------------------
    - Argument value processing.
    ------------------------------------------------------------------------------*/
    // case 2.a

    if(edit!==null && lines>0 && cols>0) {
        grid = new Grid(lines, cols);
        createPageEdit();    

    }else if(play !==null) { //cases 2.b or 2.c

        play = play.replaceAll('a','[');
        play = play.replaceAll('b',']');
        play = play.replaceAll('c',',');
        
        // a try catch to detect errors in the value of the play argument (either (1), (2), (3), (4))
        try {
            // get the description of the grid
            descriptionLignesColonnes = JSON.parse(play); 
            
            if(!(Array.isArray(descriptionLignesColonnes) && descriptionLignesColonnes.length == 2)){
                throw "the description does not represent an array of two elements"; //(1)
            }
            
            if(!(Array.isArray(descriptionLignesColonnes[0]) && descriptionLignesColonnes[0].length!=0 && Array.isArray(descriptionLignesColonnes[1]) && descriptionLignesColonnes[1].length!=0)) {
                throw "one of the two elements is an empty array"; //(2)
            } 
            
            let nbBlackBoxesLines = 0;
            let nbBlackBoxesColumns = 0;
            
            for (let l = 0; l < descriptionLignesColonnes[0].length; l++) {
                if(!(Array.isArray(descriptionLignesColonnes[0][l]))) { 
                    throw `${descriptionLignesColonnes[0][l]} is not a array(l)`; //(3)
                }
                for (let index = 0; index < descriptionLignesColonnes[0][l].length; index++) {
                    if (!Number.isInteger(descriptionLignesColonnes[0][l][index]) || descriptionLignesColonnes[0][l][index] < 0) { 
                        throw `${descriptionLignesColonnes[0][l][index]} is not a positive integer`; //(3)
                    }
                    nbBlackBoxesLines += descriptionLignesColonnes[0][l][index];    
                }
            }

            for (let c = 0; c < descriptionLignesColonnes[1].length; c++) {
                if(!(Array.isArray(descriptionLignesColonnes[1][c]))) {
                    throw `${descriptionLignesColonnes[1][c]} is not a array(c)`; //(3)
                }
                for (let index = 0; index < descriptionLignesColonnes[1][c].length; index++) {
                    if (!Number.isInteger(descriptionLignesColonnes[1][c][index]) || descriptionLignesColonnes[1][c][index] < 0) { 
                        throw `${descriptionLignesColonnes[1][c][index]} is not a positive integer`; //(3)
                    }
                    nbBlackBoxesColumns += descriptionLignesColonnes[1][c][index];   
                }
                
            }

            if(nbBlackBoxesLines !== nbBlackBoxesColumns) {
                throw `number blacked boxes lines(${nbBlackBoxesLines}) != number blacked boxes columns(${nbBlackBoxesColumns})`; //(4)
            }    

        }catch(err) { 
            // an error has been detected -> display "code invalide" and the value of argument play in the "textarea"
            wrongValuePlay(); 
            throw err; // throw the error
        }
        
        // no error -> we can play to picross
        grid = new Grid(descriptionLignesColonnes[0].length, descriptionLignesColonnes[1].length);
            
        createPagePlay();
    }
});