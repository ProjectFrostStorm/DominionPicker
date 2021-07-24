//Dominion Picker's Source Code
var weighSetsEqual = true; //Weighs and chooses sets equally first, then get card

var selection = []; //The list of cards and sets after removing the ones with include = false
var result = []; //The final picked 10 cards

var picking = false; //Currently generating result list

function setup()
{ 
    document.getElementById("curse").src = curseDirectory; //Initialize curse image

    //Setup sets (designed to be modular, i.e. just drop a new set into dominionData)
    var sets = document.getElementById("sets");
    
    var list = document.createElement("UL");
    list.className = "optionsList";

    var x = 0;
    while(data[x] != null)
    {
        var item = document.createElement("LI");
        list.appendChild(item);
        
        var checkbox = document.createElement("INPUT");
        checkbox.type = "checkbox";
        checkbox.setAttribute("onclick","checkCheckbox(this)");
        checkbox.id = data[x].name;
        item.appendChild(checkbox);
        
        var name = document.createElement("SPAN");
        name.innerHTML = data[x].name.charAt(0).toUpperCase() + data[x].name.slice(1); 
        item.appendChild(name);

        var includeTrueSets = document.createElement("SPAN");
        includeTrueSets.id = "include" + data[x].name;
        includeTrueSets.innerHTML = " " + data[x].include;
        item.appendChild(includeTrueSets);
        
        x++;
    }
    sets.appendChild(list);



    //Setup cards 
    var cards = document.getElementById("cards");

    var setList = document.createElement("UL");
    setList.className = "optionsList";

    var x = 0;
    while(data[x] != null)
    {
        var set = document.createElement("LI");
        setList.appendChild(set);
        
        var setRadio = document.createElement("INPUT");
        setRadio.type = "radio";
        setRadio.setAttribute("onclick","changeCardSet(this)");
        setRadio.id = "C" + data[x].name;
        setRadio.name = "cardSet";
        set.appendChild(setRadio);
        
        var setName = document.createElement("SPAN");
        setName.innerHTML = data[x].name.charAt(0).toUpperCase() + data[x].name.slice(1); 
        set.appendChild(setName);
        
        x++;
    }

    cards.appendChild(setList);

    //Set up list of cards
    x = 0;
    while(data[x] != null)
    {
        var cardList = document.createElement("UL");
        cardList.id = "C" + data[x].name + "C"; 
        cardList.className = "optionsList";
        cardList.setAttribute("float","left");
        cardList.setAttribute("hidden","hidden");

        var y = 0;
        while(data[x].cards[y] != null)
        {
            var c = document.createElement("LI");
            cardList.appendChild(c);
            
            var cardCBox = document.createElement("INPUT");
            cardCBox.type = "checkbox";
            cardCBox.setAttribute("onclick","checkCheckbox(this)"); 
            cardCBox.id = data[x].cards[y].name;
            c.appendChild(cardCBox);
            
            var cardName = document.createElement("SPAN");
            cardName.innerHTML = data[x].cards[y].name.charAt(0).toUpperCase() + data[x].cards[y].name.slice(1);
            c.appendChild(cardName);

            var includeTrue = document.createElement("SPAN");
            includeTrue.id = "include" + data[x].cards[y].name;
            includeTrue.innerHTML = " " + data[x].cards[y].include;
            c.appendChild(includeTrue);

            y++;
        }

        x++;

        cards.appendChild(cardList);
    }

    updateCheckboxs();

    //Temporary states
    document.getElementById("setRandom").setAttribute("disabled","disabled");
    document.getElementById("setRandom").setAttribute("checked","checked");
    document.getElementById("noDefense").setAttribute("disabled","disabled");
}

function go() //Runs check before picking
{
    var numCards = 0;
    var x = 0;
    var breakLoop = false;
    while(data[x] != null) //Checks for at least 10 cards
    {
        var y = 0;
        while(data[x].cards[y] != null)
        {
            if(data[x].cards[y].include)
            {
                numCards++;
                if(numCards == 10) //If there are at least 10 cards, end the loops
                {
                    breakLoop = true; //Ends the outer loop
                    break;
                }
            }

            y++;
        }

        if(breakLoop)
        {
            break;
        }

        x++;
    }
    
    if(!picking && numCards == 10) //Is not picking and at least 10 cards picked
    { 
        changeMenu({id: "resetResult"}); //Reset the result div
        run(); //Start picking the cards
    }
    else if(numCards < 10)
    {
        alert("You have to select at least 10 cards!");
    }
    else if(picking)
    {
        alert("The system is current picking the cards!");
    }
}

