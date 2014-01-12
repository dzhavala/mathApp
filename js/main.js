$("[data-toggle=popover]").popover();

function highliteFormulaElement (element) {
    $(element).addClass('highlited');
}

function highliteOriginFormulaElements (argument) {
    var $formulaElements = $('#origin-formula .wrap-element');
    for (var i = 0; i < $formulaElements.length; i++) {
        setTimeout(highliteFormulaElement, i*500, $formulaElements[i]);
    };
}

$("#run-step-1-1").on('click', highliteOriginFormulaElements);

$('.substep .run-button').on('click', function(e){
    $(this).closest('.substep').addClass('done');
    $(this).off('click').attr('disabled', 'disabled');
})


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
    }
};

function findColumnByName (colName) {
    var $truthTable = $('#truth-table'); 
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
    var columnName = $("#origin-formula").attr('data-type');
    trutnTableData.highliteColumn(columnName);
}
$("#run-step-1-2").on('click', highliteProperColumn);