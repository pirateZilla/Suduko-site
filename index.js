//get board from API
function getnewboard() {
    console.log("getting new board")
    boards = null
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

        boards = response.response
    });
    var inputboard = Array(9);
    for (var i = 0; i < 9; i++) { inputboard[i] = Array(9) }
    boards["inputboard"] = inputboard
    return boards
}

//run after page load
$(function () {
    function highlightSelected() {
        var selectedInput = $("#selectedInput").html()
        //reset all
        $(".cell").css('background-color', 'var(--color-primary)')
        //highlight relevant
        $(".cell:contains(" + selectedInput + ")").css('background-color', 'var(--color-highlight)')

    }
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
            var row = $(this).attr("data-row") - 1
            var column = $(this).attr("data-column") - 1
            if (selectedInput == null || selectedInput == $(this).html()) {
                $(this).html("")
                boards["inputboard"][row][column] = undefined

            }
            else {
                $(this).html(selectedInput)
                boards["inputboard"][row][column] = selectedInput
            }
        }
        highlightSelected()
        saveBoards()
    })
    $("#newGameButton").click(function () { newGame() })
    function populateBoard(board, static) {
        console.log("Populating Board")
        for (const [row_i, row] of board.entries()) {
            for (const [column_j, value] of row.entries()) {

                cellSelector = ".cell[data-row='" + (row_i + 1) + "'][data-column='" + (column_j + 1) + "']"
                cell = $(cellSelector)
                if (value != 0 && value != null) {

                    cell.html(value)
                    if (static) {
                        cell.addClass("static")
                    }
                }
            }

        }

    }
    function clearBoard() {
        console.log("Clearing Board")
        for (var i = 0; i < 9; i++) {
            for (var j = 0; j < 9; j++) {
                cellSelector = ".cell[data-row='" + (i + 1) + "'][data-column='" + (j + 1) + "']"
                $(cellSelector).html("")
                if ($(cellSelector).hasClass("static")) {
                    $(cellSelector).removeClass("static")
                }
            }
        }
    }
    function saveBoards() {
        console.log("Saving Boards")
        localStorage.setItem("boards", JSON.stringify(boards))
    }
    //setup board
    function setupBoards() {
        console.log("setupBoards")
        boards = JSON.parse(localStorage.getItem("boards"))
        if (!boards) {
            boards = getnewboard()
            saveBoards()
        }
        populateBoard(boards["unsolved-sudoku"], true)
        populateBoard(boards["inputboard"], false)

    }
    function newGame() {
        console.log("newgame")
        localStorage.removeItem("boards")
        clearBoard()
        setupBoards()
        highlightSelected()
    }
    setupBoards()
    // for (const [row_i, row] of boards["unsolved-sudoku"].entries()) {
    //     for (const [column_j, value] of row.entries()) {

    //         cellSelector = ".cell[data-row='" + (row_i + 1) + "'][data-column='" + (column_j + 1) + "']"
    //         // ".row_" + (row_i + 1) + ".column_" + (column_j + 1)
    //         cell = $(cellSelector)
    //         if (value != 0) {

    //             cell.html(value)
    //             cell.addClass("static")
    //         }
    //     }

    // }
});