function run() //Pick the cards!
{
    picking = true;
    if(weighSetsEqual) //Weighs all sets equally when choosing a random set per card 
    {
        var x = 0; //Tracks through the data aset
        var x1 = 0; //Tracks the new set
        while(data[x] != null) //Run through all sets
        {
            if(data[x].include) //Only include sets with include = true
            {
                selection[x1] = [];

                var y = 0;
                var y1 = 0;
                while(data[x].cards[y] != null) //Run through all cards in set
                {
                    if(data[x].cards[y].include) //Only include cards with include = true
                    {
                        selection[x1][y1] = data[x].cards[y];
                        y1++;
                    }

                    y++;
                }

                x1++;
            }

            x++;
        } 
        
        for(var x = 0; x < 10; x++)
        {
            var nextSet = selection[Math.floor(Math.random()*selection.length)]; //Pick the next set
            var nextCard = nextSet[Math.floor(Math.random()*nextSet.length)]; //Pick the next card from the next set
            //alert(selection.length); alert(nextSet.length); 
            var y = 0;
            var isRepeat = false;
            while(result[y] != null) //Check if the card has been picked already...
            {
                if(Object.is(result[y],nextCard)) 
                { //TODO: Maybe change to remove card from selection instead? Worst case now is (10!)/10^10 (only 10 cards selected)
                    isRepeat = true;
                    break;
                }

                y++;
            }

            if(isRepeat) //...retry if it is a repeat...
            {
                x--;
            }
            else //...add it to the result if not
            {
                result[x] = nextCard;
            }
        }

        showResult(); //Shows the results on the page
    }
    else
    {

    }
    
    picking = false; //run() can now be called again
    //for(var z = 0; z < 10; z++){alert(document.getElementById("r" + (z+1)).src);}
}

function showResult()
{
    /*
    var resultsLoaded = 0;
    for(var x = 0; x < 10; x++)
    {
        var r = document.getElementById("r" + (x+1));
        r.onload = function(){
            resultsLoaded++;
        };
    }
    */

    for(var x = 0; x < 10; x++)
    {
        var r = document.getElementById("r" + (x+1)); 
        r.src = result[x].imageDirectory; 
        r.setAttribute("title",result[x].name.charAt(0).toUpperCase() + result[x].name.slice(1)); 
    }

    //while(resultsLoaded != 10){alert("loading");}

    /*
    for(var x = 0; x < 10; x++)
    {
        var r = document.getElementById("r" + (x+1));
        r.removeAttribute("hidden");
    }
    */

    for(var x = 0; x < 10; x++)
    {
        if(result[x].isCurse)
        {
            document.getElementById("curse").removeAttribute("hidden");
        }
    }

    document.getElementById("result").removeAttribute("hidden");
}

function checkCheckbox(checkbox)
{ 
    if(checkbox.disabled !== "disabled" && checkbox.checked) //Checked the box
    {
        //If the checkbox is the noAttack box
        if(checkbox.id == "noAttack")
        {
            var x = 0;
            while(data[x] != null) //Run through all sets
            {
                var y = 0;
                while(data[x].cards[y] != null) //Run through all cards
                {
                    if(data[x].cards[y].isAttack) //If the card is an attack card...
                    {
                        data[x].cards[y].include = false; //...set include to false
                    }

                    y++;
                }

                x++;
            }

            updateCheckboxs();
            return;
        }

        //If the checkbox is the noDefense box

        //If the checkbox is a set checkbox
        var x = 0;
        while(data[x] != null)
        {
            if(checkbox.id == data[x].name)
            {
                data[x].include = true; //Set the set include = true
                //Base -> true, All BaseCards -> true 
                var y = 0;
                while(data[x].cards[y] != null)
                {
                    data[x].cards[y].include = true;

                    y++;
                }

                updateCheckboxs();
                return; 
            }

            x++;
        }

        //If the checkbox is a card checkbox
        var x = 0;
        while(data[x] != null)
        {
            var y = 0;
            while(data[x].cards[y] != null)
            {
                if(checkbox.id == data[x].cards[y].name)
                {
                    data[x].cards[y].include = true; //Set the card include = true
                    //BaseCard -> true, then base -> true
                    data[x].include = true;
                    
                    updateCheckboxs();
                    return;
                }

                y++;
            }

            x++;
        }
    }
    else if(checkbox.disabled !== "disabled" && !checkbox.checked) //Unchecked the box
    {
        //If the checkbox is the noAttack box
        if(checkbox.id == "noAttack")
        {
            var x = 0;
            while(data[x] != null) //Run through all sets
            {
                var y = 0;
                while(data[x].cards[y] != null) //Run through all cards
                {
                    if(data[x].cards[y].isAttack) //If the card is an attack card...
                    {
                        data[x].cards[y].include = true; //...set include to true
                    }

                    y++;
                }

                x++;
            }

            updateCheckboxs();
            return;
        }

        //If the checkbox is the noDefense box

        //If the checkbox is a set checkbox
        var x = 0;
        while(data[x] != null)
        {
            if(checkbox.id == data[x].name)
            { 
                data[x].include = false; //Set the set include = false
                //Base -> false, All BaseCards -> false 
                var y = 0;
                while(data[x].cards[y] != null)
                {
                    data[x].cards[y].include = false;

                    y++;
                }

                updateCheckboxs();
                return;
            }

            x++;
        }

        //If the checkbox is a card checkbox
        var x = 0;
        while(data[x] != null)
        {
            var y = 0;
            while(data[x].cards[y] != null)
            {
                if(checkbox.id == data[x].cards[y].name)
                {
                    data[x].cards[y].include = false; //Set the card include = false
                    //BaseCard -> false, if All BaseCards == false, then base -> false
                    var z = 0;
                    var isAllSetCardsFalse = true;
                    while(data[x].cards[z] != null)
                    {
                        if(data[x].cards[z].include)
                        {
                            isAllSetCardsFalse = false;

                            updateCheckboxs(); 
                            return; 
                        }

                        z++;
                    }

                    if(isAllSetCardsFalse)
                    {
                        data[x].include = false;
                    }

                    updateCheckboxs();
                    return;
                }

                y++;
            }

            x++;
        }
    }
}

