let game;
let gameOptions = {
    gemSize: 80,
    boardOffset: {
        x: 680,
        y: 320
    },
    localStorageName: "GameLogic"
}

window.onload = function() {
    let gameConfig = {
        type: Phaser.AUTO,
        backgroundColor: 0x222222,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: "thegame",
            width: 1920,
            height: 1080
        },
        scene: playGame
    }
    game = new Phaser.Game(gameConfig);
    window.focus()
}

class playGame extends Phaser.Scene{

    constructor(){
        super("PlayGame");
        this.sprites = [];
        this.buttonsList = [];

    }
    preload(){
        this.load.spritesheet("tiles", "assets/sprites/tiles.png", {
            frameWidth: gameOptions.gemSize,
            frameHeight: gameOptions.gemSize
        });
        this.load.image('button', 'assets/sprites/button.png');
        this.load.image('monster', 'assets/sprites/monster.png');
        this.load.image('star', 'assets/sprites/star.png');


    }
    create(){
        this.GameLogic = new GameLogic({
            rows: 6,
            columns: 6,
            items: 3,
        });

        this.savedData = localStorage.getItem(gameOptions.localStorageName) == null ? {
            level: 0
        } : JSON.parse(localStorage.getItem(gameOptions.localStorageName));

        console.log(this.savedData.level);
        this.GameLogic.levelnum = this.savedData.level;
        
        this.GameLogic.generateBoard();
        this.drawField();
        this.monsters();
        this.buttons();
    }

    new(button){
        button.destroy();
        this.sprites = [];
        this.GameLogic.generateBoard();
        this.drawField();
        this.buttons();
        this.monsters();
    }
    
    drawField(){
        this.poolArray = [];
        for(let i = 0; i < this.GameLogic.getRows(); i ++){
            for(let j = 1; j <= this.GameLogic.getColumns(); j ++){
                let gemX = gameOptions.boardOffset.x + gameOptions.gemSize * j + gameOptions.gemSize / 2;
                let gemY = gameOptions.boardOffset.y + gameOptions.gemSize * i + gameOptions.gemSize / 2;
                let gem = this.add.sprite(gemX, gemY, "tiles", this.GameLogic.getValueAt(i, j-1)-1);
                this.sprites.push(gem);
            }
        }


    }

    buttons(){

        let button1 = this.add.sprite(game.config.width / 2-165, game.config.height - 200, 'button').setInteractive();
        this.sprites.push(button1);
        this.buttonsList.push(button1);
        
        let rbText = this.add.text(game.config.width / 2 - 245, game.config.height - 220, "swap R-B", { font: '35px Arial', color: '0x222222' });


        let button2 = this.add.sprite(game.config.width / 2 + 48, game.config.height - 200, 'button').setInteractive();
        this.sprites.push(button2);
        this.buttonsList.push(button2);


        let ryText = this.add.text(game.config.width / 2 - 25, game.config.height - 220, "swap R-Y", { font: '35px Arial', color: '0x222222' });
    
           
        let button3 = this.add.sprite(game.config.width / 2 + 260, game.config.height - 200, 'button').setInteractive();
        this.sprites.push(button3);
        this.buttonsList.push(button3);


        let ybText = this.add.text(game.config.width / 2 + 185, game.config.height - 220, "swap Y-B", { font: '35px Arial', color: '0x222222' });
    



        button1.on('pointerdown', function (pointer) 
        {

            this.GameLogic.swapColors(2, 3);
            if(this.GameLogic.swaps == false){
                button1.setTint(0xFF0000)
                button2.setTint(0xFF0000)
                button3.setTint(0xFF0000)
            }
            
            this.drawField();

        }, this);

        button2.on('pointerdown', function (pointer) 
        {
            this.GameLogic.swapColors(1, 3);
            if(this.GameLogic.swaps == false){
                button1.setTint(0xFF0000)
                button2.setTint(0xFF0000)
                button3.setTint(0xFF0000)
            }
            
            this.drawField();
        }, this);

       

        button3.on('pointerdown', function (pointer) 
        {

            this.GameLogic.swapColors(1, 2);
            if(this.GameLogic.swaps == false){
                button1.setTint(0xFF0000)
                button2.setTint(0xFF0000)
                button3.setTint(0xFF0000)
            }

            this.drawField();

        }, this);

    }


