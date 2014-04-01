$("[data-toggle=popover]").popover();
function enableTabTrigger (index) {
  $('.steps-nav-tabs').find('li').eq(index-1).removeClass('disabled');
    console.log('trigger');
}

function highliteFormulaElement (element) {
    $(element).addClass('highlited');
}

function highliteOriginFormulaElements (argument) {
    var $formulaElements = $originFormula.children('.wrap-element');
    for (var i = 0; i < $formulaElements.length; i++) {
        setTimeout(highliteFormulaElement, i*500, $formulaElements[i]);
    };
}

$("#run-step-1-1").on('click', highliteOriginFormulaElements);

$('.substep .run-button').on('click', function(e){
    $(this).closest('.substep').addClass('done');
    $(this).off('click').attr('disabled', 'disabled');
})

var $truthTable = $('#truth-table');
var $originFormula = $("#origin-formula");
var $blueprints = [];
var columnName = $originFormula.attr('data-type');

var truthTableData = {
    columns: {
        'col-not': findColumnByName('.col-not'),
        'col-and': findColumnByName('.col-and'),
        'col-or': findColumnByName('.col-or'),
        'col-then': findColumnByName('.col-then'),
        'col-equ': findColumnByName('.col-equ')
    },
    blur: function(){
        $truthTable.addClass('blurred');
    },
    highliteColumn: function(colName) {
        $.each(this.columns[colName], function( index, $item ) {
            $item.addClass('highlited');
        });
    },
    getRow: function(rowIndex){
        return $truthTable.find('tbody tr').eq(rowIndex);
    },
    highliteRow: function(rowIndex) {
        var $row = this.getRow(rowIndex);
        $row.addClass('highlited-row');
    },
    reHighliteRow: function(rowIndex) {
        var $row = this.getRow(rowIndex);
        $row.removeClass('highlited-row');
    },
    reHighliteTable: function() {
        var rowsLength = $truthTable.find('tbody tr').length -1;
        for (var i = 0; i < rowsLength; i++) {
            if(this.getRow(i).is('.highlited-row')) {
                this.reHighliteRow(i);
            }
        };

        $.each($truthTable.find('thead th'), function( index, $item ) {
            $($item).removeClass('highlited');
        });

        $.each($truthTable.find('tbody td'), function( index, $item ) {
            $($item).removeClass('highlited');
        });
    },
    getRowBlueprintData: function(rowIndex, colName) {
        var $row = this.getRow(rowIndex);
        var $columnThead = $truthTable.find('thead ' + colName);
        return {
            x: $row.find('th').eq(0).text(),
            operation : $columnThead.find('.operation').text(),
            y: $row.find('th').eq(1).text(),
            result : $row.find('td').eq($columnThead.index()-2).text()
        }
    }
};


function findColumnByName (colName) {
    var $columnThead = $truthTable.find('thead ' + colName);
    var index = $columnThead.index()-2;
    var column = [];
    column.push($columnThead);

    $truthTable.find('tbody tr').each(function () {
        column.push($(this).find('td').eq(index));
    });
    return column;
};


function highliteProperColumn () {
    $originFormula.find('.wrap-element').addClass('show-markers');
    truthTableData.highliteColumn(columnName);
};

$("#run-step-1-2").on('click', function() {
    truthTableData.blur();
    highliteProperColumn();
    enableTabTrigger(2);
});

function createBlueprints () {
    var $trArr = $truthTable.find('tbody tr');
     for (var i=0, len = $trArr.length; i<len; i++ ) {
        (function(i) {
            setTimeout(function() {
                truthTableData.highliteRow(i);
                setTimeout(truthTableData.reHighliteRow.bind(truthTableData), 1100, i);
                var blueprintData = truthTableData.getRowBlueprintData(i, '.' + columnName);
                var $blueprint = generateBlueprintFromTemplate(blueprintData);
                placeBlueprint($blueprint);
                setBlueprintProperWidth($blueprint);
                highliteBlueprint($blueprint);
                $blueprints.push($blueprint);
            }, i * 1000);
        })(i);
    }
};

// Generate blueprint unit by filling blueprint template with proper data
function generateBlueprintFromTemplate (data){    
    var $template = $('#solution-blueprint-template');
    var $blueprint = $template.clone()
                    .removeAttr('id').removeClass('hidden')
                    .find('.wrap-left').text(data.x).end()
                    .find('.wrap-operation').text(data.operation).end()
                    .find('.wrap-right').text(data.y).end()
                    .find('.wrap-result').text(data.result).end();
    return $blueprint;
};

