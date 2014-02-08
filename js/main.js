$("[data-toggle=popover]").popover();

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

var trutnTableData = {
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
    trutnTableData.highliteColumn(columnName);
};

$("#run-step-1-2").on('click', function() {
    trutnTableData.blur();
    highliteProperColumn();
});

function createBlueprints () {
    var $trArr = $truthTable.find('tbody tr');
     for (var i=0, len = $trArr.length; i<len; i++ ) {
        (function(i) {
            setTimeout(function() {
                trutnTableData.highliteRow(i);
                setTimeout(trutnTableData.reHighliteRow.bind(trutnTableData), 1100, i);
                var blueprintData = trutnTableData.getRowBlueprintData(i, '.' + columnName);
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

$("#run-step-2-1").on('click', createBlueprints);

// Step 3
$("#run-step-3-1").on('click', showResultMatching);

function showResultMatching (argument) {
    showOrigFormulaResult();
    showBlubrientsResultMatching();
}

function showOrigFormulaResult() {
    $originFormula.addClass('show-result');
}

function showBlubrientsResultMatching() {
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