    goal(){
        let goal1 = this.add.sprite(gameOptions.boardOffset.x + gameOptions.gemSize * 7 +gameOptions.gemSize / 2, gameOptions.boardOffset.y + gameOptions.gemSize * 1 + gameOptions.gemSize / 2, 'star');
        goal1.setTint(0x2ca7b2);
        goal1.position = [1, 6];
        this.sprites.push(goal1);


        let goal2 = this.add.sprite(gameOptions.boardOffset.x + gameOptions.gemSize * 7 +gameOptions.gemSize / 2, gameOptions.boardOffset.y + gameOptions.gemSize * 5 + gameOptions.gemSize / 2, 'star');
        goal2.setTint(0xe84e4e);
        goal2.position = [5, 6];
        this.sprites.push(goal2);


        let goal3 = this.add.sprite(gameOptions.boardOffset.x + gameOptions.gemSize * 3 +gameOptions.gemSize / 2, gameOptions.boardOffset.y  + gameOptions.gemSize * -1 +gameOptions.gemSize / 2, 'star');
        goal3.setTint(0xf7c83b);
        goal3.position = [-1, 2];
        this.sprites.push(goal3);


        return [goal1, goal2, goal3];

    }

    monsters(){

        let goals = this.goal();

        let goal1 = goals[0];

        let goal2 = goals[1];
        let goal3 = goals[2];

        let monster1 = this.add.sprite(gameOptions.boardOffset.x + gameOptions.gemSize / 2, gameOptions.boardOffset.y + gameOptions.gemSize * 3 + gameOptions.gemSize / 2, 'monster').setInteractive({ draggable: true });
        this.sprites.push(monster1);


        monster1.setTint(0x2ca7b2);
        monster1.depth = monster1.x + monster1.y;
        monster1.position = [3, -1];
        monster1.type = 2;
        monster1.goalPos = goal1.position;
        monster1.movable = true;
        monster1.win = false;
        monster1.onGoal = false;
        monster1.hasMoved = false;
        this.GameLogic.monster1Pos = monster1.position;

        let monster2 = this.add.sprite(gameOptions.boardOffset.x + gameOptions.gemSize / 2, gameOptions.boardOffset.y + gameOptions.gemSize * 1 + gameOptions.gemSize / 2, 'monster').setInteractive({ draggable: true });
        this.sprites.push(monster2);


        monster2.setTint(0xe84e4e);
        monster2.depth = monster2.x + monster2.y;
        monster2.position = [1, -1];
        monster2.type = 3;
        monster2.goalPos = goal2.position;
        monster2.movable = true;
        monster2.win = false;
        monster2.onGoal = false;
        monster2.hasMoved = false;
        this.GameLogic.monster2Pos = monster2.position;



        let monster3 = this.add.sprite(gameOptions.boardOffset.x + gameOptions.gemSize / 2, gameOptions.boardOffset.y + gameOptions.gemSize * 5 + gameOptions.gemSize / 2, 'monster').setInteractive({ draggable: true });
        this.sprites.push(monster3);


        monster3.setTint(0xf7c83b);
        monster3.depth = monster3.x + monster3.y;
        monster3.position = [5, -1];
        monster3.type = 1;
        monster3.goalPos = goal3.position;
        monster3.movable = true;
        monster3.win = false;
        monster3.onGoal = false;
        monster3.hasMoved = false;
        this.GameLogic.monster3Pos = monster3.position;





        monster1.on('drag', function (pointer, dragX, dragY) {


            this.GameLogic.checkAllowSwap(monster1, monster2, monster3)
            
            if(this.GameLogic.swaps){
                
                this.buttonsList[0].setTint(0xFFFFFF)
                this.buttonsList[1].setTint(0xFFFFFF)
                this.buttonsList[2].setTint(0xFFFFFF)
                
            }

            this.GameLogic.monsterMove(monster1, dragX, dragY, 40);

            this.GameLogic.monster1Pos = monster1.position;
            if(monster3.movable != true && monster3.onGoal != true){
                monster3.movable = true
            }
            if(monster2.movable != true && monster2.onGoal != true){
                monster2.movable = true
            }
            if(monster1.win == true){
                console.log("NEXT");
                this.next();

            }

        }, this);

        monster2.on('drag', function (pointer, dragX, dragY) {

            this.GameLogic.checkAllowSwap(monster1, monster2, monster3)
             if(this.GameLogic.swaps){
                
                this.buttonsList[0].setTint(0xFFFFFF)
                this.buttonsList[1].setTint(0xFFFFFF)
                this.buttonsList[2].setTint(0xFFFFFF)
                
            }
            this.GameLogic.monsterMove(monster2, dragX, dragY, 40);
            this.GameLogic.monster2Pos = monster2.position;
            
            if(monster3.movable != true && monster3.onGoal != true){
                monster3.movable = true
            }
            if(monster1.movable != true && monster2.onGoal != true){
                monster1.movable = true
            }

            if(monster2.win == true){
                console.log("NEXT");
                this.next();

            }

        }, this);

        monster3.on('drag', function (pointer, dragX, dragY) {

            this.GameLogic.checkAllowSwap(monster1, monster2, monster3)
             if(this.GameLogic.swaps){
                
                this.buttonsList[0].setTint(0xFFFFFF)
                this.buttonsList[1].setTint(0xFFFFFF)
                this.buttonsList[2].setTint(0xFFFFFF)
                
            }
            this.GameLogic.monsterMove(monster3, dragX, dragY, 40);
            this.GameLogic.monster3Pos = monster3.position;
            
            if(monster1.movable != true && monster3.onGoal != true){
                monster1.movable = true
            }
            if(monster2.movable != true && monster2.onGoal != true){
                monster2.movable = true
            }

            if(monster3.win == true){
                console.log("NEXT");
                this.next();

            }

        }, this);

    }

