globalThis.seconds = 0
globalThis.minutes = 0

//Creates the grid container with the variable tileCount giving dimensions of grid to be created (4x4) = 4
function createHTMLgrid(tileCount){
    let gridContainer = document.getElementById("grid__container--id")
    //Clear the grid container, create a grid template with the tileCount
    gridContainer.innerHTML = ""
    gridContainer.style.gridTemplate = "repeat(" + tileCount + ",1fr) / repeat(" + tileCount + ",1fr)"

    //For each item in the grid container, create a HTML div containing two tile sides with pointers
    for(i = 0; i < tileCount * tileCount; i++){
        gridContainer.innerHTML = gridContainer.innerHTML +
        "<div class='item' id='item"+i+
        "'> <div class='grid__tile--front tile__side' id='grid__item--front--" + i +
        "' onClick='clicked(this.id)'></div> <div class='grid__tile--back tile__side' id='grid__item--back--" + i +
        "'></div>  </div>"
    }
    randomColours(tileCount)
    timerClear()
}
//Get random colours. Amount needed is defined by coloursNeeded(items / 2). add them to the colours chosen array
function randomColours(tileCount){
    coloursChosen = []
    coloursNeeded = ((tileCount * tileCount) /2)
    while(coloursChosen.length < coloursNeeded){
        //create a random rgb colour with the pass through of three random numbers between 0 and 255
        randomColour =  "rgb(" + 
                        Math.floor(Math.random()*256) + "," +
                        Math.floor(Math.random()*256) + "," + 
                        Math.floor(Math.random()*256) + ")"
        coloursChosen.push(randomColour)
    }
    //Double up the coloursChosen array. Instead of looping twice for each colour in genBoard
    coloursChosen = coloursChosen.concat(coloursChosen)
    genBoard(tileCount, coloursChosen)
}

function genBoard(tileCount, coloursChosen){
    //Loop through every item in the grid, add a random colour to it
    for( i = 0; i < (tileCount * tileCount); i++){
        //Get a random colour from the coloursChosen
        let randCol = coloursChosen[Math.floor(Math.random() * coloursChosen.length)]
        //apply the colour as a style
        document.getElementById("grid__item--back--" + i).style.backgroundColor = randCol
        //Remove the item from the array to avoid doubling up
        coloursChosen.splice(coloursChosen.indexOf(randCol) ,1)
    }

    globalThis.flipCount = 0
    document.getElementById("flipCountDisplay").innerHTML = flipCount
    firstTilePressed = true
}

function secondsTimer() {
    seconds++
    if(seconds === 60){
        minutes++
        seconds = 0
    }
    document.getElementById("timeCountDisplay").innerText = minutes + "m " + seconds + "s"
}

function timerClear(){
    //On first sweep, the timer isnt set up yet. So use the if statement to stop the error. It still works without the if statement though
    if(seconds > 1){
        clearInterval(timer)
        globalThis.seconds = 0
        globalThis.minutes = 0
        document.getElementById("timeCountDisplay").innerText = minutes + "m " + seconds + "s"
    }
}

let tilePress = 0
var tilePressOneColour
var tilePressTwoColour
var elementOne
var correctPair = 0
var firstTilePressed = true
function clicked(element){
    if(firstTilePressed){
        globalThis.timer = setInterval(secondsTimer, 1000)
        firstTilePressed = false
    }

    //element is currently the front side, we need the back side for its colour
    element = element.replace("front","back")

    //If the tile pressed was the same exact item as the tile pressed before
    if(element === elementOne){
        elementOne = ""
        tilePress = 0
        tilePressOneColour = ""
    }
    else{
        flipCount++
        document.getElementById("flipCountDisplay").innerHTML = flipCount

        tilePress++
        //If this is the first tile pressed on a 2 press cycle
        if(tilePress === 1){
            //tilePressOne is the colour of the first tile pressed
            tilePressOneColour = document.getElementById(element).style.backgroundColor
            //store the element initially pressed to later reference
            elementOne = element
            flipTile(elementOne)
        }
        //If there is already a tile flipped over
        if(tilePress === 2){
            tilePressTwoColour = document.getElementById(element).style.backgroundColor
            flipTile(element)
            //If the two tiles pressed colours are the same
            if(tilePressOneColour === tilePressTwoColour){
                //They remain flipped and unpressable. Check if they have all of the tiles flipped with the correctPair var
                correctPair++
                if(correctPair === document.getElementById("grid__container--id").childElementCount / 2){
                    document.getElementById("history__container").innerHTML =  document.getElementById("history__container").innerHTML+ "<p class='history__label'>"+ minutes + "m" + seconds + "s " + flipCount + "F</p>"
                    //End the timer, reset the amount of correctPairs
                    timerClear()
                    correctPair = 0
                    tilePress,tilePressOneColour,tilePressTwoColour,elementOne,correctPair = 0
                }
            }else{
                //If the two tiles are different, it is not a match.Flip both tiles 
                //Timeout controls the duration of how long it stays flipped
                document.getElementById("grid__container--id").classList.add("noClick")
                setTimeout(() => {
                    document.getElementById("grid__container--id").classList.remove("noClick")
                    flipTileOver(elementOne)
                    flipTileOver(element)
                    elementOne = 0
                },1300)
            }
            tilePress = 0
        }
    }
}

function flipTile(element){
    document.getElementById(element).classList.remove("flipTileFrontClass")
    document.getElementById(element).classList.add("flipTileBackClass")

    elementBack = element.replace("back","front")

    document.getElementById(elementBack).classList.remove("flipTileBackClass")
    document.getElementById(elementBack).classList.add("flipTileFrontClass")
}
function flipTileOver(element){
    document.getElementById(element).classList.remove("flipTileBackClass")
    document.getElementById(element).classList.add("flipTileFrontClass")
    
    elementBack = element.replace("back","front")

    document.getElementById(elementBack).classList.remove("flipTileFrontClass")
    document.getElementById(elementBack).classList.add("flipTileBackClass")
}

createHTMLgrid(4)