// Place generated blueprint under formula
function placeBlueprint($blueprint){
    var $blueprintsWrapper = $('.solution-blueprints');
    $blueprint.appendTo($blueprintsWrapper);
};

function highliteBlueprint($blueprint) {
    $blueprint.addClass('highlited').removeClass('invisible-state');
    setTimeout(reHighliteBlueprint, 1100, $blueprint);
};

function reHighliteBlueprint($blueprint) {
    $blueprint.removeClass('highlited');
};

function setBlueprintProperWidth ($blueprint){
    $blueprint.find('.wrap-left').width($originFormula.find('.wrap-left').width()).end()
              .find('.wrap-operation').width($originFormula.find('.wrap-operation').width()).end()
              .find('.wrap-right').width($originFormula.find('.wrap-right').width());
};

$("#run-step-2-1").on('click', function() {
    createBlueprints();
    enableTabTrigger(3);
});

// Step 3
$("#run-step-3-1").on('click', showResultMatching);

function showResultMatching (argument) {
    showOrigFormulaResult();
    showBlueprintsResultMatching();
    enableTabTrigger(4);
}

function showOrigFormulaResult() {
    $originFormula.addClass('show-result highlite-result');
}

function showBlueprintsResultMatching() {
    var origResult = $originFormula.find('.formula-result .wrap-result').text();
    $.each($blueprints, function( index, $blueprint ) {
        var blueprintResult = $blueprint.find('.wrap-result').text()
        if($.trim(origResult) === $.trim(blueprintResult)) {
            $blueprint.addClass('positive');
        } else {
            $blueprint.addClass('negative');
        }
        $blueprint.addClass('show-result-matching');
    });
}

// Step 4
$("#run-step-4-1").on('click', hideUnmatchedRulesAndMainResult);

function hideUnmatchedRulesAndMainResult () {
    hideUnmatchedRules();
    changeOriginFormulaResultValue();
    highliteMatchedTableRow();
    hideOriginFormulaMarkers();
    enableTabTrigger(5);
}



function hideUnmatchedRules() {
    $.each($blueprints, function( index, $blueprint ) {
        if ($blueprint.is('.positive')) {
            $blueprint.addClass('invisible-state');
        } else {
             $blueprint.removeClass('show-result-matching negative');
        }
    });
}

function changeOriginFormulaResultValue() {
    $originFormula.removeClass('highlite-result');
    $originFormula.find('.formula-result .wrap-result').text('F');
}

function highliteMatchedTableRow(){
    $.each($blueprints, function( index, $blueprint ) {
        if (!$blueprint.is('.invisible-state')) {
            var i = $blueprint.index()-1;
            truthTableData.highliteRow(i);
        }        
    });
}

function hideOriginFormulaMarkers() {
    $originFormula.find('.wrap-element').removeClass('show-markers');
}


// Step 5
$("#run-step-5-1").on('click', showSolvingSteps);

function showSolvingSteps () {
    var $solvingStep1 = $('#solving-step-1');
    $('#solving-step-1').removeClass('hidden');
    $solvingStep1.find('.el-left').css({
        'left': 0,
        'width': $originFormula.find('.wrap-left').width()
    });
    $solvingStep1.find('.el-operation').css({
        'left': $originFormula.find('.wrap-operation').position().left,
        'width': $originFormula.find('.wrap-operation').width()
    });
    $solvingStep1.find('.el-right').css({
        'left': $originFormula.find('.wrap-right').position().left,
        'width': $originFormula.find('.wrap-right').width()
    });
    $solvingStep1.find('.solving-formula-result').css({
        'left': $originFormula.find('.formula-result').position().left
    });
    $solvingStep1.find('.el-equal').css({
        'left': $originFormula.find('.wrap-equal').position().left,
        'width': $originFormula.find('.wrap-equal').width()
    });
    $solvingStep1.find('.el-result').css({
        'left': $originFormula.find('.wrap-result').position().left,
        'width': $originFormula.find('.wrap-result').width()
    });
    enableTabTrigger(6);
}

// Step 6
$("#run-step-6-1").on('click', highliteEquationToPrecessElem);