    // monsterReset(monsters){
    //         let monster1 = monsters[0];
    //         let monster2 = monsters[1];
    //         let monster3 = monsters[2];

    //         monster1.position = [3, -1];
    //         monster1.movable = true;
    //         monster1.setInteractive({ draggable: true });
    //         monster1.x = gameOptions.boardOffset.x + gameOptions.gemSize / 2;
    //         monster1.y = gameOptions.boardOffset.y + gameOptions.gemSize * 3 + gameOptions.gemSize / 2;



    //         monster2.position = [1, -1];
    //         monster2.movable = true;
    //         monster2.setInteractive({ draggable: true });
    //         monster2.x = gameOptions.boardOffset.x + gameOptions.gemSize / 2;
    //         monster2.y = gameOptions.boardOffset.y + gameOptions.gemSize * 1 + gameOptions.gemSize / 2;

    //         monster3.position = [5, -1];
    //         monster3.movable = true;
    //         monster3.setInteractive({ draggable: true });
    //         monster3.x = gameOptions.boardOffset.x + gameOptions.gemSize / 2;
    //         monster3.y = gameOptions.boardOffset.y + gameOptions.gemSize * 5 + gameOptions.gemSize / 2;


    // }

    next(monsters){
        
        if(this.GameLogic.checkEnd()){
            let winText = this.add.text(game.config.width / 2 - 75, game.config.height /2, "YOU WIN!", { font: '55px Arial', color: '0x222222' });
        }

        else{
            let nextButton = this.add.sprite(game.config.width / 2 + 48, game.config.height/2, 'button').setInteractive();
            let nextText = this.add.text(game.config.width / 2 - 25, game.config.height /2, "Next Level", { font: '35px Arial', color: '0x222222' });
            this.sprites.push(nextButton);
            this.sprites.push(nextText);

            console.log(this.sprites);


            nextButton.on('pointerdown', function (pointer)
            {


                for( let i=0; i < this.sprites.length; i++){
                    this.sprites[i].destroy();
                }

                console.log(this.sprites);

                this.GameLogic.next();

                this.new(nextButton);

            }, this);
        }
    }
        
}
class GameLogic{

    // constructor, simply turns obj information into class properties
    constructor(obj){
        if(obj == undefined){
            obj = {}
        }
        this.rows = (obj.rows != undefined) ? obj.rows : 6;
        this.columns = (obj.columns != undefined) ? obj.columns : 6;
        this.items = (obj.items != undefined) ? obj.items : 3;
        this.goalsReached = 0;

        // this.swaps = [5, 4, 10];

        this.swaps = true;
        this.level1 = [[2,1,2,1,3,3],[3,2,2,2,1,3],[3,3,1,2,1,2],[1,1,2,1,3,1],[1,3,1,3,2,3],[1,2,1,2,1,3]]
        // this.level1 = [[1,1,2,2,3,3],[1,1,2,2,3,3],[1,1,2,2,3,3],[1,1,2,2,3,3],[1,1,2,2,3,3],[1,1,2,2,3,3]];
        this.level2 = [[1,1,2,2,3,3],[2,2,2,2,3,3],[3,3,2,2,1,1],[1,1,2,2,3,3],[1,1,1,1,3,3],[1,1,2,2,3,3]];
        this.level3 = [[2,1,2,1,3,3],[1,2,2,2,1,3],[3,3,1,2,1,2],[1,1,2,1,3,1],[1,3,1,3,2,3],[1,2,1,2,1,3]];

        this.levelnum = 0;
        this.levels = [this.level1, this.level2, this.level3]

        this.totallevels = 2; // levelnum starts at 0
        this.monster1Pos = null;
        this.monster2Pos = null;
        this.monster3Pos = null; 
    }

