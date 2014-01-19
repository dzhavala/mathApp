$("[data-toggle=popover]").popover();

function highliteFormulaElement (element) {
    $(element).addClass('highlited');
}

function highliteOriginFormulaElements (argument) {
    var $formulaElements = $originFormula.find('.wrap-element');
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
var columnName = $originFormula.attr('data-type');

var trutnTableData = {
    columns: {
        'col-not': findColumnByName('.col-not'),
        'col-and': findColumnByName('.col-and'),
        'col-or': findColumnByName('.col-or'),
        'col-then': findColumnByName('.col-then'),
        'col-equ': findColumnByName('.col-equ')
    },
    highliteColumn: function(colName) {
        $.each(this.columns[colName], function( index, $item ) {
            $item.addClass('highlited');
        });
    },
    getRowBlueprintData: function(rowIndex, colName) {
        var $row = $truthTable.find('tbody tr').eq(rowIndex);
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

$("#run-step-1-2").on('click', highliteProperColumn);

function createBlueprints () {
    var $trArr = $truthTable.find('tbody tr');
    for (var i=0, len = $trArr.length; i<len; i++ ) {
        var blueprintData = trutnTableData.getRowBlueprintData(i, '.' + columnName);
        var $blueprint = generateBlueprintFromTemplate(blueprintData);
        setBlueprintProperWidth($blueprint);
    };
};

function generateBlueprintFromTemplate (data){
    var $blueprintsWrapper = $('.solution-blueprints');
    var $template = $('#solution-blueprint-template');
    var $blueprint = $template.clone()
                    .removeAttr('id').removeClass('hidden')
                    .find('.wrap-left').text(data.x).end()
                    .find('.wrap-operation').text(data.operation).end()
                    .find('.wrap-right').text(data.y).end()
                    .find('.wrap-result').text(data.result).end()
                    .appendTo($blueprintsWrapper);
    return $blueprint;
};

function setBlueprintProperWidth ($blueprint){
    $blueprint.find('.wrap-left').width($originFormula.find('.wrap-left').width()).end()
              .find('.wrap-operation').width($originFormula.find('.wrap-operation').width()).end()
              .find('.wrap-right').width($originFormula.find('.wrap-right').width());
};

$("#run-step-2-1").on('click', createBlueprints);