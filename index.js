//get board from API
var boards = null
const settings = {
    "async": false,
    "crossDomain": true,
    "url": "https://sudoku-board.p.rapidapi.com/new-board?diff=2&stype=list&solu=true",
    "method": "GET",
    "headers": {
        "X-RapidAPI-Host": "sudoku-board.p.rapidapi.com",
        "X-RapidAPI-Key": "60efc189bamshcb0f7f12cdd3edbp11241cjsn3167c1d288b5"
    }
};
$.ajax(settings).done(function (response) {

    boards = response
});

//run after page load
$(function () {
    function highlightSelected(){
        var selectedInput = $("#selectedInput").html()
        //reset all
        $(".cell").css('background-color', 'var(--color-primary)')
        //highlight relevant
        $(".cell:contains("+selectedInput+")").css('background-color', 'var(--color-highlight)')

    }
    var inputboard = Array(9);
    for(var i =0; i<9;i++){inputboard[i]=Array(9)}
    $(".inputSelectorItem").click(function () {
        var thisSelected = $(this).attr('id')
        //reset selector
        $(".inputSelectorItem").css({ 'background-color': 'var(--color-primary)', 'color': 'var(--color-secondary)' })
        $(".inputSelectorItem").removeAttr('id')

        if (thisSelected != 'selectedInput') {
            //hgihtlight selected
            $(this).css({ 'background-color': 'var(--color-secondary)', 'color': 'var(--color-primary)' })
            $(this).attr('id', 'selectedInput')
        }
        highlightSelected()

    })
    $(".cell").click(function () {
        var selectedInput = $("#selectedInput").html()
        if (!$(this).hasClass("static")) {
            var row = $(this).attr("data-row") -1
            console.log("Row: " + row)
            var column = $(this).attr("data-column") -1
            console.log("Column: " + column)
            if (selectedInput == null || selectedInput == $(this).html()) {
                $(this).html("")
                inputboard[row][column] = undefined
                
            }
            else{
                $(this).html(selectedInput)
                inputboard[row][column] = selectedInput
            }
            console.log(inputboard)
        }
        highlightSelected()
    })
    //setup board
    for (const [row_i, row] of boards.response["unsolved-sudoku"].entries()) {
        for (const [column_j, value] of row.entries()) {
            
            cellSelector = ".cell[data-row='" + (row_i + 1) + "'][data-column='"+ (column_j + 1) + "']"
            // ".row_" + (row_i + 1) + ".column_" + (column_j + 1)
            cell = $(cellSelector)
            if (value != 0) {

                cell.html(value)
                cell.addClass("static")
            }
        }
        
    }
});