    // generates the game board from the levels
    generateBoard(){
        this.gameArray = [];
        for(let i = 0; i < this.rows; i ++){
            this.gameArray[i] = [];
            for(let j = 0; j < this.columns; j ++){
                let Value = this.levels[this.levelnum][i][j];
                this.gameArray[i][j] = {
                    value: Value,
                    row: i,
                    column: j,
                    piece: 0
                }
            }
        }
        console.log(this.gameArray)
    }

    swapColors(c1, c2){

        console.log(this.swaps);
        
        if(this.swaps){
            for(let i=0; i < this.columns; i ++){
                for(let j = 0; j < this.rows; j ++){
                    if(this.gameArray[i][j].value == c1 && this.gameArray[i][j].piece == 0){
                        this.gameArray[i][j].value = c2                    
                    }

                    else if(this.gameArray[i][j].value == c2 && this.gameArray[i][j].piece == 0){
                        this.gameArray[i][j].value = c1
                    }
                }
            }

            this.swaps = false;

            this.checkLose(this.monster1Pos, this.monster2Pos, this.monster3Pos, this.swaps);

        }
        
        
    }

    displaySwap(swapText){
        swapText.setText('Swaps Left: ' + this.swaps[this.levelnum]);

    }

    // returns the number of board rows
    getRows(){
        return this.rows;
    }

    // returns the number of board columns
    getColumns(){
        return this.columns;
    }

    
    // returns the value of the item at (row, column), or false if it's not a valid pick
    
    validPick(row, column){
        return row >= 0 && row < this.rows && column >= 0 && column < this.columns && this.gameArray[row] != undefined && this.gameArray[row][column] != undefined;
    }

    getValueAt(row, column){

        if(!this.validPick(row, column)){
            console.log("invalid move")
            console.log(row);
            console.log(column);
            return false;
        }

        else{
            return this.gameArray[row][column].value;

        }
    }

    compareArray(a1, a2){
        for(let i = 0; i< a1.length; i++){
            if(a1[i] != a2[i]){
                return false;
            }
        }
        return true;
    }

    checkGoal(monster, dragX, dragY, buff){
        
        if(dragX - buff> monster.x && monster.movable == true){

                
                let newPosition = [monster.position[0], monster.position[1]+1];

                
                if(this.compareArray(newPosition, monster.goalPos)){
                    console.log("YAY");
                    monster.x += 80;
                    monster.movable = false;
                    monster.setInteractive({ draggable: false });
                    monster.atGoal = true;
                    return true;
                }
                
            }
        if(dragY-buff > monster.y && monster.movable == true){
            
            let newPosition = [monster.position[0]+1, monster.position[1]];
            if(this.compareArray(newPosition, monster.goalPos)){
                console.log("YAY");
                monster.y += 80;
                monster.movable = false;
                monster.setInteractive({ draggable: false });
                monster.atGoal = true;
                return true;
            }
            
        }

        if(dragX+(2*buff) < monster.x && monster.movable == true){
            
            let newPosition = [monster.position[0], monster.position[1]-1];
            
            if(this.compareArray(newPosition, monster.goalPos)){
                    console.log("YAY");
                monster.x -= 80;
                monster.movable = false;

                monster.setInteractive({ draggable: false });
                monster.atGoal = true;
                return true;
            }

        }
        if(dragY+buff < monster.y && monster.movable == true){
            
            let newPosition = [monster.position[0]-1, monster.position[1]];
            if(this.compareArray(newPosition, monster.goalPos)){
                console.log("YAY");
                monster.y -= 80;
                monster.movable = false;
                monster.setInteractive({ draggable: false });
                monster.atGoal = true;
                return true;
            }



        }
        monster.depth = monster.x + monster.y;
        return false;

    }