function updateCheckboxs()
{
    //1: Checked Base[x]    -- set all BaseC [x]
    //2: Unchecked Base[ ]  -- set all BaseC [ ]
    //3: Checked BaseC[x]   -- if(Base[ ]), then set Base[x]
    //4: Unchecked BaseC[ ] -- if(all BaseC[ ]), then set Base[ ]

    //Updates the card and set checkboxes
    var x = 0;
    while(data[x] != null)
    {
        if(data[x].include)
        {
            //document.getElementById(data[x].name).setAttribute("checked","checked");
            document.getElementById(data[x].name).checked = true;
            //alert(data[x].name + " is now checked");
        }
        else
        {
            //document.getElementById(data[x].name).removeAttribute("checked");
            document.getElementById(data[x].name).checked = false;
            //alert(data[x].name + " is now UNchecked");
        }
        document.getElementById("include" + data[x].name).innerHTML = " " + data[x].include;

        var y = 0;
        while(data[x].cards[y] != null)
        {
            if(data[x].cards[y].include)
            {
                //document.getElementById(data[x].cards[y].name).setAttribute("checked","checked");
                //alert(document.getElementById(data[x].name).checked);
                document.getElementById(data[x].cards[y].name).checked = true;
                //alert(document.getElementById(data[x].name).checked);
                //alert(data[x].cards[y].name + " is now checked");
            }
            else
            { 
                //document.getElementById(data[x].cards[y].name).removeAttribute("checked"); 
                //alert(document.getElementById(data[x].name).checked);
                document.getElementById(data[x].cards[y].name).checked = false; 
                //alert(document.getElementById(data[x].name).checked); //ALERTS FALSE WTFFFFF
                //alert(data[x].cards[y].name + " is now UNchecked");
            }
            document.getElementById("include" + data[x].cards[y].name).innerHTML = " " + data[x].cards[y].include;

            y++;
        }

        x++;
    }
    
    //Updates the noAttack box (Note: only unchecks it! Doesn't check it)
    var x = 0;
    while(data[x] != null)
    {
        var y = 0;
        while(data[x].cards[y] != null)
        {
            if(data[x].cards[y].isAttack && data[x].cards[y].include)
            { 
                document.getElementById("noAttack").checked = false;
                
                return; //TEMPORARY, MIGHT CHANGE TO LOOP BREAK TO ACCOMDATE CONDITIONS AFTER THIS ONE
            }

            y++;
        }

        x++;
    }
}

function changeCardSet(set) //Changes card sets in the cards option/menu
{
    var x = 0;
    while(data[x] != null) //Runs through all sets
    {
        document.getElementById("C" + data[x].name + "C").setAttribute("hidden","hidden"); //Hides all card sets
        
        x++;
    }

    document.getElementById(set.id + "C").removeAttribute("hidden"); //Make the relevant one visible
}

function changeMenu(menu)
{
    if(menu.id == "showSets") //Change menus
    {
        document.getElementById("sets").removeAttribute("hidden");
        document.getElementById("options").setAttribute("hidden","hidden");
        document.getElementById("cards").setAttribute("hidden","hidden");
    }
    else if(menu.id == "showOptions")
    {
        document.getElementById("sets").setAttribute("hidden","hidden");
        document.getElementById("options").removeAttribute("hidden");
        document.getElementById("cards").setAttribute("hidden","hidden");
    }
    else if(menu.id == "showCards")
    {
        document.getElementById("sets").setAttribute("hidden","hidden");
        document.getElementById("options").setAttribute("hidden","hidden");
        document.getElementById("cards").removeAttribute("hidden");
    }
    else if(menu.id == "resetResult") //Reset the result cards
    { 
        document.getElementById("result").setAttribute("hidden","hidden");
        document.getElementById("curse").setAttribute("hidden","hidden");

        selection = [];
        result = [];
    }
}

function hoverMenu(menu) 
{
    menu.style.backgroundColor = "gray";
}

function unhoverMenu(menu)
{
    menu.style.backgroundColor = "black";
}