var player1 = prompt("Enter name for player 1 (blue): ")
var player2 = prompt("Enter name for player 2 (red): ")
var player1_message = ": it is your turn to move. Drop the blue checker in a column"
var player2_message = ": it is your turn to move. Drop the red checker in a column"
var whose_turn = 1;

var num_rows = 6;
var num_cols = 7;
var elements = num_rows*num_cols;

var data = Array(elements).fill(0)

function updateBoard() {
  for (var i = 0; i < data.length; i++) {
    switch (data[i]) {
      case 0:
        $("#"+i).css("background", "gray");
//        console.log("case0");
        break;
      case 1:
        $("#"+i).css("background", "blue");
//        console.log("case1");
        break;
      case 2:
      $("#"+i).css("background", "red");
//        console.log("case2");
        break;
      default:
      $("#"+i).css("background", "gray");
//        console.log("default");
    }
  }
}

function idToRow(button_id){
  return Math.floor(button_id/num_cols);
}

function idToCol(button_id){
  return button_id%num_cols;
}

function RCtoID(row, col){
  return col + ((row)*num_cols);
}

function four_in_a_row(candidate){
  var winner = 0;
  var current_player = 0;
  var count = 0;
  var test_array = [];
  for (id of candidate) {
    test_array.push(data[id])
  }
  for (var i = 0; i < test_array.length; i++) {
    if (current_player === test_array[i] && test_array[i] !== 0) {
      count++;
      if (count === 4) {
        return winner = current_player;
      }
    }
    else {
      current_player = test_array[i];
      count = 1;
    }
  }
  return winner;
}


function four_in_a_row_ALT(candidate){
  candidate = candidate.toString()
  return (candidate.includes("1,1,1,1")*1) + (candidate.includes("2,2,2,2")*2)
}

function findLeftDiagBase(id, row_inc, col_inc){
  var row = idToRow(id)
  var col = idToCol(id)
  while (row != 0 && col != 0) {
    row += row_inc;
    col += col_inc;
  }
  return RCtoID(row, col)
}

function findRightDiagBase(id, row_inc, col_inc){
  var row = idToRow(id)
  var col = idToCol(id)
  while (row != 0 && col != num_cols-1) {
    row += row_inc;
    col += col_inc;
  }
  return RCtoID(row, col)
}

function extractLeftDiag(id){
  var base_id = findLeftDiagBase(id, -1, -1)
  var new_array = []
  var current_row = idToRow(base_id)
  var current_col = idToCol(base_id)
  while (current_row < num_rows && current_col < num_cols) {
    new_array.push(RCtoID(current_row, current_col))
    current_row++;
    current_col++;
  }
  return new_array;
}

function extractRightDiag(id){
  var base_id = findRightDiagBase(id, -1, 1)
  var new_array = []
  var current_row = idToRow(base_id)
  var current_col = idToCol(base_id)
  while (current_row < num_rows && current_col >= 0) {
    new_array.push(RCtoID(current_row, current_col))
    current_row++;
    current_col--;
  }
  return new_array;
}

function extractRow(id){
  var row_index = idToRow(id)
  var base_id = RCtoID(row_index, 0)
  var new_array = []
  for (var i = 0; i < num_cols; i++) {
    new_array.push(base_id + i)
  }
  return new_array;
}

function extractCol(id){
  var col_index = idToCol(id)
  var base_id = RCtoID(0, col_index)
  var new_array = []
  for (var i = 0; i < num_rows; i++) {
    new_array.push(base_id + (num_cols*i))
  }
  return new_array;
}

function evaluate(id){
  //row processing
  var candidate = extractRow(id)
  var winner = four_in_a_row(candidate)
  if (winner > 0) {
    return winner
  }

  //column processing
  candidate = extractCol(id)
  winner = four_in_a_row(candidate)
  if (winner > 0) {
    return winner
  }

  //left diagonal processing
  candidate = extractLeftDiag(id)
  winner = four_in_a_row(candidate)
  if (winner > 0) {
    return winner
  }

  //right diagonal processing
  candidate = extractRightDiag(id)
  winner = four_in_a_row(candidate)
  if (winner > 0) {
    return winner
  }

  return 0;
}

function processClick(clicked_id){
  var checker_id = clicked_id%num_cols;
  var clicked_col = extractCol(checker_id);
  var row = 0;
  for (id of clicked_col) {
    if (data[id] === 0) {
      data[id] = whose_turn;
      updateBoard();
      break;
    }
    row++;
  }
  return evaluate(checker_id+(7*row))
}




$("#player_turn").text(player1 + player1_message)

$(".game_button").click(function(){
  var clicked_button = this.id;
  var winner = processClick(clicked_button);
  if (winner != 0) {
    $("#announcement").fadeOut(100)
    $("#instruction").fadeOut(100)
    $("#player_turn").fadeOut(100)
    if (winner === 1) {
      $("#announcement").text(player1 + " has won! Refresh your browser to play again!")
      $("#announcement").fadeIn(100)
    }
    else {
      $("#announcement").text(player2 + " has won! Refresh your browser to play again!")
      $("#announcement").fadeIn(100)
    }
  }
  else {
    if (whose_turn === 1) {
      whose_turn = 2;
      $("#player_turn").text(player2 + player2_message)
    }
    else {
      whose_turn = 1;
      $("#player_turn").text(player1 + player1_message)
    }
  }
})