    monsterMove(monster, dragX, dragY, buff){

        if(this.checkGoal(monster, dragX, dragY, buff)){
            console.log("goal reached");
            monster.onGoal = true;

            this.goalsReached ++;
            if(this.goalsReached == 3){
                monster.win = true;
            }
            
        }
        
        else if(dragX - buff > monster.x && this.getValueAt(monster.position[0], monster.position[1]+1) == monster.type && monster.movable == true){
                
                let newPosition = [monster.position[0], monster.position[1]+1];
                this.movePiece(monster.position[0], monster.position[1], newPosition[0], newPosition[1]);
                monster.x += 80;
                monster.position = newPosition;
                monster.hasMoved = true;
                monster.movable = false;

            }
        
        else if(dragY - buff > monster.y && this.getValueAt(monster.position[0]+1, monster.position[1]) == monster.type && monster.movable == true){
            
            let newPosition = [monster.position[0]+1, monster.position[1]];
            
            this.movePiece(monster.position[0], monster.position[1], newPosition[0], newPosition[1]);

            monster.y += 80;
            monster.position = newPosition;
            monster.hasMoved = true;
            monster.movable = false;

        }

        else if(dragX+(2*buff) < monster.x && this.getValueAt(monster.position[0], monster.position[1]-1) == monster.type && monster.movable == true){
            
            let newPosition = [monster.position[0], monster.position[1]-1];
            this.movePiece(monster.position[0], monster.position[1], newPosition[0], newPosition[1]);

            monster.x -= 80;
            monster.position = newPosition;
            monster.hasMoved = true;
            monster.movable = false;

        }
        else if(dragY+buff < monster.y && this.getValueAt(monster.position[0]-1, monster.position[1]) == monster.type && monster.movable == true){
            
            let newPosition = [monster.position[0]-1, monster.position[1]];
            this.movePiece(monster.position[0], monster.position[1], newPosition[0], newPosition[1]);

            monster.y -= 80;
            monster.position = newPosition;
            monster.hasMoved = true;
            monster.movable = false;


        }
        monster.depth = monster.x + monster.y;
    }


    movePiece(OldRow, OldColumn, NewRow, NewColumn){
        
        if(this.validPick(OldRow, OldColumn)){
            this.gameArray[OldRow][OldColumn].piece = 0;

        }

        if(this.validPick(NewRow, NewColumn)){
            this.gameArray[NewRow][NewColumn].piece = 1;

        }

    }

    checkAllowSwap(monster1, monster2, monster3){

        if((monster1.hasMoved && monster2.hasMoved && monster3.hasMoved) && this.swaps == false){
            this.swaps = true;

            if(monster1.onGoal != true){
                monster1.hasMoved = false;
                monster1.movable = true;
            }

            if(monster2.onGoal != true){
                monster2.hasMoved = false;
                monster2.movable = true;
            }

            if(monster3.onGoal != true){
                monster3.hasMoved = false;
                monster3.movable = true;
            }
            
        }

    }

    checkLose(monster1, monster2, monster3, swaps){
        if(swaps == false){
            if(!this.checkCanMove(monster1) || !this.checkCanMove(monster2) || !this.checkCanMove(monster3)){
                console.log("YOU LOSE!!!!")
                return true;
            }
            else{
                return false;
            }
        }
        else{
                return false;
            }

    }

    checkCanMove(monster){
        console.log("cheking move")
        var right = this.getValueAt(monster[0] + 1, monster[1]);
        var left = this.getValueAt(monster[0] - 1, monster[1]);
        var up = this.getValueAt(monster[0], monster[1] - 1); 
        var down = this.getValueAt(monster[0], monster[1] + 1);        

        if((right != monster.type)&& (left != monster.type)  &&  (up != monster.type)  && (down != monster.type)){
            return false;
        }

        else{
            return true;
        }

    }

    next(){
        if(this.levelnum < this.totallevels){
            this.levelnum ++;

            localStorage.setItem(gameOptions.localStorageName,JSON.stringify({
                level: this.levelnum
            }));

            this.goalsReached = 0;
    
        }
    }

    checkEnd(){
        if(this.levelnum == this.totallevels){
            return true;
        }
        else{
            return false;
        }
    
    }

}