function highliteEquationToPrecessElem () {
    $('.solution-blueprint').not('.invisible-state').find('.equation-to-process').addClass('highlited');
    $('#formula-solving').find('#solving-step-1').find('.equation-to-process').addClass('highlited');

    truthTableData.reHighliteTable();
    columnName = $('#formula-solving').find('#solving-step-1').find('.equation-to-process').data('type');
    createStepEquationMain(columnName);
}

$("#run-step-6-2").on('click', highliteStepEquationRow);

var $stepEquationBlueprints = [];

function highliteStepEquationRow(){
    truthTableData.reHighliteTable();
    //columnName = $('#formula-solving').find('#solving-step-1').find('.equation-to-process').data('type');
    truthTableData.highliteColumn(columnName);
    createStepEquationBlueprints();
}

// Place generated blueprint under formula
function placeStepEquationBlueprint($blueprint){
    var $blueprintsWrapper = $('.step-equation-blueprints');
    $blueprint.appendTo($blueprintsWrapper);
};

function createStepEquationMain(columnName) {
    var blueprintData = {
            x: 'F',
            operation : $truthTable.find('thead .' + columnName).find('.operation').text(),
            y: 'q',
            result : 'T'
        };
    var $blueprint = generateBlueprintFromTemplate(blueprintData);
    $blueprint.addClass('main-equation-step-blueprint');
    placeStepEquationBlueprint($blueprint);
    setBlueprintProperWidth($blueprint);
    highliteBlueprint($blueprint);
}

function createStepEquationBlueprints () {
    var $trArr = $truthTable.find('tbody tr');
    var j = 0;
     for (var i=0, len = $trArr.length; i<len; i++ ) {
        if($($trArr[i]).find('.x').text() == 'F') {
            (function(i, j) {
                setTimeout(function() {
                    truthTableData.highliteRow(i);
                    setTimeout(truthTableData.reHighliteRow.bind(truthTableData), 1100, i);
                    var blueprintData = truthTableData.getRowBlueprintData(i, '.' + columnName);
                    var $blueprint = generateBlueprintFromTemplate(blueprintData);
                    placeStepEquationBlueprint($blueprint);
                    setBlueprintProperWidth($blueprint);
                    highliteBlueprint($blueprint);
                    $stepEquationBlueprints.push($blueprint);
                }, j * 1000);
            })(i, j);
            j++;
        }
    }
};


$("#run-step-6-3").on('click', showStepEquationResultMatching);

function showStepEquationResultMatching () {
    showOrigStepEquationFormulaResult();
    showStepEquationBlueprintsResultMatching();
    enableTabTrigger(7);
}

function showOrigStepEquationFormulaResult() {
    $('.main-equation-step-blueprint').addClass('show-result-matching');
}

function showStepEquationBlueprintsResultMatching() {
    var origResult = $('.main-equation-step-blueprint').find('.wrap-result').text();
    $.each($stepEquationBlueprints, function( index, $blueprint ) {
        var blueprintResult = $blueprint.find('.wrap-result').text()
        if($.trim(origResult) === $.trim(blueprintResult)) {
            $blueprint.addClass('positive');
        } else {
            $blueprint.addClass('negative');
        }
        $blueprint.addClass('show-result-matching');
    });
}


// Step 7
$("#run-step-7-1").on('click', failStepEquationResult);

function failStepEquationResult () {
    hideUnmatchedStepEquationResults();
    failOrigStepEquationFormulaResult();
}

function hideUnmatchedStepEquationResults() {
    $.each($stepEquationBlueprints, function( index, $blueprint ) {
        $blueprint.addClass('invisible-state');
    });
}

function failOrigStepEquationFormulaResult () {
    $('.main-equation-step-blueprint').addClass('failed-matching');
}

$("#run-step-7-2").on('click', failAllResults);

function failAllResults () {
    $('#solving-step-1').addClass('failed-matching');
    $('.solution-blueprint').not('.invisible-state').addClass('failed-matching');
    $originFormula.find('.wrap-result').addClass('failed-matching');
    truthTableData.reHighliteTable();
}

$("#run-step-7-3").on('click', changeOriginFormulaResultValueToTrue);

function changeOriginFormulaResultValueToTrue() {
    $originFormula.find('.formula-result .wrap-result').removeClass('failed-matching').text('T');
    $originFormula.addClass('highlite-result');
}

